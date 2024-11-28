import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

export async function fetchUserById(userId) {
  try {
    console.log(`Fetching profile for userId: ${userId}`);
    const response = await api.get(`/users/profile/id/${userId}`);
    
    if (!response.data || !response.data.data) {
      throw new Error('Invalid response format');
    }
    
    console.log(`Fetched profile for userId: ${userId}`, response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user profile:', {
      userId,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.response?.data?.message || error.message,
      stack: error.stack,
      config: {
        url: error.config?.url,
        method: error.config?.method,
      }
    });
    
    // Return a more detailed fallback object
    return {
      username: `User ${userId?.slice(0, 6) || 'Unknown'}...`,
      email: null,
      avatar: null,
      _id: userId,
      error: true,
      errorDetails: {
        status: error.response?.status,
        message: error.response?.data?.message || error.message
      }
    };
  }
}

export async function searchUsers(query) {
  try {
    const response = await api.get(`/users/search?q=${query}`);
    return response.data.users || [];
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
}

export async function fetchUserProfiles(userIds) {
  try {
    console.log('Starting to fetch profiles for userIds:', userIds);
    
    const promises = userIds.map(userId => {
      console.log('Creating fetch promise for userId:', userId);
      return fetchUserById(userId);
    });
    
    const profiles = await Promise.all(promises);
    console.log('Raw profile responses:', profiles);
    
    const mappedProfiles = profiles.reduce((acc, profile, index) => {
      const userId = userIds[index];
      console.log('Mapping profile for userId:', userId, 'Profile:', profile);
      acc[userId] = profile;
      return acc;
    }, {});
    
    console.log('Final mapped profiles:', mappedProfiles);
    return mappedProfiles;
  } catch (error) {
    console.error('Error fetching user profiles:', error);
    return {};
  }
}

export async function getCurrentUser() {
  try {
    const response = await api.get('/users/profile');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
} 