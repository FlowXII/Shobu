import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { clearUser } from '../slices/userSlice';
import { setAuthenticated } from '../slices/authSlice';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// Replace makeAuthenticatedRequest with axios instance usage
const makeAuthenticatedRequest = (url, options = {}, startggToken) => {
  console.log('Making authenticated request to:', url);
  return api.request({
    url,
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${startggToken}`
    }
  });
};

export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      
      if (response.data.success) {
        return response.data.user;
      }
      return rejectWithValue('Invalid credentials');
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Invalid credentials');
    }
  }
);

export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.get('/auth/user');
      
      if (response.data.user) {
        dispatch(setAuthenticated(true));
        return response.data.user;
      }
      
      dispatch(setAuthenticated(false));
      return rejectWithValue('No user data found');
    } catch (error) {
      // If the error is 401 (Unauthorized), it's not really an error - the user is just not logged in
      if (error.response?.status === 401) {
        dispatch(setAuthenticated(false));
        return rejectWithValue('Not authenticated');
      }
      
      dispatch(setAuthenticated(false));
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch user data');
    }
  }
);

export const fetchDashboardData = createAsyncThunk(
  'user/fetchDashboardData',
  async (_, { getState, rejectWithValue }) => {
    const { user } = getState().user;
    
    if (!user?.startgg?.accessToken) {
      return rejectWithValue('No Start.gg access token available');
    }

    try {
      const { data } = await makeAuthenticatedRequest(
        '/dashboard',
        { method: 'GET' },
        user.startgg.accessToken
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch dashboard data');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // Make the logout request
      await api.post('/auth/logout');
      
      // Clear user data from the store
      dispatch(clearUser());
      dispatch(setAuthenticated(false));
      
      // Optionally, you can redirect to login page here
      window.location.href = '/login';
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return rejectWithValue(error.response?.data?.error || 'Logout failed');
    }
  }
);

export const disconnectStartGG = createAsyncThunk(
  'user/disconnectStartGG',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await api.post('/auth/startgg/disconnect');
      // Refresh user data after disconnecting
      return dispatch(fetchUserData()).unwrap();
    } catch (error) {
      console.error('Start.gg disconnect error:', error);
      return rejectWithValue('Failed to disconnect Start.gg');
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', credentials);
      
      if (response.data.success) {
        return response.data.user;
      }
      return rejectWithValue('Registration failed');
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Registration failed');
    }
  }
);