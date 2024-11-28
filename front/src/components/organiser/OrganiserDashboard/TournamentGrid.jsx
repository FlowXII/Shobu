import { Card, CardBody, Typography, Progress } from "@material-tailwind/react";
import { Calendar, Trophy } from 'lucide-react';

const TournamentGrid = ({ tournaments, onTournamentClick }) => {
  return (
    <Card className="bg-gray-800/50 border border-white/10">
      <CardBody>
        <Typography variant="h5" className="text-white mb-6">
          Your Tournaments
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <Card 
              key={tournament._id}
              className="bg-gray-900/50 hover:bg-gray-800 transition-all cursor-pointer border border-white/5 hover:border-white/10"
              onClick={() => onTournamentClick(tournament._id)}
            >
              <CardBody>
                <div className="flex items-start justify-between">
                  <div>
                    <Typography variant="h5" className="text-white mb-2">
                      {tournament.name}
                    </Typography>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar size={16} />
                      <Typography className="text-sm">
                        {new Date(tournament.startAt).toLocaleDateString()}
                      </Typography>
                    </div>
                  </div>
                  <Trophy className="text-yellow-400" size={24} />
                </div>
                
                <div className="mt-4 space-y-2">
                  <div>
                    <div className="flex justify-between mb-1">
                      <Typography className="text-sm text-gray-400">Events</Typography>
                      <Typography className="text-sm text-gray-400">{tournament.events?.length || 0}</Typography>
                    </div>
                    <Progress value={((tournament.events?.length || 0) / 10) * 100} size="sm" className="bg-gray-700" color="yellow" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <Typography className="text-sm text-gray-400">Attendees</Typography>
                      <Typography className="text-sm text-gray-400">{tournament.numAttendees || 0}</Typography>
                    </div>
                    <Progress value={((tournament.numAttendees || 0) / 100) * 100} size="sm" className="bg-gray-700" color="green" />
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default TournamentGrid; 