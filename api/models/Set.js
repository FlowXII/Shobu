import mongoose from 'mongoose';

const SetSchema = new mongoose.Schema({
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
  player1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  player2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  slots: [{
    entrant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    score: {
      type: Number,
      default: 0
    },
    displayName: String
  }],
  status: {
    type: String,
    enum: ['PENDING', 'CALLED', 'IN_PROGRESS', 'COMPLETED'],
    default: 'PENDING'
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  station: {
    type: String
  },
  startTime: Date,
  endTime: Date,
  round: Number,
  bestOf: {
    type: Number,
    required: true
  },
  fullRoundText: String
}, { timestamps: true });

export default mongoose.model('Set', SetSchema);