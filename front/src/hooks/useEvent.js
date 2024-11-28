import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

export const useEvent = (eventId, tournamentId) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEvent = useCallback(async () => {
    if (!eventId || !tournamentId) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/tournaments/${tournamentId}/events/${eventId}`,
        { credentials: 'include' }
      );
      
      if (!response.ok) throw new Error('Failed to fetch event');
      const { data } = await response.json();
      setEvent(data);
    } catch (error) {
      toast.error('Failed to load event');
      setEvent(null);
    } finally {
      setLoading(false);
    }
  }, [eventId, tournamentId]);

  const updateEvent = async (formData) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/tournaments/${tournamentId}/events/${eventId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(formData)
        }
      );
      
      if (!response.ok) throw new Error('Failed to update event');
      const { data } = await response.json();
      setEvent(data);
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  return {
    event,
    loading,
    updateEvent,
    refreshEvent: fetchEvent
  };
}; 