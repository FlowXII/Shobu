// controllers/auth/startgg.controller.js
import { getAuthUrl, handleCallback, disconnectStartGG as disconnectStartGGService } from './startgg.service.js';

export const startGGAuth = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Please log in first' });
  }
  const authUrl = getAuthUrl();
  res.redirect(authUrl);
};

export const startGGCallback = async (req, res) => {
  try {
    const { code } = req.query;
    if (!req.user) {
      return res.status(401).json({ error: 'Please log in first' });
    }

    await handleCallback(code, req.user.userId);
    res.redirect(`${process.env.FRONTEND_URL}/profile`);
  } catch (error) {
    console.error('Error in startGGCallback:', error);
    res.redirect(`${process.env.FRONTEND_URL}/profile?error=auth_failed`);
  }
};

export const protectedRoute = (req, res) => {
  res.json({ message: 'Authenticated!', user: req.user });
};

export const disconnectStartGG = async (req, res) => {
  try {
    console.log('🔌 Initiating Start.gg disconnect for user:', req.user.userId);
    await disconnectStartGGService(req.user.userId);
    console.log('✅ Successfully disconnected Start.gg');
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error in disconnectStartGG:', error);
    res.status(500).json({ 
      error: 'Failed to disconnect Start.gg',
      message: error.message 
    });
  }
};
