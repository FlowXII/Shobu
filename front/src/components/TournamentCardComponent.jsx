import React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
  Chip,
} from "@material-tailwind/react";
import { MapPin, Users } from "lucide-react";

const TournamentCardComponent = ({ tournament, boxArt }) => {
  return (
    <Card className="w-full max-w-[48rem] bg-gradient-to-br from-gray-800 to-gray-950 text-white shadow-xl border border-white border-opacity-20 rounded-lg overflow-hidden">
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
              {tournament.name}
            </Typography>
            <Typography color="white" className="mt-1 font-normal opacity-75 text-sm md:text-base">
              {new Date(tournament.startAt * 1000).toLocaleDateString()}
            </Typography>
          </div>
        </div>
      </CardHeader>
      <CardBody className="p-4">
        <div className="flex flex-wrap items-center justify-start mb-4 gap-2">
          <Chip
            icon={<MapPin className="h-4 w-4" />}
            value={tournament.city || "Online"}
            className="bg-blue-500 text-white"
          />
          <Chip
            icon={<Users className="h-4 w-4" />}
            value={`${tournament.numAttendees || 0} Attendees`}
            className="bg-yellow-600 text-white"
          />
        </div>
        
        {tournament.events && tournament.events.length > 0 && (
          <div className="mt-4">
            <Typography variant="h6" color="blue-gray" className="mb-2 text-base md:text-lg">
              Events
            </Typography>
            {tournament.events.map((event, index) => (
              <Card key={index} className="mb-4 bg-gray-800 overflow-hidden">
                <CardBody className="p-0">
                  <div className="flex items-center">
                    {boxArt && (
                      <img src={boxArt} alt={event.name} className="w-20 h-20 md:w-24 md:h-24 object-cover" />
                    )}
                    <div className="flex-grow p-3 md:p-4">
                      <Typography variant="h6" color="white" className="text-sm md:text-base">
                        {event.name}
                      </Typography>
                      <Typography color="blue-gray" className="text-xs md:text-sm opacity-75">
                        {event.numEntrants} participants
                      </Typography>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
        
        <Button
          size="lg"
          color="red"
          className="mt-4 w-full text-sm md:text-base"
          onClick={() => window.open(`http://start.gg/${tournament.slug}`, '_blank')}
        >
          View Tournament
        </Button>
      </CardBody>
    </Card>
  );
};

export default TournamentCardComponent;
