import React from 'react';
import { 
  Card, 
  CardBody, 
  Typography, 
  Chip, 
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import { 
  Calendar, 
  Users, 
  MapPin, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  Info,
  Trophy,
  XCircle,
  ArrowRight,
  Target
} from 'lucide-react';

const TournamentGrid = ({ tournaments, events, onTournamentClick }) => {
  const getStatusConfig = (status) => {
    const configs = {
      draft: {
        icon: <AlertTriangle className="text-gray-500" size={16} />,
        color: "blue-gray",
        bgColor: "bg-blue-gray-500/30"
      },
      published: {
        icon: <CheckCircle2 className="text-green-500" size={16} />,
        color: "green",
        bgColor: "bg-green-500/30"
      },
      ongoing: {
        icon: <Info className="text-amber-500" size={16} />,
        color: "amber",
        bgColor: "bg-amber-500/30"
      },
      completed: {
        icon: <Trophy className="text-purple-500" size={16} />,
        color: "purple",
        bgColor: "bg-purple-500/30"
      },
      cancelled: {
        icon: <XCircle className="text-red-500" size={16} />,
        color: "red",
        bgColor: "bg-red-500/30"
      }
    };
    return configs[status] || configs.draft;
  };

  const getTournamentEvents = (tournamentId) => {
    return events.filter(event => event.tournamentId === tournamentId);
  };

  const getParticipationProgress = (current, target) => {
    const percentage = Math.min((current / target) * 100, 100);
    if (percentage >= 100) return { color: "green", value: 100 };
    if (percentage >= 75) return { color: "blue", value: percentage };
    if (percentage >= 50) return { color: "amber", value: percentage };
    return { color: "gray", value: percentage };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-2">
      {tournaments.map((tournament) => {
        const tournamentEvents = getTournamentEvents(tournament._id);
        const status = getStatusConfig(tournament.status);
        const targetAttendees = tournament.targetAttendees || 100;
        const progress = getParticipationProgress(tournament.numAttendees || 0, targetAttendees);

        return (
          <Card 
            key={tournament._id}
            className="bg-gray-800/50 backdrop-blur-sm border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer group min-h-[300px] hover:shadow-lg hover:shadow-blue-500/10"
            onClick={() => onTournamentClick(tournament._id)}
          >
            <CardBody className="p-6 flex flex-col h-full">
              {/* Status & Date */}
              <div className="flex items-center justify-between mb-4">
                <Tooltip content={`Status: ${tournament.status}`}>
                  <Chip
                    size="sm"
                    variant="ghost"
                    value={tournament.status}
                    className={`normal-case ${status.bgColor} text-white px-4 py-2`}
                    icon={status.icon}
                  />
                </Tooltip>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar size={16} />
                  {new Date(tournament.startAt).toLocaleDateString()}
                </div>
              </div>

              {/* Tournament Title & Description */}
              <div className="mb-6 flex-grow">
                <Typography variant="h4" className="font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">
                  {tournament.name}
                </Typography>
                <Typography className="text-gray-400 text-base line-clamp-3">
                  {tournament.description}
                </Typography>
              </div>

              {/* Participation Progress */}
              <div className="mb-6 bg-gray-900/50 p-4 rounded-lg border border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Users size={18} className="text-blue-400" />
                    <Typography className="text-gray-300 font-medium">
                      Participants
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <Typography className="text-gray-400 text-sm">
                      {tournament.numAttendees || 0}
                    </Typography>
                    <span className="text-gray-600">/</span>
                    <Tooltip content="Target participants">
                      <div className="flex items-center gap-1 text-gray-400">
                        <Target size={14} />
                        <Typography className="text-sm">
                          {targetAttendees}
                        </Typography>
                      </div>
                    </Tooltip>
                  </div>
                </div>
                <Progress
                  value={progress.value}
                  size="sm"
                  className="bg-gray-700"
                  color={progress.color}
                />
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-900/30 p-3 rounded-lg border border-white/5">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-blue-400" />
                    <Typography className="text-gray-300 line-clamp-1">
                      {tournament.location?.city || 'Online'}
                    </Typography>
                  </div>
                </div>
                <div className="bg-gray-900/30 p-3 rounded-lg border border-white/5">
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-blue-400" />
                    <Typography className="text-gray-300">
                      {tournamentEvents.length} Events
                    </Typography>
                  </div>
                </div>
              </div>

              {/* View Details Link */}
              <div className="flex items-center justify-end mt-auto group-hover:text-blue-500 text-gray-400 transition-colors">
                <Typography className="text-base font-medium">
                  View Details
                </Typography>
                <ArrowRight size={20} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
};

export default TournamentGrid;