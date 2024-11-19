import React, { useState } from 'react';
import { Typography, Card, CardBody, Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input } from "@material-tailwind/react";
import { Users, UserPlus, Trash2, Shield } from 'lucide-react';
import { toast } from 'react-toastify';

const TournamentParticipantsTO = ({ tournament, isOrganizer }) => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newParticipantEmail, setNewParticipantEmail] = useState('');

  const handleAddParticipant = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/tournaments/${tournament._id}/participants`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email: newParticipantEmail }),
        }
      );

      if (!response.ok) throw new Error('Failed to add participant');
      toast.success('Participant added successfully');
      setOpenAddDialog(false);
      setNewParticipantEmail('');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRemoveParticipant = async (participantId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/tournaments/${tournament._id}/participants/${participantId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      if (!response.ok) throw new Error('Failed to remove participant');
      toast.success('Participant removed successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Card className="bg-gray-800/50 border border-white/10">
      <CardBody>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Users className="text-gray-400" size={20} />
            <Typography variant="h6">
              Participants ({tournament.participants?.length || 0})
            </Typography>
          </div>
          {isOrganizer && (
            <Button
              size="sm"
              className="flex items-center gap-2 bg-blue-600"
              onClick={() => setOpenAddDialog(true)}
            >
              <UserPlus size={16} />
              Add Participant
            </Button>
          )}
        </div>
        
        {/* Participant List */}
        <div className="space-y-2">
          {tournament.participants?.map((participant) => (
            <Card key={participant._id} className="bg-gray-700/50">
              <CardBody className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  {participant.isOrganizer && (
                    <Shield className="text-blue-400" size={16} />
                  )}
                  <Typography>{participant.name}</Typography>
                  <Typography className="text-gray-400">{participant.email}</Typography>
                </div>
                {isOrganizer && !participant.isOrganizer && (
                  <Button
                    size="sm"
                    variant="text"
                    color="red"
                    onClick={() => handleRemoveParticipant(participant._id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
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
      </CardBody>
    </Card>
  );
};

export default TournamentParticipantsTO; 