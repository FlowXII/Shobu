import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Conversation from '../../models/Conversation.js';
import Message from '../../models/Message.js';

let io;

export function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true
    }
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  // Handle connections
  io.on('connection', (socket) => {
    console.log('User connected:', socket.userId);
    
    // Join personal room
    socket.join(socket.userId);

    // Join a chat room
    socket.on('join_conversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`User ${socket.userId} joined conversation: ${conversationId}`);
    });

    // Leave a chat room
    socket.on('leave_conversation', (conversationId) => {
      socket.leave(conversationId);
      console.log(`User ${socket.userId} left conversation: ${conversationId}`);
    });

    // Handle new messages
    socket.on('send_message', async (data) => {
      try {
        // Save message to database
        const message = await saveMessage(data);
        
        // Emit to all participants
        const conversation = await Conversation.findById(data.conversationId)
          .select('participants');
          
        conversation.participants.forEach(participantId => {
          io.to(participantId.toString()).emit('new_message', message);
        });
      } catch (error) {
        socket.emit('error', error.message);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.userId);
    });
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
} 