import { createSlice } from '@reduxjs/toolkit';
import { fetchUserData, fetchDashboardData, disconnectStartGG } from '../thunks/userThunks';

const initialState = {
  user: null,
  tournaments: [],
  loading: {
    user: false,
    dashboard: false,
    disconnect: false
  },
  error: {
    user: null,
    dashboard: null,
    disconnect: null
  },
  initialized: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.error.user = null;
      state.loading.user = false;
      state.initialized = true;
    },
    setError: (state, action) => {
      state.error.user = action.payload;
      state.loading.user = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.error.user = null;
      state.loading.user = false;
      state.initialized = true;
    }
  },
  extraReducers: (builder) => {
    builder
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
      })
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading.dashboard = true;
        state.error.dashboard = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading.dashboard = false;
        state.tournaments = action.payload.tournaments;
        state.error.dashboard = null;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading.dashboard = false;
        state.error.dashboard = action.payload;
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
      });
  }
});

export const { setUser, setError, clearUser } = userSlice.actions;
export default userSlice.reducer;

