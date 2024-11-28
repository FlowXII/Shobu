import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.jwt || req.cookies.auth_token;
    
    if (!token) {
      console.log('No authentication token found in cookies');
      return res.status(401).json({ error: 'Authentication required' });
    }

    console.log('Authentication token found, verifying...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded.userId) {
      console.log('Token decoded but no userId found');
      return res.status(401).json({ error: 'Invalid token format' });
    }

    console.log(`User ID extracted from token: ${decoded.userId}`);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      console.log(`User not found for ID: ${decoded.userId}`);
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    req.userId = user._id;
    console.log(`User authenticated successfully: ${user.username} (ID: ${user._id})`);
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Alias for authenticateToken to match the route's expected middleware name
export const authenticateToken = authenticate;