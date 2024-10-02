import React, { useState } from 'react';
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
  Menu,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const sidebarItems = [
    { name: 'Home', icon: Home, color: 'text-red-400', hoverColor: 'hover:bg-red-800', path: '/' },
    { name: 'Dashboard', icon: LayoutDashboard, color: 'text-red-400', hoverColor: 'hover:bg-red-800', path: '/dashboard' },
    { name: 'Tournaments', icon: Trophy, color: 'text-red-400', hoverColor: 'hover:bg-red-800', path: '/upcoming' },
    { name: 'Statistics', icon: BarChart2, color: 'text-red-400', hoverColor: 'hover:bg-red-800', path: '/statistics' },
    { name: 'Stations', icon: Presentation, color: 'text-red-400', hoverColor: 'hover:bg-red-800', path: '/station-viewer' },
    { name: 'Timeline', icon: Newspaper, color: 'text-blue-400', hoverColor: 'hover:bg-blue-800' },
    { name: 'Spaces', icon: Users, color: 'text-blue-400', hoverColor: 'hover:bg-blue-800' },
    { name: 'Messages', icon: MessageSquare, color: 'text-blue-400', hoverColor: 'hover:bg-blue-800' },
    { name: 'Streams', icon: Tv, color: 'text-purple-400', hoverColor: 'hover:bg-purple-800' },
    { name: 'Your Profile', icon: User, color: 'text-yellow-400', hoverColor: 'hover:bg-yellow-800' },
    { name: 'Login', icon: LogIn, color: 'text-yellow-400', hoverColor: 'hover:bg-yellow-800' },
    { name: 'Register', icon: UserPlus, color: 'text-yellow-400', hoverColor: 'hover:bg-yellow-800' },
  ];

  const renderSidebarItems = (items) => (
    items.map((item, index) => (
      <Link
        key={index}
        to={item.path}
        className={`flex items-center px-3 py-2 mb-2 cursor-pointer ${item.hoverColor} rounded-md transition-colors`}
      >
        <item.icon size={24} className={`mr-2 ${item.color}`} />
        {isOpen && (
          <Typography
            variant="small"
            className="font-medium transition-opacity duration-300"
          >
            {item.name}
          </Typography>
        )}
      </Link>
    ))
  );

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-950 text-white shadow-xl ${
        isOpen ? 'w-56' : 'w-16'
      } transition-all duration-300 ease-in-out z-40`}
    >
      <div className="flex flex-col h-full py-8 px-2 mt-5 space-y-4">
        <div className="flex justify-end mb-4">
          <IconButton
            color="gray"
            variant="text"
            size="sm"
            onClick={toggleSidebar}
          >
            {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
          </IconButton>
        </div>
        {renderSidebarItems(sidebarItems)}
      </div>
    </div>
  );
};

export default Sidebar;