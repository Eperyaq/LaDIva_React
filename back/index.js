require("dotenv").config(); 
const express = require("express");
const cors = require("cors");
const db = require("./src/config/db"); 
const usuarioRutas = require("./src/routes/usuario"); // Rutas de usuario
const citaRutas = require("./src/routes/citas"); // Rutas de citas
const confirmadasRutas = require("./src/routes/confirmadas"); // Rutas de citas
const uploadRoutes = require("./src/routes/upload");//Ruta de las imagenes
const stripeRoutes = require("./src/routes/stripe");
const stripeWebhook = require("./src/routes/StripeWebhook"); // Webhook de Stripe
const calendarRoute = require("./src/routes/calendar"); // Webhook para google Calendar



const app = express();

// Middlewares
app.use(cors()); // Permitir peticiones desde otros dominios

app.use("/api/webhookStripe", stripeWebhook); // Tengo que poner esta aqui porque si no da problemas stripe con el middleware de json


app.use(express.json()); // Habilitar JSON en las peticiones
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT ;




// Rutas
app.use("/api/usuario", usuarioRutas); // Endpoints de autenticación
app.use("/api/citas", citaRutas); // Endpoints para citas
app.use("/api/citasConfirmadas", confirmadasRutas); // Endpoints para citas CONFIRMADAS
app.use("/api/upload", uploadRoutes); //Endpoints para las imagenes
app.use("/api/stripe", stripeRoutes); //Endpoints para el pago con stripe
app.use("/api/calendar", calendarRoute); //Endpoints para el calendario



// Sincronizar base de datos y arrancar el servidor
db.sync({ force: false }) // Si cambias a { force: true }, se borrarán las tablas y se recrearán
  .then(() => {
    console.log("✅ Base de datos conectada");
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));
  })
  .catch(error => console.error("❌ Error al conectar la base de datos:", error));
