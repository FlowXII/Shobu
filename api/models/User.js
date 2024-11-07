import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  roles: { type: [String], default: ["user"] },
  bio: String,
  location: {
    city: String,
    state: String,
    country: String,
  },
  profileImage: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema); 