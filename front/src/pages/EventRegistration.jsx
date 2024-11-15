import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
} from "@material-tailwind/react";
import { toast } from 'react-toastify';
import LoadingIndicator from '../components/LoadingIndicator';

const EventRegistration = () => {
  const { slug, eventSlug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [formData, setFormData] = useState({
    gamerTag: '',
    prefix: ''
  });

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/tournaments/${slug}/events/${eventSlug}`,
          { credentials: 'include' }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }

        const data = await response.json();
        setEvent(data.data);
      } catch (error) {
        console.error('Error fetching event:', error);
        toast.error('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [slug, eventSlug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/tournaments/${slug}/events/${eventSlug}/register`,
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
      navigate(`/tournaments/${slug}/events/${eventSlug}`);
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
    <div className="container mx-auto px-4 py-8">
      <Card className="bg-gray-900 text-white max-w-2xl mx-auto">
        <CardBody>
          <Typography variant="h2" className="mb-4">
            Register for {event.name}
          </Typography>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="text"
                label="Gamer Tag"
                value={formData.gamerTag}
                onChange={(e) => setFormData({ ...formData, gamerTag: e.target.value })}
                className="text-white"
                required
              />
            </div>

            <div>
              <Input
                type="text"
                label="Team Prefix (optional)"
                value={formData.prefix}
                onChange={(e) => setFormData({ ...formData, prefix: e.target.value })}
                className="text-white"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                color="red"
                onClick={() => navigate(`/tournaments/${slug}/events/${eventSlug}`)}
              >
                Cancel
              </Button>
              <Button type="submit" color="blue">
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