import jwt from 'jsonwebtoken';
import config from '../../config/startgg.config.js';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.auth_token; // Get the token from cookies

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, config.startgg.jwtSecret);
    req.user = decoded; // Attach the decoded token to the request
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};