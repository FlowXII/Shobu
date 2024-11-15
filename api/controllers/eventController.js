import Event from '../models/Event.js';
import Tournament from '../models/Tournament.js';
import { createEvent, getEventById } from '../services/event/eventService.js';
import logger from '../utils/logger.js';

export const createEventController = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const eventData = {
      ...req.body,
      tournamentId
    };

    logger.info('Creating event', { tournamentId });
    const event = await createEvent(eventData);

    // Update tournament with new event
    await Tournament.findByIdAndUpdate(
      tournamentId,
      { $push: { events: event._id } }
    );

    res.status(201).json({ success: true, data: event });
  } catch (error) {
    logger.error('Failed to create event', { 
      error: error.message,
      stack: error.stack 
    });
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getEventController = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await getEventById(eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    logger.error('Failed to fetch event', { 
      error: error.message,
      eventId: req.params.eventId,
      stack: error.stack 
    });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch event details'
    });
  }
};

export const getTournamentEventsController = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const events = await Event.find({ tournamentId });
    
    res.status(200).json({
      success: true,
      data: events
    });
  } catch (error) {
    logger.error('Failed to fetch tournament events', { 
      error: error.message,
      tournamentId: req.params.tournamentId,
      stack: error.stack 
    });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tournament events'
    });
  }
}; 