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

const EventDetails = () => {
  const { slug, eventSlug } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/tournaments/${slug}/events/${eventSlug}`,
          { credentials: 'include' }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }

        const data = await response.json();
        setEvent(data.data);
      } catch (error) {
        console.error('Error fetching event:', error);
        toast.error('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [slug, eventSlug]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!event) {
    return (
      <Typography className="text-center text-gray-400">
        Event not found
      </Typography>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="bg-gray-900 text-white">
        <CardBody>
          <Typography variant="h2" className="mb-4">
            {event.name}
          </Typography>
          
          <Tabs value={activeTab} className="mt-8">
            <TabsHeader>
              <Tab value="overview" onClick={() => setActiveTab("overview")}>
                Overview
              </Tab>
              <Tab value="brackets" onClick={() => setActiveTab("brackets")}>
                Brackets
              </Tab>
              <Tab value="participants" onClick={() => setActiveTab("participants")}>
                Participants
              </Tab>
            </TabsHeader>

            <TabsBody>
              <TabPanel value="overview">
                <div className="space-y-4">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <Typography variant="h6" className="mb-2">
                      Event Details
                    </Typography>
                    <Typography className="text-gray-300">
                      Start Time: {new Date(event.startAt).toLocaleString()}<br />
                      Number of Entrants: {event.numEntrants || 0}
                    </Typography>
                  </div>
                </div>
              </TabPanel>

              <TabPanel value="brackets">
                <Typography className="text-gray-300">
                  Bracket viewer coming soon...
                </Typography>
              </TabPanel>

              <TabPanel value="participants">
                <Typography className="text-gray-300">
                  Participants
                </Typography>
              </TabPanel>
            </TabsBody>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
};

export default EventDetails; 