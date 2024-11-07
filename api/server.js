import app from './index.js';
import dotenv from 'dotenv';
import { connectDB } from './db/mongo.js';

dotenv.config();

const PORT = process.env.PORT || 4000;

// Connect to MongoDB before starting the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Failed to connect to MongoDB:', error);
  process.exit(1);
});

