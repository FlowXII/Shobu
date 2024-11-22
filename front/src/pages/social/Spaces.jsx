import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Typography,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { Users, Star, Gamepad2, ChevronDown } from "lucide-react";

const CUSTOM_ANIMATION = {
  mount: { scale: 1 },
  unmount: { scale: 0.9 },
};

const Spaces = () => {
  const [open, setOpen] = useState(1);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  return (
    <div className="flex flex-col items-center justify-start p-8 overflow-x-hidden">
      <Card className="w-full max-w-[64rem] bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-xl border border-white border-opacity-20 rounded-lg overflow-hidden mb-8">
        <CardBody className="p-8">
          <Typography variant="h3" className="mb-4 text-center text-blue-500 font-bold">
            Gaming Spaces
          </Typography>
          <Typography className="text-center text-gray-300">
            Connect with other players and build your gaming community
          </Typography>
        </CardBody>
      </Card>

      <div className="w-full max-w-[64rem] space-y-6">
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
              <Users className="h-5 w-5 text-blue-500" />
              <Typography variant="h6">Your Communities</Typography>
            </div>
            <ChevronDown
              className={`h-5 w-5 transition-transform ${open === 1 ? "rotate-180" : ""} ml-auto`}
            />
          </AccordionHeader>
          <AccordionBody className="px-8 pb-8 pt-2">
            <Typography className="text-gray-400">
              Your gaming communities will appear here...
            </Typography>
          </AccordionBody>
        </Accordion>

        {/* Additional sections similar to StatisticsViewer */}
      </div>
    </div>
  );
};

export default Spaces; 