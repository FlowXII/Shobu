import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Typography,
  Input,
  Button,
  Spinner
} from "@material-tailwind/react";

const REFRESH_INTERVAL = 5000;

const StationCard = ({ number, isUsed }) => (
  <Card className={`w-12 h-12 flex items-center justify-center ${isUsed ? 'bg-gray-700 border-2 border-dashed border-gray-500' : 'bg-gray-800'}`}>
    <Typography variant="h6" color={isUsed ? "gray" : "white"} className="text-center">
      {number}
    </Typography>
  </Card>
);

function StationViewer() {
  const [eventId, setEventId] = useState('');
  const [submittedEventId, setSubmittedEventId] = useState(null);
  const [tournamentData, setTournamentData] = useState(null);

  useEffect(() => {
    if (submittedEventId) {
      const interval = setInterval(() => {
        fetchTournaments();
      }, REFRESH_INTERVAL);

      return () => clearInterval(interval);
    }
  }, [submittedEventId]);

  const url = `${import.meta.env.VITE_API_BASE_URL}/stations/${submittedEventId}`;

  const fetchTournaments = async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (!data.data || !data.data.event || !data.data.event.sets || !data.data.event.sets.nodes) {
        throw new Error('Unexpected data structure from API');
      }
      setTournamentData(data.data);
    } catch (error) {
      console.error('Error fetching tournaments:', error.message);
      setTournamentData(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedEventId(eventId);
    setEventId('');
  };

  const getStations = () => {
    if (!tournamentData || !tournamentData.event || !tournamentData.event.sets || !tournamentData.event.sets.nodes) {
      return Array.from({ length: 20 }, (_, i) => ({ number: i + 1, isUsed: false }));
    }
    const usedStations = tournamentData.event.sets.nodes.map(set => set.station?.number).filter(Boolean);
    return Array.from({ length: 20 }, (_, i) => ({
      number: i + 1,
      isUsed: usedStations.includes(i + 1)
    }));
  };

  const getAvailableStations = () => {
    return getStations().filter(station => !station.isUsed).map(station => station.number);
  };

  return (
    <div className="flex flex-col items-center justify-start p-4 overflow-x-hidden">
      <Card className="w-full bg-gray-900 p-6 rounded-lg shadow-lg mb-6">
        <CardBody>
          {!submittedEventId ? (
            <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
              <Input
                type="text"
                label="Enter Event ID"
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                className="text-white"
                labelProps={{
                  className: "text-red-500 peer-focus:text-white peer-focus:border-red-500"
                }}
                containerProps={{
                  className: "min-w-[200px]"
                }}
              />
              <Button type="submit" className="bg-red-500 hover:bg-red-600 text-white">
                Submit
              </Button>
              <Typography variant="small" className="text-gray-400 text-center mt-2">
                Warning: This feature is meant for TOs and testing purposes only.<br />
                The event ID can be found in the URL of the admin event page on start.gg<br />
                (e.g., https://www.start.gg/admin/tournament/.../1140299/...)<br />
                In this case, the event ID would be 1140299.
              </Typography>
            </form>
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <Typography variant="h4" color="white" className="text-center">
                  Current Matches
                </Typography>
                <Card className="bg-gray-800 p-2">
                  <Typography variant="h6" color="white" className="text-center mb-2">
                    Available Stations
                  </Typography>
                  <div className="flex flex-wrap gap-1">
                    {getAvailableStations().map(station => (
                      <span key={station} className="bg-gray-700 text-white px-2 py-1 rounded-md text-sm">
                        {station}
                      </span>
                    ))}
                  </div>
                </Card>
              </div>
              {tournamentData === null ? (
                <div className="flex justify-center">
                  <Spinner className="h-12 w-12" color="red" />
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                  {tournamentData.event.sets.nodes.map(({ id, state, station, slots }) => (
                    <Card key={id} className={`bg-gray-800 ${state === 6 ? 'border-2 border-orange-500' : ''}`}>
                      <CardBody className="p-2">
                        <Typography variant="h6" color="white" className="text-center">
                          Station {station?.number || "N/A"}
                        </Typography>
                        <Typography variant="small" color={state === 6 ? "orange" : "green"} className="text-center">
                          {state === 6 ? 'Called' : 'Ongoing'}
                        </Typography>
                        <div className="space-y-1 mt-1">
                          <Card className="bg-blue-900">
                            <CardBody className="p-1">
                              <Typography variant="small" color="white" className="text-center truncate">
                                {slots[0]?.entrant?.name || 'TBD'}
                              </Typography>
                            </CardBody>
                          </Card>
                          <Card className="bg-red-900">
                            <CardBody className="p-1">
                              <Typography variant="small" color="white" className="text-center truncate">
                                {slots[1]?.entrant?.name || 'TBD'}
                              </Typography>
                            </CardBody>
                          </Card>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default StationViewer;