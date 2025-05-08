const express = require("express");
const router = express.Router();
const { solicitarCita, asignarCita, obtenerCitas, cancelarCita, getAllCitas } = require("../controller/citaController");
const verificarToken = require("../middleware/authMiddleware");

// Rutas protegidas por verificarToken para que solo los que hayan iniciado sesión puedan usar estas rutas
router.post("/crear-cita", verificarToken, solicitarCita);      // Crear una cita
router.get("/:usuarioId", verificarToken, obtenerCitas);    // Obtener citas del usuario
router.get("/", verificarToken, getAllCitas);    // Obtener citas del usuario

// router.put("/:id", verificarToken, actualizarCita); // Actualizar cita (ej. cambiar fecha)
// router.delete("/:id", verificarToken, cancelarCita); // Cancelar cita

module.exports = router;
