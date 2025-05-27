const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/Usuario");
const { sendVerificationEmail, contactEmail } = require("../service/emailService");

/**
 * Registra un nuevo usuario y envía un código de verificación por correo
 */
exports.register = async (req, res) => {
  try {
    const { nombre, email, password, telefono } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!nombre || !email || !password || !telefono) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // Validación simple de longitud de contraseña
    if (password.length < 6) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    // Validamos el teléfono con un regex tipo E.164
    const comprobarTel = /^\+?[1-9]\d{1,14}$/;
    if (!comprobarTel.test(telefono)) {
      return res.status(400).json({ error: "Número de teléfono no válido" });
    }

    // Comprobamos si ya existe un usuario con ese email
    const existeUser = await User.findOne({ where: { email } });
    if (existeUser) {
      return res.status(400).json({ error: "El email ya está en uso" });
    }

    // Generamos un código de verificación aleatorio
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Creamos el nuevo usuario
    const user = await User.create({
      nombre,
      email,
      password: hashedPassword,
      verificationCode,
      telefono,
      rol: email === process.env.EMAIL_ADMIN ? "admin" : undefined // Solo si el email es el del admin del .env
    });

    await sendVerificationEmail(email, verificationCode); // Enviamos correo con el código

    res.status(201).json({ message: "Usuario registrado con éxito", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error.message);
  }
};

/**
 * Inicia sesión de usuario con JWT
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    if (!user.verified) return res.status(400).json({ error: "Verifica tu correo antes de iniciar sesión" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ error: "Credenciales incorrectas" });

    // Generamos token JWT con ID y rol del usuario
    const token = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET);
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error.message);
  }
};

/**
 * Verifica el correo electrónico con el código enviado por email
 */
exports.verifyEmail = async (req, res) => {
  try {
    const { email, codigo } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    if (user.verified) return res.status(400).json({ error: "El usuario ya está verificado" });

    if (String(user.verificationCode) !== String(codigo)) {
      return res.status(400).json({ error: "Código incorrecto" });
    }

    user.verified = true;
    user.verificationCode = null; // Limpiamos el código una vez verificado
    await user.save();

    const token = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET);

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error.message);
  }
};

/**
 * Actualiza los datos del usuario y vuelve a enviar código de verificación
 */
exports.actualizarUser = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    const { id } = req.params;

    const usuario = await User.findByPk(id);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    // Se genera nuevo código y se envía
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    await sendVerificationEmail(email, verificationCode);

    usuario.nombre = nombre;
    usuario.email = email;
    usuario.verified = false; // Obligamos a verificar de nuevo tras el cambio
    usuario.verificationCode = verificationCode;
    usuario.password = await bcrypt.hash(password, 10);

    await usuario.save();

    res.status(200).json({ message: "Usuario actualizado con éxito", usuario });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Busca un usuario por su ID
 */
exports.buscarUser = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await User.findByPk(id);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    res.status(200).json({ message: "Usuario encontrado con éxito", usuario });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Elimina un usuario de la base de datos
 */
exports.borrarUser = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await User.findByPk(id);
    if (!usuario) return res.status(400).json({ error: "Usuario no encontrado" });

    await usuario.destroy(); // Elimina el registro de la base de datos

    res.status(200).json({ message: "Cuenta eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar cuenta:", error);
    res.status(500).json({ error: "Error interno eliminando" });
  }
};

/**
 * Envía un mensaje de contacto a través del servicio de email
 */
exports.contact = async (req, res) => {
  const { email, nombre, mensaje } = req.body;

  try {
    await contactEmail(email, nombre, mensaje); // Llama al servicio de correo

    res.status(200).json("Mensaje enviado con éxito");
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);
    res.status(500).json("Hubo un error al enviar el mensaje");
  }
};
