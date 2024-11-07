import mongoose from 'mongoose';

const phaseSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  name: { type: String, required: true },
  type: { type: String, enum: ["pools", "bracket"], required: true },
  sets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Set" }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Phase', phaseSchema); 