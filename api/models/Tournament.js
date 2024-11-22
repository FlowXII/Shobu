import mongoose from 'mongoose';

const tournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  slug: { type: String, unique: true },
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startAt: { type: Date, required: true },
  endAt: Date,
  type: { type: String, enum: ['SINGLE_ELIMINATION', 'DOUBLE_ELIMINATION', 'ROUND_ROBIN'], default: 'SINGLE_ELIMINATION' },
  location: {
    city: String,
    state: String,
    country: String,
    venueAddress: String
  },
  numAttendees: Number,
  attendees: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['REGISTERED', 'CHECKED_IN', 'CANCELLED'], default: 'REGISTERED' },
    registeredAt: { type: Date, default: Date.now },
    checkedInAt: Date,
    cancelledAt: Date
  }],
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  images: [{
    url: String,
    type: String
  }],
  status: { type: String, enum: ['DRAFT', 'PUBLISHED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], default: 'DRAFT' },
  registrationStartAt: Date,
  registrationEndAt: Date,
  maxAttendees: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

tournamentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

tournamentSchema.index({ slug: 1 });
tournamentSchema.index({ organizerId: 1 });
tournamentSchema.index({ 'attendees.userId': 1 });
tournamentSchema.index({ status: 1, startAt: 1 });

tournamentSchema.methods.isRegistrationOpen = function() {
  const now = new Date();
  return this.registrationStartAt <= now && 
         (!this.registrationEndAt || this.registrationEndAt >= now) &&
         (!this.maxAttendees || this.attendees.length < this.maxAttendees);
};

tournamentSchema.methods.canUserRegister = function(userId) {
  return this.isRegistrationOpen() && 
         !this.attendees.some(a => a.userId.toString() === userId.toString());
};

export default mongoose.model('Tournament', tournamentSchema); 