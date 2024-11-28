import { toast } from 'react-toastify';

async function fetchWithCredentials(url, options = {}) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${url}`, {
      ...options,
      credentials: 'include',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `Failed to fetch: ${url}`);
    }
    
    return data.data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// Fetch functions
export async function fetchEventById(tournamentId, eventId) {
  return await fetchWithCredentials(`/tournaments/${tournamentId}/events/${eventId}`);
}

export async function updateEvent(tournamentId, eventId, updatedData) {
  return await fetchWithCredentials(`/tournaments/${tournamentId}/events/${eventId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData)
  });
}

export async function addParticipant(tournamentId, eventId, email) {
  return await fetchWithCredentials(`/tournaments/${tournamentId}/events/${eventId}/participants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
}

export async function removeParticipant(tournamentId, eventId, participantId) {
  return await fetchWithCredentials(
    `/tournaments/${tournamentId}/events/${eventId}/participants/${participantId}`,
    { method: 'DELETE' }
  );
}

export async function generateBrackets(tournamentId, eventId, format, seeding) {
  return await fetchWithCredentials(`/tournaments/${tournamentId}/events/${eventId}/brackets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ format, seeding })
  });
}

// Loaders
export async function eventDetailsLoader({ params }) {
  if (!params.eventId || !params.tournamentId) {
    console.warn('Missing event or tournament ID');
    return { event: null };
  }

  try {
    const event = await fetchEventById(params.tournamentId, params.eventId);
    return { 
      event: {
        ...event,
        numParticipants: event.participants?.length || 0
      }
    };
  } catch (error) {
    console.error('Event loader error:', error);
    toast.error('Failed to load event details');
    return { event: null };
  }
} 