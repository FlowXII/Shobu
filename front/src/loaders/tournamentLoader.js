import { toast } from 'react-toastify';

// Base fetch function with error handling
async function fetchWithCredentials(url, options = {}) {
  try {
    console.log('Fetching URL:', `${import.meta.env.VITE_API_BASE_URL}${url}`);
    console.log('Request options:', {
      ...options,
      body: options.body ? JSON.parse(options.body) : undefined
    });

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${url}`, {
      ...options,
      credentials: 'include',
    });
    
    console.log('Response status:', response.status);

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error response:', data);
      throw new Error(data.error || `Failed to fetch: ${url}`);
    }
    
    return data.data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;  // Re-throw the error to be handled by the caller
  }
}

// Fetch functions
export async function fetchTournaments() {
  return await fetchWithCredentials('/tournaments');
}

export async function fetchTournamentById(id) {
  return await fetchWithCredentials(`/tournaments/${id}`);
}

export async function updateTournament(id, updatedData) {
  console.log('=== Starting updateTournament ===');
  console.log('Received tournament ID:', id);
  console.log('Received data:', updatedData);

  if (!id || typeof id !== 'string' || id.length !== 24) {
    console.warn('Validation failed:', { 
      id, 
      type: typeof id, 
      length: id?.length,
      isString: typeof id === 'string',
      correctLength: id?.length === 24
    });
    throw new Error('Invalid tournament ID format');
  }

  try {
    console.log('Validation passed, making request...');
    const response = await fetchWithCredentials(`/tournaments/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: updatedData.name,
        description: updatedData.description,
        startAt: updatedData.startAt,
        endAt: updatedData.endAt,
        location: {
          venueAddress: updatedData.location.venueAddress,
          city: updatedData.location.city,
          state: updatedData.location.state,
          country: updatedData.location.country
        }
      })
    });

    console.log('Request completed, response:', response);

    if (!response) {
      throw new Error('Failed to update tournament');
    }

    return response;
  } catch (error) {
    console.error('Error in updateTournament:', error);
    throw error;
  }
}

export async function addParticipant(tournamentId, userId) {
  return await fetchWithCredentials(`/tournaments/${tournamentId}/attendees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
}

export async function removeParticipant(tournamentId, attendeeId) {
  return await fetchWithCredentials(`/tournaments/${tournamentId}/attendees/${attendeeId}`, {
    method: 'DELETE',
  });
}

export async function registerForTournament(tournamentId) {
  return await fetchWithCredentials(`/tournaments/${tournamentId}/register`, {
    method: 'POST'
  });
}

export async function searchUsers(query) {
  try {
    const response = await fetchWithCredentials(`/users/search?q=${query}`);
    // Return the response directly since fetchWithCredentials already returns data.data
    return {
      users: response || [] // Ensure we always return an array
    };
  } catch (error) {
    console.error('Search users error:', error);
    return { users: [] };
  }
}

// Loaders
export async function organizerLoader() {
  const tournaments = await fetchTournaments();
  return { tournaments };
}

export async function tournamentDetailsLoader({ params }) {
  if (!params.tournamentId) {
    console.warn('No tournament ID provided to loader');
    return { tournament: null };
  }

  const tournament = await fetchTournamentById(params.tournamentId);
  
  return { 
    tournament: {
      ...tournament,
      numAttendees: tournament.attendees?.length || 0
    }
  };
} 