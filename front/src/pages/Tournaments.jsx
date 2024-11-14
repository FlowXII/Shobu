import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
  Chip,
} from "@material-tailwind/react";
import { Trophy, MapPin, Users, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import LoadingIndicator from '../components/LoadingIndicator';

const TournamentCard = ({ tournament }) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card className="w-full max-w-[48rem] bg-gradient-to-br from-gray-800 to-gray-950 text-white shadow-xl border border-white border-opacity-20 rounded-lg overflow-hidden mb-6">
      <CardHeader floated={false} className="relative h-56 m-0">
        {tournament.images && tournament.images.length > 0 ? (
          <img
            src={tournament.images[0].url}
            alt={tournament.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <Typography>No image available</Typography>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
          <div className="p-4">
            <Typography variant="h4" color="white" className="font-bold text-lg md:text-2xl">
              {tournament.name || 'Unnamed Tournament'}
            </Typography>
            <Typography color="white" className="mt-1 font-normal opacity-75 text-sm md:text-base">
              {formatDate(tournament.startAt)}
            </Typography>
          </div>
        </div>
      </CardHeader>
      
      <CardBody className="p-4">
        <div className="flex flex-wrap items-center justify-start mb-4 gap-2">
          <Chip
            icon={<MapPin className="h-4 w-4" />}
            value={tournament.location.city || "Online"}
            className="bg-blue-500 text-white"
          />
          <Chip
            icon={<Users className="h-4 w-4" />}
            value={`${tournament.numAttendees || 0} Attendees`}
            className="bg-yellow-600 text-white"
          />
          <Chip
            icon={<Calendar className="h-4 w-4" />}
            value={formatDate(tournament.startAt).split(',')[0]}
            className="bg-green-500 text-white"
          />
        </div>

        <div className="mt-4">
          <Typography className="text-gray-300 mb-4">
            {tournament.description || 'No description provided'}
          </Typography>
          
          {tournament.location.venueAddress && (
            <Typography className="text-gray-400 text-sm mb-4">
              <span className="font-bold">Venue:</span> {tournament.location.venueAddress}
            </Typography>
          )}
        </div>
        
        <Button
          size="lg"
          color="red"
          className="mt-4 w-full text-sm md:text-base"
          onClick={() => navigate(`/tournaments/${tournament.slug}`)}
        >
          View Tournament
        </Button>
      </CardBody>
    </Card>
  );
};

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        setTournaments(data.data);
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
    <div className="flex flex-col items-center justify-start p-4 overflow-x-hidden">
      {/* Header Card */}
      <Card className="w-full max-w-[48rem] bg-gradient-to-br from-gray-800 to-gray-950 text-white shadow-xl border border-white border-opacity-20 rounded-lg overflow-hidden mb-6">
        <CardBody>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-red-400" />
              <Typography variant="h4" className="text-red-500 font-bold">
                Tournaments
              </Typography>
            </div>
            <Button
              className="bg-red-500 hover:bg-red-600 transition-colors"
              onClick={() => navigate('/tournaments/create')}
            >
              Create Tournament
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Tournaments List */}
      <div className="w-full max-w-[48rem]">
        {tournaments.length > 0 ? (
          tournaments.map((tournament) => (
            <TournamentCard key={tournament._id} tournament={tournament} />
          ))
        ) : (
          <Typography className="text-center text-gray-300">
            No tournaments found
          </Typography>
        )}
      </div>
    </div>
  );
};

export default Tournaments;
