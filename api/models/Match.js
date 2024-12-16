import mongoose from 'mongoose';

const MatchSchema = new mongoose.Schema({
  setId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Set',
    required: true
  },
  matchNumber: {
    type: Number,
    required: true
  },
  player1Score: {
    type: Number,
    default: 0
  },
  player2Score: {
    type: Number,
    default: 0
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  stage: {
    type: String // e.g., "Battlefield", "Final Destination"
  }
}, { timestamps: true });

export default mongoose.model('Match', MatchSchema);