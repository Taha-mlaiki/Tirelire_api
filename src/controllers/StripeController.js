import Stripe from 'stripe';
import Payment from '../models/Payment.js';
import Group from '../models/Group.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default class StripeController {
  static async webhook(req, res) {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntent.id });
        if (!payment) return res.status(404).send('Payment not found');

        payment.status = 'completed';
        await payment.save();

        // --- ROTATION LOGIC (same as verifyPayment) ---
        const group = await Group.findById(payment.group);

        const receiverIndex = group.currentRound - 1;
        const receiverId = group.order[receiverIndex];

        const balanceIndex = group.balances.findIndex(
          (b) => b.member.toString() === receiverId.toString()
        );
        if (balanceIndex >= 0) {
          group.balances[balanceIndex].received += payment.amount;
        } else {
          group.balances.push({ member: receiverId, received: payment.amount });
        }

        // Check if all members paid this round
        const paymentsThisRound = await Payment.find({
          group: group._id,
          status: 'completed',
          createdAt: { $gte: new Date(group.paymentDate.setHours(0, 0, 0, 0)) },
        });

        if (paymentsThisRound.length === group.members.length) {
          group.currentRound += 1;
          if (group.currentRound > group.totalRounds) {
            group.status = 'completed';
          }
        }

        await group.save();
      }

      res.json({ received: true });
    } catch (err) {
      console.log('Webhook Error:', err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
}
