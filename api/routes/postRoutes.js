import express from 'express';
import { createPost, getFeedPosts } from '../controllers/postController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, createPost);
router.get('/feed', authenticate, getFeedPosts);

export default router; 