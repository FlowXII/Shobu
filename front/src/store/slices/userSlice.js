import { createSlice } from '@reduxjs/toolkit';
import { fetchUserData, disconnectStartGG, loginUser, registerUser } from '../thunks/userThunks';

const initialState = {
  user: null,
  loading: {
    user: false,
    disconnect: false
  },
  error: {
    user: null,
    disconnect: null
  },
  initialized: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.error.user = null;
      state.loading.user = false;
      state.initialized = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading.user = true;
        state.error.user = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading.user = false;
        state.user = action.payload;
        state.error.user = null;
        state.initialized = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading.user = false;
        state.error.user = action.payload;
        state.initialized = true;
      })
      .addCase(fetchUserData.pending, (state) => {
        state.loading.user = true;
        state.error.user = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading.user = false;
        state.user = action.payload;
        state.error.user = null;
        state.initialized = true;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading.user = false;
        state.error.user = action.payload;
        state.initialized = true;
        state.user = null;
      })
      .addCase(disconnectStartGG.pending, (state) => {
        state.loading.disconnect = true;
        state.error.disconnect = null;
      })
      .addCase(disconnectStartGG.fulfilled, (state) => {
        state.loading.disconnect = false;
        state.error.disconnect = null;
      })
      .addCase(disconnectStartGG.rejected, (state, action) => {
        state.loading.disconnect = false;
        state.error.disconnect = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading.user = true;
        state.error.user = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading.user = false;
        state.user = action.payload;
        state.error.user = null;
        state.initialized = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading.user = false;
        state.error.user = action.payload;
        state.initialized = true;
      });
  }
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;