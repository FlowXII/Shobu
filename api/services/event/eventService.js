import Event from '../../models/Event.js';
import logger from '../../utils/logger.js';

const validateEventData = (data) => {
  const errors = [];

  if (!data.name || data.name.trim().length < 3) {
    errors.push('Event name must be at least 3 characters long');
  }

  if (!data.tournamentId) {
    errors.push('Tournament ID is required');
  }

  if (!data.gameName) {
    errors.push('Game name is required');
  }

  if (data.maxEntrants && (isNaN(data.maxEntrants) || data.maxEntrants < 1)) {
    errors.push('Maximum entrants must be a positive number');
  }

  if (data.entryFee && (
    isNaN(data.entryFee.amount) || 
    data.entryFee.amount < 0
  )) {
    errors.push('Entry fee must be a non-negative number');
  }

  if (data.startAt) {
    const startDate = new Date(data.startAt);
    if (isNaN(startDate.getTime())) {
      errors.push('Invalid start date');
    }
  }

  return errors;
};

export const createEvent = async (eventData) => {
  logger.info('Event service: creating event', {
    eventName: eventData.name,
    tournamentId: eventData.tournamentId
  });

  try {
    logger.debug('Validating event data');
    const validationErrors = validateEventData(eventData);
    if (validationErrors.length > 0) {
      logger.warn('Event validation failed', { errors: validationErrors });
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }

    logger.debug('Creating new event instance');
    const event = new Event({
      name: eventData.name,
      tournamentId: eventData.tournamentId,
      slug: eventData.slug,
      startAt: eventData.startAt,
      state: eventData.state || 1,
      numEntrants: 0,
      maxEntrants: eventData.maxEntrants,
      gameName: eventData.gameName,
      gameId: eventData.gameId,
      format: eventData.format,
      description: eventData.description,
      rules: eventData.rules,
      registrationClosesAt: eventData.registrationClosesAt
    });

    logger.debug('Saving event to database');
    const savedEvent = await event.save();
    
    logger.info('Event created successfully', {
      eventId: savedEvent._id,
      tournamentId: savedEvent.tournamentId
    });

    return savedEvent;
  } catch (error) {
    logger.error('Database error while creating event', {
      error: error.message,
      stack: error.stack,
      eventData: {
        name: eventData.name,
        tournamentId: eventData.tournamentId
      }
    });
    throw new Error(`Error creating event: ${error.message}`);
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