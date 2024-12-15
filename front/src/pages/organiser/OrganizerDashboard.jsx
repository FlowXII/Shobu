import React, { useEffect, useState } from 'react';
import { useNavigate, useLoaderData } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserHero from '../../components/organiser/OrganiserDashboard/UserHero';
import DashboardStats from '../../components/organiser/OrganiserDashboard/DashboardStats';
import TournamentGrid from '../../components/organiser/OrganiserDashboard/TournamentGrid';
import TicketManager from '../../components/organiser/OrganiserDashboard/TicketManager';
import { fetchTournamentEvents } from '../../loaders/eventLoader';

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const { tournaments = [], events = [] } = useLoaderData();
  const [detailedEvents, setDetailedEvents] = useState([]);

  console.log(tournaments);
  console.log(events);

  useEffect(() => {
    const loadEventDetails = async () => {
      if (!tournaments || tournaments.length === 0) {
        console.warn('No tournaments to load events for');
        return;
      }

      try {
        const eventPromises = tournaments.map(tournament => 
          fetchTournamentEvents(tournament._id)
        );
        
        const eventsArrays = await Promise.all(eventPromises);
        const allEvents = eventsArrays.flat();
        
        setDetailedEvents(allEvents);
        console.log('Loaded tournament events:', allEvents);
      } catch (error) {
        console.error('Failed to load tournament events:', error);
      }
    };

    loadEventDetails();
  }, [tournaments]);

  console.log('OrganizerDashboard - Loaded events:', detailedEvents);

  const handleTournamentClick = (tournamentId) => {
    console.log('Clicking tournament with ID:', tournamentId);
    if (tournamentId) {
      navigate(`/tournaments/${tournamentId}/to`);
    }
  };

  return (
    <div className="flex flex-col gap-8 p-8">
      <UserHero 
        user={user}
        tournamentCount={tournaments.length}
        onCreateTournament={() => navigate('/tournaments/create')}
      />
      
      <DashboardStats tournaments={tournaments} />
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <TournamentGrid 
          tournaments={tournaments}
          events={detailedEvents}
          onTournamentClick={handleTournamentClick}
        />
        
        <TicketManager tournaments={tournaments} />
      </div>
    </div>
  );
};

export default OrganizerDashboard;