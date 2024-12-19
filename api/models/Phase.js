import mongoose from 'mongoose';

const phaseSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  name: { type: String, required: true },
  type: { type: String, enum: ["pools", "bracket"], required: true },
  sets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Set" }],
  metadata: {
    bracketType: { type: String, enum: ['SINGLE_ELIMINATION', 'DOUBLE_ELIMINATION'], required: true },
    seedingType: { type: String, enum: ['random', 'manual'], required: true },
    numberOfRounds: { type: Number, required: true },
    totalParticipants: { type: Number, required: true },
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    status: { type: String, enum: ['created', 'in_progress', 'completed'], default: 'created' },
    participants: [{
      displayName: String,
      seed: Number,
      initialSeedNumber: Number,
      isBye: { type: Boolean, default: false }
    }]
  },
  createdAt: { type: Date, default: Date.now },
});

const Phase = mongoose.model('Phase', phaseSchema);
export default Phase; 