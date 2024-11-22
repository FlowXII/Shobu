import React, { useState, useEffect } from 'react';
import { Typography, Card, CardBody } from "@material-tailwind/react";
import { Calendar, MapPin, Users, Trophy } from 'lucide-react';
import { useParams } from 'react-router-dom';

const TournamentOverviewTO = () => {
  const { tournamentId } = useParams();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/tournaments/${tournamentId}`,
          {
            credentials: 'include',
          }
        );
        
        if (!response.ok) throw new Error('Failed to fetch tournament');
        
        const data = await response.json();
        setTournament(data);
      } catch (error) {
        console.error('Error fetching tournament:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [tournamentId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!tournament) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-gray-800/50 border border-white/10">
        <CardBody>
          <Typography variant="h6" className="mb-4">Description</Typography>
          <Typography className="text-gray-400">
            {tournament.description || 'No description provided'}
          </Typography>
        </CardBody>
      </Card>

      <Card className="bg-gray-800/50 border border-white/10">
        <CardBody>
          <Typography variant="h6" className="mb-4">Details</Typography>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Trophy className="text-gray-400" size={20} />
              <Typography className="text-gray-400">
                {tournament.type || 'Standard'} Tournament
              </Typography>
            </div>
            <div className="flex items-center gap-3">
              <Users className="text-gray-400" size={20} />
              <Typography className="text-gray-400">
                {tournament.numAttendees || 0} Attendees
              </Typography>
            </div>
            {tournament.location && (
              <div className="flex items-center gap-3">
                <MapPin className="text-gray-400" size={20} />
                <Typography className="text-gray-400">
                  {[
                    tournament.location.venueAddress,
                    tournament.location.city,
                    tournament.location.state,
                    tournament.location.country
                  ].filter(Boolean).join(', ')}
                </Typography>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default TournamentOverviewTO; 