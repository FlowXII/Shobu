import React from 'react';
import { Card, CardBody, Typography } from "@material-tailwind/react";

const stateStyles = {
  1: { color: "blue", text: "Created", border: "border-2 border-blue-500" },
  2: { color: "green", text: "Ongoing", border: "border-2 border-green-500" },
  4: { color: "yellow", text: "Ready", border: "border-2 border-yellow-500" },
  6: { color: "orange", text: "Called", border: "border-2 border-orange-500" },
  7: { color: "purple", text: "Completed", border: "border-2 border-purple-500" },
};

const SetCardComponent = ({ set }) => {
  const stateNumber = parseInt(set.state, 10);
  const { color, text, border } = stateStyles[stateNumber] || { color: "gray", text: "Unknown", border: "" };

  return (
    <Card className={`bg-gray-800 ${border}`}>
      <CardBody className="p-2">
        <Typography variant="h6" color="white" className="text-center">
          Station {set.station?.number || "N/A"}
        </Typography>
        <Typography 
          variant="small" 
          color={color} 
          className={`text-center font-bold border-b-2 border-${color}`}
        >
          {text}
        </Typography>
        <Typography variant="small" color="white" className="text-center mt-1">
          {set.fullRoundText || "Unknown Round"}
        </Typography>
        <div className="space-y-1 mt-1">
          <Card className="bg-blue-900">
            <CardBody className="p-1">
              <Typography variant="small" color="white" className="text-center truncate">
                {set.slots[0]?.entrantName || 'TBD'}
              </Typography>
            </CardBody>
          </Card>
          <Card className="bg-red-900">
            <CardBody className="p-1">
              <Typography variant="small" color="white" className="text-center truncate">
                {set.slots[1]?.entrantName || 'TBD'}
              </Typography>
            </CardBody>
          </Card>
        </div>
      </CardBody>
    </Card>
  );
};

export default SetCardComponent;
