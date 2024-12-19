import User from '../../models/User.js';
import jwt from 'jsonwebtoken';
import logger from '../../utils/logger.js';
import { ValidationError, NotFoundError, AuthenticationError, AppError } from '../../utils/errors.js';

const validateUserData = (userData) => {
  const { username, email, password } = userData;

  if (!username || username.length < 3) {
    throw new ValidationError('Username must be at least 3 characters long');
  }

  if (!email || !email.includes('@')) {
    throw new ValidationError('Valid email is required');
  }

  if (!password || password.length < 6) {
    throw new ValidationError('Password must be at least 6 characters long');
  }
};

export const registerUser = async (userData) => {
  validateUserData(userData);
  const { username, email, password } = userData;

  const existingUser = await User.findOne({ 
    $or: [{ email }, { username }] 
  });
  
  if (existingUser) {
    logger.warn('Registration failed - user exists', { email, username });
    throw new ValidationError('User with this email or username already exists');
  }

  const user = new User({ username, email, password });
  await user.save();
  
  logger.info('User registered successfully', { userId: user._id });
  
  const token = generateAuthToken(user._id);
  
  return {
    token,
    user: {
      userId: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  };
};

export const loginUser = async (credentials) => {
  const { email, password } = credentials;

  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  const user = await User.findOne({ email });
  
  if (!user || !await user.comparePassword(password)) {
    throw new AuthenticationError('Invalid credentials');
  }

  const token = generateAuthToken(user._id);
  
  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      username: user.username
    }
  };
};

export const getCurrentUserData = async (userId) => {
  if (!userId) {
    throw new ValidationError('User ID is required');
  }

  const user = await User.findById(userId)
    .select('-password -startgg.accessToken -startgg.refreshToken');
  
  if (!user) {
    throw new NotFoundError('User');
  }

  return {
    userId: user._id,
    username: user.username,
    email: user.email,
    role: user.role
  };
};

export const searchUsersService = async (query, currentUserId) => {
  if (!query || query.length < 2) {
    throw new ValidationError('Search query must be at least 2 characters long');
  }

  if (!currentUserId) {
    throw new ValidationError('Current user ID is required');
  }

  try {
    return await User.find({
      _id: { $ne: currentUserId },
      username: { $regex: query, $options: 'i' }
    })
    .select('username _id')
    .limit(10)
    .lean();
  } catch (error) {
    logger.error('Search users error:', { error, query });
    throw new AppError('Failed to search users', 500);
  }
};

export const updateUserProfile = async (userId, updates) => {
  if (!userId) {
    throw new ValidationError('User ID is required');
  }

  const allowedUpdates = [
    'bio', 
    'avatar',
    'banner',
    'location', 
    'socialLinks',
    'preferences'
  ];
  
  const filteredUpdates = Object.keys(updates)
    .filter(key => allowedUpdates.includes(key))
    .reduce((obj, key) => {
      obj[key] = updates[key];
      return obj;
    }, {});

  if (Object.keys(filteredUpdates).length === 0) {
    throw new ValidationError('No valid update fields provided');
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: filteredUpdates },
    { new: true, runValidators: true }
  ).select('-password');

  if (!updatedUser) {
    throw new NotFoundError('User');
  }

  return updatedUser;
};

export const getUserProfile = async ({ userId, username }) => {
  if (!userId && !username) {
    throw new ValidationError('Either userId or username must be provided');
  }

  try {
    let user;
    if (userId) {
      user = await User.findById(userId);
    } else {
      user = await User.findOne({ username });
    }

    if (!user) {
      throw new NotFoundError('User');
    }

    return user;
  } catch (error) {
    if (error instanceof AppError) throw error;
    
    logger.error('getUserProfile error', { error, userId, username });
    throw new AppError('Failed to fetch user profile', 500);
  }
};

const generateAuthToken = (userId) => {
  try {
    return jwt.sign(
      { userId }, 
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  } catch (error) {
    logger.error('Token generation error:', error);
    throw new AppError('Failed to generate authentication token', 500);
  }
};