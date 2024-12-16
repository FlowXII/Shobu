import { toast } from 'react-toastify';

async function fetchWithCredentials(url, options = {}) {
  try {
    console.log('fetchWithCredentials - Starting request:', {
      url,
      options,
      fullUrl: `${import.meta.env.VITE_API_BASE_URL}${url}`
    });

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${url}`, {
      ...options,
      credentials: 'include',
    });
    
    const data = await response.json();
    
    console.log('fetchWithCredentials - Response:', {
      status: response.status,
      ok: response.ok,
      data
    });
    
    if (!response.ok) {
      throw new Error(data.error || `Failed to fetch: ${url}`);
    }
    
    return data.data;
  } catch (error) {
    console.error('fetchWithCredentials - Error:', {
      error,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
}

// Fetch functions
export async function fetchEventById(tournamentId, eventId) {
  if (typeof tournamentId === 'object' && tournamentId._id) {
    tournamentId = tournamentId._id.toString();
  }
  console.log(tournamentId, eventId);
  return await fetchWithCredentials(
    `/tournaments/${tournamentId}/events/${eventId}?populate=phases.sets.slots.entrant,phases.metadata`
  );
}

export async function updateEvent(tournamentId, eventId, updatedData) {
  console.log('updateEvent - Starting update:', {
    tournamentId,
    eventId,
    updatedData
  });

  try {
    const result = await fetchWithCredentials(`/tournaments/${tournamentId}/events/${eventId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    });

    console.log('updateEvent - Success:', result);
    return result;
  } catch (error) {
    console.error('updateEvent - Error:', {
      error,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
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

export async function generateBrackets(tournamentId, eventId, type, seeding) {
  if (typeof tournamentId === 'object' && tournamentId._id) {
    tournamentId = tournamentId._id.toString();
  }

  console.log('generateBrackets - Starting generation:', {
    tournamentId,
    eventId,
    type,
    seeding
  });

  try {
    const result = await fetchWithCredentials(
      `/tournaments/${tournamentId}/events/${eventId}/brackets/generate`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, seeding })
      }
    );

    console.log('generateBrackets - Success:', result);
    return result;
  } catch (error) {
    console.error('generateBrackets - Error:', error);
    throw error;
  }
}

export async function deleteEvent(tournamentId, eventId) {
  return await fetchWithCredentials(`/tournaments/${tournamentId}/events/${eventId}`, {
    method: 'DELETE'
  });
}

export async function generateParticipants(tournamentId, eventId, participants) {
  return await fetchWithCredentials(`/tournaments/${tournamentId}/events/${eventId}/participants/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ participants })
  });
}

export async function fetchEventsByIds(tournamentId, eventIds) {
  if (typeof tournamentId === 'object' && tournamentId._id) {
    tournamentId = tournamentId._id.toString();
  }

  console.log('fetchEventsByIds - Fetching events:', {
    tournamentId,
    eventIds
  });

  return await fetchWithCredentials(
    `/tournaments/${tournamentId}/events?ids=${eventIds.join(',')}&populate=phases.sets.slots.entrant,phases.metadata`
  );
}

export async function fetchTournamentEvents(tournamentId) {
  if (typeof tournamentId === 'object' && tournamentId._id) {
    tournamentId = tournamentId._id.toString();
  }

  console.log('fetchTournamentEvents - Fetching all events for tournament:', {
    tournamentId
  });

  return await fetchWithCredentials(
    `/tournaments/${tournamentId}/events?populate=phases.sets.slots.entrant,phases.metadata`
  );
}

// New loader functions
export async function fetchEventPhases(tournamentId, eventId) {
  if (typeof tournamentId === 'object' && tournamentId._id) {
    tournamentId = tournamentId._id.toString();
  }
  
  return await fetchWithCredentials(
    `/tournaments/${tournamentId}/events/${eventId}/phases?populate=sets.slots.entrant`
  );
}

export async function fetchEventSets(tournamentId, eventId, phaseId) {
  if (typeof tournamentId === 'object' && tournamentId._id) {
    tournamentId = tournamentId._id.toString();
  }
  
  const url = phaseId 
    ? `/tournaments/${tournamentId}/events/${eventId}/phases/${phaseId}/sets`
    : `/tournaments/${tournamentId}/events/${eventId}/sets`;
    
  return await fetchWithCredentials(url);
}

export async function updateSetScore(setId, scores) {
  return await fetchWithCredentials(`/sets/${setId}/score`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scores })
  });
}

// Loader functions for React Router
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

export async function eventPhasesLoader({ params }) {
  if (!params.eventId || !params.tournamentId) {
    console.warn('Missing event or tournament ID');
    return { phases: [] };
  }

  try {
    const phases = await fetchEventPhases(params.tournamentId, params.eventId);
    return { phases };
  } catch (error) {
    console.error('Phases loader error:', error);
    toast.error('Failed to load event phases');
    return { phases: [] };
  }
}

export async function eventSetsLoader({ params }) {
  if (!params.eventId || !params.tournamentId) {
    console.warn('Missing event or tournament ID');
    return { sets: [] };
  }

  try {
    const sets = await fetchEventSets(
      params.tournamentId, 
      params.eventId,
      params.phaseId
    );
    return { sets };
  } catch (error) {
    console.error('Sets loader error:', error);
    toast.error('Failed to load event sets');
    return { sets: [] };
  }
}
