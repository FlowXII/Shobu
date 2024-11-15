import { createSlice } from '@reduxjs/toolkit';
import { fetchDashboardData } from '../thunks/userThunks';

const initialState = {
  tournaments: [],
  loading: false,
  error: null
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboard: (state) => {
      state.tournaments = [];
      state.error = null;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.tournaments = action.payload.tournaments || [];
        state.error = null;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.tournaments = [];
      });
  }
});

export const { clearDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer; 