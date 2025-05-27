const express = require("express");
const router = express.Router();
const { obtenerCitasConfirmadas, asignarCita, obtenerAllCitasConfirmadas, cancelarCita} = require("../controller/citaConfirmadaController");
const verificarToken = require("../middleware/authMiddleware");


router.post("/asignar/:citaId", verificarToken, asignarCita); // Asignar cita a un usuario (admin)
router.get("/:usuarioIdCita", verificarToken, obtenerCitasConfirmadas); // Obtener citas confirmadas de un usuario
router.get("/", verificarToken, obtenerAllCitasConfirmadas); // Obtener citas confirmadas de TODOS los usuario
router.post("/cancelar/:citaId", verificarToken, cancelarCita); // Cancelar la cita confirmada 



module.exports = router;