import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String },
  audioUrl: { type: String }, // optional for audio messages
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Chat', chatSchema);
