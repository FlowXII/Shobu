// controllers/auth/startgg.controller.js
import { getAuthUrl, handleCallback } from './startgg.service.js';

export const startGGAuth = (req, res) => {
  const authUrl = getAuthUrl();
  res.redirect(authUrl);
};

export const startGGCallback = async (req, res) => {
  try {
    const tokens = await handleCallback(req.query.code);
    
    // Auth token remains httpOnly
    res.cookie('auth_token', tokens.authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // User info token accessible to JavaScript
    res.cookie('user_info', tokens.userInfoToken, {
      httpOnly: false,  // Changed to false
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // Redirect to the dashboard
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  } catch (error) {
    console.error('Error in startGGCallback:', error);
    res.status(500).json({ error: error.message });
  }
};

export const protectedRoute = (req, res) => {
  res.json({ message: 'Authenticated!', user: req.user });
};
