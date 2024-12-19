import { fetchWithCredentials } from '../utils/api';
import { toast } from 'react-toastify';

export async function generateBracketPhase(tournamentId, eventId, options) {
  try {
    console.log('generateBracketPhase - Starting generation:', {
      tournamentId,
      eventId,
      options,
      url: `/tournaments/${tournamentId}/events/${eventId}/phases/brackets`
    });

    const result = await fetchWithCredentials(
      `/tournaments/${tournamentId}/events/${eventId}/phases/brackets`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options)
      }
    );

    console.log('generateBracketPhase - Success:', result);
    return result;
  } catch (error) {
    console.error('generateBracketPhase - Detailed error:', {
      error,
      message: error.message,
      stack: error.stack,
      tournamentId,
      eventId,
      options
    });
    throw error;
  }
}

export const getPhase = async (tournamentId, eventId, phaseId) => {
  try {
    const response = await api.get(
      `/tournaments/${tournamentId}/events/${eventId}/phases/${phaseId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch phase');
  }
}; 