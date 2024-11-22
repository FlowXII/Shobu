import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardBody,
  Typography,
  Button,
  Chip,
} from "@material-tailwind/react";
import { 
  Trophy, 
  MapPin, 
  Calendar,
  Users2,
  ArrowLeft,
  DollarSign,
  Clock,
} from 'lucide-react';
import { toast } from 'react-toastify';
import LoadingIndicator from '../../components/layout/LoadingIndicator';

const ViewTournament = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/tournaments/${id}`, {
          credentials: 'include'
        });

        if (!response.ok) throw new Error('Tournament not found');

        const data = await response.json();
        setTournament(data.data);
        setIsRegistered(data.data.isRegistered || false);
      } catch (error) {
        console.error('Error fetching tournament:', error);
        toast.error('Failed to load tournament details');
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [id]);

  const handleRegister = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/tournaments/${id}/register`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to register');

      setIsRegistered(true);
      toast.success('Successfully registered for tournament!');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to register for tournament');
    }
  };

  if (loading) return <LoadingIndicator />;
  if (!tournament) return <Typography className="text-center">Tournament not found</Typography>;

  const getStatusChip = () => {
    const now = new Date();
    const startTime = new Date(tournament.startAt);
    
    if (now > startTime) {
      return <Chip color="green" value="In Progress" className="w-fit" />;
    }
    return <Chip color="blue" value="Upcoming" className="w-fit" />;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button
        variant="text"
        color="blue-gray"
        className="flex items-center gap-2 mb-4"
        onClick={() => navigate('/tournaments')}
      >
        <ArrowLeft className="h-4 w-4" /> Back to Tournaments
      </Button>

      {/* Main Info Card */}
      <Card className="bg-gray-900 border-2 border-blue-500/50 mb-6">
        <CardBody>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <Typography variant="h3" className="text-blue-400">
                    {tournament.name}
                  </Typography>
                  {getStatusChip()}
                </div>
                <Typography className="text-gray-300">
                  {tournament.description}
                </Typography>
              </div>
              
              <Button
                variant="gradient"
                color={isRegistered ? "green" : "blue"}
                className="flex items-center gap-2"
                onClick={handleRegister}
                disabled={isRegistered}
              >
                <Trophy className="h-4 w-4" />
                {isRegistered ? "Registered" : "Register Now"}
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gray-800/50 border border-gray-700/50">
                <CardBody className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Users2 className="text-blue-400" size={20} />
                    </div>
                    <div>
                      <Typography variant="small" className="text-gray-400">Participants</Typography>
                      <Typography variant="h6">{tournament.numAttendees || 0}</Typography>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-gray-800/50">
                <CardBody className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Trophy className="text-blue-400" size={20} />
                    </div>
                    <div>
                      <Typography variant="small" className="text-gray-400">Format</Typography>
                      <Typography variant="h6">{tournament.type.replace('_', ' ')}</Typography>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-gray-800/50">
                <CardBody className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Clock className="text-blue-400" size={20} />
                    </div>
                    <div>
                      <Typography variant="small" className="text-gray-400">Start Date</Typography>
                      <Typography variant="h6">
                        {new Date(tournament.startAt).toLocaleDateString()}
                      </Typography>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-gray-800/50">
                <CardBody className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <MapPin className="text-blue-400" size={20} />
                    </div>
                    <div>
                      <Typography variant="small" className="text-gray-400">Location</Typography>
                      <Typography variant="h6">{tournament.location.city || 'Online'}</Typography>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Location Details */}
      {tournament.location && (
        <Card className="bg-gray-900 border border-gray-800 mb-6">
          <CardBody>
            <Typography variant="h5" color="blue" className="mb-4">
              Venue Information
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tournament.location.venueAddress && (
                <Typography className="text-gray-300">
                  <span className="font-bold text-white">Address:</span> {tournament.location.venueAddress}
                </Typography>
              )}
              {tournament.location.city && (
                <Typography className="text-gray-300">
                  <span className="font-bold text-white">City:</span> {tournament.location.city}
                </Typography>
              )}
              {tournament.location.state && (
                <Typography className="text-gray-300">
                  <span className="font-bold text-white">State:</span> {tournament.location.state}
                </Typography>
              )}
              {tournament.location.country && (
                <Typography className="text-gray-300">
                  <span className="font-bold text-white">Country:</span> {tournament.location.country}
                </Typography>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Tournament Images */}
      {tournament.images && tournament.images.length > 0 && (
        <Card className="bg-gray-900 border border-gray-800">
          <CardBody>
            <Typography variant="h5" color="blue" className="mb-4">
              Tournament Images
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tournament.images.map((image, index) => (
                <div key={index} className="relative group overflow-hidden rounded-lg">
                  <img
                    src={image.url}
                    alt={`Tournament ${index + 1}`}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default ViewTournament;