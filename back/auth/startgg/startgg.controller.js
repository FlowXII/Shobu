// controllers/auth/startgg.controller.js
import { getAuthUrl, handleCallback } from './startgg.service.js';

export const startGGAuth = (req, res) => {
  res.redirect(getAuthUrl());
};

export const startGGCallback = async (req, res) => {
  try {
    const token = await handleCallback(req.query.code);
    
    // Set the token in a secure HTTP-only cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Redirect to the dashboard without the token in the URL
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  } catch (error) {
    console.error('Error in startGGCallback:', error);
    res.status(500).json({ error: error.message });
  }
};

export const protectedRoute = (req, res) => {
  res.json({ message: 'Authenticated!', user: req.user });
};