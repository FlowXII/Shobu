import React from 'react';
import { Card, CardBody, Typography } from '@material-tailwind/react';
import TournamentCardComponent from '../components/TournamentCardComponent';
import TournamentFilterForm from '../components/TournamentFilterForm';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';
import useTournamentData from '../hooks/useTournamentData';
import GameOptionsComponent from '../components/GameOptionsComponent';

function UpcomingTournaments() {
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
      <Card className="w-full max-w-4xl bg-gray-900 p-6 rounded-lg shadow-lg mb-6">
        <CardBody>
          <Typography variant="h4" className="mb-6 text-center text-red-700 font-bold">Upcoming Tournaments</Typography>
          <TournamentFilterForm
            cCode={cCode}
            setCCode={setCCode}
            perPage={perPage}
            setPerPage={setPerPage}
            videogameId={videogameId}
            setVideogameId={setVideogameId}
            videogameOptions={videogameOptions}
            handleFormSubmit={handleFormSubmit}
            loading={loading}
          />
        </CardBody>
      </Card>

      {error && <ErrorMessage error={error} />}
      {loading && <LoadingIndicator />}
      {data && (
        <div className="w-full max-w-4xl">
          {data.tournaments && data.tournaments.nodes ? (
            data.tournaments.nodes.map((tournament) => (
              <TournamentCardComponent key={tournament.id} tournament={tournament} boxArt={boxArt} />
            ))
          ) : (
            <Typography className="text-red-700">No tournaments found or unexpected data structure.</Typography>
          )}
        </div>
      )}
    </div>
  );
}

export default UpcomingTournaments;