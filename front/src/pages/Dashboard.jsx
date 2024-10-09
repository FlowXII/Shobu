import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardBody,
  Typography,
  Avatar
} from "@material-tailwind/react";
import LatestTournamentsCardComponent from '../components/LatestTournamentsCardComponent';

const MockComponent = () => (
  <Card className="w-full bg-gray-900 text-white shadow-lg">
    <CardBody>
      <Typography variant="h5" className="mb-4">Second part of the dashboard goes here</Typography>
      <Typography>This is a placeholder for additional dashboard content.</Typography>
    </CardBody>
  </Card>
);

const Dashboard = () => {
  // State to hold user data fetched from the backend
  const [userData, setUserData] = useState(null);
  // State to hold tournament data fetched from the backend
  const [tournamentData, setTournamentData] = useState(null);
  // State to manage loading status
  const [loading, setLoading] = useState(true);
  // State to manage error messages
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch dashboard data from the backend
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/dashboard`, {
          withCredentials: true
        });
        // Set user data from the backend response
        setUserData(response.data.user);
        // Set tournament data from the backend response
        setTournamentData(response.data.tournaments);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to fetch dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div></div>;
  if (error) return <Typography color="red">{error}</Typography>;
  if (!userData || !tournamentData) return <Typography>No dashboard data available</Typography>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Typography variant="h4" className="mb-4">Your latest tournaments</Typography>
          {Array.isArray(tournamentData) && tournamentData.length > 0 ? (
            tournamentData.map((tournament) => (
              <LatestTournamentsCardComponent
                key={tournament.id} 
                tournament={{
                  ...tournament,
                  images: tournament.images || [], // Ensure images is an array
                  slug: tournament.slug || '', // Provide a default slug
                }} 
              />
            ))
          ) : (
            <Typography>No upcoming tournaments found.</Typography>
          )}
        </div>
        <div className="lg:col-span-1">
          <MockComponent />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;