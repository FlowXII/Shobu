import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log('Successfully connected to MongoDB Atlas!');
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
  } catch (error) {
    console.error('Connection error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testConnection(); 