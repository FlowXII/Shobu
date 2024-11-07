import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Tournament from '../models/Tournament.js';
import Event from '../models/Event.js';
import Phase from '../models/Phase.js';
import Set from '../models/Set.js';
import Match from '../models/Match.js';

dotenv.config();

const sampleData = {
  user: {
    username: "testUser",
    password: "hashedPassword123",
    email: "test@example.com",
    roles: ["user"],
    bio: "Test user bio",
    location: {
      city: "Test City",
      state: "Test State",
      country: "Test Country"
    }
  },
  tournament: {
    name: "Test Tournament",
    slug: "test-tournament-2024",
    location: {
      city: "Test City",
      state: "Test State",
      country: "Test Country"
    },
    startAt: new Date(),
    numAttendees: 64
  }
};

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log('Connected to MongoDB');

    // Create collections
    await User.createCollection();
    await Tournament.createCollection();
    await Event.createCollection();
    await Phase.createCollection();
    await Set.createCollection();
    await Match.createCollection();

    // Optional: Add sample data
    const user = await User.create(sampleData.user);
    const tournament = await Tournament.create({
      ...sampleData.tournament,
      organizerId: user._id
    });

    console.log('Database seeded successfully!');
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase(); 