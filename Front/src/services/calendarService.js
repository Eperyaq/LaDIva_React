import API_URL from "../config/config";

// Crea un evento presencial en Google Calendar
export async function crearEventoPresencial(nombre, descripcion, fechaInicio, fechaFin, deposito, dia, token) {
  try {
    if (!nombre || !descripcion || !fechaInicio || !fechaFin || !deposito || !dia) {
      throw new Error("No se puede crear evento sin rellenar todos los datos");
    }

    const res = await fetch(`${API_URL}/calendar/crear`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ nombre, descripcion, fechaInicio, fechaFin, deposito, dia }),
    });

    const data = await res.json();

    if (data.error) throw new Error(data.error);

    return data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

// Obtiene todos los eventos del calendario
export async function getEventos(token) {
  try {
    const res = await fetch(`${API_URL}/calendar/eventos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error del backend:", errorText);
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    console.log("DATA:", data);
    return data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}
