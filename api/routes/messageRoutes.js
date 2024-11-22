import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { attachIO } from '../services/socket/socketMiddleware.js';
import { 
  sendMessage, 
  getConversationMessages, 
  markMessagesAsRead 
} from '../controllers/messageController.js';

const router = express.Router();

router.post('/', authenticate, attachIO, sendMessage);
router.get('/conversations/:conversationId/messages', authenticate, getConversationMessages);
router.post('/conversations/:conversationId/read', authenticate, markMessagesAsRead);

export default router; 