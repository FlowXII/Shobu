import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  console.log('🔒 Verifying token...');
  const jwtToken = req.cookies.jwt;

  if (!jwtToken) {
    console.log('❌ No JWT token found in cookies');
    return res.status(401).json({ error: 'Please log in first' });
  }

  try {
    console.log('🔑 Attempting to verify JWT...');
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    console.log('✅ JWT verified successfully for user:', decoded.userId);
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    console.error('❌ Token verification failed:', {
      error: error.message,
      stack: error.stack
    });
    return res.status(401).json({ error: 'Invalid token' });
  }
};