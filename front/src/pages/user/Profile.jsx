import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
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
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
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
  Twitter,
  Twitch,
  Settings,
} from "lucide-react";
import { logoutUser, disconnectStartGG } from '../../store/thunks/userThunks';
import LoadingIndicator from '../../components/layout/LoadingIndicator';
import { useProfile } from '../../hooks/useProfile';

const CUSTOM_ANIMATION = {
  mount: { scale: 1 },
  unmount: { scale: 0.9 },
};

const TournamentCard = ({ tournament, type, userId }) => (
  <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition-colors cursor-pointer">
    <div>
      <Typography className="text-gray-200">{tournament.name}</Typography>
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Calendar className="w-4 h-4" />
        {new Date(tournament.startAt).toLocaleDateString()}
      </div>
    </div>
    <div className="flex items-center gap-2">
      {type === 'participating' && tournament.attendees?.find(a => 
        a.userId === userId && a.placement
      )?.placement && (
        <Chip 
          size="sm" 
          value={`#${tournament.attendees.find(a => 
            a.userId === userId
          ).placement}`}
          className="bg-purple-500/20 text-purple-400 border border-purple-500/20"
        />
      )}
      <Chip 
        size="sm" 
        value={tournament.status} 
        className={`${
          tournament.status === 'COMPLETED' 
            ? 'bg-green-500/20 text-green-400 border border-green-500/20'
            : tournament.status === 'IN_PROGRESS'
            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20'
            : 'bg-blue-500/20 text-blue-400 border border-blue-500/20'
        }`}
      />
    </div>
  </div>
);

