import mongoose from 'mongoose';

const streamQueueSchema = new mongoose.Schema({
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
  streamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stream', required: true },
  position: { type: Number, required: true },
  status: { type: String, enum: ['PENDING', 'ACTIVE', 'COMPLETED'], default: 'PENDING' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('StreamQueue', streamQueue); 