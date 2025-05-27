const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const CitaConfirmada  = require("../model/CitaConfirmada"); 
const Pagos  = require("../model/Pagos"); 

/**
 * Webhook de Stripe para manejar eventos de pago completado
 * Verifica la firma del evento y guarda el pago en la base de datos
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"]; // Firma que envía Stripe en los headers para validar el evento

  let event;
  try {
    // Verificamos la autenticidad del evento usando la firma
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Ha habido un error en la verificación de la firma:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Solo nos interesa actuar si el pago ha sido exitoso
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const { usuarioId, citaId, servicio } = paymentIntent.metadata; // Estos valores se pasaron al crear el PaymentIntent

    try {
      // Guardamos el registro del pago en la base de datos
      await Pagos.create({
        usuarioId,
        citaId,
        servicio,
        stripeSessionId: paymentIntent.id,
        cantidad: paymentIntent.amount / 100, // Convertimos de céntimos a euros
        estado: "completado",
      });

      // Actualizamos el estado de la cita confirmada a "pagada"
      await CitaConfirmada.update(
        { estado: "pagada" },
        { where: { citaId } }
      );
    } catch (err) {
      console.error("Error guardando pago:", err);
      return res.status(500).send("Error interno");
    }
  }

  // Stripe espera una respuesta 200 para confirmar que se recibió el evento correctamente
  res.status(200).send("Evento recibido");
};
