import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardBody,
  Typography,
  Avatar,
  Spinner,
} from "@material-tailwind/react";
import { MapPin, Globe, User } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/user');
        if (!response.ok) {
          throw new Error('Not authenticated');
        }
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner className="h-12 w-12" color="blue" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Typography variant="h4" color="blue-gray">
          No user data available
        </Typography>
      </div>
    );
  }

  return (
    <Card className="w-full bg-gradient-to-br from-gray-900 to-blue-950 text-white shadow-xl overflow-hidden border border-white border-opacity-20 rounded-lg">
      <CardBody>
        <div className="relative pb-6">
          {user?.images?.[0]?.url ? (
            <div 
              className="absolute top-0 left-0 w-full h-24 bg-cover bg-center"
              style={{ backgroundImage: `url(${user.images[0].url})` }}
            >
              <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>
          ) : (
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          )}
          <div className="relative flex justify-center">
            <Avatar
              src={user?.images?.[1]?.url || 'https://via.placeholder.com/100'}
              alt={user?.name || 'User'}
              size="xxl"
              className="border-4 border-white shadow-lg"
            />
          </div>
        </div>
        <Typography variant="h4" className="mb-2 text-center font-bold">
          {user?.name || 'Anonymous User'}
        </Typography>
        {user?.player?.gamerTag && (
          <Typography className="text-center text-blue-300 mb-4">
            {user.player.prefix && <span>{user.player.prefix} | </span>}
            {user.player.gamerTag}
          </Typography>
        )}
        <div className="space-y-3">
          {user?.genderPronoun && (
            <div className="flex items-center bg-gray-800 rounded-lg p-2">
              <User className="mr-3 h-5 w-5 text-purple-400" />
              <Typography className="text-sm">Pronouns: {user.genderPronoun}</Typography>
            </div>
          )}
          {user?.location && (
            <div className="flex items-center bg-gray-800 rounded-lg p-2">
              <MapPin className="mr-3 h-5 w-5 text-red-400" />
              <Typography className="text-sm">
                {[user.location.city, user.location.state, user.location.country].filter(Boolean).join(', ')}
              </Typography>
            </div>
          )}
          {user?.bio && (
            <div className="bg-gray-800 rounded-lg p-2">
              <Typography className="text-sm">{user.bio}</Typography>
            </div>
          )}
          {user?.slug && (
            <div className="flex items-center bg-gray-800 rounded-lg p-2">
              <Globe className="mr-3 h-5 w-5 text-blue-400" />
              <Typography className="text-sm">
                <a 
                  href={`https://start.gg/${user.slug}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-300 hover:text-blue-100"
                >
                  start.gg Profile
                </a>
              </Typography>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default Profile;
