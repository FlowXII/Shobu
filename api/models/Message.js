import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  content: { type: String, required: true },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  attachments: [{
    type: { type: String, enum: ['IMAGE', 'FILE'] },
    url: String,
    filename: String
  }],
  deleted: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Index for faster queries
messageSchema.index({ conversation: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });

export default mongoose.model('Message', messageSchema); 