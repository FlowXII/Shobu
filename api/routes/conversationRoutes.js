import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  createConversation,
  getUserConversations,
  deleteConversation,
  getConversationMessages
} from '../controllers/conversationController.js';
import { markMessagesAsRead } from '../controllers/messageController.js';

const router = express.Router();

router.post('/', authenticate, createConversation);
router.get('/', authenticate, getUserConversations);
router.delete('/:conversationId', authenticate, deleteConversation);
router.get('/:conversationId/messages', authenticate, getConversationMessages);
router.post('/:conversationId/read', authenticate, markMessagesAsRead);

export default router; 