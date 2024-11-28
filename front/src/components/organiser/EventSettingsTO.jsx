import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Typography,
  Input,
  Button,
  Textarea,
  Select,
  Option
} from "@material-tailwind/react";
import { Save, RotateCcw, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { updateEvent } from '../../loaders/eventLoader';

const EventSettingsTO = ({ event, onUpdate, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    format: 'DOUBLE_ELIMINATION',
    maxEntrants: '',
    startAt: '',
    entryFee: 0,
    rules: '',
    gameName: ''
  });

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name || '',
        description: event.description || '',
        format: event.format || 'DOUBLE_ELIMINATION',
        maxEntrants: event.maxEntrants || '',
        startAt: event.startAt ? new Date(event.startAt).toISOString().slice(0, 16) : '',
        entryFee: event.entryFee || 0,
        rules: event.rules || '',
        gameName: event.gameName || ''
      });
    }
  }, [event]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const updatedEvent = await updateEvent(event.tournamentId, event._id, formData);
      onUpdate(updatedEvent);
      toast.success('Event updated successfully');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (event) {
      setFormData({
        name: event.name || '',
        description: event.description || '',
        format: event.format || 'DOUBLE_ELIMINATION',
        maxEntrants: event.maxEntrants || '',
        startAt: event.startAt ? new Date(event.startAt).toISOString().slice(0, 16) : '',
        entryFee: event.entryFee || 0,
        rules: event.rules || '',
        gameName: event.gameName || ''
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="bg-gray-800/50">
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Event Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="!text-white"
            />
            <Input
              label="Game"
              name="gameName"
              value={formData.gameName}
              onChange={handleInputChange}
              required
              className="!text-white"
            />
          </div>

          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="!text-white"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Format"
              name="format"
              value={formData.format}
              onChange={(value) => handleInputChange({ target: { name: 'format', value }})}
              className="!text-white"
            >
              <Option value="SINGLE_ELIMINATION">Single Elimination</Option>
              <Option value="DOUBLE_ELIMINATION">Double Elimination</Option>
              <Option value="ROUND_ROBIN">Round Robin</Option>
            </Select>

            <Input
              type="number"
              label="Max Entrants"
              name="maxEntrants"
              value={formData.maxEntrants}
              onChange={handleInputChange}
              className="!text-white"
            />

            <Input
              type="number"
              label="Entry Fee"
              name="entryFee"
              value={formData.entryFee}
              onChange={handleInputChange}
              className="!text-white"
            />
          </div>

          <Input
            type="datetime-local"
            label="Start Time"
            name="startAt"
            value={formData.startAt}
            onChange={handleInputChange}
            className="!text-white"
          />

          <Textarea
            label="Rules"
            name="rules"
            value={formData.rules}
            onChange={handleInputChange}
            className="!text-white"
          />

          <div className="flex gap-4">
            <Button 
              type="submit" 
              className="flex-1 bg-blue-500 flex items-center justify-center gap-2"
              disabled={loading}
            >
              <Save size={16} />
              {loading ? 'Updating...' : 'Save Changes'}
            </Button>
            <Button 
              type="button" 
              variant="outlined"
              className="flex-1 flex items-center justify-center gap-2"
              onClick={handleReset}
            >
              <RotateCcw size={16} />
              Reset
            </Button>
            <Button 
              type="button" 
              color="red" 
              className="flex-1 flex items-center justify-center gap-2"
              onClick={onDelete}
            >
              <Trash2 size={16} />
              Delete
            </Button>
          </div>
        </CardBody>
      </Card>
    </form>
  );
};

EventSettingsTO.propTypes = {
  event: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default EventSettingsTO; 