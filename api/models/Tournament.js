import mongoose from 'mongoose';

const tournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  slug: { type: String, unique: true },
  location: {
    city: String,
    state: String,
    country: String,
  },
  startAt: { type: Date, required: true },
  endAt: Date,
  numAttendees: Number,
  createdAt: { type: Date, default: Date.now },
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
});

export default mongoose.model('Tournament', tournamentSchema); 