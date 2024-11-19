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
import PropTypes from 'prop-types';

const EventSettingsTO = ({ event, onUpdate, onDelete, isNew, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: event?.name || '',
    description: event?.description || '',
    format: event?.format || 'Double Elimination',
    maxEntrants: event?.maxEntrants || '',
    startAt: event?.startAt ? new Date(event.startAt).toISOString().slice(0, 16) : '',
    entryFee: event?.entryFee?.amount || 0,
    rules: event?.rules || '',
    // Add other fields as needed
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isNew) {
      onSubmit(formData);
    } else {
      onUpdate(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ... form fields ... */}
      <div className="flex gap-4">
        <Button type="submit" color="blue" className="flex-1">
          {isNew ? 'Create Event' : 'Update Event'}
        </Button>
        {!isNew && (
          <Button 
            type="button" 
            color="red" 
            className="flex-1"
            onClick={onDelete}
          >
            Delete Event
          </Button>
        )}
      </div>
    </form>
  );
};

EventSettingsTO.propTypes = {
  event: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default EventSettingsTO; 