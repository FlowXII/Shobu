import React, { useState } from 'react';
import { 
  Typography, 
  Card, 
  CardBody, 
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Chip
} from "@material-tailwind/react";
import { Plus, Edit2, Trash2, Users, Calendar, DollarSign, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const TournamentEvents = ({ tournament, isOrganizer, onUpdate }) => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [eventForm, setEventForm] = useState({
    name: '',
    game: '',
    startTime: '',
    maxParticipants: '',
    entryFee: ''
  });

  const handleViewEvent = (event) => {
    navigate(`/tournaments/${tournament.slug}/events/${event._id}`);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting to create event:', eventForm);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/tournaments/${tournament._id}/events`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            name: eventForm.name,
            game: eventForm.game,
            startTime: eventForm.startTime,
            maxParticipants: parseInt(eventForm.maxParticipants),
            entryFee: parseFloat(eventForm.entryFee)
          }),
        }
      );

      console.log('Response received:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error creating event:', errorData);
        throw new Error(errorData.error || 'Failed to create event');
      }

      const data = await response.json();
      console.log('Event created successfully:', data);

      toast.success('Event created successfully');
      setOpenDialog(false);
      onUpdate();
    } catch (error) {
      console.error('Error in handleCreateEvent:', error);
      toast.error(error.message || 'Failed to create event');
    }
  };

  const formatEntryFee = (entryFee) => {
    if (!entryFee) return 'Free';
    if (typeof entryFee === 'number') return `$${entryFee}`;
    if (typeof entryFee === 'object' && entryFee.amount) {
      return `$${entryFee.amount}`;
    }
    return 'Free';
  };

  return (
    <div className="space-y-6">
      {isOrganizer && (
        <div className="flex justify-end">
          <Button
            className="flex items-center gap-2 bg-gray-800 text-white"
            onClick={() => setOpenDialog(true)}
          >
            <Plus size={16} />
            Create Event
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tournament.events?.map((event) => (
          <Card 
            key={event._id} 
            className="bg-gray-800/50 border border-white/10 hover:bg-gray-700/50 transition-colors cursor-pointer"
            onClick={() => handleViewEvent(event)}
          >
            <CardBody>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Typography variant="h6" className="text-white">
                    {event.name}
                  </Typography>
                  <Typography className="text-gray-400 mb-2">
                    {event.gameName || event.game}
                  </Typography>
                  <div className="flex flex-wrap gap-2">
                    <Chip
                      value={
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(event.startAt || event.startTime).toLocaleDateString()}
                        </div>
                      }
                      className="bg-gray-700"
                    />
                    <Chip
                      value={
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          {event.numEntrants || 0}/{event.maxEntrants || '∞'}
                        </div>
                      }
                      className="bg-gray-700"
                    />
                    <Chip
                      value={
                        <div className="flex items-center gap-1">
                          <DollarSign size={14} />
                          {formatEntryFee(event.entryFee)}
                        </div>
                      }
                      className="bg-gray-700"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  {isOrganizer && (
                    <>
                      <Button 
                        size="sm" 
                        variant="text" 
                        className="text-gray-400 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add edit functionality
                        }}
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="text" 
                        className="text-red-400 hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add delete functionality
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </>
                  )}
                  <ChevronRight className="text-gray-400" size={20} />
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Dialog 
        open={openDialog} 
        handler={() => setOpenDialog(false)}
        className="bg-gray-900 text-white"
      >
        <form onSubmit={handleCreateEvent}>
          <DialogHeader className="text-white">Create New Event</DialogHeader>
          <DialogBody className="space-y-4">
            <Input
              label="Event Name"
              value={eventForm.name}
              onChange={(e) => setEventForm({...eventForm, name: e.target.value})}
              required
              className="!text-white"
              labelProps={{
                className: "!text-gray-200"
              }}
              color="white"
            />
            <Input
              label="Game"
              value={eventForm.game}
              onChange={(e) => setEventForm({...eventForm, game: e.target.value})}
              required
              className="!text-white"
              labelProps={{
                className: "!text-gray-200"
              }}
              color="white"
            />
            <Input
              type="datetime-local"
              label="Start Time"
              value={eventForm.startTime}
              onChange={(e) => setEventForm({...eventForm, startTime: e.target.value})}
              required
              className="!text-white"
              labelProps={{
                className: "!text-gray-200"
              }}
              color="white"
            />
            <Input
              type="number"
              label="Max Participants"
              value={eventForm.maxParticipants}
              onChange={(e) => setEventForm({...eventForm, maxParticipants: e.target.value})}
              className="!text-white"
              labelProps={{
                className: "!text-gray-200"
              }}
              color="white"
            />
            <Input
              type="number"
              label="Entry Fee"
              value={eventForm.entryFee}
              onChange={(e) => setEventForm({...eventForm, entryFee: e.target.value})}
              className="!text-white"
              labelProps={{
                className: "!text-gray-200"
              }}
              color="white"
            />
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
              Create
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
};

export default TournamentEvents; 