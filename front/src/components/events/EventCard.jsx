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
import { formatDate, getEventStateLabel } from '../utils/eventUtils';

const EventCard = ({ event, tournamentSlug }) => {
  const navigate = useNavigate();
  
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
              onClick={() => navigate(`/tournaments/${tournamentSlug}/events/${event._id}`)}
            >
              View Brackets
            </Button>
            <Button
              color="green"
              size="sm"
              onClick={() => navigate(`/tournaments/${tournamentSlug}/events/${event._id}/register`)}
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