import React from 'react';
import { Card, CardBody, Typography, Chip } from "@material-tailwind/react";
import { Clock, Play, CheckCircle, Bell, AlertCircle, MonitorIcon, Swords, XCircle, List } from "lucide-react";

export const stateStyles = {
  1: { color: "gray", text: "Created", icon: Clock, bgColor: "from-gray-800 to-gray-900" },
  2: { color: "green", text: "Active", icon: Play, bgColor: "from-green-900 to-gray-900" },
  3: { color: "purple", text: "Complete", icon: CheckCircle, bgColor: "from-purple-900 to-gray-900" },
  4: { color: "yellow", text: "Ready", icon: AlertCircle, bgColor: "from-yellow-900 to-gray-900" },
  5: { color: "red", text: "Invalid", icon: XCircle, bgColor: "from-red-900 to-gray-900" },
  6: { color: "orange", text: "Called", icon: Bell, bgColor: "from-orange-900 to-gray-900" },
  7: { color: "gray", text: "Queued", icon: List, bgColor: "from-gray-800 to-gray-900" },
};

const SetCardComponent = ({ set }) => {
  const stateNumber = parseInt(set?.state, 10);
  const { color, text, icon: Icon, bgColor } = stateStyles[stateNumber] || stateStyles[1];

  return (
    <Card className={`w-full bg-gradient-to-br ${bgColor} hover:scale-105 transition-all duration-300 border border-white/20 hover:border-white/30 shadow-xl rounded-lg overflow-hidden`}>
      <CardBody className="p-3">
        <div className="flex flex-col gap-2">
          {/* Header */}
          <div className="flex justify-between items-center">
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
              size="sm"
              icon={<Swords className="h-4 w-4 text-white" />}
            />
          </div>

          {/* Station */}
          {set?.station?.number && (
            <div className="flex justify-center">
              <Chip
                value={`Station ${set.station.number}`}
                className="bg-white/20 text-white font-semibold"
                size="sm"
                icon={<MonitorIcon className="h-4 w-4" />}
              />
            </div>
          )}

          {/* Players */}
          <div className="space-y-2 mt-2">
            {set.slots.map((slot, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg ${
                  index === 0 ? 'bg-blue-900/50' : 'bg-red-900/50'
                } border border-white/20`}
              >
                <Typography variant="small" className="text-white font-medium truncate">
                  {slot.entrantName || 'TBD'}
                </Typography>
                {slot.score !== undefined && (
                  <Typography variant="small" className="text-gray-300">
                    Score: {slot.score}
                  </Typography>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default SetCardComponent;
