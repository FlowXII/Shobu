import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardBody,
  Typography,
  Button,
  Avatar,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Chip,
  Progress,
} from "@material-tailwind/react";
import {
  User,
  Mail,
  Trophy,
  MapPin,
  Globe,
  ChevronDown,
  Medal,
  Target,
  Users,
  Calendar,
  Award,
  Star,
} from "lucide-react";
import { logoutUser, disconnectStartGG } from '../../store/thunks/userThunks';
import LoadingIndicator from '../../components/layout/LoadingIndicator';

const CUSTOM_ANIMATION = {
  mount: { scale: 1 },
  unmount: { scale: 0.9 },
};

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const loading = useSelector((state) => state.user.loading.user);
  const initialized = useSelector((state) => state.user.initialized);
  const [open, setOpen] = useState(1);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  if (!initialized || loading) {
    return <LoadingIndicator />;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Typography className="text-gray-400">
          Please log in to view your profile
        </Typography>
      </div>
    );
  }

  const isStartGGConnected = user?.startgg?.accessToken;
  const startggProfile = user?.startgg?.profile;
  const startggPlayer = user?.startgg?.player;

  // Placeholder stats
  const stats = [
    { label: 'Tournaments', value: '24', icon: Trophy, color: 'text-red-400' },
    { label: 'Matches', value: '168', icon: Target, color: 'text-blue-400' },
    { label: 'Win Rate', value: '67%', icon: Award, color: 'text-green-400' },
    { label: 'Ranking', value: '#42', icon: Medal, color: 'text-yellow-400' },
  ];

  // Placeholder achievements
  const achievements = [
    { name: 'Tournament Victor', description: 'Won first place in a major tournament', icon: Trophy, date: '2024-02-15' },
    { name: 'Streak Master', description: '10 wins in a row', icon: Star, date: '2024-01-20' },
    { name: 'Community Leader', description: 'Created 5 successful tournaments', icon: Users, date: '2024-01-10' },
  ];

  return (
    <div className="flex flex-col items-center justify-start p-8 overflow-x-hidden">
      {/* Hero Section */}
      <Card className="w-full max-w-[72rem] bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-xl border border-white/10 rounded-xl overflow-hidden mb-8">
        <CardBody className="p-0">
          {/* Banner */}
          <div className="relative h-48 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
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
                <Typography variant="h3" className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  {user?.username}
                </Typography>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-2">
                  <Chip size="sm" value="Pro Player" className="bg-blue-500/20 text-blue-400 border border-blue-500/20" />
                  <Chip size="sm" value="Tournament Organizer" className="bg-purple-500/20 text-purple-400 border border-purple-500/20" />
                </div>
              </div>
              {isStartGGConnected && (
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  onClick={() => window.open(startggProfile?.url, '_blank')}
                >
                  View Start.gg Profile
                </Button>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Stats Grid */}
      <div className="w-full max-w-[72rem] grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-gray-800/50 border border-white/10">
            <CardBody className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-gray-900/50">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <Typography variant="h4" className="font-bold text-white">
                    {stat.value}
                  </Typography>
                  <Typography className="text-gray-400 text-sm">
                    {stat.label}
                  </Typography>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="w-full max-w-[72rem] grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <Card className="bg-gray-800/50 border border-white/10">
            <CardBody>
              <Typography variant="h5" className="mb-4 text-white flex items-center gap-2">
                <User className="w-5 h-5 text-blue-400" />
                About
              </Typography>
              <Typography className="text-gray-300">
                {user?.bio || "Professional gamer and tournament organizer. Passionate about competitive gaming and community building."}
              </Typography>
              
              {/* Progress Bars */}
              <div className="mt-6 space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <Typography className="text-sm text-gray-400">Tournament Experience</Typography>
                    <Typography className="text-sm text-gray-400">Level 8</Typography>
                  </div>
                  <Progress value={80} size="sm" className="bg-gray-700" color="blue" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <Typography className="text-sm text-gray-400">Organization Skills</Typography>
                    <Typography className="text-sm text-gray-400">Level 6</Typography>
                  </div>
                  <Progress value={60} size="sm" className="bg-gray-700" color="purple" />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Achievements Section */}
          <Card className="bg-gray-800/50 border border-white/10">
            <CardBody>
              <Typography variant="h5" className="mb-4 text-white flex items-center gap-2">
                <Medal className="w-5 h-5 text-yellow-400" />
                Recent Achievements
              </Typography>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-gray-900/50 rounded-lg">
                    <div className="p-2 rounded-lg bg-gray-800">
                      <achievement.icon className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <Typography className="font-semibold text-white">
                        {achievement.name}
                      </Typography>
                      <Typography className="text-sm text-gray-400">
                        {achievement.description}
                      </Typography>
                      <Typography className="text-xs text-gray-500 mt-1">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {new Date(achievement.date).toLocaleDateString()}
                      </Typography>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Account Info Card */}
          <Card className="bg-gray-800/50 border border-white/10">
            <CardBody>
              <Typography variant="h5" className="mb-4 text-white">Account Details</Typography>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <Typography className="text-gray-300">{user?.email}</Typography>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  <Typography className="text-gray-300">
                    Joined {new Date(user?.createdAt).toLocaleDateString()}
                  </Typography>
                </div>
              </div>
              
              <Button
                className="w-full mt-6 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
                onClick={() => dispatch(logoutUser())}
              >
                Logout
              </Button>
            </CardBody>
          </Card>

          {/* Start.gg Integration Status */}
          <Card className="bg-gray-800/50 border border-white/10">
            <CardBody>
              <div className="flex items-center justify-between mb-4">
                <Typography variant="h5" className="text-white">Start.gg Integration</Typography>
                <div className={`h-3 w-3 rounded-full ${isStartGGConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              </div>
              
              {isStartGGConnected ? (
                <Button
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white border border-white/10"
                  onClick={() => dispatch(disconnectStartGG())}
                >
                  Disconnect Start.gg
                </Button>
              ) : (
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  onClick={() => window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/startgg`}
                >
                  Connect with Start.gg
                </Button>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;

