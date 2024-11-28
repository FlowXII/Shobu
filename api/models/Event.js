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
    type: Number,
    min: 0,
    default: 0
  },
  format: {
    type: String,
    enum: ['SINGLE_ELIMINATION', 'DOUBLE_ELIMINATION', 'ROUND_ROBIN'],
    default: 'DOUBLE_ELIMINATION'
  },
  description: String,
  rules: String,
  registrationClosesAt: Date,
  participants: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    displayName: String,
    seed: Number,
    registeredAt: { type: Date, default: Date.now },
    checkedIn: { type: Boolean, default: false },
    _id: false
  }],
  sets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Set' }],
  phases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Phase' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

eventSchema.pre('save', function(next) {
  if (!this.phases) {
    this.phases = [];
  }
  this.entryFee = Math.max(0, Number(this.entryFee) || 0);
  next();
});

eventSchema.index({ tournamentId: 1 });
eventSchema.index({ 'participants.userId': 1 });
eventSchema.index({ startAt: 1 });

export default mongoose.model('Event', eventSchema); 