import React from 'react';
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

const TournamentEventsTO = ({ tournament, isOrganizer, onUpdate }) => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [eventData, setEventData] = React.useState({
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
      const eventPayload = {
        ...eventData,
        tournamentId: tournament._id,
        format: eventData.format.toUpperCase().replace(' ', '_')
      };

      console.log('Sending event payload:', eventPayload);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/tournaments/${tournament._id}/events`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(eventPayload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create event');
      }
      
      const data = await response.json();
      console.log('Received new event data:', data);
      
      if (!data.data || !data.data._id) {
        throw new Error('Invalid event data received');
      }

      toast.success('Event created successfully');
      setOpen(false);
      
      if (onUpdate) {
        await onUpdate();
      }

      navigate(`/tournaments/${tournament._id}/events/${data.data._id}/to`);
    } catch (error) {
      console.error('Create event error:', error);
      toast.error(error.message);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/events/${eventId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      if (!response.ok) throw new Error('Failed to delete event');
      toast.success('Event deleted successfully');
      onUpdate(); // Refresh the tournament data
    } catch (error) {
      toast.error(error.message);
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
            className="bg-gray-800/50 border border-white/10 hover:bg-gray-700/50 transition-colors cursor-pointer"
            onClick={() => handleEventClick(event)}
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
                  <ChevronRight 
                    className="text-gray-400" 
                    size={20} 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!event?._id || !tournament?._id) {
                        console.error('Missing event or tournament ID:', { event, tournament });
                        return;
                      }
                      navigate(`/tournaments/${tournament._id}/events/${event._id}/to`);
                    }}
                  />
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