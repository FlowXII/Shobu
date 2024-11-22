import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Card,
  CardBody,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  TabsBody,
  TabPanel,
  Button,
  Chip,
} from "@material-tailwind/react";
import { 
  Settings, 
  Users, 
  Brackets, 
  Trophy, 
  Eye, 
  ScrollText, 
  UserCog, 
  TrophyIcon,
  DollarSign,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { useEvent } from '../../hooks/useEvent';
import {
  EventSettingsTO,
  EventParticipantsTO,
  EventBracketsTO
} from '.';
import { toast } from 'react-toastify';
  
const EventDetailsTO = () => {
  const { tournamentId, eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("settings");
  const { event, loading, refreshEvent } = useEvent(eventId);

  useEffect(() => {
    if (!loading && !event) {
      console.error('Event not found:', { eventId, tournamentId });
      navigate(`/tournaments/${tournamentId}/to`);
      return;
    }

    if (event && event.tournamentId !== tournamentId) {
      console.error('Event belongs to different tournament:', {
        eventId,
        eventTournamentId: event.tournamentId,
        currentTournamentId: tournamentId
      });
      navigate(`/tournaments/${event.tournamentId}/events/${eventId}/to`);
    }
  }, [event, loading, tournamentId, eventId]);

  // Debug loading and event state
  useEffect(() => {
    console.log('Loading:', loading);
    console.log('Event data:', event);
  }, [loading, event]);

  const handleUpdateEvent = async (formData) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/events/${eventId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error('Failed to update event');
      toast.success('Event updated successfully');
      refreshEvent();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteEvent = async () => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/events/${eventId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      if (!response.ok) throw new Error('Failed to delete event');
      toast.success('Event deleted successfully');
      navigate(`/tournaments/${event?.tournamentContext?._id}/to`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getStatusChip = () => {
    if (!event) return null;
    
    const now = new Date();
    const startTime = new Date(event.startAt);
    
    if (now > startTime) {
      return <Chip color="green" value="In Progress" className="w-fit" />;
    } else {
      return <Chip color="blue" value="Upcoming" className="w-fit" />;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
        <div className="flex items-center gap-3">
          <Trophy size={20} className="text-blue-400" />
          <div>
            <Typography variant="small" className="text-gray-400">Tournament</Typography>
            <Typography variant="h6" className="text-gray-200">
              {event?.tournamentContext?.name || 'Loading...'}
            </Typography>
          </div>
        </div>
        <Button
          variant="outlined"
          color="blue"
          size="sm"
          className="flex items-center gap-2 normal-case"
          onClick={() => navigate(`/tournaments/${tournamentId}/view`)}
        >
          <Eye size={14} />
          View Public Page
        </Button>
      </div>

      <Card className="bg-gray-900 border-2 border-blue-500/50 mb-6">
        <CardBody>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <Typography variant="h3" className="text-blue-400">
                    Tournament Organizer View
                  </Typography>
                  {getStatusChip()}
                </div>
                <Typography variant="h4" className="text-gray-300">
                  {event?.name}
                </Typography>
              </div>
              
              <Button
                variant="outlined"
                color="blue"
                size="sm"
                className="flex items-center gap-2 normal-case"
                onClick={() => navigate(`/tournaments/${tournamentId}/events/${eventId}/view`)}
              >
                <Eye size={14} />
                View Public Page
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <Card className="bg-gray-800/50 border border-gray-700/50">
                <CardBody className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Users className="text-blue-400" size={20} />
                    </div>
                    <div>
                      <Typography variant="small" className="text-gray-400">Participants</Typography>
                      <Typography variant="h6">{event?.participants?.length || 0}/{event?.maxEntrants || '∞'}</Typography>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-gray-800/50">
                <CardBody className="p-4">
                  <div className="flex items-center gap-3">
                    <Trophy className="text-blue-400" size={24} />
                    <div>
                      <Typography variant="small" className="text-gray-400">Format</Typography>
                      <Typography variant="h6">{event?.format || 'Double Elimination'}</Typography>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-gray-800/50">
                <CardBody className="p-4">
                  <div className="flex items-center gap-3">
                    <DollarSign className="text-blue-400" size={24} />
                    <div>
                      <Typography variant="small" className="text-gray-400">Entry Fee</Typography>
                      <Typography variant="h6">${event?.entryFee?.amount || '0'}</Typography>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-gray-800/50">
                <CardBody className="p-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="text-blue-400" size={24} />
                    <div>
                      <Typography variant="small" className="text-gray-400">Start Time</Typography>
                      <Typography variant="h6">{new Date(event?.startAt).toLocaleDateString()}</Typography>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="bg-gray-900 border border-gray-800">
        <CardBody>
          <Tabs value={activeTab} className="overflow-visible">
            <TabsHeader className="bg-gray-800/50 border border-gray-700/50 p-0 rounded-lg">
              <Tab 
                value="settings" 
                onClick={() => setActiveTab("settings")}
                className={`flex items-center gap-2 py-2 px-4 min-h-[40px] ${
                  activeTab === "settings" 
                    ? "text-blue-500 bg-blue-500/10" 
                    : "text-gray-400 hover:text-gray-300 hover:bg-gray-700/50"
                } transition-all duration-200`}
              >
                <ScrollText size={16} />
                <span className="font-medium text-sm">Settings</span>
              </Tab>
              <Tab 
                value="participants"
                onClick={() => setActiveTab("participants")}
                className={`flex items-center gap-2 py-2 px-4 min-h-[40px] ${
                  activeTab === "participants" 
                    ? "text-blue-500 bg-blue-500/10" 
                    : "text-gray-400 hover:text-gray-300 hover:bg-gray-700/50"
                } transition-all duration-200`}
              >
                <UserCog size={16} />
                <span className="font-medium text-sm">Participants</span>
                {event?.participants?.length > 0 && (
                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    activeTab === "participants"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-gray-700 text-gray-400"
                  }`}>
                    {event.participants.length}
                  </span>
                )}
              </Tab>
              <Tab 
                value="brackets"
                onClick={() => setActiveTab("brackets")}
                className={`flex items-center gap-2 py-2 px-4 min-h-[40px] ${
                  activeTab === "brackets" 
                    ? "text-blue-500 bg-blue-500/10" 
                    : "text-gray-400 hover:text-gray-300 hover:bg-gray-700/50"
                } transition-all duration-200`}
              >
                <TrophyIcon size={16} />
                <span className="font-medium text-sm">Brackets</span>
              </Tab>
            </TabsHeader>

            <TabsBody className="mt-6">
              <TabPanel value="settings" className="p-0">
                <EventSettingsTO 
                  event={event} 
                  onUpdate={handleUpdateEvent}
                  onDelete={handleDeleteEvent}
                />
              </TabPanel>
              <TabPanel value="participants" className="p-0">
                <EventParticipantsTO 
                  event={event} 
                  onUpdate={() => {
                    console.log('Triggering refresh');
                    refreshEvent();
                  }} 
                />
              </TabPanel>
              <TabPanel value="brackets" className="p-0">
                <EventBracketsTO event={event} />
              </TabPanel>
            </TabsBody>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
};

export default EventDetailsTO; 