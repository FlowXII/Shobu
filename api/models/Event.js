import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  tournamentId: { type: mongoose.Schema.Types.ObjectId, ref: "Tournament" },
  name: { type: String, required: true },
  videogameId: Number,
  numEntrants: Number,
  createdAt: { type: Date, default: Date.now },
  phases: [{ type: mongoose.Schema.Types.ObjectId, ref: "Phase" }],
});

export default mongoose.model('Event', eventSchema); 