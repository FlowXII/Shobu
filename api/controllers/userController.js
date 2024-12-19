import { 
  registerUser, 
  loginUser, 
  getCurrentUserData, 
  searchUsersService,
  updateUserProfile,
  getUserProfile
} from '../services/user/userService.js';
import logger from '../utils/logger.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ValidationError, NotFoundError, AuthenticationError } from '../utils/errors.js';
import { 
  sendCreatedResponse,
  sendSuccessResponse,
  sendListResponse
} from '../utils/responseHandler.js';

export const register = catchAsync(async (req, res) => {
  const { token, user } = await registerUser(req.body);
  
  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  });

  return sendCreatedResponse({
    res,
    data: user,
    message: 'User registered successfully'
  });
});

export const login = catchAsync(async (req, res) => {
  const { token, user } = await loginUser(req.body);
  
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  });

  return sendSuccessResponse({
    res,
    data: user,
    message: 'Login successful'
  });
});

export const getProfile = catchAsync(async (req, res) => {
  let result;
  
  if (req.path === '/profile/me') {
    result = await getUserProfile({ userId: req.user._id });
  } else if (req.params.userId) {
    result = await getUserProfile({ userId: req.params.userId });
  } else if (req.params.username) {
    result = await getUserProfile({ username: req.params.username });
  } else {
    throw new ValidationError('No identifier provided');
  }

  return sendSuccessResponse({
    res,
    data: result
  });
});

export const searchUsers = catchAsync(async (req, res) => {
  const users = await searchUsersService(req.query.q, req.user._id);
  
  return sendListResponse({
    res,
    data: users
  });
});

export const updateProfile = catchAsync(async (req, res) => {
  const user = await updateUserProfile(req.userId, req.body);
  
  return sendSuccessResponse({
    res,
    data: user,
    message: 'Profile updated successfully'
  });
});

export const logout = catchAsync(async (req, res) => {
  ['auth_token', 'jwt'].forEach(cookie => {
    res.clearCookie(cookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
  });

  return sendSuccessResponse({
    res,
    message: 'Successfully logged out'
  });
}); 