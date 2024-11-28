import Event from '../models/Event.js';
import Tournament from '../models/Tournament.js';
import { createEvent, getEventById, registerParticipant } from '../services/event/eventService.js';
import logger from '../utils/logger.js';
import mongoose from 'mongoose';

const createEventController = async (req, res) => {
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

    logger.debug('Event created successfully', { event });

    // Convert to plain object if it's a mongoose document
    const eventObject = event.toObject ? event.toObject() : event;

    res.status(201).json({ 
      success: true, 
      data: eventObject
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

const getEventController = async (req, res) => {
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
      .populate({
        path: 'phases',
        populate: {
          path: 'sets',
          populate: {
            path: 'slots'
          }
        }
      })
      .populate('participants');

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

const getTournamentEventsController = async (req, res) => {
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

const registerForEventController = async (req, res) => {
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

const updateEventController = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    logger.info('Updating event', { 
      eventId,
      updateData: req.body
    });

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid event ID format'
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      logger.warn('Event not found for update', { eventId });
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    // Create update object only with provided fields
    const updateData = {};
    
    if (req.body.participants !== undefined) {
      updateData.participants = req.body.participants;
    }
    if (req.body.name !== undefined) {
      updateData.name = req.body.name;
    }
    if (req.body.description !== undefined) {
      updateData.description = req.body.description;
    }
    if (req.body.format !== undefined) {
      updateData.format = req.body.format;
    }
    if (req.body.maxEntrants !== undefined) {
      updateData.maxEntrants = Number(req.body.maxEntrants);
    }
    if (req.body.startAt !== undefined) {
      updateData.startAt = req.body.startAt;
    }
    if (req.body.entryFee !== undefined) {
      updateData.entryFee = Number(req.body.entryFee);
    }
    if (req.body.rules !== undefined) {
      updateData.rules = req.body.rules;
    }

    // Update event fields
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('tournamentId', 'name slug');

    logger.info('Event updated successfully', { 
      eventId,
      updatedEvent: updatedEvent._id 
    });

    res.status(200).json({
      success: true,
      data: updatedEvent
    });
  } catch (error) {
    logger.error('Failed to update event', { 
      error: error.message,
      eventId: req.params.eventId,
      stack: error.stack 
    });
    res.status(500).json({
      success: false,
      error: 'Failed to update event'
    });
  }
};

const deleteEventController = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    logger.info('Deleting event', { eventId });

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid event ID format'
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      logger.warn('Event not found for deletion', { eventId });
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    // Remove event reference from tournament
    await Tournament.findByIdAndUpdate(
      event.tournamentId,
      { $pull: { events: eventId } }
    );

    // Delete the event
    await Event.findByIdAndDelete(eventId);

    logger.info('Event deleted successfully', { eventId });

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    logger.error('Failed to delete event', { 
      error: error.message,
      eventId: req.params.eventId,
      stack: error.stack 
    });
    res.status(500).json({
      success: false,
      error: 'Failed to delete event'
    });
  }
};

const generateParticipantsController = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { participants } = req.body;
    
    logger.info('Generating participants for event', { 
      eventId,
      count: participants.length 
    });

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid event ID format'
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      logger.warn('Event not found for generating participants', { eventId });
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    // Add the new participants
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { 
        $push: { 
          participants: { 
            $each: participants.map(p => ({
              ...p,
              registeredAt: new Date(),
              checkedIn: false
            }))
          }
        }
      },
      { new: true, runValidators: true }
    ).populate('tournamentId', 'name slug');

    logger.info('Participants generated successfully', { 
      eventId,
      count: participants.length
    });

    res.status(200).json({
      success: true,
      data: updatedEvent
    });
  } catch (error) {
    logger.error('Failed to generate participants', { 
      error: error.message,
      eventId: req.params.eventId,
      stack: error.stack 
    });
    res.status(500).json({
      success: false,
      error: 'Failed to generate participants'
    });
  }
};

// Export the controllers
export {
  createEventController,
  getEventController,
  getTournamentEventsController,
  registerForEventController,
  updateEventController,
  deleteEventController,
  generateParticipantsController
}; 