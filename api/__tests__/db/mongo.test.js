import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();


describe('Database Connection', () => {
  it('should connect to MongoDB successfully', async () => {
    expect(mongoose.connection.readyState).toBe(1);
  }, 10000);

  it('should handle connection errors', async () => {
    // Invalid MongoDB URI to test error handling
    const invalidUri = 'mongodb://invalid:27017/invalid';
    await expect(mongoose.connect(invalidUri)).rejects.toThrow();
  }, 10000);

  it('should have the jest_shobu collection', async () => {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    expect(collectionNames).toContain('jest');
  });
}); 