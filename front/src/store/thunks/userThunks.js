import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setUser, setError, clearUser } from '../slices/userSlice';
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
  return api.request({
    url,
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${startggToken}`
    }
  });
};

export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async (_, { dispatch, rejectWithValue }) => {
    console.log('🔍 Initiating user data fetch...');
    try {
      console.log('📤 Making request to:', `${import.meta.env.VITE_API_BASE_URL}/auth/user`);
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/user`, {
        withCredentials: true
      });
      console.log('📥 Received user data:', response.data);
      
      if (response.data.user) {
        dispatch(setUser(response.data.user));
        dispatch(setAuthenticated(true));
        return response.data.user;
      } else {
        dispatch(setUser(null));
        dispatch(setAuthenticated(false));
        return null;
      }
    } catch (error) {
      dispatch(setAuthenticated(false));
      dispatch(setUser(null));
      console.error('❌ User data fetch error:', error);
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
