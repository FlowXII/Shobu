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
  const [bracketType, setBracketType] = useState(event?.format || 'DOUBLE_ELIMINATION');
  const [loading, setLoading] = useState(false);

  const handleGenerateBrackets = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/events/${event._id}/brackets/generate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            type: bracketType,
            seeding
          })
        }
      );

      if (!response.ok) throw new Error('Failed to generate brackets');
      
      toast.success('Brackets generated successfully');
      setOpenDialog(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gray-800/50">
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
                disabled={!event?.participants?.length}
              >
                <Plus size={16} />
                Generate Brackets
              </Button>
            </div>
          </div>

          {event?.brackets ? (
            <div className="bracket-display">
              {/* Add your bracket visualization component here */}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No brackets generated yet. Add participants and generate brackets to get started.
            </div>
          )}
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
              value={bracketType}
              onChange={(value) => setBracketType(value)}
              className="!text-white"
            >
              <Option value="SINGLE_ELIMINATION">Single Elimination</Option>
              <Option value="DOUBLE_ELIMINATION">Double Elimination</Option>
              <Option value="ROUND_ROBIN">Round Robin</Option>
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
              className="bg-blue-500"
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate'}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
};

export default EventBracketsTO; 