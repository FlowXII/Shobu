import React from 'react';
import { Typography, Card, CardBody } from "@material-tailwind/react";
import { Users } from 'lucide-react';

const TournamentParticipants = ({ tournament }) => {
  return (
    <Card className="bg-gray-800/50 border border-white/10">
      <CardBody>
        <div className="flex items-center gap-3 mb-4">
          <Users className="text-gray-400" size={20} />
          <Typography variant="h6">
            Participants ({tournament.participants?.length || 0})
          </Typography>
        </div>
        
        {tournament.participants?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tournament.participants.map((participant) => (
              <Card key={participant._id} className="bg-gray-700/50">
                <CardBody>
                  <Typography>{participant.name}</Typography>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <Typography className="text-gray-400">
            No participants yet
          </Typography>
        )}
      </CardBody>
    </Card>
  );
};

export default TournamentParticipants; 