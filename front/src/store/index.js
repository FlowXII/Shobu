import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['user/setUser'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.user'],
        // Ignore these paths in the state
        ignoredPaths: ['user.user'],
      },
    }),
});

export default store;
