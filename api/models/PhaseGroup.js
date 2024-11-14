import mongoose from 'mongoose';

const phaseGroupSchema = new mongoose.Schema({
  phaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Phase', required: true },
  name: { type: String, required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Participant' }],
  sets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Set' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('PhaseGroup', phaseGroupSchema); 