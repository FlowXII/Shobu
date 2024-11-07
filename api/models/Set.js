import mongoose from 'mongoose';

const setSchema = new mongoose.Schema({
  phaseId: { type: mongoose.Schema.Types.ObjectId, ref: "Phase" },
  round: Number,
  participants: [{
    playerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    score: Number,
  }],
  winnerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Set', setSchema); 