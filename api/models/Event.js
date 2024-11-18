import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  tournamentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true },
  name: { type: String, required: true },
  slug: String,
  startAt: Date,
  state: Number,
  numEntrants: Number,
  maxEntrants: Number,
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
  gameName: String,
  entryFee: {
    amount: Number,
    currency: { type: String, default: 'USD' }
  },
  format: {
    type: String,
    enum: ['SINGLE_ELIMINATION', 'DOUBLE_ELIMINATION', 'ROUND_ROBIN'],
    default: 'DOUBLE_ELIMINATION'
  },
  description: String,
  rules: String,
  registrationClosesAt: Date,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  sets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Set' }],
  phases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Phase' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Event', eventSchema); 