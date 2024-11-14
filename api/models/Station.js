import mongoose from 'mongoose';

const stationSchema = new mongoose.Schema({
  tournamentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true },
  name: { type: String, required: true },
  number: { type: Number, required: true },
  location: String,
  status: { type: String, enum: ['AVAILABLE', 'IN_USE', 'MAINTENANCE'], default: 'AVAILABLE' },
  currentSetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Set' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Station', stationSchema); 