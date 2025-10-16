import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    paymentAmount: Number,
    paymentDate: Date,
    currentRound: { type: Number, default: 1 },
    totalRounds: Number,
    order: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // order of who receives
    status: { type: String, enum: ['active', 'completed'], default: 'active' },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    balances: [
      {
        member: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        received: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

export const Group = mongoose.model('Group', groupSchema);
