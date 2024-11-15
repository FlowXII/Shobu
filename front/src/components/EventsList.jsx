import React from 'react';
import { Typography } from "@material-tailwind/react";
import EventCard from './EventCard';

const EventsList = ({ events, tournamentSlug }) => {
  if (!events || events.length === 0) {
    return (
      <Typography className="text-center text-gray-400">
        No events found for this tournament
      </Typography>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {events.map((event) => (
        <EventCard 
          key={event._id} 
          event={event} 
          tournamentSlug={tournamentSlug}
        />
      ))}
    </div>
  );
};

export default EventsList; 