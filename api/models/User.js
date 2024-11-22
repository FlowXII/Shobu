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
  bio: { type: String, default: '' },
  avatar: { type: String, default: 'https://via.placeholder.com/150' },
  banner: { type: String, default: 'https://via.placeholder.com/1500x500' },
  location: {
    city: String,
    country: String
  },
  socialLinks: {
    twitter: String,
    discord: String,
    twitch: String
  },
  preferences: {
    displayEmail: { type: Boolean, default: false },
    theme: { type: String, default: 'dark' }
  },
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
  },
  statsCache: {
    tournamentsOrganized: Number,
    tournamentsParticipated: Number,
    totalMatches: Number,
    totalWins: Number,
    lastUpdated: Date,
  },
  recentTournaments: [{
    tournamentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament' },
    placement: Number,
    date: Date
  }]
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