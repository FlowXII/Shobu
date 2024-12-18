import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

dotenv.config({ path: '.env.test' });

// Setup test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '4001';
process.env.DB_URI = process.env.DB_URI;
process.env.JWT_SECRET = 'test-jwt-secret';

// Helper function to create auth token for testing
global.generateTestToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET);
};

// Helper function to create auth header
global.getAuthHeader = (token) => ({
  Cookie: `jwt=${token}`
});

beforeAll(async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
});

afterAll(async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
});

afterEach(async () => {
  const collection = mongoose.connection.collection('jest');
});
