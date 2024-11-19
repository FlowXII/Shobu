import Event from '../models/Event.js';
import Tournament from '../models/Tournament.js';
import { createEvent, getEventById, registerParticipant } from '../services/event/eventService.js';
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
      entryFee: Number(req.body.entryFee),
      startAt: req.body.startAt,
      maxEntrants: Number(req.body.maxEntrants)
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

    logger.debug('Event created successfully', {
      event: event.toObject(),
      tournamentId: tournament._id
    });

    res.status(201).json({ 
      success: true, 
      data: event.toObject() 
    });
  } catch (error) {
    logger.error('Failed to create event', { 
      error: error.message,
      stack: error.stack,
      tournamentId: req.params.tournamentId,
      body: req.body
    });
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
};

export const getEventController = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    logger.info('Fetching event details', { 
      eventId,
      isValidObjectId: mongoose.Types.ObjectId.isValid(eventId)
    });

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid event ID format'
      });
    }

    const event = await Event.findById(eventId)
      .populate('tournamentId', 'name slug');

    if (!event) {
      logger.warn('Event not found', { eventId });
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    logger.info('Event found successfully', { 
      eventId,
      eventData: event._id 
    });
    
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
    const user = req.user;

    // Add validation for user object
    if (!user || !user._id) {
      logger.error('Registration attempted without valid user', { eventId });
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    // Use the service layer instead of direct model operations
    const updatedEvent = await registerParticipant(eventId, user);

    res.status(200).json({
      success: true,
      message: 'Successfully registered for event',
      data: updatedEvent
    });
  } catch (error) {
    logger.error('Failed to register for event', { 
      error: error.message,
      eventId: req.params.eventId,
      userId: req?.user?._id,
      stack: error.stack 
    });
    
    // Better error handling with appropriate status codes
    const statusCode = error.message.includes('not found') ? 404 : 
                      error.message.includes('already registered') ? 400 : 
                      error.message.includes('closed') || error.message.includes('full') ? 400 : 
                      500;
                      
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
}; 