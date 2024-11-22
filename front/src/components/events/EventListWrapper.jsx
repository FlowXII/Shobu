import React from 'react';
import { useParams } from 'react-router-dom';
import EventsList from './EventsList';

const EventListWrapper = () => {
    const { tournamentSlug } = useParams();
    return <EventsList tournamentSlug={tournamentSlug} />;
};

export default EventListWrapper; 