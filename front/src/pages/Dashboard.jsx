import React, { useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardData } from '../store/thunks/userThunks';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import {
  Card,
  CardBody,
  Typography,
  Avatar,
} from "@material-tailwind/react";
import { MapPin, Globe, User } from "lucide-react";
import LatestTournamentsCardComponent from '../components/LatestTournamentsCardComponent';
import SetWatcherComponent from '../components/SetWatcherComponent';
import DashboardRefresher from '../components/DashboardRefresher';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user, tournaments, loading, error } = useSelector(state => state.user);
  const [localTournaments, setLocalTournaments] = useState(tournaments);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  useEffect(() => {
    setLocalTournaments(tournaments);
  }, [tournaments]);

  const refreshDashboard = useCallback(async () => {
    try {
      const response = await axios.get('/api/dashboard', { withCredentials: true });
      setLocalTournaments(response.data.tournaments);
      // Optionally update user data if needed
      // dispatch(setUser(response.data.user));
    } catch (error) {
      console.error('Failed to refresh dashboard:', error);
    }
  }, []);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col items-center mb-8">
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
            {Array.isArray(localTournaments) && localTournaments.length > 0 ? (
              localTournaments.map((tournament, index) => (
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

        {/* Dashboard Refresher and Set Watcher */}
        <div className="lg:col-span-3">
          <DashboardRefresher onRefresh={refreshDashboard} />
          <SetWatcherComponent tournaments={localTournaments} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
