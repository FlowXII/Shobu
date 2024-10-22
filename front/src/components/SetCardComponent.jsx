import React from 'react';
import { Card, CardBody, Typography, Chip } from "@material-tailwind/react";
import { Clock, Play, CheckCircle, Bell, AlertCircle, MonitorIcon, Swords } from "lucide-react";

const stateStyles = {
  1: { color: "blue", text: "Created", icon: Clock },
  2: { color: "green", text: "Ongoing", icon: Play },
  4: { color: "yellow", text: "Ready", icon: AlertCircle },
  6: { color: "orange", text: "Called", icon: Bell },
  7: { color: "purple", text: "Completed", icon: CheckCircle },
};

const SetCardComponent = ({ set }) => {
  const stateNumber = parseInt(set?.state, 10);
  const { color, text, icon: Icon } = stateStyles[stateNumber] || { color: "gray", text: "Unknown", icon: AlertCircle };

  return (
    <Card className="w-full bg-gradient-to-br from-gray-800 to-gray-950 text-white border border-white border-opacity-20 shadow-xl rounded-lg overflow-hidden">
      <CardBody className="p-2">
        <div className="flex justify-between items-center mb-2">
          <Chip
            value={text}
            color={color}
            size="sm"
            className="font-semibold"
            icon={<Icon className="h-4 w-4" />}
          />
          <Chip
            value={set?.fullRoundText || "Unknown Round"}
            className="bg-gray-700 text-white font-semibold"
            icon={<Swords className="h-4 w-4 text-white" />}
          />
        </div>
        <div className="flex justify-center mb-2">
          <Chip
            value={`Station ${set?.station?.number || "N/A"}`}
            className="bg-white text-black font-semibold text-base py-2 px-2"
            icon={<MonitorIcon className="h-5 w-4  text-black" />}
          />
        </div>
        <div className="space-y-1">
          <Card className="bg-blue-900 border border-white border-opacity-20">
            <CardBody className="p-1">
              <Typography variant="small" color="white" className="text-center truncate">
                {set?.slots?.[0]?.entrantName || 'TBD'}
              </Typography>
            </CardBody>
          </Card>
          <Card className="bg-red-900 border border-white border-opacity-20">
            <CardBody className="p-1">
              <Typography variant="small" color="white" className="text-center truncate">
                {set?.slots?.[1]?.entrantName || 'TBD'}
              </Typography>
            </CardBody>
          </Card>
        </div>
      </CardBody>
    </Card>
  );
};

export default SetCardComponent;
