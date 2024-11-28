import React, { useState } from 'react';
import { 
  Typography, 
  Card, 
  CardBody, 
  Button,
  Chip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Select,
  Option,
  Textarea
} from "@material-tailwind/react";
import { Plus, Edit2, Trash2, Users, Calendar, DollarSign, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useEventManagement } from '../../hooks/useEventManagement';

const TournamentEventsTO = ({ tournament, isOrganizer, onUpdate }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { loading, createEvent, deleteEvent } = useEventManagement(tournament._id);
  const [eventData, setEventData] = useState({
    name: "",
    game: "",
    startAt: new Date().toISOString().split('T')[0],
    maxEntrants: 32,
    entryFee: 0,
    format: "Double Elimination",
    description: "",
    rules: ""
  });

  const handleOpen = () => setOpen(true);
  
  const handleCreateEvent = async (event) => {
    event.preventDefault();
    try {
      const newEvent = await createEvent(eventData);
      setOpen(false);
      
      if (onUpdate) {
        await onUpdate();
      }

      navigate(`/tournaments/${tournament._id}/events/${newEvent._id}/to`);
    } catch (error) {
      console.error('Create event error:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await deleteEvent(eventId);
      onUpdate();
    } catch (error) {
      console.error('Delete event error:', error);
    }
  };

  const formatEntryFee = (entryFee) => {
    if (!entryFee) return 'Free';
    return `$${entryFee}`;
  };

  const inputProps = {
    className: "text-white focus:border-gray-400",
    labelProps: {
      className: "text-gray-300",
    },
    containerProps: {
      className: "text-white",
    },
    color: "gray"
  };

  const handleEventClick = (event) => {
    if (!event?._id || !tournament?._id) {
      console.error('Missing event or tournament ID:', { event, tournament });
      return;
    }
    console.log('Navigating to event:', {
      tournamentId: tournament._id,
      eventId: event._id
    });
    navigate(`/tournaments/${tournament._id}/events/${event._id}/to`);
  };

  const createEventDialog = (
    <Dialog 
      open={open} 
      handler={() => setOpen(false)} 
      size="md"
      className="bg-gray-800 text-white"
    >
      <form onSubmit={handleCreateEvent}>
        <DialogHeader className="text-white">Create New Event</DialogHeader>
        <DialogBody className="space-y-4">
          <Input
            label="Event Name"
            value={eventData.name}
            onChange={(e) => setEventData({...eventData, name: e.target.value})}
            required
            {...inputProps}
          />
          <Input
            label="Game Name"
            value={eventData.game}
            onChange={(e) => setEventData({...eventData, game: e.target.value})}
            required
            {...inputProps}
          />
          <Input
            type="date"
            label="Start Date"
            value={eventData.startAt}
            onChange={(e) => setEventData({...eventData, startAt: e.target.value})}
            required
            {...inputProps}
          />
          <Input
            type="number"
            label="Max Entrants"
            value={eventData.maxEntrants}
            onChange={(e) => setEventData({...eventData, maxEntrants: parseInt(e.target.value)})}
            required
            {...inputProps}
          />
          <Input
            type="number"
            label="Entry Fee ($)"
            value={eventData.entryFee}
            onChange={(e) => {
              const rawValue = e.target.value;
              const value = rawValue === '' ? 0 : Number(rawValue);
              console.log('Raw input value:', rawValue);
              console.log('Converted value:', value);
              console.log('Value type:', typeof value);
              setEventData({
                ...eventData,
                entryFee: value
              });
            }}
            min="0"
            step="1"
            {...inputProps}
          />
          <Select
            label="Format"
            value={eventData.format}
            onChange={(value) => setEventData({...eventData, format: value})}
            {...inputProps}
            menuProps={{
              className: "bg-gray-700 text-white",
            }}
          >
            <Option value="Single Elimination" className="hover:bg-gray-600">Single Elimination</Option>
            <Option value="Double Elimination" className="hover:bg-gray-600">Double Elimination</Option>
            <Option value="Round Robin" className="hover:bg-gray-600">Round Robin</Option>
          </Select>
          <Textarea
            label="Description"
            value={eventData.description}
            onChange={(e) => setEventData({...eventData, description: e.target.value})}
            {...inputProps}
          />
          <Textarea
            label="Rules"
            value={eventData.rules}
            onChange={(e) => setEventData({...eventData, rules: e.target.value})}
            {...inputProps}
          />
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button 
            variant="text" 
            onClick={() => setOpen(false)}
            className="text-gray-300 hover:text-white"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="bg-gray-700 hover:bg-gray-600"
          >
            Create Event
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {isOrganizer && (
        <div className="flex justify-end">
          <Button
            className="flex items-center gap-2 bg-gray-800 text-white"
            onClick={handleOpen}
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
            className="bg-gray-800/50 border border-white/10 hover:bg-gray-700/50 transition-colors cursor-pointer overflow-hidden"
            onClick={() => handleEventClick(event)}
          >
            <CardBody className="p-0">
              {/* Status Banner */}
              <div className={`px-4 py-1.5 text-xs font-medium ${
                new Date(event.startAt) < new Date() 
                  ? 'bg-green-500/20 text-green-300'
                  : 'bg-blue-500/20 text-blue-300'
              }`}>
                {new Date(event.startAt) < new Date() ? 'In Progress' : 'Upcoming'}
              </div>

              <div className="p-4 space-y-4">
                {/* Header Section */}
                <div className="flex justify-between items-start">
                  <div>
                    <Typography variant="h5" className="text-white font-bold">
                      {event.name}
                    </Typography>
                    <Typography className="text-gray-400">
                      {event.gameName || event.game}
                    </Typography>
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
                            handleEventClick(event);
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
                            handleDeleteEvent(event._id);
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Typography variant="small" className="text-gray-400">Format</Typography>
                    <Typography className="text-white">
                      {event.format || 'Double Elimination'}
                    </Typography>
                  </div>
                  <div className="space-y-1">
                    <Typography variant="small" className="text-gray-400">Start Time</Typography>
                    <Typography className="text-white">
                      {new Date(event.startAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </Typography>
                  </div>
                  <div className="space-y-1">
                    <Typography variant="small" className="text-gray-400">Participants</Typography>
                    <Typography className="text-white">
                      {event.participants?.length || 0}/{event.maxEntrants || '∞'}
                    </Typography>
                  </div>
                  <div className="space-y-1">
                    <Typography variant="small" className="text-gray-400">Entry Fee</Typography>
                    <Typography className="text-white">
                      {formatEntryFee(event.entryFee)}
                    </Typography>
                  </div>
                </div>

                {/* Description Preview */}
                {event.description && (
                  <div className="pt-2 border-t border-gray-700">
                    <Typography variant="small" className="text-gray-300 line-clamp-2">
                      {event.description}
                    </Typography>
                  </div>
                )}

                {/* Footer Chips */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {event.state === 1 && (
                    <Chip
                      size="sm"
                      value="Registration Open"
                      className="bg-green-500/20 text-green-300"
                    />
                  )}
                  {event.participants?.some(p => p.checkedIn) && (
                    <Chip
                      size="sm"
                      value={`${event.participants.filter(p => p.checkedIn).length} Checked In`}
                      className="bg-blue-500/20 text-blue-300"
                    />
                  )}
                  {event.sets?.length > 0 && (
                    <Chip
                      size="sm"
                      value={`${event.sets.length} Matches`}
                      className="bg-purple-500/20 text-purple-300"
                    />
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {createEventDialog}
    </div>
  );
};

export default TournamentEventsTO; 