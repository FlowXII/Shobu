import { Card, CardBody, Typography } from "@material-tailwind/react";
import { Trophy, Target, Users, Award } from 'lucide-react';

const DashboardStats = ({ tournaments }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-gray-800/50 border border-white/10">
        <CardBody>
          <div className="flex items-center gap-4">
            <Trophy className="text-yellow-400" size={24} />
            <div>
              <Typography variant="small" className="text-gray-400">
                Total Tournaments
              </Typography>
              <Typography variant="h4" className="text-white">
                {tournaments.length}
              </Typography>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="bg-gray-800/50 border border-white/10">
        <CardBody>
          <div className="flex items-center gap-4">
            <Users className="text-blue-400" size={24} />
            <div>
              <Typography variant="small" className="text-gray-400">
                Total Participants
              </Typography>
              <Typography variant="h4" className="text-white">
                {tournaments.reduce((sum, t) => sum + (t.numAttendees || 0), 0)}
              </Typography>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="bg-gray-800/50 border border-white/10">
        <CardBody>
          <div className="flex items-center gap-4">
            <Trophy className="text-green-400" size={24} />
            <div>
              <Typography variant="small" className="text-gray-400">
                Organizer Level
              </Typography>
              <Typography variant="h4" className="text-white">
                Rookie
              </Typography>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default DashboardStats; 