import { 
  registerUser, 
  loginUser, 
  getCurrentUserData, 
  searchUsersService,
  updateUserProfile,
  getUserProfile
} from '../services/user/userService.js';
import logger from '../utils/logger.js';

export const register = async (req, res) => {
  try {
    const { token, user } = await registerUser(req.body);
    
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error('Registration error', { error });
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
};

export const login = async (req, res) => {
  try {
    const { token, user } = await loginUser(req.body);
    
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      message: 'Login successful',
      user
    });
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      error: error.message 
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const result = await getUserProfile(req.userId, username);
    res.json(result);
  } catch (error) {
    res.status(404).json({ 
      success: false, 
      error: error.message 
    });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const users = await searchUsersService(req.query.q, req.user._id);
    res.json({ users });
  } catch (error) {
    logger.error('Search users error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to search users' 
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await updateUserProfile(req.userId, req.body);
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error('Update profile error', { error });
    res.status(500).json({
      success: false,
      error: 'Error updating profile'
    });
  }
};

export const logout = async (req, res) => {
  try {
    ['auth_token', 'jwt'].forEach(cookie => {
      res.clearCookie(cookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
    });

    res.status(200).json({
      success: true,
      message: 'Successfully logged out'
    });
  } catch (error) {
    logger.error('Logout error', { error });
    res.status(500).json({
      success: false,
      error: 'Error during logout'
    });
  }
}; 