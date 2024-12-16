import { toast } from 'react-toastify';

export async function fetchSeeding(tournamentId, eventId, phaseId) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/tournaments/${tournamentId}/events/${eventId}/phases/${phaseId}/seeding`,
      { credentials: 'include' }
    );
    
    if (!response.ok) throw new Error('Failed to fetch seeding');
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching seeding:', error);
    toast.error('Failed to fetch seeding');
    return null;
  }
}

export async function createSeeding(tournamentId, eventId, phaseId, type = 'manual') {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/tournaments/${tournamentId}/events/${eventId}/phases/${phaseId}/seeding`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ type })
      }
    );
    
    if (!response.ok) throw new Error('Failed to create seeding');
    
    const data = await response.json();
    toast.success('Seeding created successfully');
    return data.data;
  } catch (error) {
    console.error('Error creating seeding:', error);
    toast.error('Failed to create seeding');
    throw error;
  }
}

export async function updateSeeding(tournamentId, eventId, phaseId, seeds) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/tournaments/${tournamentId}/events/${eventId}/phases/${phaseId}/seeding/update`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ seeds })
      }
    );
    
    if (!response.ok) throw new Error('Failed to update seeding');
    
    const data = await response.json();
    toast.success('Seeding updated successfully');
    return data.data;
  } catch (error) {
    console.error('Error updating seeding:', error);
    toast.error('Failed to update seeding');
    throw error;
  }
}

export async function finalizeSeeding(tournamentId, eventId, phaseId) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/tournaments/${tournamentId}/events/${eventId}/phases/${phaseId}/seeding/finalize`,
      {
        method: 'PUT',
        credentials: 'include'
      }
    );
    
    if (!response.ok) throw new Error('Failed to finalize seeding');
    
    const data = await response.json();
    toast.success('Seeding finalized successfully');
    return data.data;
  } catch (error) {
    console.error('Error finalizing seeding:', error);
    toast.error('Failed to finalize seeding');
    throw error;
  }
} 