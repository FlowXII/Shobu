import express from 'express';
import { startGGAuth, startGGCallback, disconnectStartGG } from '../../auth/startgg/startgg.controller.js';
import { verifyToken } from '../../auth/startgg/startgg.middleware.js';
import User from '../../models/User.js';

const router = express.Router();

const logRequest = (req, res, next) => {
  console.log('\n🔄 Request:', new Date().toISOString());
  console.log('📍 Path:', req.path);
  console.log('🔑 User ID:', req.user?.userId);
  console.log('🍪 Cookies:', req.cookies);
  next();
};

router.use(logRequest);

router.get('/', verifyToken, startGGAuth);
router.get('/callback', verifyToken, startGGCallback);

router.get('/auth/user', verifyToken, async (req, res) => {
  console.log('👤 Fetching user data for ID:', req.user.userId);
  try {
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      console.log('❌ User not found:', req.user.userId);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('✅ User data found:', {
      id: user._id,
      username: user.username,
      startggConnected: user.startgg?.connected
    });

    res.json({ user: user.toObject() });
  } catch (error) {
    console.error('❌ Error fetching user:', {
      userId: req.user.userId,
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

router.post('/disconnect', verifyToken, async (req, res) => {
  try {
    await disconnectStartGG(req.user.userId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error disconnecting Start.gg:', error);
    res.status(500).json({ error: 'Failed to disconnect Start.gg' });
  }
});

router.get('/status', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      connected: !!user.startgg?.connected,
      gamerTag: user.startgg?.gamerTag,
      startgg: user.startgg
    });
  } catch (error) {
    console.error('Error checking Start.gg status:', error);
    res.status(500).json({ error: 'Failed to check Start.gg status' });
  }
});

export default router;
