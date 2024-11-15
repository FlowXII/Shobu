import React from 'react';
import {
  Card,
  CardBody,
  Typography,
  Button,
  Chip,
} from "@material-tailwind/react";
import { Users, Calendar, Gamepad2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event, tournamentSlug }) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getEventStateLabel = (state) => {
    const states = {
      1: 'Created',
      2: 'Active',
      3: 'Completed',
      4: 'Ready',
      5: 'Canceled',
      6: 'Called',
      7: 'Completed'
    };
    return states[state] || 'Unknown';
  };

  return (
    <Card className="bg-gray-900 text-white shadow-lg border border-gray-800">
      <CardBody>
        <div className="flex flex-col space-y-4">
          <Typography variant="h5" className="font-bold">
            {event.name}
          </Typography>

          <div className="flex flex-wrap gap-2">
            <Chip
              icon={<Calendar className="h-4 w-4" />}
              value={formatDate(event.startAt)}
              className="bg-blue-500"
            />
            <Chip
              icon={<Users className="h-4 w-4" />}
              value={`${event.numEntrants || 0} Entrants`}
              className="bg-green-500"
            />
            <Chip
              icon={<Gamepad2 className="h-4 w-4" />}
              value={getEventStateLabel(event.state)}
              className="bg-yellow-600"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              color="blue"
              size="sm"
              onClick={() => navigate(`/tournaments/${tournamentSlug}/events/${event.slug}`)}
            >
              View Brackets
            </Button>
            <Button
              color="green"
              size="sm"
              onClick={() => navigate(`/tournaments/${tournamentSlug}/events/${event.slug}/register`)}
            >
              Register
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default EventCard; 