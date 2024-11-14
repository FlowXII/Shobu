import mongoose from 'mongoose';

const setSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  fullRoundText: String,
  state: { type: Number, required: true }, // 1: Created, 2: Ongoing, 4: Ready, 6: Called, 7: Completed
  station: {
    id: String,
    number: Number
  },
  slots: [{
    id: String,
    entrant: {
      id: String,
      name: String
    }
  }],
  score1: Number,
  score2: Number,
  winnerId: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Set', setSchema); 