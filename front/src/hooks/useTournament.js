import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

export const useTournament = (tournamentId = null) => {
  const [tournaments, setTournaments] = useState([]);
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTournaments = useCallback(async () => {
    if (tournamentId) return; // Skip if we're fetching a single tournament

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/tournaments`,
        { credentials: 'include' }
      );
      
      if (!response.ok) throw new Error('Failed to fetch tournaments');
      const { data } = await response.json();
      setTournaments(data);
    } catch (error) {
      toast.error('Failed to load tournaments');
      setTournaments([]);
    } finally {
      setLoading(false);
    }
  }, [tournamentId]);

  const fetchTournament = useCallback(async () => {
    if (!tournamentId) {
      fetchTournaments();
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/tournaments/${tournamentId}`,
        { credentials: 'include' }
      );
      
      if (!response.ok) throw new Error('Failed to fetch tournament');
      const { data } = await response.json();
      setTournament(data);
    } catch (error) {
      toast.error('Failed to load tournament');
      setTournament(null);
    } finally {
      setLoading(false);
    }
  }, [tournamentId, fetchTournaments]);

  const addParticipant = async (email) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/tournaments/${tournamentId}/participants`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) throw new Error('Failed to add participant');
      await fetchTournament();
      toast.success('Participant added successfully');
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const removeParticipant = async (participantId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/tournaments/${tournamentId}/participants/${participantId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      if (!response.ok) throw new Error('Failed to remove participant');
      await fetchTournament();
      toast.success('Participant removed successfully');
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  useEffect(() => {
    if (tournamentId) {
      fetchTournament();
    } else {
      fetchTournaments();
    }
  }, [tournamentId, fetchTournament, fetchTournaments]);

  return {
    tournament,
    tournaments,
    loading,
    addParticipant,
    removeParticipant,
    refreshTournament: tournamentId ? fetchTournament : fetchTournaments
  };
}; 