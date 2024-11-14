import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  tournamentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true },
  name: { type: String, required: true },
  slug: String,
  startAt: Date,
  state: Number,
  numEntrants: Number,
  videogame: {
    id: String
  },
  sets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Set' }],
  phases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Phase' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Event', eventSchema); 