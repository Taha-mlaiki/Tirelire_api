import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  payer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  stripePaymentIntentId: String,
});

export default mongoose.model('Payment', paymentSchema);
