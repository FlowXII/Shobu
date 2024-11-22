import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
} from "@material-tailwind/react";
import { toast } from 'react-toastify';
import LoadingIndicator from '../../components/layout/LoadingIndicator';
import { useEvent } from '../../hooks/useEvent';

const EventRegistration = () => {
  const { tournamentId, eventId } = useParams();
  const navigate = useNavigate();
  const { event, loading } = useEvent(eventId);
  const [formData, setFormData] = useState({
    gamerTag: '',
    prefix: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/tournaments/${tournamentId}/events/${eventId}/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      toast.success('Successfully registered for event!');
      navigate(`/tournaments/${tournamentId}/events/${eventId}`);
    } catch (error) {
      console.error('Error registering:', error);
      toast.error('Failed to register for event');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!event) {
    return (
      <Typography className="text-center text-gray-400">
        Event not found
      </Typography>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="bg-gray-900 border border-gray-800 shadow-xl">
        <CardBody className="p-8">
          <Typography variant="h2" className="mb-6 text-3xl font-bold text-blue-400">
            Register for {event.name}
          </Typography>

          <div className="mb-8 p-4 bg-gray-800 rounded-lg">
            <Typography className="text-gray-300">
              <span className="font-semibold">Event Details:</span>
              <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                <div>Start Time: {new Date(event.startAt).toLocaleString()}</div>
                <div>Entrants: {event.numEntrants} / {event.maxEntrants || '∞'}</div>
                <div>Game: {event.gameName}</div>
                <div>Format: {event.format || 'Double Elimination'}</div>
              </div>
            </Typography>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input
                type="text"
                label="Gamer Tag"
                value={formData.gamerTag}
                onChange={(e) => setFormData({ ...formData, gamerTag: e.target.value })}
                className="text-white bg-gray-800 border-gray-700"
                labelProps={{
                  className: "text-gray-400"
                }}
                required
              />
              <Typography className="text-xs text-gray-500">
                This is the name that will be displayed in the bracket
              </Typography>
            </div>

            <div className="space-y-2">
              <Input
                type="text"
                label="Team Prefix (optional)"
                value={formData.prefix}
                onChange={(e) => setFormData({ ...formData, prefix: e.target.value })}
                className="text-white bg-gray-800 border-gray-700"
                labelProps={{
                  className: "text-gray-400"
                }}
              />
              <Typography className="text-xs text-gray-500">
                Add your team or sponsor tag (e.g., TSM, C9)
              </Typography>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                variant="outlined"
                color="red"
                onClick={() => navigate(`/tournaments/${tournamentId}/events/${eventId}`)}
                className="hover:bg-red-900/20"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                color="blue"
                className="px-6 bg-blue-600 hover:bg-blue-700"
              >
                Register
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default EventRegistration; 