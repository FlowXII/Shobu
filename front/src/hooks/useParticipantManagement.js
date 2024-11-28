import { useState } from 'react';
import { toast } from 'react-toastify';
import { generateRandomUsername } from '../utils/generators';

export const useParticipantManagement = (tournamentId, eventId) => {
  const [loading, setLoading] = useState(false);

  const addParticipant = async (email) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/tournaments/${tournamentId}/events/${eventId}/participants`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email })
        }
      );

      if (!response.ok) throw new Error('Failed to add participant');
      toast.success('Participant added successfully');
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const removeParticipant = async (participantId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/tournaments/${tournamentId}/events/${eventId}/participants/${participantId}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      );

      if (!response.ok) throw new Error('Failed to remove participant');
      toast.success('Participant removed successfully');
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const generateParticipants = async (count) => {
    setLoading(true);
    try {
      const participants = Array.from({ length: count }, () => ({
        displayName: generateRandomUsername(),
        email: `${generateRandomUsername().toLowerCase()}@example.com`,
      }));

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/tournaments/${tournamentId}/events/${eventId}/participants/generate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ participants })
        }
      );

      if (!response.ok) throw new Error('Failed to generate participants');
      toast.success(`Generated ${count} participants successfully`);
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    addParticipant,
    removeParticipant,
    generateParticipants
  };
};