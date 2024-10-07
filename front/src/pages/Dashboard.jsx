import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardBody,
  Typography,
  Avatar,
  Chip
} from "@material-tailwind/react";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [tournamentData, setTournamentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/dashboard`, {
          withCredentials: true
        });
        setUserData(response.data.user);
        setTournamentData(response.data.tournaments);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to fetch dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div></div>;
  if (error) return <Typography color="red">{error}</Typography>;
  if (!userData || !tournamentData) return <Typography>No dashboard data available</Typography>;

  const TournamentEventCard = ({ tournament, event, loggedInPlayerName }) => {
    // Check if event.sets and event.sets.nodes are defined
    const playerSets = event.sets?.nodes?.filter(set => 
      set.slots.some(slot => slot.entrant?.name === loggedInPlayerName)
    ) || [];

    const getSetStateChip = (state) => {
      if (state === '6') return <Chip value="Called" className="bg-orange-500 text-white" />;
      if (state === '2') return <Chip value="Ongoing" className="bg-blue-500 text-white" />;
      return <Chip value={state} />;
    };

    return (
      <Card className="mb-4 w-full bg-gray-900 text-white">
        <CardBody>
          <div className="flex flex-col items-center mb-4">
            <Typography variant="h5" className="mb-2">{tournament.name}</Typography>
            <Typography variant="small" color="gray" className="mb-2">{event.name}</Typography>
            <Typography variant="small" className="mb-1">
              {new Date(tournament.startAt * 1000).toLocaleDateString()} - {new Date(tournament.endAt * 1000).toLocaleDateString()}
            </Typography>
            <Typography variant="small" className="mb-1">{tournament.city}, {tournament.countryCode}</Typography>
            <Typography variant="small">Entrants: {event.numEntrants}</Typography>
          </div>
          {playerSets.length > 0 && (
            <>
              <Typography variant="h6" className="text-center mb-2">Your Matches</Typography>
              {playerSets.map((set) => (
                <div key={set.id} className="border border-gray-700 rounded p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <Typography variant="h6" className="font-bold">
                      Station: {set.station?.number || 'N/A'}
                    </Typography>
                    {getSetStateChip(set.state)}
                  </div>
                  <div className="flex justify-between">
                    {set.slots.map((slot, index) => (
                      <div 
                        key={slot.id} 
                        className={`p-2 rounded flex-1 ${index === 0 ? 'bg-blue-900 mr-2' : 'bg-red-900'}`}
                      >
                        <Typography>
                          Player {index + 1}: <strong>{slot.entrant?.name || 'TBD'}</strong>
                          {slot.entrant?.name === loggedInPlayerName && ' (You)'}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </CardBody>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="flex flex-col items-center">
            <Avatar 
              src={userData.images?.[1]?.url} 
              alt={userData.player?.gamerTag || 'User'}
              size="xxl"
              className="mb-4"
            />
            <Typography variant="h4" className="mb-4">
              {userData.player?.gamerTag || 'User'}
            </Typography>
          </div>
        </div>
        <div className="md:col-span-3">
          <Typography variant="h4" className="mb-4">Your Tournaments</Typography>
          {Array.isArray(tournamentData) && tournamentData.length > 0 ? (
            tournamentData.flatMap((tournament) => 
              (tournament.events || []).map((event) => (
                <TournamentEventCard 
                  key={`${tournament.id}-${event.id}`} 
                  tournament={tournament} 
                  event={event} 
                  loggedInPlayerName={userData.player?.gamerTag}
                />
              ))
            )
          ) : (
            <Typography>No upcoming tournaments found.</Typography>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;