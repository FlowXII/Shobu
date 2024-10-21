import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Card,
  CardBody,
  Typography,
  Spinner,
  Avatar,
} from "@material-tailwind/react";
import { MapPin, GamepadIcon, Globe, User } from "lucide-react";
import LatestTournamentsCardComponent from '../components/LatestTournamentsCardComponent';
import SetCardComponent from '../components/SetCardComponent';

const REFRESH_INTERVAL = 10000; // 100 seconds

const SetWatcherComponent = ({ tournaments, onRefresh }) => {
  const [timeUntilRefresh, setTimeUntilRefresh] = useState(REFRESH_INTERVAL);
  const [prevSets, setPrevSets] = useState({});
  const [subscription, setSubscription] = useState(null);

  const activeSets = React.useMemo(() => {
    return (tournaments || []).flatMap(tournament => 
      (tournament?.events || []).flatMap(event => 
        (event?.sets || []).map(set => ({
          ...set,
          tournamentName: tournament?.name || 'Unknown Tournament',
          eventName: event?.name || 'Unknown Event',
          fullRoundText: set.fullRoundText || 'Unknown Round'
        }))
      )
    ).filter(set => [1, 2, 4, 6, 7].includes(set.state));
  }, [tournaments]);

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

  useEffect(() => {
    const getSubscription = async () => {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        try {
          const registration = await navigator.serviceWorker.ready;
          const sub = await registration.pushManager.getSubscription();
          if (sub) {
            setSubscription(sub);
          } else {
            console.log('No subscription found. User needs to subscribe to push notifications.');
          }
        } catch (error) {
          console.error('Error getting push subscription:', error);
        }
      }
    };

    getSubscription();
  }, []);

  const sendNotification = useCallback(async (set) => {
    if (!subscription) {
      console.log('No push subscription available. Cannot send notification.');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/notifications/send-set-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription,
          set: {
            id: set.id,
            state: set.state,
            tournamentName: set.tournamentName,
            eventName: set.eventName,
            fullRoundText: set.fullRoundText,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send notification: ${response.status}`);
      }

      console.log('Set state change notification sent successfully');
    } catch (error) {
      console.error('Error sending set state change notification:', error);
    }
  }, [subscription]);

  useEffect(() => {
    activeSets.forEach(set => {
      const prevSet = prevSets[set.id];
      if (!prevSet || prevSet.state !== set.state) {
        if (
          (prevSet && prevSet.state === 1 && set.state === 2) || // Created to In Progress
          (prevSet && prevSet.state === 2 && set.state === 6) || // In Progress to Called
          (!prevSet && (set.state === 2 || set.state === 6)) // New set that's In Progress or Called
        ) {
          console.log('Sending notification for set:', set);
          sendNotification(set);
        }
        setPrevSets(prev => ({ ...prev, [set.id]: set }));
      }
    });
  }, [activeSets, sendNotification]);

  return (
    <Card className="w-full bg-gray-900 text-white shadow-xl border border-white border-opacity-20 rounded-lg">
      <CardBody className="p-4">
        <div className="flex justify-between items-center mb-2">
          <Typography variant="h6" className="text-sm text-center">Active Sets</Typography>
          <div className="flex items-center">
            <Spinner className="h-3 w-3 text-blue-500" />
            <Typography className="ml-1 text-xs">{Math.ceil(timeUntilRefresh / 1000)}s</Typography>
          </div>
        </div>
        {activeSets.length > 0 ? (
          <div className="space-y-2">
            {activeSets.map((set, index) => (
              <SetCardComponent key={index} set={set} />
            ))}
          </div>
        ) : (
          <Typography className="text-center text-xs">No active sets available.</Typography>
        )}
      </CardBody>
    </Card>
  );
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div></div>;
  if (error) return <Typography color="red">{error}</Typography>;
  if (!dashboardData) return <Typography>No dashboard data available</Typography>;

  const { user, tournaments } = dashboardData || {};

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-center mb-8">
        <Card className="w-full max-w-3xl bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg border border-white border-opacity-10 rounded-lg overflow-hidden">
          <CardBody className="p-4">
            <Typography variant="h3" className="text-center font-bold mb-2">
              Welcome to Your Dashboard
            </Typography>
            <Typography variant="lead" className="text-center text-gray-300 text-sm">
              Track your tournaments, matches, and performance
            </Typography>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* User Profile */}
        <div className="lg:col-span-3">
          <Card className="w-full bg-gradient-to-br from-gray-900 to-blue-950 text-white shadow-xl overflow-hidden border border-white border-opacity-20 rounded-lg">
            <CardBody>
              <div className="relative pb-6">
                {user?.images?.[0]?.url ? (
                  <div 
                    className="absolute top-0 left-0 w-full h-24 bg-cover bg-center"
                    style={{ backgroundImage: `url(${user.images[0].url})` }}
                  >
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                  </div>
                ) : (
                  <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                )}
                <div className="relative flex justify-center">
                  <Avatar
                    src={user?.images?.[1]?.url || 'https://via.placeholder.com/100'}
                    alt={user?.name || 'User'}
                    size="xxl"
                    className="border-4 border-white shadow-lg"
                  />
                </div>
              </div>
              <Typography variant="h4" className="mb-2 text-center font-bold">{user?.name || 'Anonymous User'}</Typography>
              {user?.player?.gamerTag && (
                <Typography className="text-center text-blue-300 mb-4">
                  {user.player.prefix && <span>{user.player.prefix} | </span>}
                  {user.player.gamerTag}
                </Typography>
              )}
              <div className="space-y-3">
                {user?.genderPronoun && (
                  <div className="flex items-center bg-gray-800 rounded-lg p-2">
                    <User className="mr-3 h-5 w-5 text-purple-400" />
                    <Typography className="text-sm">Pronouns: {user.genderPronoun}</Typography>
                  </div>
                )}
                {user?.location && (
                  <div className="flex items-center bg-gray-800 rounded-lg p-2">
                    <MapPin className="mr-3 h-5 w-5 text-red-400" />
                    <Typography className="text-sm">
                      {[user.location.city, user.location.state, user.location.country].filter(Boolean).join(', ')}
                    </Typography>
                  </div>
                )}
                {user?.bio && (
                  <div className="bg-gray-800 rounded-lg p-2">
                    <Typography className="text-sm">{user.bio}</Typography>
                  </div>
                )}
                {user?.slug && (
                  <div className="flex items-center bg-gray-800 rounded-lg p-2">
                    <Globe className="mr-3 h-5 w-5 text-blue-400" />
                    <Typography className="text-sm">
                      <a href={`https://start.gg/${user.slug}`} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-100">
                        start.gg Profile
                      </a>
                    </Typography>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Latest Tournaments */}
        <div className="lg:col-span-6">
          <div className="space-y-4">
            {Array.isArray(tournaments) && tournaments.length > 0 ? (
              tournaments.map((tournament, index) => (
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
              <Typography className="text-white">No upcoming tournaments found.</Typography>
            )}
          </div>
        </div>

        {/* Set Watcher */}
        <div className="lg:col-span-3">
          <SetWatcherComponent tournaments={tournaments || []} onRefresh={fetchDashboardData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
