import mongoose from 'mongoose';

const streamSchema = new mongoose.Schema({
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
  source: { type: String, enum: ['TWITCH', 'YOUTUBE'], required: true },
  url: { type: String, required: true },
  status: { type: String, enum: ['LIVE', 'OFFLINE', 'SCHEDULED'], default: 'SCHEDULED' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Stream', streamSchema); 