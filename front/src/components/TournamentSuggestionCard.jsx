import React, { useState } from 'react';
import { Card, CardBody, Typography, Chip, List, ListItem } from "@material-tailwind/react";
import { Users, Calendar, Trophy, Clock, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";

const TournamentSuggestionCard = ({ tournament, onClick }) => {
  const [expanded, setExpanded] = useState(false);
  const startDate = new Date(tournament.startAt * 1000).toLocaleDateString();
  
  // Get Smash Ultimate events only (videogameId: 1386)
  const smashEvents = tournament.events.filter(event => 
    event.videogame?.id === 1386 && event.userParticipating
  );

  const hasActiveEvents = smashEvents.some(event => 
    event.state === "ACTIVE" || event.state === "CREATED"
  );

  return (
    <Card 
      className={`
        relative overflow-hidden transition-all duration-300
        ${hasActiveEvents 
          ? 'bg-gradient-to-br from-red-900/50 to-gray-900 hover:from-red-800/50 hover:to-gray-800 border-red-500/30' 
          : 'bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border-gray-700'
        }
        border shadow-lg hover:shadow-xl
      `}
    >
      <CardBody className="p-4">
        {tournament.images?.[0] && (
          <div className="w-full h-24 mb-3 rounded-lg overflow-hidden">
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

        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="h-4 w-4" />
            <Typography variant="small">{startDate}</Typography>
          </div>

          <div className="flex items-center gap-2 text-gray-400">
            <Users className="h-4 w-4" />
            <Typography variant="small">
              {tournament.numAttendees} Attendees
            </Typography>
          </div>
        </div>

        {/* Events Section */}
        <div 
          className="cursor-pointer flex items-center gap-2 mb-2"
          onClick={() => setExpanded(!expanded)}
        >
          <Typography variant="small" className="text-white font-semibold">
            Your Events
          </Typography>
          {expanded ? 
            <ChevronUp className="h-4 w-4 text-gray-400" /> : 
            <ChevronDown className="h-4 w-4 text-gray-400" />
          }
        </div>

        {expanded && (
          <List className="p-0">
            {smashEvents.map((event) => (
              <ListItem
                key={event.id}
                onClick={() => onClick(event.id)}
                className="p-2 hover:bg-white/10 rounded-lg cursor-pointer"
              >
                <div className="flex flex-col gap-1">
                  <Typography variant="small" className="text-white">
                    {event.name}
                  </Typography>
                  <div className="flex items-center gap-2">
                    <Chip
                      size="sm"
                      value={`ID: ${event.id}`}
                      className="bg-gray-700/50 text-white"
                    />
                    <Chip
                      size="sm"
                      value={event.state}
                      className={`${
                        event.state === "COMPLETED" 
                          ? "bg-green-500/20 text-green-300" 
                          : event.state === "ACTIVE"
                          ? "bg-red-500/20 text-red-300"
                          : "bg-gray-500/20 text-gray-300"
                      }`}
                    />
                  </div>
                </div>
              </ListItem>
            ))}
          </List>
        )}
      </CardBody>
    </Card>
  );
};

export default TournamentSuggestionCard; 