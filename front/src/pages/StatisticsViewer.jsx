import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Typography,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { BarChart2, Trophy, Users, Activity, ChevronDown } from "lucide-react";

const CUSTOM_ANIMATION = {
  mount: { scale: 1 },
  unmount: { scale: 0.9 },
};

const StatisticsViewer = () => {
  const [open, setOpen] = useState(1);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  return (
    <div className="flex flex-col items-center justify-start p-8 overflow-x-hidden">
      {/* Header Card */}
      <Card className="w-full max-w-[64rem] bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-xl border border-white border-opacity-20 rounded-lg overflow-hidden mb-8">
        <CardBody className="p-8">
          <Typography variant="h3" className="mb-4 text-center text-red-500 font-bold">
            Statistics
          </Typography>
          <Typography className="text-center text-gray-300">
            View your tournament performance and player statistics
          </Typography>
        </CardBody>
      </Card>

      {/* Main Content */}
      <div className="w-full max-w-[64rem] space-y-6">
        {/* Tournament Statistics */}
        <Accordion 
          open={open === 1}
          animate={CUSTOM_ANIMATION}
          className="border border-white/10 rounded-lg"
        >
          <AccordionHeader
            onClick={() => handleOpen(1)}
            className="border-b-0 transition-colors text-white hover:!text-red-500 p-6 flex justify-between items-center"
          >
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-red-400" />
              <Typography variant="h6">Tournament Statistics</Typography>
            </div>
            <ChevronDown
              className={`h-5 w-5 transition-transform ${open === 1 ? "rotate-180" : ""} ml-auto`}
            />
          </AccordionHeader>
          <AccordionBody className="px-8 pb-8 pt-2">
            <Typography className="text-gray-400">
              Tournament statistics coming soon...
            </Typography>
          </AccordionBody>
        </Accordion>

        {/* Player Statistics */}
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
              <Users className="h-5 w-5 text-blue-500" />
              <Typography variant="h6">Player Statistics</Typography>
            </div>
            <ChevronDown
              className={`h-5 w-5 transition-transform ${open === 2 ? "rotate-180" : ""} ml-auto`}
            />
          </AccordionHeader>
          <AccordionBody className="px-8 pb-8 pt-2">
            <Typography className="text-gray-400">
              Player statistics coming soon...
            </Typography>
          </AccordionBody>
        </Accordion>

        {/* Performance Metrics */}
        <Accordion 
          open={open === 3}
          animate={CUSTOM_ANIMATION}
          className="border border-white/10 rounded-lg"
        >
          <AccordionHeader
            onClick={() => handleOpen(3)}
            className="border-b-0 transition-colors text-white hover:!text-green-500 p-6 flex justify-between items-center"
          >
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              <Typography variant="h6">Performance Metrics</Typography>
            </div>
            <ChevronDown
              className={`h-5 w-5 transition-transform ${open === 3 ? "rotate-180" : ""} ml-auto`}
            />
          </AccordionHeader>
          <AccordionBody className="px-8 pb-8 pt-2">
            <Typography className="text-gray-400">
              Performance metrics coming soon...
            </Typography>
          </AccordionBody>
        </Accordion>
      </div>
    </div>
  );
};

export default StatisticsViewer;
