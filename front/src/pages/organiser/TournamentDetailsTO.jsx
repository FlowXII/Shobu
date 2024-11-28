import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLoaderData } from 'react-router-dom';
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
  Trophy, 
  Eye,
  ScrollText,
  UserCog,
  Calendar,
  MapPin,
  DollarSign,
  Plus
} from 'lucide-react';
import { toast } from 'react-toastify';
import LoadingIndicator from '../../components/layout/LoadingIndicator';
import TournamentOverviewTO from './TournamentOverviewTO';
import TournamentEventsTO from '../../components/organiser/TournamentEventsTO';
import TournamentParticipantsTO from '../../components/organiser/TournamentParticipantsTO';
import TournamentSettingsTO from '../../components/organiser/TournamentSettingsTO';

const TournamentDetailsTO = () => {
  const navigate = useNavigate();
  const { tournament } = useLoaderData();
  const [activeTab, setActiveTab] = useState("overview");
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startAt: '',
    endAt: '',
    location: {
      venueAddress: '',
      city: '',
      state: '',
      country: ''
    }
  });

  useEffect(() => {
    if (!tournament) {
      navigate('/tournaments');
    }
  }, [tournament, navigate]);

  const updateTournament = async (updatedData) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/tournaments/${tournament._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(updatedData),
        }
      );
      
      if (!response.ok) throw new Error('Failed to update tournament');
      const { data } = await response.json();
      navigate(0);
      return data;
    } catch (error) {
      toast.error('Failed to update tournament');
      return null;
    }
  };

  const getStatusChip = () => {
    const statusColors = {
      draft: "gray",
      published: "green",
      ongoing: "blue",
      completed: "purple",
      cancelled: "red"
    };

    return (
      <Chip
        size="sm"
        variant="ghost"
        color={statusColors[tournament.status] || "gray"}
        value={tournament.status?.charAt(0).toUpperCase() + tournament.status?.slice(1)}
        className="normal-case"
      />
    );
  };

  if (!tournament) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
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
                  {tournament.name}
                </Typography>
              </div>
              
              <Button
                variant="outlined"
                color="blue"
                size="sm"
                className="flex items-center gap-2 normal-case"
                onClick={() => navigate(`/tournaments/${tournament._id}`)}
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
                      <Typography variant="small" className="text-gray-400">Attendees</Typography>
                      <Typography variant="h6">{tournament.numAttendees || 0}</Typography>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-gray-800/50">
                <CardBody className="p-4">
                  <div className="flex items-center gap-3">
                    <Trophy className="text-blue-400" size={24} />
                    <div>
                      <Typography variant="small" className="text-gray-400">Events</Typography>
                      <Typography variant="h6">{tournament.events?.length || 0}</Typography>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-gray-800/50">
                <CardBody className="p-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="text-blue-400" size={24} />
                    <div>
                      <Typography variant="small" className="text-gray-400">Start Date</Typography>
                      <Typography variant="h6">{new Date(tournament.startAt).toLocaleDateString()}</Typography>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-gray-800/50">
                <CardBody className="p-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="text-blue-400" size={24} />
                    <div>
                      <Typography variant="small" className="text-gray-400">Location</Typography>
                      <Typography variant="h6">{tournament.location?.city || 'Online'}</Typography>
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
                value="overview"
                onClick={() => setActiveTab("overview")}
                className={`flex items-center gap-2 py-2 px-4 min-h-[40px] ${
                  activeTab === "overview" 
                    ? "text-blue-500 bg-blue-500/10" 
                    : "text-gray-400 hover:text-gray-300 hover:bg-gray-700/50"
                } transition-all duration-200`}
              >
                <ScrollText size={16} />
                <span className="font-medium text-sm">Overview</span>
              </Tab>
              <Tab 
                value="events"
                onClick={() => setActiveTab("events")}
                className={`flex items-center gap-2 py-2 px-4 min-h-[40px] ${
                  activeTab === "events" 
                    ? "text-blue-500 bg-blue-500/10" 
                    : "text-gray-400 hover:text-gray-300 hover:bg-gray-700/50"
                } transition-all duration-200`}
              >
                <Trophy size={16} />
                <span className="font-medium text-sm">Events</span>
                {tournament.events?.length > 0 && (
                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    activeTab === "events"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-gray-700 text-gray-400"
                  }`}>
                    {tournament.events.length}
                  </span>
                )}
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
                <span className="font-medium text-sm">Attendees</span>
                {tournament.numAttendees > 0 && (
                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    activeTab === "participants"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-gray-700 text-gray-400"
                  }`}>
                    {tournament.numAttendees}
                  </span>
                )}
              </Tab>
              <Tab 
                value="settings"
                onClick={() => setActiveTab("settings")}
                className={`flex items-center gap-2 py-2 px-4 min-h-[40px] ${
                  activeTab === "settings" 
                    ? "text-blue-500 bg-blue-500/10" 
                    : "text-gray-400 hover:text-gray-300 hover:bg-gray-700/50"
                } transition-all duration-200`}
              >
                <Settings size={16} />
                <span className="font-medium text-sm">Settings</span>
              </Tab>
            </TabsHeader>

            <TabsBody className="mt-6">
              <TabPanel value="overview" className="p-0">
                <TournamentOverviewTO tournament={tournament} />
              </TabPanel>
              <TabPanel value="events" className="p-0">
                <TournamentEventsTO 
                  tournament={tournament}
                  isOrganizer={true}
                  onUpdate={updateTournament}
                />
              </TabPanel>
              <TabPanel value="participants" className="p-0">
                <TournamentParticipantsTO tournament={tournament} />
              </TabPanel>
              <TabPanel value="settings" className="p-0">
                <TournamentSettingsTO 
                  tournament={tournament}
                  onUpdate={updateTournament}
                  formData={formData}
                  setFormData={setFormData}
                />
              </TabPanel>
            </TabsBody>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
};

export default TournamentDetailsTO; 