import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

export const useProfile = (username) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(
        username ? `/users/profile/${username}` : '/users/profile/me'
      );

      const profile = response.data.data || response.data.user;
      setProfileData(profile);
      return profile;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [username]);

  // Initial fetch
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updates) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.patch('/users/profile', updates);
      if (response.data.success) {
        const updatedData = response.data.data;
        setProfileData(prev => ({
          ...prev,
          ...updatedData
        }));
        return updatedData;
      }
      throw new Error(response.data.error || 'Failed to update profile');
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    profileData,
    fetchProfile,
    updateProfile
  };
}; 