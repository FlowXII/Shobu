import { Card, CardBody, Typography } from "@material-tailwind/react";
import { Trophy, Target, Users, Award } from 'lucide-react';

const DashboardStats = ({ tournaments }) => {
  const stats = [
    { 
      label: 'Total Tournaments', 
      value: tournaments.length, 
      icon: Trophy, 
      color: 'text-yellow-400' 
    },
    { 
      label: 'Active Events', 
      value: tournaments.reduce((acc, t) => acc + (t.events?.length || 0), 0), 
      icon: Target, 
      color: 'text-blue-400' 
    },
    { 
      label: 'Total Participants', 
      value: tournaments.reduce((acc, t) => acc + (t.numAttendees || 0), 0), 
      icon: Users, 
      color: 'text-green-400' 
    },
    { 
      label: 'Success Rate', 
      value: '98%', 
      icon: Award, 
      color: 'text-purple-400' 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-gray-800/50 border border-white/10">
          <CardBody className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-gray-900/50">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <Typography variant="h4" className="text-white">
                {stat.value}
              </Typography>
              <Typography className="text-gray-400">
                {stat.label}
              </Typography>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats; 