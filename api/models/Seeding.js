import mongoose from 'mongoose';

const seedingSchema = new mongoose.Schema({
  eventId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event', 
    required: true 
  },
  phaseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Phase', 
    required: true 
  },
  seeds: [{
    participantId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Participant', 
      required: true 
    },
    seedNumber: { 
      type: Number, 
      required: true 
    },
    displayName: String
  }],
  type: {
    type: String,
    enum: ['manual', 'random', 'skill'],
    default: 'manual'
  },
  status: {
    type: String,
    enum: ['draft', 'final'],
    default: 'draft'
  }
}, { timestamps: true });

seedingSchema.index({ eventId: 1, phaseId: 1 });

export default mongoose.model('Seeding', seedingSchema); 