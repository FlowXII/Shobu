import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Card,
  CardBody,
  Typography,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Button,
  Chip
} from "@material-tailwind/react";

const EventDetails = () => {
  const { slug, eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [canRegister, setCanRegister] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        console.log('Fetching event:', eventId); // Debug log

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/events/${eventId}`, // Simplified endpoint
          { credentials: 'include' }
        );

        console.log('Response status:', response.status); // Debug log

        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }

        const data = await response.json();
        console.log('Event data:', data); // Debug log
        setEvent(data.data);
      } catch (error) {
        console.error('Error fetching event:', error);
        toast.error('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

  const handleRegister = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/events/${eventId}/register`,
        {
          method: 'POST',
          credentials: 'include'
        }
      );

      if (!response.ok) {
        throw new Error('Failed to register for event');
      }

      toast.success('Successfully registered for event');
    } catch (error) {
      console.error('Error registering for event:', error);
      toast.error(error.message || 'Failed to register for event');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="bg-gray-900 text-white">
        <CardBody>
          <div className="flex justify-between items-start mb-6">
            <div>
              <Typography variant="h2" className="mb-2">
                {event.name}
              </Typography>
              <Typography variant="lead" color="gray" className="mb-4">
                {event.gameName}
              </Typography>
            </div>
            {canRegister ? (
              <Button
                size="lg"
                color="blue"
                onClick={handleRegister}
                className="ml-4"
              >
                Register Now
              </Button>
            ) : (
              <Chip
                color="red"
                value={event.maxEntrants ? "Registration Full" : "Registration Closed"}
              />
            )}
          </div>
          
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
                    <Typography variant="h6" className="mb-4">
                      Event Details
                    </Typography>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Typography className="text-gray-300">
                          <strong>Start Time:</strong><br />
                          {new Date(event.startAt).toLocaleString()}
                        </Typography>
                      </div>
                      <div>
                        <Typography className="text-gray-300">
                          <strong>Format:</strong><br />
                          {event.format || 'Double Elimination'}
                        </Typography>
                      </div>
                      <div>
                        <Typography className="text-gray-300">
                          <strong>Entrants:</strong><br />
                          {event.numEntrants || 0} {event.maxEntrants ? `/ ${event.maxEntrants}` : ''}
                        </Typography>
                      </div>
                      <div>
                        <Typography className="text-gray-300">
                          <strong>Entry Fee:</strong><br />
                          {event.entryFee?.amount ? 
                            `${event.entryFee.amount} ${event.entryFee.currency}` : 
                            'Free Entry'}
                        </Typography>
                      </div>
                    </div>
                  </div>

                  {event.description && (
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <Typography variant="h6" className="mb-2">
                        Description
                      </Typography>
                      <Typography className="text-gray-300 whitespace-pre-wrap">
                        {event.description}
                      </Typography>
                    </div>
                  )}

                  {event.rules && (
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <Typography variant="h6" className="mb-2">
                        Rules
                      </Typography>
                      <Typography className="text-gray-300 whitespace-pre-wrap">
                        {event.rules}
                      </Typography>
                    </div>
                  )}
                </div>
              </TabPanel>

              <TabPanel value="brackets">
                <Typography className="text-gray-300">
                  Bracket viewer coming soon...
                </Typography>
              </TabPanel>

              <TabPanel value="participants">
                <Typography className="text-gray-300">
                  {event.numEntrants ? `${event.numEntrants} registered participants` : 'No participants yet'}
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