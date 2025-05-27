const jwt = require("jsonwebtoken");

/**
 * Middleware para verificar el token JWT en las solicitudes protegidas.
 * 
 * - Requiere un header Authorization con el token.
 * - Si el token es válido, agrega los datos del usuario verificado a `req.usuario`.
 * - Si no hay token o es inválido, responde con el estado correspondiente.
 */
const verificarToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Acceso denegado" });

  try {
    const verificado = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = verificado;
    next();
  } catch (error) {
    res.status(400).json({ error: "Token inválido" });
    console.log("Error en verificarToken:", error.message);
  }
};


module.exports = verificarToken;
