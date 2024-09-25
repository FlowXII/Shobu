// backend/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your_secret_key';

const authMiddleware = (req, res, next) => {
  if (process.env.SKIP_AUTH === 'true') {
    req.user = { username: 'dev_user' };
    return next();
  }

  const token = req.headers['authorization'];
  if (token) {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).send('Invalid token');
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    res.status(401).send('No token provided');
  }
};

export default authMiddleware;
