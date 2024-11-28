import { Card, CardBody, Typography, Button, Avatar, Chip } from "@material-tailwind/react";
import { PlusCircle } from 'lucide-react';

const UserHero = ({ user, tournamentCount, onCreateTournament }) => {
  return (
    <Card className="w-full bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-xl border border-white/10">
      <CardBody className="p-0">
        <div className="relative h-48 bg-gradient-to-r from-yellow-500 via-red-500 to-purple-500">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
        </div>
        
        <div className="px-8 pb-8 -mt-16 relative">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <Avatar
              src={user?.avatar || 'https://via.placeholder.com/150'}
              alt={user?.username}
              size="xxl"
              className="w-32 h-32 border-4 border-gray-900 shadow-xl rounded-xl"
            />
            <div className="flex-grow text-center md:text-left">
              <Typography variant="h3" className="font-bold">
                Welcome, {user?.username}
              </Typography>
              <Typography className="text-gray-400 mt-2">
                Tournament Organizer Dashboard
              </Typography>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-2">
                <Chip size="sm" value="Tournament Organizer" className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/20" />
                <Chip size="sm" value={`${tournamentCount} Tournaments`} className="bg-blue-500/20 text-blue-400 border border-blue-500/20" />
              </div>
            </div>
            <Button
              className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-red-500"
              onClick={onCreateTournament}
            >
              <PlusCircle size={20} />
              Create Tournament
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default UserHero; 