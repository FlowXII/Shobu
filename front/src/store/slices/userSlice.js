import { createSlice } from '@reduxjs/toolkit';
import { fetchUserData, loginUser, registerUser, disconnectStartGG } from '../thunks/userThunks';

const initialState = {
  user: null,
  loading: {
    user: false
  },
  error: {
    user: null
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
      })
      .addCase(disconnectStartGG.fulfilled, (state) => {
        if (state.user) {
          state.user.startgg = undefined;
        }
      });
  }
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;