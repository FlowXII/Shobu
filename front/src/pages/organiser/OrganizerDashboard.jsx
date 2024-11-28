import React from 'react';
import { useNavigate, useLoaderData } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserHero from '../../components/organiser/OrganiserDashboard/UserHero';
import DashboardStats from '../../components/organiser/OrganiserDashboard/DashboardStats';
import TournamentGrid from '../../components/organiser/OrganiserDashboard/TournamentGrid';

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const { tournaments } = useLoaderData();

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
      
      <TournamentGrid 
        tournaments={tournaments}
        onTournamentClick={handleTournamentClick}
      />
    </div>
  );
};

export default OrganizerDashboard;