import app from './index.js';
import dotenv from 'dotenv';
import { connectDB } from './db/mongo.js';
import { createServer } from 'http';
import { initializeSocket } from './services/socket/socketService.js';

dotenv.config();

const PORT = process.env.PORT || 4000;
const httpServer = createServer(app);

// Initialize Socket.IO using the service
const io = initializeSocket(httpServer);

// Connect to MongoDB before starting the server
connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Failed to connect to MongoDB:', error);
  process.exit(1);
});

