import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  setId: { type: mongoose.Schema.Types.ObjectId, ref: "Set" },
  participants: [{
    playerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    score: Number,
  }],
  winnerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Match', matchSchema); 