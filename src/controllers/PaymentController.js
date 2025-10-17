import Stripe from 'stripe';
import Payment from '../models/Payment.js';
import { Group } from '../models/Group.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default class PaymentController {
  static async createPayment(req, res) {
    try {
      const { groupId } = req.body;
      const group = await Group.findById(groupId);
      if (!group) return res.status(404).json({ message: 'Groupe non trouvé' });

      //   const paymentIntent = await stripe.paymentIntents.create({
      //     amount: group.paymentAmount * 100,
      //     currency: 'usd',
      //     metadata: { groupId, payerId: req.user.id },
      //   });

      const payment = await Payment.create({
        group: groupId,
        payer: req.user.id,
        amount: group.paymentAmount,
        status: 'pending',
        stripePaymentIntentId: 'testId',
      });

      res.status(201).json({ clientSecret: 'testClientSecret', paymentId: payment._id });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async verifyPayment(req, res) {
    try {
      const { paymentId } = req.body;
      const payment = await Payment.findById(paymentId);
      if (!payment) return res.status(404).json({ message: 'Paiement non trouvé' });

      const paymentIntent = await stripe.paymentIntents.retrieve(payment.stripePaymentIntentId);

      if (paymentIntent.status === 'succeeded') {
        payment.status = 'completed';
        await payment.save();

        // ---- ROTATION LOGIC ----
        const group = await Group.findById(payment.group);

        // Who receives in this round
        const receiverIndex = group.currentRound - 1;
        const receiverId = group.order[receiverIndex];

        // Update balance for receiver
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

        res.json({ success: true, receiver: receiverId });
      } else {
        res.json({ success: false, status: paymentIntent.status });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async getPaymentHistory(req, res) {
    try {
      const groupId = req.params.groupId;
      const userId = req.user.id; // from auth middleware

      // Check if the user is part of the group
      const group = await Group.findById(groupId).populate('members');
      if (!group) {
        return res.status(404).json({ message: 'Group not found' });
      }

      const isMember = group.members.some((member) => member._id.toString() === userId);

      if (!isMember) {
        return res.status(403).json({ message: 'Access denied' });
      }

      // Get all payments for this group
      const payments = await Payment.find({ group: groupId })
        .populate('member', 'firstName lastName email') // optional: show member info
        .sort({ createdAt: -1 }); // latest first

      return res.status(200).json({
        message: 'Payment history retrieved successfully',
        payments,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
}
