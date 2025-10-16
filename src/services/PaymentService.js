import Payment from '../models/Payment.js';
import Group from '../models/Group.js';
import stripe from '../config/stripe.js';

export class PaymentService {
  // 1. Create a payment intent
  async createPaymentIntent(groupId, payerId, amount) {
    const group = await Group.findById(groupId);
    if (!group) throw new Error('Group not found');

    if (amount !== group.paymentAmount) throw new Error('Invalid payment amount');

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects amount in cents
      currency: 'usd',
      metadata: {
        groupId,
        payerId,
        round: group.currentRound,
      },
    });

    // Save payment in DB with pending status
    const payment = new Payment({
      group: groupId,
      payer: payerId,
      round: group.currentRound,
      amount,
      paymentHash: paymentIntent.id,
      status: 'pending',
    });

    await payment.save();
    return { payment, clientSecret: paymentIntent.client_secret };
  }

  // 2. Verify payment after Stripe webhook
  async verifyPayment(stripePaymentIntentId) {
    const payment = await Payment.findOne({ paymentHash: stripePaymentIntentId });
    if (!payment) throw new Error('Payment not found');

    // Update status
    payment.status = 'verified';
    await payment.save();

    // Check if all members have paid
    const group = await Group.findById(payment.group);
    const totalPayments = await Payment.countDocuments({
      group: group._id,
      round: group.currentRound,
      status: 'verified',
    });

    if (totalPayments === group.members.length) {
      await this.rotateRound(group);
      // Optionally: trigger payout to the selected member
    }

    return payment;
  }

  async rotateRound(group) {
    if (group.currentRound >= group.totalRounds) {
      group.status = 'completed';
    } else {
      group.currentRound += 1;
    }
    await group.save();
    return group;
  }
}
