import React from 'react';
import { Card, CardBody, Typography, Chip } from "@material-tailwind/react";
import { Calendar, MapPin, Users } from 'lucide-react';

const TournamentCard = ({ tournament, onClick }) => {
  const startDate = new Date(tournament.startAt * 1000).toLocaleDateString();
  
  return (
    <Card 
      className="bg-gradient-to-br from-gray-800 to-gray-900 cursor-pointer hover:from-gray-700 hover:to-gray-800 transition-all duration-300 border border-gray-700 hover:border-gray-600"
      onClick={onClick}
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