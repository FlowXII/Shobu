import express from 'express';
import { startGGAuth, startGGCallback, protectedRoute } from '../../auth/startgg/startgg.controller.js';
import { verifyToken } from '../../auth/startgg/startgg.middleware.js';
import jwt from 'jsonwebtoken';
import config from '../../config/startgg.config.js';

const router = express.Router();

router.get('/auth/startgg', startGGAuth);
router.get('/auth/startgg/callback', startGGCallback);
router.get('/protected', verifyToken, protectedRoute);
router.get('/auth/user', verifyToken, async (req, res) => {
  try {
    const decoded = jwt.verify(req.cookies.user_info, config.startgg.jwtSecret);
    res.json({ user: decoded.user });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

router.post('/auth/logout', (req, res) => {
  res.clearCookie('auth_token');
  res.clearCookie('user_info');
  res.status(200).json({ message: 'Logged out successfully' });
});

export default router;
