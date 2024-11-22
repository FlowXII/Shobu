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
} from 'lucide-react';
import { useSidebar } from '../../contexts/SidebarContext';
import { useSelector } from 'react-redux';

const Sidebar = () => {
  const { isOpen, toggleSidebar } = useSidebar();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Updated sections with Home separated
  const sections = [
    {
      title: "Main",
      items: [
        { name: 'Home', icon: Home, color: 'text-white', hoverColor: 'hover:bg-white/5', path: '/' },
      ]
    },
    {
      title: "Tournaments",
      items: [
        { name: 'Dashboard', icon: LayoutDashboard, color: 'text-red-400', hoverColor: 'hover:bg-red-500/10', path: '/dashboard', requiresAuth: true },
        { name: 'Tournaments', icon: Trophy, color: 'text-red-400', hoverColor: 'hover:bg-red-500/10', path: '/upcoming' },
        { name: 'Create Tournament', icon: PlusCircle, color: 'text-red-400', hoverColor: 'hover:bg-red-500/10', path: '/tournaments/create', requiresAuth: true },
        { name: 'Statistics', icon: BarChart2, color: 'text-red-400', hoverColor: 'hover:bg-red-500/10', path: '/statistics', requiresAuth: true },
        { name: 'Stations', icon: Presentation, color: 'text-red-400', hoverColor: 'hover:bg-red-500/10', path: '/station-viewer', requiresAuth: true },
        { name: 'Organizer Dashboard', icon: Presentation, color: 'text-red-400', hoverColor: 'hover:bg-red-500/10', path: '/organizer', requiresAuth: true },
      ]
    },
    {
      title: "Social",
      items: [
        { name: 'Feed', icon: Newspaper, color: 'text-blue-400', hoverColor: 'hover:bg-blue-500/10', path: '/feed' },
        { name: 'Spaces', icon: Users, color: 'text-blue-400', hoverColor: 'hover:bg-blue-500/10', path: '/spaces' },
        { name: 'Messages', icon: MessageSquare, color: 'text-blue-400', hoverColor: 'hover:bg-blue-500/10', path: '/messages', requiresAuth: true },
      ]
    },
    {
      title: "Entertainment",
      items: [
        { name: 'Streams', icon: Tv, color: 'text-purple-400', hoverColor: 'hover:bg-purple-500/10', path: '/streams' },
      ]
    },
    {
      title: "Account",
      items: [
        ...(isAuthenticated ? [
          { name: 'Your Profile', icon: User, color: 'text-yellow-400', hoverColor: 'hover:bg-yellow-500/10', path: '/profile' },
        ] : [
          { name: 'Login', icon: LogIn, color: 'text-yellow-400', hoverColor: 'hover:bg-yellow-500/10', path: '/login' },
          { name: 'Register', icon: UserPlus, color: 'text-yellow-400', hoverColor: 'hover:bg-yellow-500/10', path: '/register' },
        ]),
      ]
    }
  ];

  const renderSidebarSection = (section) => {
    const visibleItems = section.items.filter(item => 
      !item.requiresAuth || isAuthenticated
    );

    if (visibleItems.length === 0) return null;

    return (
      <div className="mb-6 relative">
        {isOpen && (
          <>
            {/* Enhanced Gradient Bar */}
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent mb-2" />
            
            {/* Enhanced Section Title */}
            <Typography 
              variant="small" 
              className="mb-2 px-4 uppercase tracking-wider text-[10px] font-semibold text-gray-500/80"
            >
              {section.title}
            </Typography>
          </>
        )}
        <div className="space-y-1">
          {renderSidebarItems(visibleItems)}
        </div>
      </div>
    );
  };

  const renderSidebarItems = (items) => (
    items.map((item, index) => {
      const isActive = location.pathname === item.path;
      return (
        <Link
          key={index}
          to={item.path}
          className={`
            flex items-center w-full px-4 py-2.5 cursor-pointer
            ${item.hoverColor} rounded-lg transition-all duration-300
            ${isActive ? 'bg-gray-800/80 border border-white/10 shadow-lg' : 'bg-transparent'}
            hover:shadow-md border border-white/5 hover:border-white/10
            group
          `}
        >
          <item.icon 
            size={20} 
            className={`
              ${item.color} transition-all duration-300 
              ${isActive ? 'scale-110' : 'group-hover:scale-105'}
              ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-90'}
            `} 
          />
          {isOpen && (
            <Typography
              variant="small"
              className={`
                ml-3 font-medium transition-all duration-300
                ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}
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
        fixed top-0 left-0 h-screen bg-gray-900/95
        text-white shadow-xl ${isOpen ? 'w-64' : 'w-20'}
        transition-all duration-300 ease-in-out z-50 flex flex-col
        border-r border-white/10 backdrop-blur-sm
      `}
    >
      {/* Enhanced Logo and Toggle Section */}
      <div className="p-4 border-b border-white/10 relative">
        {/* Logo Container */}
        <div className="flex items-center justify-center mb-6">
          <Typography
            variant="h3"
            className={`
              font-bold text-center bg-clip-text text-transparent 
              bg-gradient-to-r from-red-400 via-purple-400 to-blue-400 
              hover:from-red-500 hover:via-purple-500 hover:to-blue-500
              transition-all duration-300 
              drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]
              ${isOpen ? 'text-4xl' : 'text-3xl'}
            `}
          >
            {isOpen ? 'Shobu' : 'S'}
          </Typography>
        </div>

        {/* Centered Toggle Button */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <button
            onClick={toggleSidebar}
            className="
              w-10 h-10
              flex items-center justify-center
              rounded-full
              bg-gradient-to-r from-gray-800 to-gray-900
              hover:from-gray-700 hover:to-gray-800
              border border-white/10
              group relative overflow-hidden
              transition-all duration-300
              hover:border-white/20
              hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]
              z-10
            "
          >
            {/* Gradient Overlays */}
            <div className="
              absolute inset-0 
              bg-gradient-to-r from-red-400/5 via-purple-400/5 to-blue-400/5 
              opacity-0 group-hover:opacity-100 
              transition-all duration-500
            " />
            
            {/* Shine Effect */}
            <div className="
              absolute inset-0 
              bg-gradient-to-r from-transparent via-white/10 to-transparent 
              opacity-0 group-hover:opacity-100 
              translate-x-[-200%] group-hover:translate-x-[200%]
              transition-all duration-1000
            " />
            
            {/* Icon */}
            {isOpen ? (
              <ChevronLeft 
                size={18} 
                className="text-gray-400 group-hover:text-white transition-colors relative z-10" 
              />
            ) : (
              <ChevronRight 
                size={18} 
                className="text-gray-400 group-hover:text-white transition-colors relative z-10" 
              />
            )}
          </button>
        </div>
      </div>

      {/* Sidebar Content with improved spacing */}
      <div className="flex-grow flex flex-col pt-8 px-4 space-y-2 overflow-y-auto">
        {sections.map((section, index) => renderSidebarSection(section))}
      </div>
    </div>
  );
};

export default Sidebar;
