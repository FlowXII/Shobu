import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const formatToBracketType = {
  'Single Elimination': 'Single Elimination',
  'Double Elimination': 'Double Elimination',
  'Round Robin': 'Round Robin',
  'SINGLE_ELIMINATION': 'Single Elimination',
  'DOUBLE_ELIMINATION': 'Double Elimination',
  'ROUND_ROBIN': 'Round Robin'
};

export const useEvent = (eventId) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canRegister, setCanRegister] = useState(false);
  const currentUser = useSelector(state => state.user.user);

  const fetchEventDetails = useCallback(async () => {
    if (!eventId) {
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/events/${eventId}`,
        {
          credentials: 'include',
        }
      );
      
      console.log('Event API response:', { 
        status: response.status, 
        ok: response.ok 
      });
      
      if (response.status === 404) {
        setEvent(null);
        throw new Error('Event not found');
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch event');
      }
      
      const { data: eventData } = await response.json();
      
      if (!eventData) {
        throw new Error('No event data received');
      }

      console.log('Raw event data:', eventData);

      if (!eventData.tournamentId || !eventData.tournamentId._id) {
        console.error('Missing tournament ID in event data');
        throw new Error('Invalid event data: missing tournament reference');
      }

      setEvent({
        ...eventData,
        tournamentId: eventData.tournamentId._id,
        tournament: eventData.tournamentId,
        tournamentContext: {
          _id: eventData.tournamentId._id,
          name: eventData.tournamentId.name
        },
        format: eventData.format || 'DOUBLE_ELIMINATION',
        bracketType: formatToBracketType[eventData.format] || formatToBracketType['DOUBLE_ELIMINATION']
      });

      console.log('Setting event state:', eventData);

      setCanRegister(
        currentUser && 
        eventData.maxEntrants > (eventData.numEntrants || 0) &&
        !eventData.participants?.some(p => p.userId === currentUser._id)
      );

    } catch (error) {
      console.error('Error fetching event:', error);
      if (!error.message.includes('not found')) {
        toast.error('Failed to load event details');
      }
      setEvent(null);
    } finally {
      setLoading(false);
    }
  }, [eventId, currentUser]);

  useEffect(() => {
    if (event) {
      console.log('Event State:', {
        name: event.name,
        tournament: event.tournament,
        context: event.tournamentContext
      });
    }
  }, [event]);

  useEffect(() => {
    fetchEventDetails();
  }, [fetchEventDetails]);

  const handleRegister = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/events/${eventId}/register`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to register for event');
      }

      toast.success('Successfully registered for event! 🎮');
      await fetchEventDetails();
    } catch (error) {
      console.error('Error registering for event:', error);
      toast.error(error.message || 'Failed to register for event');
    }
  };

  return {
    event,
    loading,
    canRegister,
    handleRegister,
    refreshEvent: fetchEventDetails
  };
}; 