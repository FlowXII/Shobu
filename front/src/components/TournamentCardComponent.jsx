import React from 'react';
import { Card, Typography } from '@material-tailwind/react';

const TournamentCardComponent = ({ tournament, boxArt }) => {
  return (
    <Card key={tournament.id} className="bg-gray-900 p-4 rounded-lg mb-4 flex flex-col">
      <div className="flex">
        {tournament.images && tournament.images.length > 0 && (
          <img src={tournament.images[0].url} alt={tournament.name} className="w-52 h-52 object-contain rounded-lg mr-4" />
        )}
        <div className="flex flex-col justify-between">
          <Typography variant="h5" className="cursor-pointer mb-2 text-red-700 font-semibold text-lg" onClick={() => window.open(`http://start.gg/${tournament.slug}`, '_blank')}>
            {tournament.name}
          </Typography>
          <Typography className="text-white text-lg"><strong>Start Date:</strong> {new Date(tournament.startAt * 1000).toLocaleDateString()}</Typography>
          <Typography className="text-white text-lg"><strong>City:</strong> {tournament.city}</Typography>
          <Typography className="text-white text-lg"><strong>Number of Attendees:</strong> {tournament.numAttendees}</Typography>
        </div>
      </div>
      {tournament.events && tournament.events.length > 0 && (
        <div className="mt-4">
          <Typography variant="h6" className="text-red-700 font-semibold text-lg">Events:</Typography>
          {tournament.events.map((event, index) => (
            <Card key={index} className="bg-gray-800 p-4 rounded-lg mt-2">
              <div className="flex">
                {boxArt && (
                  <img src={boxArt} alt={event.name} className="w-32 h-32 object-contain rounded-lg mr-4" />
                )}
                <div className="flex flex-col justify-between">
                  <Typography className="text-white text-lg"><strong>Event Name:</strong> {event.name}</Typography>
                  <Typography className="text-white text-lg"><strong>Number of Entrants:</strong> {event.numEntrants}</Typography>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
};

export default TournamentCardComponent;
