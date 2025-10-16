import express from 'express';
import stripe from '../config/stripe.js';
import { PaymentService } from '../services/PaymentService.js';
import PaymentController from '../controllers/PaymentController.js';

const router = express.Router();

router.post('/create', PaymentController.createPayment);

// Verify a payment (Stripe webhook or callback)
router.post('/verify', PaymentController.verifyPayment);

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const paymentService = new PaymentService();

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    await paymentService.verifyPayment(paymentIntent.id);
  }

  res.status(200).json({ received: true });
});

router.get('/history/:groupId', PaymentController.getPaymentHistory);

export default router;
