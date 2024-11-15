import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Card,
  CardBody,
  Typography,
  Input,
  Button,
  Spinner,
  Dialog,
  Alert,
  Chip
} from "@material-tailwind/react";
import SetCardComponent from '../components/SetCardComponent';
import Login from './StartGGLogin';
import TournamentSuggestionCard from '../components/TournamentSuggestionCard';
import { Bell, CheckCircle, Play, Clock, XCircle } from 'lucide-react';

const REFRESH_INTERVAL = 30000;

const StationCard = ({ number, isUsed }) => (
  <Card className={`
    w-16 h-16 
    flex items-center justify-center 
    ${isUsed 
      ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-dashed border-gray-500' 
      : 'bg-gradient-to-br from-gray-900 to-blue-900'
    } 
    shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl
  `}>
    <Typography variant="h6" color={isUsed ? "gray" : "white"} className="text-center font-bold">
      {number}
    </Typography>
  </Card>
);

function StationViewer() {
  const { user, initialized } = useSelector(state => state.user);
  const { isAuthenticated } = useSelector(state => state.auth);
  const navigate = useNavigate();
  
  // State declarations
  const [pageLoading, setPageLoading] = useState(true);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [eventId, setEventId] = useState('');
  const [submittedEventId, setSubmittedEventId] = useState(null);
  const [tournamentData, setTournamentData] = useState(null);
  const [showOnlyCalled, setShowOnlyCalled] = useState(false);
  const [selectedSet, setSelectedSet] = useState(null);
  const [selectedScores, setSelectedScores] = useState({ player1: null, player2: null });
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });
  const { tournaments, loading: dashboardLoading } = useSelector(state => state.dashboard);
  const [filters, setFilters] = useState({
    showCalled: true,
    showCompleted: true,
    showActive: false,
    showCreated: false,
    hideTBD: true,
  });

  // Define URL based on submittedEventId
  const getUrl = () => submittedEventId ? 
    `${import.meta.env.VITE_API_BASE_URL}/stations/${submittedEventId}` : 
    null;

  // Initialization effect
  useEffect(() => {
    if (initialized) {
      setPageLoading(false);
    }
  }, [initialized]);

  // Tournament fetching effect
  useEffect(() => {
    let intervalId;
    let isMounted = true;
    
    const fetchData = async () => {
      const url = getUrl();
      if (!url || !user?.startgg?.accessToken || !isMounted) return;
      
      try {
        setFetchLoading(true);
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${user.startgg.accessToken}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        
        if (!isMounted) return;
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        if (!data.data || !data.data.event || !data.data.event.sets || !data.data.event.sets.nodes) {
          throw new Error('Unexpected data structure from API');
        }

        // Update only if data has changed
        setTournamentData(prevData => {
          if (JSON.stringify(prevData) !== JSON.stringify(data.data)) {
            return data.data;
          }
          return prevData;
        });
      } catch (error) {
        if (!isMounted) return;
        console.error('Error fetching tournaments:', error.message);
        setNotification({
          show: true,
          message: `Error fetching tournaments: ${error.message}`,
          type: 'error'
        });
      } finally {
        if (isMounted) {
          setFetchLoading(false);
        }
      }
    };

    // Initial fetch
    fetchData();

    // Set up interval only if we have an event ID
    if (submittedEventId) {
      intervalId = setInterval(fetchData, REFRESH_INTERVAL);
    }

    // Cleanup function
    return () => {
      isMounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [submittedEventId, user?.startgg?.accessToken]); // Removed url from dependencies

  // Loading state check
  if (pageLoading) {
    return <div className="flex justify-center items-center h-screen">
      <Spinner className="h-12 w-12" color="blue" />
    </div>;
  }

  // Authentication checks
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  // Start.gg integration check
  if (!user.startgg?.accessToken) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-gradient-to-br from-gray-900 to-blue-950 text-white">
          <CardBody className="text-center">
            <Typography variant="h4" className="mb-4">
              Start.gg Integration Required
            </Typography>
            <Typography className="mb-6">
              To access the station viewer, you need to connect your Start.gg account.
            </Typography>
            <Button
              color="purple"
              onClick={() => navigate('/profile')}
            >
              Go to Profile to Connect
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  const fetchTournaments = async () => {
    try {
      setFetchLoading(true);
      const response = await fetch(getUrl(), {
        headers: {
          'Authorization': `Bearer ${user.startgg.accessToken}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
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
      setNotification({
        show: true,
        message: `Error fetching tournaments: ${error.message}`,
        type: 'error'
      });
    } finally {
      setFetchLoading(false);
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
  
  // Updated to include finished matches (state 3)
  const relevantSets = allSets.filter(set => [1, 2, 3, 4, 6, 7].includes(set.state))
    .map(set => ({
      ...set,
      fullRoundText: set.fullRoundText || 'Unknown Round'
    }));

  // Updated to include finished matches in the filter
  const filteredSets = relevantSets.filter(set => {
    // First check if both slots are TBD
    const isBothTBD = set.slots.every(slot => 
      !slot.entrant?.name || slot.entrant?.name === 'TBD' || slot.entrantName === 'TBD'
    );
    
    if (filters.hideTBD && isBothTBD) {
      return false;
    }

    // Then check state filters
    return (
      (filters.showCalled && set.state === 6) ||    // Called
      (filters.showCompleted && set.state === 3) ||  // Completed
      (filters.showActive && set.state === 2) ||     // Active
      (filters.showCreated && set.state === 1)       // Created
    );
  });

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
      setFetchLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/reset-set`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.startgg.accessToken}`
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
    } finally {
      setFetchLoading(false);
    }
  };

  const handleMarkSetCalled = async (setId) => {
    try {
      setFetchLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/mark-set-called`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.startgg.accessToken}`
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
    } finally {
      setFetchLoading(false);
    }
  };

  const handleMarkSetInProgress = async (setId) => {
    try {
      setFetchLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/mark-set-in-progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.startgg.accessToken}`
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
    } finally {
      setFetchLoading(false);
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

  // New component for tournament suggestions
  const TournamentSuggestions = () => {
    if (dashboardLoading) {
      return (
        <div className="flex justify-center items-center py-4">
          <Spinner className="h-8 w-8" color="red" />
        </div>
      );
    }

    if (!tournaments || tournaments.length === 0) {
      return (
        <Card className="bg-gray-800/50 p-4 mb-6">
          <Typography variant="h6" className="text-gray-400 text-center">
            No recent tournaments found
          </Typography>
          <Typography variant="small" className="text-gray-500 text-center">
            Enter an event ID manually below
          </Typography>
        </Card>
      );
    }

    return (
      <div className="mb-6">
        <Typography variant="h6" className="text-white mb-4">
          Your Recent Tournaments
        </Typography>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tournaments.map(tournament => (
            <TournamentSuggestionCard
              key={tournament.id}
              tournament={tournament}
              onClick={(eventId) => {
                setEventId(eventId);
                setSubmittedEventId(eventId);
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  // Add this component definition before the main return statement
  const EventIdForm = () => (
    <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-6">
      <div className="w-full max-w-md">
        <Input
          type="text"
          label="Enter Event ID"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          className="text-white bg-gray-800"
          labelProps={{
            className: "text-gray-400"
          }}
          containerProps={{
            className: "min-w-[200px]"
          }}
        />
      </div>
      <Button 
        type="submit" 
        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg transition-all duration-300"
      >
        Load Tournament
      </Button>
      <div className="bg-gray-800 p-4 rounded-lg max-w-md">
        <Typography variant="small" className="text-gray-400 text-center">
          <span className="text-red-400 font-semibold">Note:</span> This feature is for TOs and testing only.<br />
          Find the event ID in the start.gg admin URL:<br />
          <code className="bg-gray-900 px-2 py-1 rounded text-xs">
            start.gg/admin/tournament/.../1140299/...
          </code>
        </Typography>
      </div>
    </form>
  );

  const FilterSection = () => {
    return (
      <Card className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-white/20">
        <Typography variant="h6" color="white" className="mb-3">
          Filters
        </Typography>
        <div className="flex flex-wrap gap-2">
          <Chip
            value="Called"
            icon={<Bell className="h-3 w-3" />}
            className={`cursor-pointer ${
              filters.showCalled 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-700 text-gray-300'
            }`}
            onClick={() => setFilters(prev => ({ ...prev, showCalled: !prev.showCalled }))}
          />
          <Chip
            value="Completed"
            icon={<CheckCircle className="h-3 w-3" />}
            className={`cursor-pointer ${
              filters.showCompleted 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-700 text-gray-300'
            }`}
            onClick={() => setFilters(prev => ({ ...prev, showCompleted: !prev.showCompleted }))}
          />
          <Chip
            value="Active"
            icon={<Play className="h-3 w-3" />}
            className={`cursor-pointer ${
              filters.showActive 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-700 text-gray-300'
            }`}
            onClick={() => setFilters(prev => ({ ...prev, showActive: !prev.showActive }))}
          />
          <Chip
            value="Created"
            icon={<Clock className="h-3 w-3" />}
            className={`cursor-pointer ${
              filters.showCreated 
                ? 'bg-gray-500 text-white' 
                : 'bg-gray-700 text-gray-300'
            }`}
            onClick={() => setFilters(prev => ({ ...prev, showCreated: !prev.showCreated }))}
          />
          <Chip
            value="Hide TBD vs TBD"
            icon={<XCircle className="h-3 w-3" />}
            className={`cursor-pointer ${
              filters.hideTBD 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-700 text-gray-300'
            }`}
            onClick={() => setFilters(prev => ({ ...prev, hideTBD: !prev.hideTBD }))}
          />
        </div>
      </Card>
    );
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-6 bg-gradient-to-br from-gray-900 to-gray-800 shadow-xl border border-gray-700">
        <CardBody>
          <Typography variant="h4" className="text-white mb-2 font-bold">
            Welcome, {user.startgg?.player?.gamerTag || user.username}
          </Typography>
          <Typography className="text-gray-400">
            Manage your tournament stations and report match results here.
          </Typography>
        </CardBody>
      </Card>

      <div className="flex gap-4 mb-6 relative z-50">
        {submittedEventId && (
          <>
            <Button
              onClick={() => navigate(`/bracket/${submittedEventId}`)}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl relative z-50"
              size="lg"
            >
              View Bracket
            </Button>
            <Button
              onClick={() => {
                setSubmittedEventId(null);
                setEventId('');
              }}
              className="flex-1 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl relative z-50"
              size="lg"
            >
              Return to Tournament Selection
            </Button>
          </>
        )}
      </div>

      <Card className="w-full p-6 rounded-lg bg-gray-950/50 border border-white border-opacity-20 mb-6 shadow-lg">
        <CardBody>
          {!submittedEventId ? (
            <>
              {tournaments.length > 0 && <TournamentSuggestions />}
              <Typography variant="h6" className="text-white mb-4">
                Or Enter Event ID Manually
              </Typography>
              <EventIdForm />
            </>
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <Typography variant="h4" color="white" className="text-center">
                  {/* Current Matches */}
                </Typography>
                <div className="flex flex-col items-end space-y-4">
                  <Card className="bg-gradient-to-br from-gray-800 to-gray-900 p-2 rounded-lg border border-white/20 shadow-md">
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
                  <FilterSection />
                </div>
              </div>
              {fetchLoading ? (
                <div className="flex justify-center">
                  <Spinner className="h-12 w-12" color="red" />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 relative z-10">
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
                className="bg-gray-900 text-white max-w-[600px] shadow-lg z-[9999]"
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
