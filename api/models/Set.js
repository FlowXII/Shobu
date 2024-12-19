import mongoose from 'mongoose';

const setSchema = new mongoose.Schema({
  phaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Phase', required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  roundNumber: { type: Number, required: true },
  fullRoundText: { type: String, required: true },
  slots: [{
    entrant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    score: { type: Number, default: 0 }
  }],
  state: { 
    type: String, 
    enum: ['pending', 'called', 'in_progress', 'completed'], 
    default: 'pending' 
  },
  metadata: {
    isComplete: { type: Boolean, default: false },
    winnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    loserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
  }
}, { timestamps: true });

const Set = mongoose.model('Set', setSchema);
export default Set; 