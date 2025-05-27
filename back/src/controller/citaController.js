const Cita = require("../model/Cita");
const CitaConfirmada = require("../model/CitaConfirmada");

/**
 * Crea una nueva cita en estado "pendiente"
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.solicitarCita = async (req, res) => {
  const {
    fecha,
    tramoHorario,
    servicio,
    diseno,
    usuarioId,
    observaciones,
    archivo,
  } = req.body; // Pillamos los datos del body, vienen desde el formulario del cliente

  try {
    // Creamos la cita en estado pendiente
    const cita = await Cita.create({
      usuarioId,
      fecha, // Fecha seleccionada para la cita
      tramoHorario, // Rango horario seleccionado (mañana, tarde, etc.)
      servicio,
      diseno,
      imagenDisenoUrl: archivo, // Guardamos la URL del diseño subido
      observaciones,
      archivo,
      estado: "pendiente", // Por defecto es "pendiente", pero lo marcamos explícitamente
    });

    return res.status(201).json(cita);
  } catch (error) {
    return res.status(500).json({ error: "Error creando la cita" });
  }
};

/**
 * Devuelve todas las citas solicitadas por un usuario (incluye confirmadas)
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.obtenerCitas = async (req, res) => {
  try {
    const { usuarioId } = req.params; // ID del usuario que quiere ver sus citas

    // Buscamos todas sus citas, incluyendo si alguna ya está confirmada
    const citas = await Cita.findAll({
      where: { usuarioId },
      include: [{ model: CitaConfirmada }],
    });

    if (!citas.length) return res.status(404).json({ error: "No hay citas" });

    res.status(200).json(citas);
  } catch (error) {
    console.error("Error obteniendo citas:", error);
    res.status(500).json({ error: "Error al obtener citas" });
  }
};

/**
 * Devuelve todas las citas de todos los usuarios (solo para uso administrativo)
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.getAllCitas = async (req, res) => {
  try {
    const citas = await Cita.findAll(); // Obtenemos todas las citas sin filtros

    if (!citas.length) return res.status(404).json({ error: "No hay citas" });

    res.status(200).json(citas);
  } catch (error) {
    console.error("Error obteniendo citas:", error);
    res.status(500).json({ error: "Error al obtener citas" });
  }
};

/**
 * Elimina una cita específica por su ID
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.eliminarCita = async (req, res) => {
  try {
    const { citaId } = req.params; // ID de la cita que se quiere eliminar

    const cita = await Cita.findByPk(citaId);
    if (!cita) return res.status(404).json({ error: "Cita no encontrada" });

    // Eliminamos la cita directamente de la base de datos
    await Cita.destroy({ where: { id: citaId } });

    res.status(200).json({ message: "Cita eliminada correctamente" });
  } catch (error) {
    console.error("Error eliminando cita:", error);
    res.status(500).json({ error: "Error al cancelar cita" });
  }
};
