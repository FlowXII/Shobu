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

  return errors;
};

export const createEvent = async (eventData) => {
  try {
    const validationErrors = validateEventData(eventData);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }

    const event = new Event({
      name: eventData.name,
      tournamentId: eventData.tournamentId,
      slug: eventData.slug,
      startAt: eventData.startAt,
      state: eventData.state || 1, // Default to created state
      numEntrants: eventData.numEntrants || 0,
      videogame: eventData.videogame
    });

    const savedEvent = await event.save();
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