import { useState } from 'react';
import { toast } from 'react-toastify';
import { generateRandomUsername } from '../utils/generators';

export const useEventManagement = (tournamentId) => {
  const [loading, setLoading] = useState(false);

  const createEvent = async (eventData) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/tournaments/${tournamentId}/events`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            ...eventData,
            format: eventData.format.toUpperCase().replace(' ', '_')
          })
        }
      );

      if (!response.ok) throw new Error('Failed to create event');
      const { data } = await response.json();
      toast.success('Event created successfully');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/tournaments/${tournamentId}/events/${eventId}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      );

      if (!response.ok) throw new Error('Failed to delete event');
      toast.success('Event deleted successfully');
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const generateBrackets = async (eventId, bracketType, seeding) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/tournaments/${tournamentId}/events/${eventId}/brackets/generate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ type: bracketType, seeding })
        }
      );

      if (!response.ok) throw new Error('Failed to generate brackets');
      toast.success('Brackets generated successfully');
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  return {
    loading,
    createEvent,
    deleteEvent,
    generateBrackets
  };
}; 