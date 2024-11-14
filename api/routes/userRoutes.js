import express from 'express';
import { register, login, getCurrentUser, logout } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticateToken, logout);
router.get('/user', authenticateToken, getCurrentUser);

export default router; 