// routes/calendarRoutes.js
const express = require('express');
const { crearEvento, getEventos } = require('../controller/calendarController');
const verificarToken = require("../middleware/authMiddleware"); 
require('dotenv').config();

const router = express.Router();

router.post('/crear', verificarToken, crearEvento); //Crea un evento en el calendario

router.get('/eventos', verificarToken, getEventos) //Obtiene los eventos del calendario

module.exports = router;

