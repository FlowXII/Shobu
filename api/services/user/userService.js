import User from '../../models/User.js';
import jwt from 'jsonwebtoken';
import logger from '../../utils/logger.js';

export const registerUser = async (userData) => {
  const { username, email, password } = userData;

  const existingUser = await User.findOne({ 
    $or: [{ email }, { username }] 
  });
  
  if (existingUser) {
    logger.warn('Registration failed - user exists', { email, username });
    throw new Error('User already exists');
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
  const user = await User.findOne({ email });
  
  if (!user || !await user.comparePassword(password)) {
    throw new Error('Invalid credentials');
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
  const user = await User.findById(userId)
    .select('-password -startgg.accessToken -startgg.refreshToken');
  
  if (!user) {
    throw new Error('User not found');
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
    return [];
  }

  return await User.find({
    _id: { $ne: currentUserId },
    username: { $regex: query, $options: 'i' }
  })
  .select('username _id')
  .limit(10)
  .lean();
};

export const updateUserProfile = async (userId, updates) => {
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

  return await User.findByIdAndUpdate(
    userId,
    { $set: filteredUpdates },
    { new: true }
  ).select('-password');
};

export const getUserProfile = async ({ userId, username }) => {
  try {
    let user;
    if (userId) {
      // Query by user ID
      user = await User.findById(userId);
    } else if (username) {
      // Query by username
      user = await User.findOne({ username: username });
    } else {
      throw new Error('No valid identifier provided');
    }

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    console.error('getUserProfile error', { error, userId, username });
    throw error;
  }
};

const generateAuthToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};