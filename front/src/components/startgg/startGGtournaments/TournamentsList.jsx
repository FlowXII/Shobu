import React, { useState, useEffect } from 'react';
import { Typography } from "@material-tailwind/react";
import { toast } from 'react-toastify';
import LoadingIndicator from '../../layout/LoadingIndicator';
import TournamentCardComponent from './TournamentCardComponent';

const TournamentsList = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/tournaments`, {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tournaments');
        }

        const data = await response.json();
        
        // Ensure each tournament has an _id
        const validTournaments = data.data.filter(tournament => tournament._id);
        setTournaments(validTournaments);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
        toast.error('Failed to load tournaments');
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="space-y-6">
      {tournaments.length > 0 ? (
        tournaments.map((tournament) => (
          <TournamentCardComponent 
            key={tournament._id} 
            tournament={tournament}
            tournamentId={tournament._id} // Explicitly pass the ID
          />
        ))
      ) : (
        <Typography className="text-center text-gray-300">
          No tournaments found
        </Typography>
      )}
    </div>
  );
};

export default TournamentsList; 