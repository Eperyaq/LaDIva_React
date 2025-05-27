const { google } = require('googleapis');

/** @type {google.auth.GoogleAuth} */
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

/** @type {google.calendar_v3.Calendar} */
const calendar = google.calendar({ version: 'v3', auth });

/**
 * Crea un evento en Google Calendar
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.crearEvento = async (req, res) => {
  const { nombre, descripcion, fechaInicio, fechaFin, deposito } = req.body;

  try {
    const event = {
      summary: `Cita con ${nombre}`,
      description: `${descripcion}\nDepósito: €${deposito}`,
      start: {
        dateTime: fechaInicio,
        timeZone: process.env.TIMEZONE,
      },
      end: {
        dateTime: fechaFin,
        timeZone: process.env.TIMEZONE,
      },
    };

    const response = await calendar.events.insert({
      calendarId: process.env.CALENDAR_ID,
      requestBody: event,
    });

    res.status(200).json({
      message: 'Cita creada correctamente',
      link: response.data.htmlLink,
    });
  } catch (error) {
    console.error('Error creando evento:', error);
    res.status(500).json({ error: 'Error al crear el evento' });
  }
};

/**
 * Obtiene eventos del calendario para los próximos 7 días
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.getEventos = async (req, res) => {
  try {
    const now = new Date();
    const weekLater = new Date();
    weekLater.setDate(now.getDate() + 7);

    const response = await calendar.events.list({
      calendarId: process.env.CALENDAR_ID,
      timeMin: now.toISOString(),
      timeMax: weekLater.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const eventos = response.data.items.map(event => ({
      id: event.id,
      title: event.summary,
      start: new Date(event.start.dateTime || event.start.date),
      end: new Date(event.end.dateTime || event.end.date),
    }));

    res.status(200).json(eventos);
  } catch (err) {
    console.error('Error al obtener eventos:', err);
    res.status(500).json({ error: 'No se pudieron obtener los eventos' });
  }
};
