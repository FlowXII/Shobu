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
} from "@material-tailwind/react";
import {
  User,
  Mail,
  Trophy,
  MapPin,
  Globe,
  ChevronDown,
} from "lucide-react";
import { logoutUser, disconnectStartGG } from '../store/thunks/userThunks';

const CUSTOM_ANIMATION = {
  mount: { scale: 1 },
  unmount: { scale: 0.9 },
};

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [open, setOpen] = useState(1);
  const isStartGGConnected = user?.startgg?.accessToken;
  const startggProfile = user?.startgg?.profile;
  const startggPlayer = user?.startgg?.player;

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  return (
    <div className="flex flex-col items-center justify-start p-8 overflow-x-hidden">
      {/* Header Card */}
      <Card className="w-full max-w-[64rem] bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-xl border border-white/10 rounded-lg overflow-hidden mb-8">
        <CardBody className="p-8">
          <div className="relative pb-6">
            <div className="h-32 w-full rounded-lg overflow-hidden mb-4">
              <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500" />
            </div>
            <div className="flex flex-col items-center">
              <Avatar
                src={user?.avatar || 'https://via.placeholder.com/100'}
                alt={user?.username}
                size="xxl"
                className="border-4 border-gray-900 shadow-lg rounded-xl mb-4"
              />
              <Typography variant="h3" className="text-center text-blue-500 font-bold">
                {user?.username}
              </Typography>
              <Typography className="text-center text-gray-400 mt-2">
                {user?.role}
              </Typography>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="w-full max-w-[64rem] space-y-6">
        {/* Basic Info Accordion */}
        <Accordion 
          open={open === 1}
          animate={CUSTOM_ANIMATION}
          className="border border-white/10 rounded-lg"
        >
          <AccordionHeader
            onClick={() => handleOpen(1)}
            className="border-b-0 transition-colors text-white hover:!text-blue-500 p-6 flex justify-between items-center"
          >
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              <Typography variant="h6">Account Information</Typography>
            </div>
            <ChevronDown
              className={`h-5 w-5 transition-transform ${open === 1 ? "rotate-180" : ""} ml-auto`}
            />
          </AccordionHeader>
          <AccordionBody className="px-8 pb-8 pt-2">
            <div className="space-y-4">
              <div className="flex items-center bg-gray-800/50 rounded-lg p-4">
                <Mail className="mr-3 h-5 w-5 text-blue-400" />
                <Typography>{user.email}</Typography>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <Typography className="text-gray-400 text-sm mb-1">Created</Typography>
                  <Typography>{new Date(user.createdAt).toLocaleString()}</Typography>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <Typography className="text-gray-400 text-sm mb-1">Last Updated</Typography>
                  <Typography>{new Date(user.updatedAt).toLocaleString()}</Typography>
                </div>
              </div>
            </div>
          </AccordionBody>
        </Accordion>

        {/* Start.gg Integration Accordion */}
        <Accordion 
          open={open === 2}
          animate={CUSTOM_ANIMATION}
          className="border border-white/10 rounded-lg"
        >
          <AccordionHeader
            onClick={() => handleOpen(2)}
            className="border-b-0 transition-colors text-white hover:!text-blue-500 p-6 flex justify-between items-center"
          >
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-blue-500" />
              <Typography variant="h6">Start.gg Integration</Typography>
              <div className={`h-2.5 w-2.5 rounded-full ${isStartGGConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            </div>
            <ChevronDown
              className={`h-5 w-5 transition-transform ${open === 2 ? "rotate-180" : ""} ml-auto`}
            />
          </AccordionHeader>
          <AccordionBody className="px-8 pb-8 pt-2">
            {isStartGGConnected ? (
              <div className="space-y-6">
                {/* Profile Banner and Info */}
                <div className="relative rounded-lg overflow-hidden">
                  <div className="h-32 w-full">
                    {startggProfile?.images?.find(img => img.type === 'banner') ? (
                      <img
                        src={startggProfile.images.find(img => img.type === 'banner').url}
                        alt="Profile Banner"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500" />
                    )}
                  </div>
                  <div className="absolute -bottom-6 left-4">
                    <Avatar
                      src={startggProfile?.images?.find(img => img.type === 'profile')?.url || 'https://via.placeholder.com/100'}
                      alt={startggPlayer?.gamerTag}
                      size="xxl"
                      className="border-4 border-gray-900 shadow-lg rounded-xl"
                    />
                  </div>
                </div>

                {/* Start.gg Info Cards */}
                <div className="pt-8 space-y-4">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-5 w-5 text-blue-400" />
                      <Typography variant="h6">{startggPlayer?.gamerTag}</Typography>
                    </div>
                    {startggPlayer?.prefix && (
                      <Typography className="text-gray-400">
                        Team: {startggPlayer.prefix}
                      </Typography>
                    )}
                  </div>

                  {startggProfile?.location && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {startggProfile.location.city && (
                        <div className="bg-gray-800/50 rounded-lg p-4 flex items-center">
                          <MapPin className="w-5 h-5 mr-3 text-blue-400" />
                          <Typography>{startggProfile.location.city}</Typography>
                        </div>
                      )}
                      {startggProfile.location.country && (
                        <div className="bg-gray-800/50 rounded-lg p-4 flex items-center">
                          <Globe className="w-5 h-5 mr-3 text-blue-400" />
                          <Typography>{startggProfile.location.country}</Typography>
                        </div>
                      )}
                    </div>
                  )}

                  {startggProfile?.bio && (
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <Typography className="text-gray-300">{startggProfile.bio}</Typography>
                    </div>
                  )}

                  <Button
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white shadow-lg border border-white/10"
                    onClick={() => dispatch(disconnectStartGG())}
                  >
                    Disconnect Start.gg
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center p-4">
                <Button
                  className="w-full bg-blue-500 hover:bg-blue-600"
                  onClick={() => window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/startgg`}
                >
                  Connect with Start.gg
                </Button>
                <Typography className="text-sm text-gray-400 mt-2">
                  Connect your Start.gg account to access tournament features
                </Typography>
              </div>
            )}
          </AccordionBody>
        </Accordion>

        {/* Logout Section */}
        <Button
          className="w-full bg-red-500 hover:bg-red-600 mt-4"
          onClick={() => dispatch(logoutUser())}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Profile;

