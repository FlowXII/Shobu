import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import {
  Card,
  CardBody,
  Typography,
  Input,
  Button,
  Spinner,
  Dialog,
  Alert
} from "@material-tailwind/react";
import SetCardComponent from '../components/SetCardComponent';
import Login from './Login';

const REFRESH_INTERVAL = 5000;

const StationCard = ({ number, isUsed }) => (
  <Card className={`w-16 h-16 flex items-center justify-center ${isUsed ? 'bg-gray-700 border-2 border-dashed border-gray-500' : 'bg-gray-800'} shadow-lg transition-transform transform hover:scale-105`}>
    <Typography variant="h6" color={isUsed ? "gray" : "white"} className="text-center">
      {number}
    </Typography>
  </Card>
);

function StationViewer() {
  const { user, loading } = useSelector((state) => state.user);
  const [eventId, setEventId] = useState('');
  const [submittedEventId, setSubmittedEventId] = useState(null);
  const [tournamentData, setTournamentData] = useState(null);
  const [showOnlyCalled, setShowOnlyCalled] = useState(false);
  const [selectedSet, setSelectedSet] = useState(null);
  const [selectedScores, setSelectedScores] = useState({ player1: null, player2: null });
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success' // or 'error'
  });

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

  const allSets = tournamentData?.event?.sets?.nodes || [];
  const relevantSets = allSets.filter(set => [1, 2, 4, 6, 7].includes(set.state))
    .map(set => ({
      ...set,
      fullRoundText: set.fullRoundText || 'Unknown Round'
    }));

  const filteredSets = showOnlyCalled
    ? relevantSets.filter(set => [2, 6].includes(set.state)) // Ongoing (2) and Called (6)
    : relevantSets;

  const toggleFilter = () => {
    setShowOnlyCalled(!showOnlyCalled);
  };

  const handleSetClick = (set) => {
    setSelectedSet(set);
  };

  const handleCloseModal = () => {
    setSelectedSet(null);
  };

  const handleScoreSelect = (playerNum, score) => {
    setSelectedScores(prev => ({
      ...prev,
      [`player${playerNum}`]: score
    }));
  };

  const handleReportSet = async () => {
    if (selectedScores.player1 !== null && selectedScores.player2 !== null) {
      try {
        const player1 = selectedSet.slots[0];
        const player2 = selectedSet.slots[1];
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/report-set`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify({
            setId: selectedSet.id,
            player1Id: player1.entrant?.id,
            player2Id: player2.entrant?.id,
            player1Score: selectedScores.player1,
            player2Score: selectedScores.player2
          }),
          credentials: 'include'
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to report set');
        }

        const data = await response.json();

        if (data.success) {
          setNotification({
            show: true,
            message: 'Scores submitted successfully!',
            type: 'success'
          });

          setSelectedScores({ player1: null, player2: null });
          handleCloseModal();
          fetchTournaments();

          setTimeout(() => {
            setNotification(prev => ({ ...prev, show: false }));
          }, 3000);
        } else {
          throw new Error(data.message || 'Failed to report set');
        }
      } catch (error) {
        console.error('Error submitting scores:', error);
        setNotification({
          show: true,
          message: `Error submitting scores: ${error.message}`,
          type: 'error'
        });
      }
    }
  };

  const handleResetSet = async (setId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/reset-set`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ setId, resetDependentSets: false }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to reset set');
      }

      const data = await response.json();
      if (data.success) {
        setNotification({
          show: true,
          message: 'Set reset successfully!',
          type: 'success'
        });
        handleCloseModal();
        fetchTournaments();
      } else {
        throw new Error(data.error || 'Failed to reset set');
      }
    } catch (error) {
      setNotification({
        show: true,
        message: `Error resetting set: ${error.message}`,
        type: 'error'
      });
    }
  };

  const handleMarkSetCalled = async (setId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/mark-set-called`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ setId }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to mark set as called');
      }

      const data = await response.json();
      if (data.success) {
        setNotification({
          show: true,
          message: 'Set marked as called successfully!',
          type: 'success'
        });
        handleCloseModal();
        fetchTournaments();
      } else {
        throw new Error(data.error || 'Failed to mark set as called');
      }
    } catch (error) {
      setNotification({
        show: true,
        message: `Error marking set as called: ${error.message}`,
        type: 'error'
      });
    }
  };

  const handleMarkSetInProgress = async (setId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/mark-set-in-progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ setId }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to mark set as in progress');
      }

      const data = await response.json();
      if (data.success) {
        setNotification({
          show: true,
          message: 'Set marked as in progress successfully!',
          type: 'success'
        });
        handleCloseModal();
        fetchTournaments();
      } else {
        throw new Error(data.error || 'Failed to mark set as in progress');
      }
    } catch (error) {
      setNotification({
        show: true,
        message: `Error marking set as in progress: ${error.message}`,
        type: 'error'
      });
    }
  };

  const ScoreButtons = ({ slot, opponentSlot }) => {
    const possibleScores = [-1, 0, 1, 2, 3];
    
    return (
      <div className="flex flex-col items-center space-y-2">
        <Typography variant="h6" className="text-white font-bold">
          {slot.entrant?.name || 'TBD'}
        </Typography>
        <div className="grid grid-cols-5 gap-2">
          {possibleScores.map((score) => (
            <Button
              key={score}
              size="sm"
              onClick={() => handleReportSet(
                slot.entrant?.id,
                score,
                null // We'll handle the second score separately
              )}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700"
            >
              {score}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Spinner className="h-12 w-12" color="blue" /></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-4 shadow-xl">
        <CardBody>
          <Typography variant="h5" color="blue-gray" className="mb-2">
            Welcome, {user.player.gamerTag}!
          </Typography>
          <Typography color="gray">
            You are logged in and can access the Station Viewer. Click on a set to report the result.
          </Typography>
        </CardBody>
      </Card>

      <div className="fixed top-4 right-4 z-50">
        <Alert
          open={notification.show}
          onClose={() => setNotification(prev => ({ ...prev, show: false }))}
          animate={{
            mount: { y: 0 },
            unmount: { y: -100 },
          }}
          className={`${
            notification.type === 'success' 
              ? 'bg-green-500' 
              : 'bg-red-500'
          } text-white shadow-lg`}
        >
          {notification.message}
        </Alert>
      </div>

      <Card className="w-full p-6 rounded-lg bg-gray-950/50 border border-white border-opacity-20 mb-6 shadow-lg">
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
              <Button type="submit" className="bg-red-500 hover:bg-red-600 text-white shadow-md">
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
                  {/* Current Matches */}
                </Typography>
                <div className="flex flex-col items-end space-y-2">
                  <Card className="bg-gradient-to-r from-gray-800 to-gray-950 p-2 rounded-lg border border-white border-opacity-20 shadow-md">
                    <Typography variant="h6" color="white" className="text-center mb-2">
                      Available Stations
                    </Typography>
                    <div className="flex flex-wrap gap-1">
                      {getAvailableStations().map(station => (
                        <span key={station} className="bg-gray-700 text-white px-2 py-1 rounded-md text-sm shadow-sm">
                          {station}
                        </span>
                      ))}
                    </div>
                  </Card>
                  <Button
                    onClick={toggleFilter}
                    className="bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {showOnlyCalled ? "Show All Sets" : "Show Only Called Sets"}
                  </Button>
                </div>
              </div>
              {tournamentData === null ? (
                <div className="flex justify-center">
                  <Spinner className="h-12 w-12" color="red" />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {filteredSets.map(set => (
                    <div key={set.id} onClick={() => handleSetClick(set)} className="cursor-pointer">
                      <SetCardComponent
                        set={{
                          ...set,
                          slots: set.slots.map(slot => ({
                            ...slot,
                            entrantName: slot.entrant?.name || 'TBD'
                          }))
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
              <Dialog
                open={selectedSet !== null}
                handler={handleCloseModal}
                className="bg-gray-900 text-white max-w-[600px] shadow-lg"
              >
                {selectedSet && (
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <Typography variant="h4">
                        Set Actions
                      </Typography>
                      <Typography variant="small" className="text-gray-400">
                        {selectedSet.fullRoundText}
                      </Typography>
                    </div>

                    <div className="space-y-6">
                      {/* Match Information */}
                      <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                        <Typography variant="small" className="text-gray-400">
                          {selectedSet.slots[0].entrant?.name || 'TBD'} vs {selectedSet.slots[1].entrant?.name || 'TBD'}
                        </Typography>
                      </div>

                      {/* Score Selection */}
                      <div className="space-y-4">
                        {selectedSet.slots.map((slot, index) => (
                          <div key={slot.entrant?.id || index} className="flex flex-col items-center space-y-2">
                            <Typography variant="h6" className="text-white font-bold">
                              {slot.entrant?.name || 'TBD'}
                            </Typography>
                            <div className="grid grid-cols-5 gap-2">
                              {[-1, 0, 1, 2, 3].map((score) => (
                                <Button
                                  key={score}
                                  size="sm"
                                  onClick={() => handleScoreSelect(index + 1, score)}
                                  className={`
                                    px-4 py-2 
                                    ${selectedScores[`player${index + 1}`] === score 
                                      ? 'bg-red-500 hover:bg-red-600' 
                                      : 'bg-gray-600 hover:bg-gray-700'}
                                  `}
                                >
                                  {score}
                                </Button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col space-y-4">
                        <Button
                          onClick={handleReportSet}
                          disabled={selectedScores.player1 === null || selectedScores.player2 === null}
                          className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-700 shadow-md"
                        >
                          Submit Scores
                        </Button>
                        <Button
                          onClick={() => handleResetSet(selectedSet.id)}
                          className="w-full bg-yellow-500 hover:bg-yellow-600 shadow-md"
                        >
                          Reset Set
                        </Button>
                        <Button
                          onClick={() => handleMarkSetCalled(selectedSet.id)}
                          className="w-full bg-blue-500 hover:bg-blue-600 shadow-md"
                        >
                          Mark Set as Called
                        </Button>
                        <Button
                          onClick={() => handleMarkSetInProgress(selectedSet.id)}
                          className="w-full bg-green-500 hover:bg-green-600 shadow-md"
                        >
                          Mark Set as In Progress
                        </Button>
                        <Button
                          onClick={handleCloseModal}
                          className="w-full bg-gray-700 hover:bg-gray-600 shadow-md"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Dialog>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default StationViewer;
