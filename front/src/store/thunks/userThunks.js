import { setUser, setLoading, setError, setTournaments, clearUser } from '../slices/userSlice';
import axios from 'axios';

export const fetchUserData = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get('/api/auth/user');
    dispatch(setUser(response.data));
    // ... rest of the success logic
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // User is not authenticated, clear the user data
      dispatch(clearUser());
    } else {
      dispatch(setError('Failed to fetch user data'));
    }
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchDashboardData = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get('/api/dashboard', {
      withCredentials: true, // This ensures cookies are sent with the request
    });
    dispatch(setUser(response.data.user));
    dispatch(setTournaments(response.data.tournaments));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch dashboard data'));
    dispatch(setLoading(false));
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    await axios.post('/api/auth/logout', {}, { withCredentials: true });
    dispatch(clearUser());
  } catch (error) {
    dispatch(setError('Logout failed'));
  }
};
