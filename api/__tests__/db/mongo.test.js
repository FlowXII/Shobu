import mongoose from 'mongoose';
import { connectDB } from '../../db/mongo.js';
import dotenv from 'dotenv';

dotenv.config();

describe('Database Connection', () => {
  beforeAll(async () => {
    // Use a test database URL
    process.env.DB_URI = process.env.TEST_DB_URI || 'mongodb://localhost:27017/shobu_test';
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should connect to MongoDB successfully', async () => {
    await connectDB();
    expect(mongoose.connection.readyState).toBe(1);
  });

  it('should handle connection errors', async () => {
    // Invalid MongoDB URI to test error handling
    process.env.DB_URI = 'mongodb://invalid:27017/invalid';
    await expect(connectDB()).rejects.toThrow();
  });
}); 