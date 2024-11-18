import Event from '../models/Event.js';
import Tournament from '../models/Tournament.js';
import { createEvent, getEventById } from '../services/event/eventService.js';
import logger from '../utils/logger.js';
import mongoose from 'mongoose';

export const createEventController = async (req, res) => {
  logger.info('Create event controller started', {
    tournamentId: req.params.tournamentId,
    body: req.body
  });

  try {
    const tournament = req.tournament;
    
    const eventData = {
      ...req.body,
      tournamentId: tournament._id,
      gameName: req.body.game,
      entryFee: {
        amount: parseFloat(req.body.entryFee),
        currency: 'USD' // Default currency
      },
      startAt: req.body.startTime, // Match the model field name
      maxEntrants: parseInt(req.body.maxParticipants) // Match the model field name
    };

    logger.debug('Creating event with data', { eventData });
    const event = await createEvent(eventData);

    logger.debug('Event created, updating tournament', {
      eventId: event._id,
      tournamentId: tournament._id
    });

    // Update tournament with new event
    await Tournament.findByIdAndUpdate(
      tournament._id,
      { $push: { events: event._id } }
    );

    logger.info('Event created successfully', {
      eventId: event._id,
      tournamentId: tournament._id
    });

    res.status(201).json({ success: true, data: event });
  } catch (error) {
    logger.error('Failed to create event', { 
      error: error.message,
      stack: error.stack,
      tournamentId: req.params.tournamentId,
      body: req.body
    });
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getEventController = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    logger.info('Fetching event details', { eventId });

    const event = await Event.findById(eventId)
      .populate('tournamentId', 'name slug'); // Optionally populate tournament info

    if (!event) {
      logger.warn('Event not found', { eventId });
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    logger.info('Event found successfully', { eventId });
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
      error: 'Failed to fetch event'
    });
  }
};

export const getTournamentEventsController = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(tournamentId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid tournament ID format'
      });
    }

    // Find events using the tournament's ID directly
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

export const registerForEventController = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;

    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    // Check if registration is closed
    if (event.registrationClosesAt && new Date() > new Date(event.registrationClosesAt)) {
      return res.status(400).json({
        success: false,
        error: 'Registration is closed for this event'
      });
    }

    // Check if event is full
    if (event.maxEntrants && event.numEntrants >= event.maxEntrants) {
      return res.status(400).json({
        success: false,
        error: 'Event has reached maximum capacity'
      });
    }

    // Check if user is already registered
    if (event.participants.includes(userId)) {
      return res.status(400).json({
        success: false,
        error: 'You are already registered for this event'
      });
    }

    // Add user to participants and increment numEntrants
    event.participants.push(userId);
    event.numEntrants += 1;
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Successfully registered for event'
    });
  } catch (error) {
    logger.error('Failed to register for event', { 
      error: error.message,
      eventId: req.params.eventId,
      userId: req.user._id,
      stack: error.stack 
    });
    res.status(500).json({
      success: false,
      error: 'Failed to register for event'
    });
  }
}; 