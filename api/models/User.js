import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const imageSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  url: { type: String, required: true }
}, { _id: false });

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  startgg: {
    connected: { type: Boolean, default: false },
    accessToken: String,
    refreshToken: String,
    expiresAt: Date,
    tokenType: String,
    scope: String,
    userId: String,
    slug: String,
    gamerTag: String,
    profile: {
      bio: String,
      genderPronoun: String,
      location: {
        city: String,
        state: String,
        country: String,
        countryId: Number
      },
      images: [{
        _id: false,
        id: { type: String, required: true },
        type: { type: String, required: true },
        url: { type: String, required: true }
      }]
    },
    player: {
      id: String,
      gamerTag: String,
      prefix: String
    }
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  this.updatedAt = new Date();
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema); 