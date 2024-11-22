import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
  Avatar,
  Progress,
  Chip,
} from "@material-tailwind/react";
import { 
  PlusCircle, 
  Trophy, 
  BarChart2, 
  Users, 
  Calendar,
  Settings,
  Target,
  Award
} from 'lucide-react';
import { toast } from 'react-toastify';
import LoadingIndicator from '../../components/layout/LoadingIndicator';

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tournaments");

  useEffect(() => {
    fetchOrganizerTournaments();
  }, []);

  const fetchOrganizerTournaments = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/tournaments/organizer`,
        { credentials: 'include' }
      );

      if (!response.ok) throw new Error('Failed to fetch tournaments');
      const data = await response.json();
      setTournaments(data.data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load tournaments');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingIndicator />;

  const stats = [
    { label: 'Total Tournaments', value: tournaments.length, icon: Trophy, color: 'text-yellow-400' },
    { label: 'Active Events', value: tournaments.reduce((acc, t) => acc + (t.events?.length || 0), 0), icon: Target, color: 'text-blue-400' },
    { label: 'Total Participants', value: tournaments.reduce((acc, t) => acc + (t.numAttendees || 0), 0), icon: Users, color: 'text-green-400' },
    { label: 'Success Rate', value: '98%', icon: Award, color: 'text-purple-400' },
  ];

  return (
    <div className="flex flex-col gap-8 p-8">
      {/* Hero Section */}
      <Card className="w-full bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-xl border border-white/10">
        <CardBody className="p-0">
          {/* Banner */}
          <div className="relative h-48 bg-gradient-to-r from-yellow-500 via-red-500 to-purple-500">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          </div>

          {/* Profile Info */}
          <div className="px-8 pb-8 -mt-16 relative">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              <Avatar
                src={user?.avatar || 'https://via.placeholder.com/150'}
                alt={user?.username}
                size="xxl"
                className="w-32 h-32 border-4 border-gray-900 shadow-xl rounded-xl"
              />
              <div className="flex-grow text-center md:text-left">
                <Typography variant="h3" className="font-bold">
                  Welcome, {user?.username}
                </Typography>
                <Typography className="text-gray-400 mt-2">
                  Tournament Organizer Dashboard
                </Typography>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-2">
                  <Chip size="sm" value="Tournament Organizer" className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/20" />
                  <Chip size="sm" value={`${tournaments.length} Tournaments`} className="bg-blue-500/20 text-blue-400 border border-blue-500/20" />
                </div>
              </div>
              <Button
                className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-red-500"
                onClick={() => navigate('/tournaments/create')}
              >
                <PlusCircle size={20} />
                Create Tournament
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-gray-800/50 border border-white/10">
            <CardBody className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-gray-900/50">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <Typography variant="h4" className="text-white">
                  {stat.value}
                </Typography>
                <Typography className="text-gray-400">
                  {stat.label}
                </Typography>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Tournaments Grid */}
      <Card className="bg-gray-800/50 border border-white/10">
        <CardBody>
          <Typography variant="h5" className="text-white mb-6">
            Your Tournaments
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <Card 
                key={tournament._id}
                className="bg-gray-900/50 hover:bg-gray-800 transition-all cursor-pointer border border-white/5 hover:border-white/10"
                onClick={() => navigate(`/tournaments/${tournament._id}/to`)}
              >
                <CardBody>
                  <div className="flex items-start justify-between">
                    <div>
                      <Typography variant="h5" className="text-white mb-2">
                        {tournament.name}
                      </Typography>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar size={16} />
                        <Typography className="text-sm">
                          {new Date(tournament.startAt).toLocaleDateString()}
                        </Typography>
                      </div>
                    </div>
                    <Trophy className="text-yellow-400" size={24} />
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div>
                      <div className="flex justify-between mb-1">
                        <Typography className="text-sm text-gray-400">Events</Typography>
                        <Typography className="text-sm text-gray-400">{tournament.events?.length || 0}</Typography>
                      </div>
                      <Progress value={((tournament.events?.length || 0) / 10) * 100} size="sm" className="bg-gray-700" color="yellow" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <Typography className="text-sm text-gray-400">Attendees</Typography>
                        <Typography className="text-sm text-gray-400">{tournament.numAttendees || 0}</Typography>
                      </div>
                      <Progress value={((tournament.numAttendees || 0) / 100) * 100} size="sm" className="bg-gray-700" color="green" />
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default OrganizerDashboard;