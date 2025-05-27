const express = require("express");
const router = express.Router();
const { register, login, verifyEmail, actualizarUser, buscarUser, borrarUser, contact } = require("../controller/usuarioController");
const verificarToken = require("../middleware/authMiddleware");
require("dotenv").config();


router.post("/register", register); //Registra un nuevo usuario
router.post("/login", login);
router.post("/verificar", verifyEmail); //Verifica el email del usuario
router.post("/contacto", contact); 


router.put("/editar/:id", verificarToken, actualizarUser); //Actualiza los datos de un usuario autenticado
router.get("/:id", verificarToken, buscarUser); //Busca un usuario por ID
router.delete("/eliminar/:id", verificarToken, borrarUser); //Elimina un usuario por ID

module.exports = router;
