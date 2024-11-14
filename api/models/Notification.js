import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  readStatus: { type: Boolean, default: false },
  type: { type: String, enum: ['MATCH_READY', 'MATCH_RESULT', 'TOURNAMENT_UPDATE'], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Notification', notificationSchema); 