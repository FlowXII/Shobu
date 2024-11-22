import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { ChevronUp, ChevronDown } from 'lucide-react';
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { isStartGGConnected } from '../utils/startgg';

const CUSTOM_ANIMATION = {
  mount: { scale: 1 },
  unmount: { scale: 0.9 },
};

const DEBUG_SECTIONS = [
  {
    id: 1,
    title: 'Auth State',
    color: 'blue',
    getData: (state) => state.auth
  },
  {
    id: 2,
    title: 'User State',
    color: 'green',
    getData: (state) => ({
      user: {
        ...state.user.user,
        hasStartGG: !!state.user.user?.startgg,
        startggDetails: state.user.user?.startgg ? {
          connected: true,
          gamerTag: state.user.user.startgg.gamerTag,
          userId: state.user.user.startgg.userId,
          slug: state.user.user.startgg.slug,
        } : null
      },
      loading: state.user.loading,
      error: state.user.error,
      initialized: state.user.initialized
    })
  },
  {
    id: 3,
    title: 'Dashboard State',
    color: 'yellow',
    getData: (state) => ({
      tournaments: state.dashboard.tournaments,
      loading: state.dashboard.loading,
      error: state.dashboard.error,
      count: state.dashboard.tournaments?.length || 0
    })
  },
  {
    id: 4,
    title: 'Loading States',
    color: 'red',
    getData: (state) => ({
      auth: state.auth.loading,
      user: state.user.loading,
      dashboard: state.dashboard.loading
    })
  },
  {
    id: 5,
    title: 'StartGG Integration',
    color: 'purple',
    getData: (state) => ({
      isConnected: isStartGGConnected(state.user.user),
      status: isStartGGConnected(state.user.user) ? {
        connected: true,
        gamerTag: state.user.user.startgg.gamerTag,
        userId: state.user.user.startgg.userId,
        lastUpdated: state.user.user.startgg.expiresAt
      } : {
        connected: false,
        reason: 'Not connected or authenticated with Start.gg'
      }
    })
  }
];

const DebugSection = ({ section, isOpen, onToggle, state }) => (
  <Accordion 
    open={isOpen}
    animate={CUSTOM_ANIMATION}
    className={`border border-${section.color}-900/30 rounded-lg bg-gray-800/80`}
  >
    <AccordionHeader
      onClick={onToggle}
      className={`border-b-0 transition-colors text-white hover:!text-${section.color}-500 p-4 text-sm`}
    >
      <h4 className={`font-bold text-${section.color}-400`}>{section.title}</h4>
    </AccordionHeader>
    <AccordionBody className="p-4 pt-0">
      <pre className="whitespace-pre-wrap text-xs text-white">
        {JSON.stringify(section.getData(state), null, 2)}
      </pre>
    </AccordionBody>
  </Accordion>
);

const DebugBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openAccordions, setOpenAccordions] = useState(new Set());
  const [refreshKey, setRefreshKey] = useState(0);
  const location = useLocation();
  
  const state = {
    auth: useSelector((state) => state.auth),
    user: useSelector((state) => state.user),
    dashboard: useSelector((state) => state.dashboard)
  };

  useEffect(() => {
    setRefreshKey(prev => prev + 1);
  }, [location.pathname]);

  const toggleBar = () => setIsOpen(!isOpen);
  
  const handleOpen = (value) => {
    setOpenAccordions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      return newSet;
    });
  };

  return (
    <div 
      key={refreshKey} 
      className="fixed top-0 right-0 z-[9999] w-80 bg-gray-900/90 text-white max-h-screen overflow-auto shadow-lg"
    >
      {!isOpen ? (
        <div 
          className="sticky top-0 bg-gray-900/90 text-white p-2 cursor-pointer hover:bg-gray-800/90 transition-all flex items-center justify-between"
          onClick={toggleBar}
        >
          <span className="text-xs">Debug Mode</span>
          <ChevronDown size={16} />
        </div>
      ) : (
        <>
          <div 
            className="flex justify-between items-center cursor-pointer p-4"
            onClick={toggleBar}
          >
            <h3 className="text-sm font-bold">Debug Information</h3>
            <ChevronUp size={16} />
          </div>

          <div className="space-y-2 p-4 pt-0">
            {DEBUG_SECTIONS.map(section => (
              <DebugSection
                key={section.id}
                section={section}
                isOpen={openAccordions.has(section.id)}
                onToggle={() => handleOpen(section.id)}
                state={state}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DebugBar; 