import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select,
  Option,
} from "@material-tailwind/react";
import { Trophy, Users, Brackets, Plus } from 'lucide-react';
import { toast } from 'react-toastify';

const EventBracketsTO = ({ event }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [seeding, setSeeding] = useState('random');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (!event) {
    return (
      <div className="flex justify-center items-center h-64">
        <Typography className="text-gray-400">
          Loading bracket information...
        </Typography>
      </div>
    );
  }

  const handleGenerateBrackets = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/events/${event._id}/brackets`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            type: event?.bracketType || 'DOUBLE_ELIMINATION',
            seeding: seeding
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to generate brackets');
      toast.success('Brackets generated successfully');
      setOpenDialog(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleResetBrackets = async () => {
    if (!confirm('Are you sure you want to reset the brackets? This action cannot be undone.')) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/events/${event._id}/brackets`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      if (!response.ok) throw new Error('Failed to reset brackets');
      toast.success('Brackets reset successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Format mapping for display
  const formatDisplay = {
    'SINGLE_ELIMINATION': 'Single Elimination',
    'DOUBLE_ELIMINATION': 'Double Elimination',
    'ROUND_ROBIN': 'Round Robin'
  };

  const displayFormat = formatDisplay[event.format] || 'Double Elimination';

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border border-white/10">
        <CardBody>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Brackets className="text-gray-400" size={20} />
              <Typography variant="h6">Tournament Brackets</Typography>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex items-center gap-2 bg-blue-600"
                onClick={() => setOpenDialog(true)}
              >
                <Plus size={16} />
                Generate Brackets
              </Button>
              <Button
                size="sm"
                variant="outlined"
                color="red"
                className="flex items-center gap-2"
                onClick={handleResetBrackets}
              >
                Reset Brackets
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Trophy className="text-gray-400" size={20} />
              <Typography className="text-gray-400">
                Bracket Type: {displayFormat}
              </Typography>
            </div>
            <div className="flex items-center gap-3">
              <Users className="text-gray-400" size={20} />
              <Typography className="text-gray-400">
                Participants: {event.participants?.length || 0}
              </Typography>
            </div>
          </div>

          <div className="bracket-display mt-6">
            {(event?.bracketType || 'DOUBLE_ELIMINATION') === 'DOUBLE_ELIMINATION' && (
              <div className="p-4 border border-white/10 rounded-lg">
                <Typography className="text-gray-400 text-center">
                  Bracket visualization coming soon...
                </Typography>
                <Typography className="text-gray-500 text-sm text-center mt-2">
                  This tournament will use a {event?.bracketType || 'DOUBLE_ELIMINATION'} format
                </Typography>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      <Dialog
        open={openDialog}
        handler={() => setOpenDialog(false)}
        className="bg-gray-900 text-white"
      >
        <form onSubmit={handleGenerateBrackets}>
          <DialogHeader className="text-white">Generate Brackets</DialogHeader>
          <DialogBody className="space-y-4">
            <Select
              label="Bracket Type"
              value={event?.bracketType || 'DOUBLE_ELIMINATION'}
              onChange={(value) => setBracketType(value)}
              className="!text-white"
            >
              <Option value="single">Single Elimination</Option>
              <Option value="double">Double Elimination</Option>
              <Option value="round-robin">Round Robin</Option>
            </Select>
            
            <Select
              label="Seeding Method"
              value={seeding}
              onChange={(value) => setSeeding(value)}
              className="!text-white"
            >
              <Option value="random">Random</Option>
              <Option value="manual">Manual</Option>
              <Option value="skill">Skill-based</Option>
            </Select>
          </DialogBody>
          <DialogFooter className="space-x-2">
            <Button
              variant="text"
              onClick={() => setOpenDialog(false)}
              className="text-gray-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gray-800 text-white"
            >
              Generate
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
};

export default EventBracketsTO; 