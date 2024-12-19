import Event from '../../models/Event.js';
import logger from '../../utils/logger.js';
import mongoose from 'mongoose';
import { ValidationError, NotFoundError, AppError } from '../../utils/errors.js';

const validateEventData = (data) => {
  const errors = [];

  logger.debug('Entry fee validation:', {
    rawValue: data.entryFee,
    type: typeof data.entryFee,
    numberValue: Number(data.entryFee),
    isNaN: Number.isNaN(Number(data.entryFee))
  });

  if (!data.name || data.name.trim().length < 3) {
    throw new ValidationError('Event name must be at least 3 characters long');
  }

  if (!data.tournamentId) {
    throw new ValidationError('Tournament ID is required');
  }

  if (!data.game) {
    throw new ValidationError('Game name is required');
  }

  if (data.maxEntrants && Number(data.maxEntrants) < 1) {
    throw new ValidationError('Maximum entrants must be a positive number');
  }

  const entryFee = Number(data.entryFee);
  if (data.entryFee !== undefined && (Number.isNaN(entryFee) || entryFee < 0)) {
    throw new ValidationError('Entry fee must be a non-negative number');
  }

  if (data.startAt && isNaN(new Date(data.startAt).getTime())) {
    throw new ValidationError('Invalid start date');
  }
};

export const createEvent = async (eventData) => {
  logger.debug('Validating event data');
  await validateEventData(eventData);

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
    .exec();

  if (!populatedEvent) {
    throw new NotFoundError('Event not found after creation');
  }

  logger.debug('Created event with data:', populatedEvent);
  return populatedEvent;
};

export const getEventById = async (eventId) => {
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new ValidationError('Invalid event ID format');
  }

  try {
    const event = await Event.findById(eventId)
      .populate('sets')
      .populate('phases');
      
    if (!event) {
      throw new NotFoundError('Event');
    }
    
    return event;
  } catch (error) {
    if (error instanceof AppError) throw error;
    
    logger.error('Database error while fetching event', {
      error: error.message,
      stack: error.stack,
      eventId
    });
    throw new Error(`Error fetching event: ${error.message}`);
  }
};

export const registerParticipant = async (eventId, user) => {
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new ValidationError('Invalid event ID format');
  }

  if (!user || !user._id) {
    throw new ValidationError('Invalid user data provided');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const event = await Event.findById(eventId).session(session);
    
    if (!event) {
      throw new NotFoundError('Event');
    }

    if (event.registrationClosesAt && new Date() > event.registrationClosesAt) {
      throw new ValidationError('Registration is closed for this event');
    }

    if (event.maxEntrants && event.numEntrants >= event.maxEntrants) {
      throw new ValidationError('Event has reached maximum capacity');
    }

    // Check for duplicate registration using indexed field
    const existingRegistration = await Event.findOne({
      _id: eventId,
      'participants.userId': user._id
    }).session(session);
    
    if (existingRegistration) {
      throw new ValidationError('User is already registered for this event');
    }

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

    if (!result) {
      throw new NotFoundError('Event not found during update');
    }

    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    if (error instanceof AppError) throw error;
    
    logger.error('Error in registerParticipant:', {
      error: error.message,
      eventId,
      userId: user._id
    });
    throw new Error(`Failed to register participant: ${error.message}`);
  } finally {
    session.endSession();
  }
};

export const getEventParticipants = async (eventId, page = 1, limit = 50) => {
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new ValidationError('Invalid event ID format');
  }

  const skip = (page - 1) * limit;
  const event = await Event.findById(eventId)
    .select('participants')
    .slice('participants', [skip, limit]);

  if (!event) {
    throw new NotFoundError('Event');
  }

  return event.participants;
};

export const updateEvent = async (eventId, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new ValidationError('Invalid event ID format');
  }

  // Validate numeric fields if they exist in updateData
  if (updateData.maxEntrants && Number(updateData.maxEntrants) < 1) {
    throw new ValidationError('Maximum entrants must be a positive number');
  }

  if (updateData.entryFee !== undefined) {
    const entryFee = Number(updateData.entryFee);
    if (Number.isNaN(entryFee) || entryFee < 0) {
      throw new ValidationError('Entry fee must be a non-negative number');
    }
  }

  const updatedEvent = await Event.findByIdAndUpdate(
    eventId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate('tournamentId', 'name slug');

  if (!updatedEvent) {
    throw new NotFoundError('Event');
  }

  return updatedEvent;
}; 