import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: '.env.test' });

// Setup test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '4001';
process.env.DB_URI = process.env.TEST_DB_URI || 'mongodb://localhost:27017/shobu_test';

// Setup MongoDB Memory Server for testing
beforeAll(async () => {
  await mongoose.connect(process.env.DB_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

// Clear all collections after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

// Mock environment variables
process.env.VAPID_PUBLIC_KEY = 'test_public_key';
process.env.VAPID_PRIVATE_KEY = 'test_private_key';
process.env.VAPID_EMAIL = 'test@example.com'; 