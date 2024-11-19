import Event from '../../models/Event.js';
import logger from '../../utils/logger.js';
import mongoose from 'mongoose';

const validateEventData = (data) => {
  const errors = [];

  logger.debug('Entry fee validation:', {
    rawValue: data.entryFee,
    type: typeof data.entryFee,
    numberValue: Number(data.entryFee),
    isNaN: Number.isNaN(Number(data.entryFee))
  });

  if (!data.name || data.name.trim().length < 3) {
    errors.push('Event name must be at least 3 characters long');
  }

  if (!data.tournamentId) {
    errors.push('Tournament ID is required');
  }

  if (!data.game) {
    errors.push('Game name is required');
  }

  if (data.maxEntrants && Number(data.maxEntrants) < 1) {
    errors.push('Maximum entrants must be a positive number');
  }

  const entryFee = Number(data.entryFee);
  if (data.entryFee !== undefined && (Number.isNaN(entryFee) || entryFee < 0)) {
    errors.push('Entry fee must be a non-negative number');
  }

  if (data.startAt && isNaN(new Date(data.startAt).getTime())) {
    errors.push('Invalid start date');
  }

  return errors;
};

export const createEvent = async (eventData) => {
  try {
    logger.debug('Validating event data');
    const validationErrors = validateEventData(eventData);
    
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }

    logger.debug('Creating new event instance');
    const event = new Event({
      name: eventData.name,
      tournamentId: eventData.tournamentId,
      startAt: new Date(eventData.startAt),
      state: 1,
      numEntrants: 0,
      maxEntrants: Number(eventData.maxEntrants),
      gameName: eventData.game,
      entryFee: Math.max(0, Number(eventData.entryFee) || 0),
      format: eventData.format,
      description: eventData.description || '',
      rules: eventData.rules || ''
    });

    const savedEvent = await event.save();
    
    // Populate the tournament reference before returning
    const populatedEvent = await Event.findById(savedEvent._id)
      .populate('tournamentId', 'name slug')
      .lean()  // Convert to plain object
      .exec();

    logger.debug('Created event with data:', populatedEvent);
    return populatedEvent;
  } catch (error) {
    logger.error('Error creating event:', error);
    throw error;
  }
};

export const getEventById = async (eventId) => {
  try {
    const event = await Event.findById(eventId)
      .populate('sets')
      .populate('phases');
    return event;
  } catch (error) {
    logger.error('Database error while fetching event', {
      error: error.message,
      stack: error.stack,
      eventId
    });
    throw new Error(`Error fetching event: ${error.message}`);
  }
};

export const registerParticipant = async (eventId, user) => {
  // Validate user parameter
  if (!user || !user._id) {
    throw new Error('Invalid user data provided');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const event = await Event.findById(eventId).session(session);
    
    // Enhanced validation checks
    if (!event) throw new Error('Event not found');
    if (event.registrationClosesAt && new Date() > event.registrationClosesAt) {
      throw new Error('Registration is closed for this event');
    }
    if (event.maxEntrants && event.numEntrants >= event.maxEntrants) {
      throw new Error('Event has reached maximum capacity');
    }

    // Check for duplicate registration using indexed field
    const existingRegistration = await Event.findOne({
      _id: eventId,
      'participants.userId': user._id
    }).session(session);
    
    if (existingRegistration) {
      throw new Error('User is already registered for this event');
    }

    // Add participant with required user data
    const result = await Event.findByIdAndUpdate(
      eventId,
      {
        $push: {
          participants: {
            userId: user._id,
            displayName: user.displayName || user.username || 'Unknown Player',
            registeredAt: new Date()
          }
        },
        $inc: { numEntrants: 1 }
      },
      { new: true, session }
    );

    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const getEventParticipants = async (eventId, page = 1, limit = 50) => {
  const skip = (page - 1) * limit;
  return Event.findById(eventId)
    .select('participants')
    .slice('participants', [skip, limit]);
}; 