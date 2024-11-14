import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    // Check for token in both possible cookie names
    const token = req.cookies.jwt || req.cookies.auth_token;
    
    if (!token) {
      console.log('No authentication token found in cookies');
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded.userId) {
      console.log('Token decoded but no userId found');
      return res.status(401).json({ error: 'Invalid token format' });
    }

    const user = await User.findById(decoded.userId);
    
    if (!user) {
      console.log(`User not found for ID: ${decoded.userId}`);
      return res.status(401).json({ error: 'User not found' });
    }

    // Attach both full user object and userId for flexibility
    req.user = user;
    req.userId = user._id;
    req.user = user; // Attach the full user object to the request
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Alias for authenticateToken to match the route's expected middleware name
export const authenticateToken = authenticate;