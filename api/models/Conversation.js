import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  type: { type: String, enum: ['DIRECT', 'GROUP'], default: 'DIRECT' },
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  name: String, // For group conversations
  isActive: { type: Boolean, default: true },
  metadata: {
    unreadCounts: {
      type: Map,
      of: Number,
      default: new Map()
    }
  }
}, {
  timestamps: true
});

// Indexes for faster queries
conversationSchema.index({ participants: 1 });
conversationSchema.index({ updatedAt: -1 });

export default mongoose.model('Conversation', conversationSchema); 