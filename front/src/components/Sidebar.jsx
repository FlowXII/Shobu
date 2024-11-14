import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Typography, IconButton } from "@material-tailwind/react";
import {
  Home,
  LayoutDashboard,
  Trophy,
  PlusCircle,
  BarChart2,
  Presentation,
  Newspaper,
  Users,
  MessageSquare,
  Tv,
  User,
  LogIn,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { useSidebar } from '../contexts/SidebarContext';

const Sidebar = () => {
  const { isOpen, toggleSidebar } = useSidebar();
  const location = useLocation();

  const sidebarItems = [
    { name: 'Home', icon: Home, color: 'text-red-400', hoverColor: 'hover:bg-red-800/30', path: '/' },
    { name: 'Dashboard', icon: LayoutDashboard, color: 'text-red-400', hoverColor: 'hover:bg-red-800/30', path: '/dashboard' },
    { name: 'Tournaments', icon: Trophy, color: 'text-red-400', hoverColor: 'hover:bg-red-800/30', path: '/upcoming' },
    { name: 'Create Tournament', icon: PlusCircle, color: 'text-red-400', hoverColor: 'hover:bg-red-800/30', path: '/tournaments/create' },
    { name: 'Statistics', icon: BarChart2, color: 'text-red-400', hoverColor: 'hover:bg-red-800/30', path: '/statistics' },
    { name: 'Stations', icon: Presentation, color: 'text-red-400', hoverColor: 'hover:bg-red-800/30', path: '/station-viewer' },
    { name: 'Feed', icon: Newspaper, color: 'text-blue-400', hoverColor: 'hover:bg-blue-800/30', path: '/feed' },
    { name: 'Spaces', icon: Users, color: 'text-blue-400', hoverColor: 'hover:bg-blue-800/30', path: '/spaces' },
    { name: 'Messages', icon: MessageSquare, color: 'text-blue-400', hoverColor: 'hover:bg-blue-800/30', path: '/messages' },
    { name: 'Streams', icon: Tv, color: 'text-purple-400', hoverColor: 'hover:bg-purple-800/30', path: '/streams' },
    { name: 'Your Profile', icon: User, color: 'text-yellow-400', hoverColor: 'hover:bg-yellow-800/30' , path: '/profile' },
    { name: 'Login', icon: LogIn, color: 'text-yellow-400', hoverColor: 'hover:bg-yellow-800/30', path: '/login' },
    { name: 'Register', icon: UserPlus, color: 'text-yellow-400', hoverColor: 'hover:bg-yellow-800/30', path: '/register' },
  ];

  const renderSidebarItems = (items) => (
    items.map((item, index) => {
      const isActive = location.pathname === item.path;
      return (
        <Link
          key={index}
          to={item.path}
          className={`
            flex items-center w-full px-4 py-3 mt-2 cursor-pointer
            ${item.hoverColor} rounded-lg transition-all duration-300
            ${isActive ? 'bg-gray-800/60 shadow-md' : 'bg-transparent'}
            hover:bg-gray-800/40 border border-white/5
          `}
        >
          <item.icon 
            size={24} 
            className={`${item.color} transition-all duration-300 ${isActive ? 'scale-110' : ''}`} 
          />
          {isOpen && (
            <Typography
              variant="small"
              className={`
                ml-3 font-medium transition-all duration-300
                ${isActive ? 'text-white' : 'text-gray-400'}
              `}
            >
              {item.name}
            </Typography>
          )}
        </Link>
      );
    })
  );

  return (
    <div
      className={`
        fixed top-0 left-0 h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950
        text-white shadow-2xl ${isOpen ? 'w-64' : 'w-20'}
        transition-all duration-300 ease-in-out z-50 flex flex-col
      `}
    >
      <div className="p-4">
        <IconButton
          color="white"
          variant="text"
          size="lg"
          onClick={toggleSidebar}
          className="w-full justify-center hover:bg-gray-800/40 transition-all duration-300
                     hover:scale-105 bg-white/5 border border-white/10 rounded-lg"
        >
          {isOpen ? (
            <ChevronLeft size={28} className="text-white" />
          ) : (
            <ChevronRight size={28} className="text-white" />
          )}
        </IconButton>
      </div>
      <div className="flex-grow flex flex-col py-6 px-4 space-y-2">
        {renderSidebarItems(sidebarItems)}
      </div>
    </div>
  );
};

export default Sidebar;
