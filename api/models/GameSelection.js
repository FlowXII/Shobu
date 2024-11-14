import mongoose from 'mongoose';

const gameSelectionSchema = new mongoose.Schema({
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  characterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Character' },
  selectionType: { type: String, enum: ['CHARACTER', 'STAGE'], required: true },
  participantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Participant' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('GameSelection', gameSelectionSchema); 