import React, { useState } from 'react';
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
import { useEvent } from '../../hooks/useEvent';
import { useSelector } from 'react-redux';

const EventDetails = () => {
  const { eventId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const { event, loading, canRegister, handleRegister } = useEvent(eventId);
  const currentUser = useSelector(state => state.user.user);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Card className="bg-gray-900 border border-gray-800 shadow-xl">
        <CardBody className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <Typography variant="h2" className="text-3xl font-bold text-blue-400 mb-2">
                {event.name}
              </Typography>
              <div className="flex items-center space-x-3">
                <Typography variant="lead" className="text-gray-400">
                  {event.gameName}
                </Typography>
                <div className="h-1 w-1 bg-gray-600 rounded-full" />
                <Typography className="text-gray-400">
                  {event.format || 'Double Elimination'}
                </Typography>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0">
              {canRegister ? (
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 shadow-lg transform hover:scale-105 transition-all"
                  onClick={handleRegister}
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register Now"}
                </Button>
              ) : (
                <Chip
                  variant="gradient"
                  color={event.participants?.includes(currentUser?.id) ? "green" : "red"}
                  value={
                    event.participants?.includes(currentUser?.id)
                      ? "Already Registered"
                      : event.maxEntrants && event.numEntrants >= event.maxEntrants
                        ? "Registration Full"
                        : "Registration Closed"
                  }
                  className="text-sm py-2"
                />
              )}
            </div>
          </div>
          
          <Tabs value={activeTab} className="mt-8">
            <TabsHeader className="bg-gray-800 border-none">
              {["overview", "brackets", "participants"].map((tab) => (
                <Tab
                  key={tab}
                  value={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`${
                    activeTab === tab
                      ? "text-blue-400 bg-gray-700"
                      : "text-gray-400"
                  } capitalize py-3`}
                >
                  {tab}
                </Tab>
              ))}
            </TabsHeader>

            <TabsBody className="mt-8">
              <TabPanel value="overview">
                <div className="space-y-6">
                  <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
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
                {event.participants && event.participants.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {event.participants.map((participant, index) => (
                      <Card key={participant.id} className="bg-gray-800 border border-gray-700">
                        <CardBody className="p-4 flex items-center space-x-4">
                          <Chip
                            value={index + 1}
                            className="bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center"
                          />
                          <div>
                            <Typography className="text-gray-200 font-medium">
                              {participant.prefix ? 
                                <span className="text-gray-400">{participant.prefix} | </span> 
                                : ''
                              }
                              {participant.displayName}
                            </Typography>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Typography className="text-gray-300">
                    No participants yet
                  </Typography>
                )}
              </TabPanel>
            </TabsBody>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
};

export default EventDetails; 