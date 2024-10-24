import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  loading: false,
  error: null,
  tournaments: []
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    setTournaments: (state, action) => {
      state.tournaments = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.tournaments = [];
      state.loading = false;
      state.error = null;
    }
  }
});

export const { setUser, setTournaments, setLoading, setError, clearUser } = userSlice.actions;
export default userSlice.reducer;

