import { createSlice } from '@reduxjs/toolkit';
import { loginUser, logoutUser, registerUser, fetchUserData } from '../thunks/userThunks';

const initialState = {
  isAuthenticated: false,
  loading: false,
  error: null,
  initialized: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
      state.initialized = true;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        state.initialized = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload;
        state.initialized = true;
      })
      // Fetch user data cases
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        state.initialized = true;
      })
      .addCase(fetchUserData.rejected, (state) => {
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        state.initialized = true;
      })
      // Logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        state.initialized = true;
      })
      // Register cases
      .addCase(registerUser.fulfilled, (state) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        state.initialized = true;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isAuthenticated = false;
        state.loading = false;
        state.initialized = true;
      });
  }
});

export const { setAuthenticated } = authSlice.actions;
export default authSlice.reducer;