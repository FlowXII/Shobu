import React, { useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardData, fetchUserData } from '../../../store/thunks/userThunks';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import {
  Card,
  CardBody,
  Typography,
  Avatar,
  Button,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { MapPin, Globe, User, Trophy, ChevronDown } from "lucide-react";
import LatestTournamentsCardComponent from '../../../components/startgg/startGGdashboard/LatestTournamentsCardComponent';
import SetWatcherComponent from '../../../components/startgg/startGGstations/SetWatcherComponent';
import DashboardRefresher from '../../../components/startgg/startGGdashboard/DashboardRefresher';
import LogoutButton from '../../../components/auth/LogoutButton';
import TournamentsList from '../../../components/startgg/startGGtournaments/TournamentsList';

const CUSTOM_ANIMATION = {
  mount: { scale: 1 },
  unmount: { scale: 0.9 },
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const { tournaments, loading, error } = useSelector(state => state.dashboard);
  const [localTournaments, setLocalTournaments] = useState(tournaments);
  const [showStartGGData, setShowStartGGData] = useState(false);
  const [open, setOpen] = useState(0);

  useEffect(() => {
    if (user?.startgg && showStartGGData && !localTournaments.length) {
      dispatch(fetchDashboardData());
    }
  }, [dispatch, user?.startgg, showStartGGData, localTournaments.length]);

  useEffect(() => {
    setLocalTournaments(tournaments);
  }, [tournaments]);

  const refreshDashboard = useCallback(async () => {
    if (!user?.startgg) return;
    dispatch(fetchDashboardData());
  }, [dispatch, user?.startgg]);

  useEffect(() => {
    if (!user && !loading.user) {
      dispatch(fetchUserData());
    }
  }, [dispatch, user, loading.user]);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!user.startgg) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-gradient-to-br from-gray-900 to-blue-950 text-white">
          <CardBody className="text-center">
            <Typography variant="h4" className="mb-4">
              Start.gg Integration Required
            </Typography>
            <Typography className="mb-6">
              To access the dashboard features, you need to connect your Start.gg account.
            </Typography>
          </CardBody>
        </Card>
      </div>
    );
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
    <div className="flex flex-col items-center justify-start p-8 overflow-x-hidden">
      {/* Header Card */}
      <Card className="w-full max-w-[64rem] bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-xl border border-white border-opacity-20 rounded-lg overflow-hidden mb-8">
        <CardBody className="p-8">
          <Typography variant="h3" className="mb-4 text-center text-red-500 font-bold">
            Welcome to Your Dashboard
          </Typography>
          <Typography className="text-center text-gray-300">
            Track your tournaments, matches, and performance
          </Typography>
        </CardBody>
      </Card>

      {/* Main Content */}
      <div className="w-full max-w-[64rem] space-y-6">
        {!user.startgg ? (
          <Card className="w-full bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-xl border border-white border-opacity-20 rounded-lg overflow-hidden">
            <CardBody className="text-center p-8">
              <Typography variant="h4" className="mb-4">
                Start.gg Integration Required
              </Typography>
              <Typography className="mb-6">
                To access the dashboard features, you need to connect your Start.gg account.
              </Typography>
            </CardBody>
          </Card>
        ) : (
          <>
            {/* Shobu Tournaments Accordion */}
            <Accordion 
              open={open === 1}
              animate={CUSTOM_ANIMATION}
              className="border border-white/10 rounded-lg"
            >
              <AccordionHeader
                onClick={() => handleOpen(1)}
                className="border-b-0 transition-colors text-white hover:!text-red-500 p-6 flex justify-between items-center"
              >
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-red-400" />
                  <Typography variant="h6">Shobu Tournaments</Typography>
                </div>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${open === 1 ? "rotate-180" : ""} ml-auto`}
                />
              </AccordionHeader>
              <AccordionBody className="px-8 pb-8 pt-2">
                <TournamentsList />
              </AccordionBody>
            </Accordion>

            {/* Start.gg Tournaments Accordion */}
            <Accordion 
              open={open === 2}
              animate={CUSTOM_ANIMATION}
              className="border border-white/10 rounded-lg"
            >
              <AccordionHeader
                onClick={() => handleOpen(2)}
                className="border-b-0 transition-colors text-white hover:!text-purple-500 p-6 flex justify-between items-center"
              >
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-purple-500" />
                  <Typography variant="h6">Start.GG Tournaments</Typography>
                </div>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${open === 2 ? "rotate-180" : ""} ml-auto`}
                />
              </AccordionHeader>
              <AccordionBody className="px-8 pb-8 pt-2">
                {!showStartGGData ? (
                  <div className="text-center">
                    <Typography variant="h5" className="mb-4">
                      Load Your Start.GG Data
                    </Typography>
                    <Button
                      color="purple"
                      onClick={() => setShowStartGGData(true)}
                      className="mt-2"
                    >
                      Query Start.GG Data
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <SetWatcherComponent tournaments={localTournaments} />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2">
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
                            <Typography className="text-white text-center">
                              {loading ? "Loading tournaments..." : "No upcoming tournaments found."}
                            </Typography>
                          )}
                        </div>
                      </div>
                      <div className="lg:col-span-1">
                        <DashboardRefresher onRefresh={refreshDashboard} />
                      </div>
                    </div>
                  </div>
                )}
              </AccordionBody>
            </Accordion>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
