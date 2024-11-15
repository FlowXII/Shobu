import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardBody,
  Typography,
  Button,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { toast } from 'react-toastify';
import LoadingIndicator from '../components/LoadingIndicator';
import EventsList from '../components/EventsList';

const TournamentDetails = () => {
  const { slug } = useParams();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchTournamentDetails = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/tournaments/${slug}`, {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tournament details');
        }

        const data = await response.json();
        setTournament(data.data);
      } catch (error) {
        console.error('Error fetching tournament:', error);
        toast.error('Failed to load tournament details');
      } finally {
        setLoading(false);
      }
    };

    fetchTournamentDetails();
  }, [slug]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!tournament) {
    return (
      <Typography className="text-center text-gray-400">
        Tournament not found
      </Typography>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="bg-gray-900 text-white">
        <CardBody>
          <Typography variant="h2" className="mb-4">
            {tournament.name}
          </Typography>
          
          <Tabs value={activeTab} className="mt-8">
            <TabsHeader>
              <Tab value="overview" onClick={() => setActiveTab("overview")}>
                Overview
              </Tab>
              <Tab value="events" onClick={() => setActiveTab("events")}>
                Events
              </Tab>
              <Tab value="participants" onClick={() => setActiveTab("participants")}>
                Participants
              </Tab>
            </TabsHeader>

            <TabsBody>
              <TabPanel value="overview">
                {/* Tournament Overview Content */}
                <div className="space-y-4">
                  <Typography className="text-gray-300">
                    {tournament.description}
                  </Typography>
                  
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <Typography variant="h6" className="mb-2">
                      Location Details
                    </Typography>
                    <Typography className="text-gray-300">
                      {tournament.location.venueAddress}<br />
                      {tournament.location.city}, {tournament.location.state}<br />
                      {tournament.location.country}
                    </Typography>
                  </div>
                </div>
              </TabPanel>

              <TabPanel value="events">
                <EventsList 
                  events={tournament.events} 
                  tournamentSlug={tournament.slug}
                />
              </TabPanel>

              <TabPanel value="participants">
                {/* Participants list component would go here */}
                <Typography className="text-gray-300">
                  Coming soon...
                </Typography>
              </TabPanel>
            </TabsBody>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
};

export default TournamentDetails; 