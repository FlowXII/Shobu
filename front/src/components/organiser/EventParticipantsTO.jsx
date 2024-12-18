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
  Input,
  Chip,
  IconButton,
  Select,
  Option,
} from "@material-tailwind/react";
import { Users, UserPlus, Trash2, Shield, Search, Mail, Ban, Wand2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { generateRandomUsername } from '../../utils/generators';
import { addParticipant, removeParticipant, generateParticipants } from '../../loaders/eventLoader';

const EventParticipantsTO = ({ event, onUpdate }) => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openGenerateDialog, setOpenGenerateDialog] = useState(false);
  const [newParticipantEmail, setNewParticipantEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [generatingCount, setGeneratingCount] = useState(32);
  const [loading, setLoading] = useState(false);

  const filteredParticipants = event?.participants?.filter(participant => 
    participant.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    participant.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddParticipant = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addParticipant(event.tournamentId, event._id, newParticipantEmail);
      setOpenAddDialog(false);
      setNewParticipantEmail('');
      onUpdate();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveParticipant = async (participantId) => {
    setLoading(true);
    try {
      await removeParticipant(event.tournamentId, event._id, participantId);
      onUpdate();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateParticipants = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tournamentId = event.tournamentId?._id || event.tournamentId;
      const eventId = event._id?._id || event._id;

      console.log('Generating participants:', {
        tournamentId,
        eventId,
        count: generatingCount
      });

      const participants = Array.from({ length: generatingCount }, () => {
        const username = generateRandomUsername();
        return {
          email: `${username.toLowerCase()}@example.com`,
          displayName: username
        };
      });

      await generateParticipants(
        tournamentId.toString(),
        eventId.toString(),
        participants
      );
      
      setOpenGenerateDialog(false);
      onUpdate();
      toast.success(`Generated ${generatingCount} participants successfully`);
    } catch (error) {
      console.error('Generate participants error:', {
        error,
        message: error.message,
        tournamentId: event.tournamentId,
        eventId: event._id
      });
      toast.error('Failed to generate participants');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Users className="text-blue-400" size={24} />
          <Typography variant="h5">
            Manage Participants ({event?.participants?.length || 0})
          </Typography>
        </div>
        <div className="flex gap-2">
          <Button
            className="flex items-center gap-2 bg-purple-500"
            onClick={() => setOpenGenerateDialog(true)}
          >
            <Wand2 size={16} />
            Generate Participants
          </Button>
          <Button
            className="flex items-center gap-2 bg-blue-500"
            onClick={() => setOpenAddDialog(true)}
          >
            <UserPlus size={16} />
            Add Participant
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Input
          type="text"
          label="Search participants"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="!border-t-blue-gray-200 focus:!border-blue-500"
          labelProps={{
            className: "before:content-none after:content-none",
          }}
          icon={<Search className="text-blue-gray-300" />}
        />
      </div>

      {/* Participants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredParticipants?.map((participant, index) => (
          <Card key={participant._id} className="bg-gray-800/50 border border-gray-700/50">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Chip
                    value={`#${index + 1}`}
                    className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center text-sm"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Typography className="font-medium text-gray-200">
                        {participant.displayName || 'Unnamed Participant'}
                      </Typography>
                      {participant.isOrganizer && (
                        <Shield className="text-blue-400" size={16} />
                      )}
                      {participant.seed && (
                        <Chip
                          value={`Seed ${participant.seed}`}
                          size="sm"
                          className="bg-blue-gray-700"
                        />
                      )}
                    </div>
                    <Typography className="text-sm text-gray-400">
                      {participant.email || 'No email provided'}
                    </Typography>
                    {participant.checkedIn && (
                      <Chip
                        value="Checked In"
                        size="sm"
                        color="green"
                        className="mt-1"
                      />
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <IconButton
                    variant="text"
                    color="blue-gray"
                    className="hover:bg-blue-400/20"
                    onClick={() => window.location.href = `mailto:${participant.email}`}
                  >
                    <Mail size={16} />
                  </IconButton>
                  <IconButton
                    variant="text"
                    color="red"
                    className="hover:bg-red-400/20"
                    onClick={() => handleRemoveParticipant(participant._id)}
                  >
                    <Ban size={16} />
                  </IconButton>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Add Participant Dialog */}
      <Dialog open={openAddDialog} handler={() => setOpenAddDialog(false)}>
        <form onSubmit={handleAddParticipant}>
          <DialogHeader>Add Participant</DialogHeader>
          <DialogBody>
            <Input
              label="Email Address"
              type="email"
              value={newParticipantEmail}
              onChange={(e) => setNewParticipantEmail(e.target.value)}
              required
              className="!text-gray-900"
            />
          </DialogBody>
          <DialogFooter>
            <Button variant="text" onClick={() => setOpenAddDialog(false)}>
              Cancel
            </Button>
            <Button type="submit" color="blue">
              Add
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      {/* Add Generate Participants Dialog */}
      <Dialog 
        open={openGenerateDialog} 
        handler={() => setOpenGenerateDialog(false)}
        className="bg-gray-900 text-white"
      >
        <form onSubmit={handleGenerateParticipants}>
          <DialogHeader>Generate Random Participants</DialogHeader>
          <DialogBody>
            <div className="space-y-4">
              <Typography className="text-gray-400">
                Generate random participants for testing purposes.
              </Typography>
              <Select
                label="Number of Participants"
                value={String(generatingCount)}
                onChange={(value) => setGeneratingCount(Number(value))}
                className="!text-white"
              >
                {[8, 16, 32, 64, 128].map(count => (
                  <Option key={`count-${count}`} value={String(count)}>
                    {count} Participants
                  </Option>
                ))}
              </Select>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="gray"
              onClick={() => setOpenGenerateDialog(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-purple-500"
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

export default EventParticipantsTO; 