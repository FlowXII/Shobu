import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

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
    
    console.log('useEvent hook fetching:', {
      eventId,
      url: `${import.meta.env.VITE_API_BASE_URL}/events/${eventId}`
    });
    
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

      const formatToBracketType = {
        'SINGLE_ELIMINATION': 'Single Elimination',
        'DOUBLE_ELIMINATION': 'Double Elimination',
        'ROUND_ROBIN': 'Round Robin'
      };

      setEvent({
        ...eventData,
        tournament: eventData.tournamentId,
        tournamentContext: {
          name: eventData.tournamentId?.name || 'Tournament',
          slug: eventData.tournamentId?.slug
        },
        bracketType: formatToBracketType[eventData.format] || 'Double Elimination'
      });

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