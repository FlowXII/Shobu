import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    dashboard: dashboardReducer
  }
});

export default store;
