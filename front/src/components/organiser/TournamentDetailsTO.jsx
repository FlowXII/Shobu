import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
import LoadingIndicator from '../LoadingIndicator';
import {
  TournamentOverviewTO,
  TournamentEventsTO,
  TournamentParticipantsTO,
  TournamentSettingsTO
} from '.';

const TournamentDetailsTO = () => {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (!tournamentId) {
      navigate('/tournaments');
      return;
    }
    fetchTournament();
  }, [tournamentId, navigate]);

  const fetchTournament = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/tournaments/${tournamentId}`,
        { credentials: 'include' }
      );
      if (!response.ok) throw new Error('Failed to fetch tournament');
      const data = await response.json();
      setTournament(data.data);
      setFormData(data.data);
    } catch (error) {
      toast.error('Failed to load tournament');
      navigate('/tournaments');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/tournaments/${tournamentId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) throw new Error('Failed to update tournament');
      const data = await response.json();
      setTournament(data.data);
      toast.success('Tournament updated successfully');
    } catch (error) {
      toast.error('Failed to update tournament');
    }
  };

  const getStatusChip = () => {
    if (!tournament) return null;
    
    const now = new Date();
    const startTime = new Date(tournament.startAt);
    
    if (now > startTime) {
      return <Chip color="green" value="In Progress" className="w-fit" />;
    } else {
      return <Chip color="blue" value="Upcoming" className="w-fit" />;
    }
  };

  if (loading) return <LoadingIndicator />;

  if (!tournament) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Typography variant="h4" className="text-red-500">
          Tournament not found
        </Typography>
      </div>
    );
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
                onClick={() => navigate(`/tournaments/${tournament.slug}`)}
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
                      <Typography variant="h6">{tournament.participants?.length || 0}</Typography>
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
                <span className="font-medium text-sm">Participants</span>
                {tournament.participants?.length > 0 && (
                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    activeTab === "participants"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-gray-700 text-gray-400"
                  }`}>
                    {tournament.participants.length}
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
                  onUpdate={fetchTournament}
                />
              </TabPanel>
              <TabPanel value="participants" className="p-0">
                <TournamentParticipantsTO tournament={tournament} />
              </TabPanel>
              <TabPanel value="settings" className="p-0">
                <TournamentSettingsTO 
                  tournament={tournament}
                  onUpdate={handleUpdate}
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