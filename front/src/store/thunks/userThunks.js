import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { clearUser } from '../slices/userSlice';
import { setAuthenticated } from '../slices/authSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.success) {
        dispatch(setAuthenticated(true));
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
      const response = await api.get('/users/profile');
      if (response.data.success) {
        dispatch(setAuthenticated(true));
        return response.data.data;
      }
      dispatch(setAuthenticated(false));
      return rejectWithValue('No user data found');
    } catch (error) {
      dispatch(setAuthenticated(false));
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch user data');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await api.post('/auth/logout');
      dispatch(clearUser());
      dispatch(setAuthenticated(false));
      return { success: true };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Logout failed');
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

export const fetchDashboardData = createAsyncThunk(
  'user/fetchDashboardData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/dashboard');
      if (response.data) {
        return response.data;
      }
      return rejectWithValue('No dashboard data found');
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch dashboard data');
    }
  }
);

export const disconnectStartGG = createAsyncThunk(
  'user/disconnectStartGG',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/startgg/disconnect');
      if (response.data.success) {
        return true;
      }
      return rejectWithValue('Failed to disconnect Start.gg');
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to disconnect Start.gg');
    }
  }
);