const TournamentHistory = ({ tournaments, loading, userId }) => {
  if (loading) {
    return <LoadingIndicator />;
  }

  const organizing = tournaments?.organizing || [];
  const participating = tournaments?.participating || [];
  const hasNoTournaments = organizing.length === 0 && participating.length === 0;

  if (hasNoTournaments) {
    return (
      <div className="text-center py-8">
        <Typography className="text-gray-400">
          No tournament history yet
        </Typography>
      </div>
    );
  }

  const sortByDate = (a, b) => new Date(b.startAt) - new Date(a.startAt);

  return (
    <div className="space-y-8">
      {organizing.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-blue-400" />
            <Typography variant="h6" className="text-gray-300">
              Organizing ({organizing.length})
            </Typography>
          </div>
          <div className="space-y-3">
            {organizing.sort(sortByDate).map(tournament => (
              <TournamentCard 
                key={tournament._id}
                tournament={tournament}
                type="organizing"
                userId={userId}
              />
            ))}
          </div>
        </div>
      )}

      {participating.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Medal className="w-5 h-5 text-purple-400" />
            <Typography variant="h6" className="text-gray-300">
              Participating ({participating.length})
            </Typography>
          </div>
          <div className="space-y-3">
            {participating.sort(sortByDate).map(tournament => (
              <TournamentCard 
                key={tournament._id}
                tournament={tournament}
                type="participating"
                userId={userId}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Profile = () => {
  const dispatch = useDispatch();
  const { username } = useParams();
  const currentUser = useSelector((state) => state.user.user);
  
  // Use the current user's username if no username parameter is provided
  const targetUsername = username || currentUser?.username;
  
  const { loading, error, profileData, updateProfile } = useProfile(targetUsername);
  const [open, setOpen] = useState(0);
  const [activeTab, setActiveTab] = useState('about');
  const [editForm, setEditForm] = useState({
    bio: '',
    avatar: '',
    banner: '',
    location: {
      city: '',
      country: ''
    },
    socialLinks: {
      twitter: '',
      discord: '',
      twitch: ''
    }
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Initialize edit form when profile data loads
  useEffect(() => {
    if (profileData) {
      setEditForm({
        bio: profileData.bio || '',
        avatar: profileData.avatar || '',
        banner: profileData.banner || '',
        location: {
          city: profileData.location?.city || '',
          country: profileData.location?.country || ''
        },
        socialLinks: {
          twitter: profileData.socialLinks?.twitter || '',
          discord: profileData.socialLinks?.discord || '',
          twitch: profileData.socialLinks?.twitch || ''
        }
      });
    }
  }, [profileData]);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setIsEditDialogOpen(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const updatedProfile = await updateProfile(editForm);
    if (updatedProfile) {
      setIsEditDialogOpen(false);
    }
  };

  const handleInputChange = (e, section, field) => {
    if (section) {
      setEditForm(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: e.target.value
        }
      }));
    } else {
      setEditForm(prev => ({
        ...prev,
        [e.target.name]: e.target.value
      }));
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!profileData) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Typography className="text-gray-400">
          User not found
        </Typography>
      </div>
    );
  }

  const isStartGGConnected = profileData?.startgg?.connected;
  const startggProfile = profileData?.startgg?.profile;
  const startggPlayer = profileData?.startgg?.player;

  // Check if this is the current user's profile
  const isOwnProfile = currentUser?.username === profileData?.username;

  return (
    <div className="flex flex-col items-center justify-start p-8 overflow-x-hidden">
      {/* Banner Image */}
      <div className="w-full max-w-[72rem] h-48 md:h-64 relative overflow-hidden rounded-t-xl">
        <img
          src={profileData?.banner || 'https://via.placeholder.com/1500x500'}
          alt="Profile Banner"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Profile Info Card */}
      <Card className="w-full max-w-[72rem] bg-gray-800/50 border border-white/10 -mt-8">
        <CardBody>
          <div className="px-8 pb-8 relative">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              <Avatar
                src={profileData?.avatar || "https://via.placeholder.com/150"}
                alt="profile-picture"
                className="w-32 h-32 border-4 border-gray-900 shadow-xl rounded-xl -mt-16"
              />
              <div className="flex-grow text-center md:text-left">
                <Typography variant="h3" className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  {profileData?.username}
                </Typography>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-2">
                  <Chip size="sm" value="Pro Player" className="bg-blue-500/20 text-blue-400 border border-blue-500/20" />
                  <Chip size="sm" value="Tournament Organizer" className="bg-purple-500/20 text-purple-400 border border-purple-500/20" />
                </div>
              </div>
              {isOwnProfile && (
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Main Content Grid */}
      <div className="w-full max-w-[72rem] grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <Card className="bg-gray-800/50 border border-white/10">
            <CardBody>
              {/* Tab Navigation */}
              <div className="flex items-center gap-4 mb-6 border-b border-white/10">
                <button
                  type="button"
                  onClick={() => handleTabChange('about')}
                  className={`pb-2 px-1 ${activeTab === 'about' 
                    ? 'text-blue-400 border-b-2 border-blue-400' 
                    : 'text-gray-400'}`}
                >
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    About
                  </div>
                </button>
                {isOwnProfile && (
                  <button
                    type="button"
                    onClick={() => handleTabChange('edit')}
                    className={`pb-2 px-1 ${activeTab === 'edit' 
                      ? 'text-blue-400 border-b-2 border-blue-400' 
                      : 'text-gray-400'}`}
                  >
                    <div className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Edit Profile
                    </div>
                  </button>
                )}
              </div>

              {/* About Tab Content */}
              {activeTab === 'about' && (
                <>
                  <Typography className="text-gray-300">
                    {profileData?.bio || "No bio yet"}
                  </Typography>
                  
                  {profileData?.location?.city && profileData?.location?.country && (
                    <div className="flex items-center gap-2 mt-4">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <Typography className="text-gray-300">
                        {`${profileData.location.city}, ${profileData.location.country}`}
                      </Typography>
                    </div>
                  )}

                  {(profileData?.socialLinks?.twitter || 
                    profileData?.socialLinks?.discord || 
                    profileData?.socialLinks?.twitch) && (
                    <div className="flex gap-4 mt-4">
                      {profileData.socialLinks.twitter && (
                        <a href={`https://twitter.com/${profileData.socialLinks.twitter}`} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-gray-400 hover:text-blue-400">
                          <Twitter className="w-5 h-5" />
                        </a>
                      )}
                      {profileData.socialLinks.discord && (
                        <Typography className="text-gray-400">
                          Discord: {profileData.socialLinks.discord}
                        </Typography>
                      )}
                      {profileData.socialLinks.twitch && (
                        <a href={`https://twitch.tv/${profileData.socialLinks.twitch}`} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-gray-400 hover:text-purple-400">
                          <Twitch className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Edit Tab Content */}
              {activeTab === 'edit' && isOwnProfile && (
                <form onSubmit={handleEditSubmit} className="space-y-6">
                  <div>
                    <Typography variant="small" className="mb-2 text-gray-200">Bio</Typography>
                    <Textarea
                      name="bio"
                      value={editForm.bio}
                      onChange={(e) => handleInputChange(e)}
                      className="!border-white/20 focus:!border-white/40 text-gray-200"
                      variant="outlined"
                    />
                  </div>

                  <div>
                    <Typography variant="small" className="mb-2 text-gray-200">Avatar URL</Typography>
                    <Input
                      name="avatar"
                      value={editForm.avatar}
                      onChange={(e) => handleInputChange(e)}
                      className="!border-white/20 focus:!border-white/40 text-gray-200"
                      variant="outlined"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Typography variant="small" className="mb-2 text-gray-200">City</Typography>
                      <Input
                        value={editForm.location.city}
                        onChange={(e) => handleInputChange(e, 'location', 'city')}
                        className="!border-white/20 focus:!border-white/40 text-gray-200"
                        variant="outlined"
                      />
                    </div>
                    <div>
                      <Typography variant="small" className="mb-2 text-gray-200">Country</Typography>
                      <Input
                        value={editForm.location.country}
                        onChange={(e) => handleInputChange(e, 'location', 'country')}
                        className="!border-white/20 focus:!border-white/40 text-gray-200"
                        variant="outlined"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Typography variant="small" className="text-gray-200">Social Links</Typography>
                    <Input
                      label="Twitter"
                      value={editForm.socialLinks.twitter}
                      onChange={(e) => handleInputChange(e, 'socialLinks', 'twitter')}
                      className="!border-white/20 focus:!border-white/40 text-gray-200"
                      variant="outlined"
                    />
                    <Input
                      label="Discord"
                      value={editForm.socialLinks.discord}
                      onChange={(e) => handleInputChange(e, 'socialLinks', 'discord')}
                      className="!border-white/20 focus:!border-white/40 text-gray-200"
                      variant="outlined"
                    />
                    <Input
                      label="Twitch"
                      value={editForm.socialLinks.twitch}
                      onChange={(e) => handleInputChange(e, 'socialLinks', 'twitch')}
                      className="!border-white/20 focus:!border-white/40 text-gray-200"
                      variant="outlined"
                    />
                  </div>

                  <div>
                    <Typography variant="small" className="mb-2 text-gray-200">Banner URL</Typography>
                    <Input
                      name="banner"
                      value={editForm.banner}
                      onChange={(e) => handleInputChange(e)}
                      className="!border-white/20 focus:!border-white/40 text-gray-200"
                      variant="outlined"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    Save Changes
                  </Button>
                </form>
              )}
            </CardBody>
          </Card>

          {/* Tournament History Section */}
          <Card className="bg-gray-800/50 border border-white/10">
            <CardBody>
              <div className="flex items-center justify-between mb-6">
                <Typography variant="h5" className="text-white">
                  Tournament History
                </Typography>
                <div className="flex items-center gap-2">
                  <Chip
                    size="sm"
                    value={`${profileData?.tournaments?.organizing?.length || 0} Organized`}
                    className="bg-blue-500/20 text-blue-400"
                  />
                  <Chip
                    size="sm"
                    value={`${profileData?.tournaments?.participating?.length || 0} Participated`}
                    className="bg-purple-500/20 text-purple-400"
                  />
                </div>
              </div>
              <TournamentHistory 
                tournaments={profileData?.tournaments}
                loading={loading}
                userId={profileData?._id}
              />
            </CardBody>
          </Card>

          {/* Tournament Stats Section */}
          <Card className="bg-gray-800/50 border border-white/10 mt-8">
            <CardBody>
              <Typography variant="h5" className="mb-4 text-white">Tournament Statistics</Typography>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Stats Overview */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Trophy className="w-5 h-5 text-blue-400" />
                      <Typography className="text-gray-300">Tournaments Organized</Typography>
                    </div>
                    <Typography className="text-blue-400 font-bold">
                      {profileData?.statsCache?.tournamentsOrganized || 0}
                    </Typography>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Medal className="w-5 h-5 text-purple-400" />
                      <Typography className="text-gray-300">Tournaments Participated</Typography>
                    </div>
                    <Typography className="text-purple-400 font-bold">
                      {profileData?.statsCache?.tournamentsParticipated || 0}
                    </Typography>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-green-400" />
                      <Typography className="text-gray-300">Win Rate</Typography>
                    </div>
                    <Typography className="text-green-400 font-bold">
                      {profileData?.statsCache?.totalMatches 
                        ? Math.round((profileData.statsCache.totalWins / profileData.statsCache.totalMatches) * 100)
                        : 0}%
                    </Typography>
                  </div>
                </div>

                {/* Recent Results */}
                <div className="space-y-4">
                  <Typography variant="h6" className="text-gray-300">Recent Results</Typography>
                  {profileData?.statsCache?.recentResults?.length > 0 ? (
                    profileData.statsCache.recentResults.map((result, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                        <Typography className="text-gray-300">
                          {new Date(result.date).toLocaleDateString()}
                        </Typography>
                        <Chip 
                          size="sm" 
                          value={`#${result.placement}`}
                          className="bg-blue-500/20 text-blue-400 border border-blue-500/20"
                        />
                      </div>
                    ))
                  ) : (
                    <Typography className="text-gray-400">
                      No recent tournament results
                    </Typography>
                  )}
                </div>
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
                  <Typography className="text-gray-300">{profileData?.email}</Typography>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  <Typography className="text-gray-300">
                    Joined {new Date(profileData?.createdAt).toLocaleDateString()}
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

