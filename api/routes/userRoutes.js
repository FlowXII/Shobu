import express from 'express';
import { 
  register, 
  login, 
  logout, 
  getProfile,
  updateProfile, 
  searchUsers 
} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticateToken, logout);

// Profile routes
router.get('/profile/:username?', authenticateToken, getProfile);
router.patch('/profile', authenticateToken, updateProfile);

// Search route
router.get('/search', authenticateToken, searchUsers);

export default router; 