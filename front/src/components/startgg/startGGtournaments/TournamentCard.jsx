import React from 'react';
import { Card, CardBody, Typography, Chip } from "@material-tailwind/react";
import { Calendar, MapPin, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TournamentCard = ({ tournament }) => {
  const navigate = useNavigate();
  const startDate = new Date(tournament.startAt * 1000).toLocaleDateString();
  
  return (
    <Card 
      className="mb-4 cursor-pointer bg-gray-900 text-white hover:bg-gray-800 transition-colors"
      onClick={() => navigate(`/tournaments/${tournament._id}`)}
    >
      <CardBody className="p-4">
        {tournament.images?.[0] && (
          <div className="w-full h-32 mb-4 rounded-lg overflow-hidden">
            <img 
              src={tournament.images[0].url} 
              alt={tournament.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <Typography variant="h6" className="text-white mb-2 line-clamp-2">
          {tournament.name}
        </Typography>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="h-4 w-4" />
            <Typography variant="small">
              {startDate}
            </Typography>
          </div>
          
          {tournament.venue && (
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin className="h-4 w-4" />
              <Typography variant="small" className="truncate">
                {tournament.venue}
              </Typography>
            </div>
          )}

          <div className="flex items-center gap-2 text-gray-400">
            <Users className="h-4 w-4" />
            <Typography variant="small">
              {tournament.participants || 0} Participants
            </Typography>
          </div>
        </div>

        <div className="mt-4">
          <Chip
            value={`ID: ${tournament.id}`}
            className="bg-gray-700 text-white"
            size="sm"
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default TournamentCard; 