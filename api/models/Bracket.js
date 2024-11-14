import mongoose from 'mongoose';

const bracketSchema = new mongoose.Schema({
  tournamentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true },
  round: { type: Number, required: true },
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
  phaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Phase' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Bracket', bracketSchema); 