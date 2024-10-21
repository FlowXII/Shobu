import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, IconButton } from "@material-tailwind/react";
import {
  Home,
  LayoutDashboard,
  Trophy,
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
} from 'lucide-react';
import { useSidebar } from '../contexts/SidebarContext';

const Sidebar = () => {
  const { isOpen, toggleSidebar } = useSidebar();

  const sidebarItems = [
    { name: 'Home', icon: Home, color: 'text-red-400', hoverColor: 'hover:bg-red-800/30', path: '/' },
    { name: 'Dashboard', icon: LayoutDashboard, color: 'text-red-400', hoverColor: 'hover:bg-red-800/30', path: '/dashboard' },
    { name: 'Tournaments', icon: Trophy, color: 'text-red-400', hoverColor: 'hover:bg-red-800/30', path: '/upcoming' },
    { name: 'Statistics', icon: BarChart2, color: 'text-red-400', hoverColor: 'hover:bg-red-800/30', path: '/statistics' },
    { name: 'Stations', icon: Presentation, color: 'text-red-400', hoverColor: 'hover:bg-red-800/30', path: '/station-viewer' },
    { name: 'Timeline', icon: Newspaper, color: 'text-blue-400', hoverColor: 'hover:bg-blue-800/30' },
    { name: 'Spaces', icon: Users, color: 'text-blue-400', hoverColor: 'hover:bg-blue-800/30' },
    { name: 'Messages', icon: MessageSquare, color: 'text-blue-400', hoverColor: 'hover:bg-blue-800/30' },
    { name: 'Streams', icon: Tv, color: 'text-purple-400', hoverColor: 'hover:bg-purple-800/30' },
    { name: 'Your Profile', icon: User, color: 'text-yellow-400', hoverColor: 'hover:bg-yellow-800/30' },
    { name: 'StartGG Login', icon: LogIn, color: 'text-yellow-400', hoverColor: 'hover:bg-yellow-800/30', path: '/login' },
    { name: 'Register', icon: UserPlus, color: 'text-yellow-400', hoverColor: 'hover:bg-yellow-800/30', path: '/register' },
  ];

  const renderSidebarItems = (items) => (
    items.map((item, index) => (
      <Link
        key={index}
        to={item.path}
        className={`flex items-center w-full px-3 py-3 mt-1 cursor-pointer ${item.hoverColor} rounded-md transition-all duration-300 hover:scale-105 bg-gray-900/50 border border-white/10`}
      >
        <item.icon size={isOpen ? 24 : 20} className={`${item.color} transition-all duration-300`} />
        {isOpen && (
          <Typography
            variant="small"
            className="ml-3 font-medium transition-opacity duration-300"
          >
            {item.name}
          </Typography>
        )}
      </Link>
    ))
  );

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-gray-950 text-white shadow-xl ${
        isOpen ? 'w-56' : 'w-16'
      } transition-all duration-300 ease-in-out z-50 flex flex-col`}
    >
      <div className="p-2">
        <IconButton
          color="white"
          variant="text"
          size="lg"
          onClick={toggleSidebar}
          className="w-full justify-center hover:bg-gray-700/50 transition-all duration-300 hover:scale-105 bg-white/5 border border-white/10 rounded-md"
        >
          {isOpen ? (
            <ChevronLeft size={28} className="text-white" />
          ) : (
            <ChevronRight size={28} className="text-white" />
          )}
        </IconButton>
      </div>
      <div className="flex-grow flex flex-col py-4 px-2">
        <div className="space-y-4">
          {renderSidebarItems(sidebarItems)}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
