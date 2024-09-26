import React, { useState } from 'react';
import { Typography } from "@material-tailwind/react";
import { Home, Trophy, LogIn, UserPlus, Menu, LayoutDashboard, User, MessageSquare, Tv, BarChart2, Users, Newspaper } from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const sidebarSocialItems = [
    { name: 'Spaces', icon: Users, color: 'text-blue-400', hoverColor: 'hover:bg-blue-800' },
    { name: 'Messages', icon: MessageSquare, color: 'text-blue-400', hoverColor: 'hover:bg-blue-800' },
    { name: 'Timeline', icon: Newspaper, color: 'text-blue-400', hoverColor: 'hover:bg-blue-800' },
  ];

  const sidebarEssentialItems = [
    { name: 'Home', icon: Home, color: 'text-red-400', hoverColor: 'hover:bg-red-800' },
    { name: 'Dashboard', icon: LayoutDashboard, color: 'text-red-400', hoverColor: 'hover:bg-red-800' },
    { name: 'Tournaments', icon: Trophy, color: 'text-red-400', hoverColor: 'hover:bg-red-800' },
    { name: 'Statistics', icon: BarChart2, color: 'text-red-400', hoverColor: 'hover:bg-red-800' },
  ];

  const sidebarStreamsItems = [
    { name: 'Streams', icon: Tv, color: 'text-purple-400', hoverColor: 'hover:bg-purple-800' }
  ];

  const sidebarUserItems = [
    { name: 'Your Profile', icon: User, color: 'text-yellow-400', hoverColor: 'hover:bg-yellow-800' },
    { name: 'Login', icon: LogIn, color: 'text-yellow-400', hoverColor: 'hover:bg-yellow-800' },
    { name: 'Register', icon: UserPlus, color: 'text-yellow-400', hoverColor: 'hover:bg-yellow-800' }
  ];

  const renderSidebarItems = (items) => (
    items.map((item, index) => (
      <div
        key={index}
        className={`flex items-center px-4 py-3 mb-2 cursor-pointer ${item.hoverColor} rounded-md transition-colors`}
      >
        <item.icon size={24} className={`mr-4 ${item.color}`} />
        <Typography
          variant="small"
          className={`font-medium ${
            isOpen ? 'opacity-100' : 'opacity-0 lg:opacity-100'
          } transition-opacity duration-300`}
        >
          {item.name}
        </Typography>
      </div>
    ))
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden bg-purple-600 text-white p-2 rounded-md shadow-md"
        onClick={toggleSidebar}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-950 text-white shadow-xl ${
          isOpen ? 'w-56' : 'w-16'
        } lg:w-56 transition-all duration-300 ease-in-out z-40`}
      >
        <div className="flex flex-col h-full py-8 px-4 mt-5 space-y-4">
          <div>{renderSidebarItems(sidebarEssentialItems)}</div>
          <hr className="border-gray-700 my-2" />
          <div>{renderSidebarItems(sidebarSocialItems)}</div>
          <hr className="border-gray-700 my-2" />
          <div>{renderSidebarItems(sidebarStreamsItems)}</div>
          <hr className="border-gray-700 my-2" />
          <div>{renderSidebarItems(sidebarUserItems)}</div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
