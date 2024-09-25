import React, { useState } from 'react';
import { Typography } from "@material-tailwind/react";
import { Home, Trophy, LogIn, UserPlus, Menu, LayoutDashboard, User, MessageSquare, Film, BarChart2, Users, Rss } from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const sidebarItems = [
    { name: 'Home', icon: Home },
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Your Profile', icon: User },
    { name: 'Feed', icon: Rss },
    { name: 'Spaces', icon: Users },
    { name: 'Messages', icon: MessageSquare },
    { name: 'Tournaments', icon: Trophy },
    { name: 'Statistics', icon: BarChart2 },
    { name: 'Your Cinema', icon: Film },
    { name: 'Login', icon: LogIn },
    { name: 'Register', icon: UserPlus }
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden bg-red-600 text-white p-2 rounded-md shadow-md"
        onClick={toggleSidebar}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white shadow-xl ${
          isOpen ? 'w-64' : 'w-20'
        } lg:w-64 transition-all duration-300 ease-in-out z-40`}
      >
        <div className="flex flex-col h-full py-8 px-4">
          {sidebarItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center px-4 py-3 mb-2 cursor-pointer hover:bg-red-600 rounded-md transition-colors"
            >
              <item.icon size={24} className="mr-4 text-red-500" />
              <Typography
                variant="small"
                className={`font-medium ${
                  isOpen ? 'opacity-100' : 'opacity-0 lg:opacity-100'
                } transition-opacity duration-300`}
              >
                {item.name}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
