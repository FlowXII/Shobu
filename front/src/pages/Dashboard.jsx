import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardBody,
  Typography,
  Spinner,
} from "@material-tailwind/react";
import LatestTournamentsCardComponent from '../components/LatestTournamentsCardComponent';
import SetCardComponent from '../components/SetCardComponent';

const REFRESH_INTERVAL = 100000; // 10 seconds

const SetWatcherComponent = ({ tournaments, onRefresh }) => {
  const [timeUntilRefresh, setTimeUntilRefresh] = useState(REFRESH_INTERVAL);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeUntilRefresh((prevTime) => {
        if (prevTime <= 1000) {
          onRefresh();
          return REFRESH_INTERVAL;
        }
        return prevTime - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onRefresh]);

  const activeSets = (tournaments || []).flatMap(tournament => 
    (tournament?.events || []).flatMap(event => 
      (event?.sets || []).map(set => ({
        ...set,
        tournamentName: tournament?.name || 'Unknown Tournament',
        eventName: event?.name || 'Unknown Event',
        fullRoundText: set.fullRoundText || 'Unknown Round'
      }))
    )
  ).filter(set => [1, 2, 4, 6, 7].includes(set.state)); // Include all relevant states including Completed

  return (
    <Card className="w-full bg-gray-900 text-white shadow-lg">
      <CardBody>
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h5">Set Watcher</Typography>
          <div className="flex items-center">
            <Spinner className="h-6 w-6 text-blue-500" />
            <Typography className="ml-2">{Math.ceil(timeUntilRefresh / 1000)}s</Typography>
          </div>
        </div>
        {activeSets.length > 0 ? (
          <div className="max-h-[600px] overflow-y-auto">
            {activeSets.map((set, index) => (
              <Card key={index} className="mb-4 bg-gray-800">
                <CardBody>
                  <Typography variant="h6" className="mb-2">{set.tournamentName} - {set.eventName}</Typography>
                  <SetCardComponent set={set} />
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <Typography>No active sets available.</Typography>
        )}
      </CardBody>
    </Card>
  );
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/dashboard`, {
        withCredentials: true
      });
      console.log('Dashboard API response:', response.data);
      setDashboardData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div></div>;
  if (error) return <Typography color="red">{error}</Typography>;
  if (!dashboardData) return <Typography>No dashboard data available</Typography>;

  const { user, tournaments } = dashboardData || {};

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Typography variant="h4" className="mb-4">Your latest tournaments</Typography>
          {Array.isArray(tournaments) && tournaments.length > 0 ? (
            tournaments.map((tournament) => (
              <LatestTournamentsCardComponent
                key={tournament?.id || index} 
                tournament={{
                  ...tournament,
                  images: tournament?.images || [],
                  slug: tournament?.slug || '',
                }} 
              />
            ))
          ) : (
            <Typography>No upcoming tournaments found.</Typography>
          )}
        </div>
        <div className="lg:col-span-1">
          <SetWatcherComponent tournaments={tournaments || []} onRefresh={fetchDashboardData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;