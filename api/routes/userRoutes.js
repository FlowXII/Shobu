import express from 'express';
import { getCurrentUser, searchUsers } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/current', authenticateToken, getCurrentUser);
router.get('/search', authenticateToken, searchUsers);
router.get('/profile/:username', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password -email')
      .lean();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

export default router; 