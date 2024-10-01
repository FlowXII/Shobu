import axios from 'axios';

export const fetchUpcomingTournaments = async (countryCode, perPage, videogameId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/tournaments/upcoming`, {
      params: { countryCode, perPage, videogameId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching upcoming tournaments:', error);
    throw error;
  }
};