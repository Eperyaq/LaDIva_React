const Cita = require("../model/Cita");
const CitaConfirmada = require("../model/CitaConfirmada");
const Usuario = require("../model/Usuario");
const { contactClient } = require("../service/emailService");

/**
 * Obtiene las citas confirmadas de un usuario específico
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.obtenerCitasConfirmadas = async (req, res) => {
  try {
    const { usuarioIdCita } = req.params;

    const citas = await CitaConfirmada.findAll({
      where: { usuarioIdCita },
      include: [{ model: Cita }, { model: Usuario }],
    });

    res.status(200).json(citas);
  } catch (error) {
    console.error("Error obteniendo citas confirmadas:", error);
    res.status(500).json({ error: "Error al obtener citas" });
  }
};

/**
 * Asigna una cita a un cliente desde el panel de administración
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.asignarCita = async (req, res) => {
  try {
    const { fechaAsignada, horaInicio, horaFin, notasAdmin, artista } = req.body;
    const { citaId } = req.params;

    const cita = await Cita.findByPk(citaId);
    if (!cita) return res.status(404).json({ error: "Cita no encontrada" });

    const usuarioIdCita = cita.usuarioId;
    const servicio = cita.servicio;

    await cita.update({ estado: "asignada" });

    const citaConfirmada = await CitaConfirmada.create({
      citaId,
      usuarioIdCita,
      servicio,
      fechaAsignada,
      horaInicio,
      horaFin,
      estado: "pendiente_pago",
      notasAdmin,
      artista,
    });

    const usuario = await Usuario.findByPk(usuarioIdCita);
    const email = usuario?.email;
    const nombre = usuario?.nombre;

    if (!usuario || !email) {
      console.error("Usuario o email no encontrado");
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    await contactClient(email, nombre, fechaAsignada, horaInicio, horaFin);

    res.status(201).json(citaConfirmada);
  } catch (error) {
    console.error("Error asignando cita:", error);
    res.status(500).json({ error: "Error al asignar cita" });
  }
};

/**
 * Obtiene todas las citas confirmadas con información extendida del cliente
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.obtenerAllCitasConfirmadas = async (req, res) => {
  try {
    const citas = await CitaConfirmada.findAll({
      include: [
        {
          model: Cita,
          attributes: ['diseno', 'imagenDisenoUrl', 'servicio'],
          include: [
            {
              model: Usuario,
              attributes: ['nombre', 'email', 'telefono'],
            },
          ],
        },
      ],
    });

    res.status(200).json(citas);
  } catch (error) {
    console.error("Error obteniendo todas las citas confirmadas:", error);
    res.status(500).json({ error: "Error al obtener citas" });
  }
};

/**
 * Cancela una cita confirmada
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.cancelarCita = async (req, res) => {
  try {
    const { citaId } = req.params;
    const { motivoCancelacion } = req.body;

    const cita = await CitaConfirmada.findByPk(citaId);
    if (!cita) return res.status(404).json({ error: "Cita no encontrada" });

    await cita.update({ estado: "cancelada", motivoCancelacion });

    res.status(200).json({ message: "Cita cancelada correctamente" });
  } catch (error) {
    console.error("Error cancelando cita:", error);
    res.status(500).json({ error: "Error al cancelar cita" });
  }
};
