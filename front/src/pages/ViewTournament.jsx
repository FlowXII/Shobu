import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardBody,
  Typography,
  Chip,
  Button,
} from "@material-tailwind/react";
import { 
  Trophy, 
  MapPin, 
  Calendar, 
  Users, 
  Image as ImageIcon,
  ArrowLeft,
  Clock,
  Users2
} from 'lucide-react';
import { toast } from 'react-toastify';
import LoadingIndicator from '../components/LoadingIndicator';

const ViewTournament = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/tournaments/${slug}`, {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Tournament not found');
        }

        const data = await response.json();
        setTournament(data.data);
      } catch (error) {
        console.error('Error fetching tournament:', error);
        toast.error('Failed to load tournament details');
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [slug]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!tournament) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Typography variant="h4" className="text-red-500">
          Tournament not found
        </Typography>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getTournamentTypeColor = (type) => {
    const types = {
      'SINGLE_ELIMINATION': 'blue',
      'DOUBLE_ELIMINATION': 'green',
      'ROUND_ROBIN': 'amber'
    };
    return types[type] || 'gray';
  };

  return (
    <div className="flex flex-col items-center justify-start p-4 overflow-x-hidden">
      {/* Fixed Return Button */}
      <div className="w-full max-w-[48rem] mb-4 relative z-10">
        <Button
          variant="filled"
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white shadow-lg border border-white/20 px-4 py-2 normal-case text-base font-normal"
          onClick={() => navigate('/tournaments')}
        >
          <ArrowLeft className="h-4 w-4" /> 
          Back to Tournaments
        </Button>
      </div>

      {/* Header Card - Updated with additional info */}
      <Card className="w-full max-w-[48rem] bg-gradient-to-br from-gray-800 to-gray-950 text-white shadow-xl border border-white border-opacity-20 rounded-lg overflow-hidden mb-6">
        <CardBody className="p-6">
          <Typography variant="h4" className="mb-4 text-center text-red-500 font-bold">
            {tournament.name}
          </Typography>
          
          {/* Status Chips - Centered and improved */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <Chip
              size="lg"
              variant="gradient"
              value={tournament.type.replace('_', ' ')}
              color={getTournamentTypeColor(tournament.type)}
              className="font-medium shadow-md"
              icon={<Trophy className="h-4 w-4" />}
            />
            {tournament.location.city && (
              <Chip
                size="lg"
                variant="gradient"
                value={`${tournament.location.city}, ${tournament.location.country}`}
                color="teal"
                className="font-medium shadow-md"
                icon={<MapPin className="h-4 w-4" />}
              />
            )}
            <Chip
              size="lg"
              variant="gradient"
              value={formatDate(tournament.startAt).split(',')[0]}
              color="purple"
              className="font-medium shadow-md"
              icon={<Calendar className="h-4 w-4" />}
            />
            {tournament.numAttendees > 0 && (
              <Chip
                size="lg"
                variant="gradient"
                value={`${tournament.numAttendees} Attendees`}
                color="amber"
                className="font-medium shadow-md"
                icon={<Users2 className="h-4 w-4" />}
              />
            )}
          </div>

          {/* Description - Added if available */}
          {tournament.description && (
            <Typography className="text-gray-300 text-center mt-4 px-4">
              {tournament.description}
            </Typography>
          )}
        </CardBody>
      </Card>

      {/* Details Card - Updated styling */}
      <Card className="w-full max-w-[48rem] bg-gradient-to-br from-gray-800 to-gray-950 text-white shadow-xl border border-white border-opacity-20 rounded-lg overflow-hidden">
        <CardBody className="p-6">
          {/* Schedule Section - Updated layout */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-6 w-6 text-blue-400" />
              <Typography variant="h5" className="font-bold">Schedule Details</Typography>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/20 p-4 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                <Typography className="text-gray-300 mb-2 font-bold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-400" />
                  Start Date
                </Typography>
                <Typography className="text-white">
                  {formatDate(tournament.startAt)}
                </Typography>
              </div>
              
              {tournament.endAt && (
                <div className="bg-black/20 p-4 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                  <Typography className="text-gray-300 mb-2 font-bold flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-red-400" />
                    End Date
                  </Typography>
                  <Typography className="text-white">
                    {formatDate(tournament.endAt)}
                  </Typography>
                </div>
              )}
            </div>
          </div>

          {/* Location Section - Updated styling */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-6 w-6 text-green-400" />
              <Typography variant="h5" className="font-bold">Location Details</Typography>
            </div>
            
            <div className="bg-black/20 p-6 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                {tournament.location.venueAddress && (
                  <Typography className="text-gray-300 md:col-span-2">
                    <span className="font-bold text-white">Venue:</span> {tournament.location.venueAddress}
                  </Typography>
                )}
              </div>
            </div>
          </div>

          {/* Images Section - Updated styling */}
          {tournament.images && tournament.images.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="h-6 w-6 text-purple-400" />
                <Typography variant="h5" className="font-bold">Tournament Images</Typography>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tournament.images.map((image, index) => (
                  <div key={index} className="relative group overflow-hidden rounded-lg border border-white/5 hover:border-white/10 transition-all">
                    <img
                      src={image.url}
                      alt={`Tournament ${image.type}`}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default ViewTournament;
