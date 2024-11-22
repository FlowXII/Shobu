import React from 'react';
import { Card, CardBody, Typography, Button } from '@material-tailwind/react';
import { Trophy, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TournamentCard from '../../../components/startgg/startGGtournaments/TournamentCard';
import TournamentFilterForm from '../../../components/startgg/startGGtournaments/TournamentFilterForm';
import LoadingIndicator from '../../../components/layout/LoadingIndicator';
import ErrorMessage from '../../../components/common/ErrorMessage';
import useTournamentData from '../../../hooks/useTournamentData';
import GameOptionsComponent from '../../../components/common/GameOptionsComponent';

function UpcomingTournaments() {
  const navigate = useNavigate();
  const videogameOptions = GameOptionsComponent();

  const {
    cCode, setCCode,
    perPage, setPerPage,
    videogameId, setVideogameId,
    loading, error, data, boxArt,
    handleFormSubmit
  } = useTournamentData(videogameOptions);

  return (
    <div className="flex flex-col items-center justify-start p-4 overflow-x-hidden">
      {/* Archades Tournaments Section */}
      <Card className="w-full max-w-[48rem] bg-gradient-to-br from-gray-800 to-gray-950 text-white shadow-xl border border-white border-opacity-20 rounded-lg overflow-hidden mb-6">
        <CardBody>
          <div className="flex items-center gap-3 mb-6 justify-center">
            <Trophy className="h-6 w-6 text-red-500" />
            <Typography variant="h4" className="text-center text-red-500 font-bold">
              Tournaments on Shobu
            </Typography>
          </div>
          
          <div className="text-center mb-6">
            <Typography className="text-gray-300 mb-4">
              View all tournaments created on Shobu !
            </Typography>
            <Button
              size="lg"
              className="bg-red-500 hover:bg-red-600 transition-colors shadow-lg"
              onClick={() => navigate('/tournaments')}
            >
              Browse Tournaments
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Stylish OR Divider */}
      <div className="w-full max-w-[48rem] flex items-center gap-4 mb-6">
        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="relative">
          <div className="absolute inset-0 blur-sm bg-white/20 rounded-full"></div>
          <Typography className="px-4 py-2 text-white font-bold relative z-10">
            OR
          </Typography>
        </div>
        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>

      {/* Start.gg Search Section */}
      <Card className="w-full max-w-[48rem] bg-gradient-to-br from-gray-800 to-gray-950 text-white shadow-xl border border-white border-opacity-20 rounded-lg overflow-hidden mb-6">
        <CardBody>
          <div className="flex items-center gap-3 mb-6 justify-center">
            <Search className="h-6 w-6 text-red-500" />
            <Typography variant="h4" className="text-center text-red-500 font-bold">
              Search Start.gg Tournaments
            </Typography>
          </div>
          
          <TournamentFilterForm
            cCode={cCode}
            setCCode={setCCode}
            perPage={perPage}
            setPerPage={setPerPage}
            videogameId={videogameId}
            setVideogameId={setVideogameId}
            handleFormSubmit={handleFormSubmit}
            loading={loading}
            videogameOptions={videogameOptions}
          />
        </CardBody>
      </Card>

      {error && <ErrorMessage error={error} />}
      {loading && <LoadingIndicator />}
      {data && (
        <div className="w-full max-w-[48rem]">
          {data.tournaments && data.tournaments.nodes ? (
            data.tournaments.nodes.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} boxArt={boxArt} />
            ))
          ) : (
            <Typography className="text-red-500">No tournaments found or unexpected data structure.</Typography>
          )}
        </div>
      )}
    </div>
  );
}

export default UpcomingTournaments;
