import Tournament from '../../models/Tournament.js';
import logger from '../../utils/logger.js';

const validateTournamentData = (data) => {
  const errors = [];

  if (!data.name || data.name.trim().length < 3) {
    errors.push('Tournament name must be at least 3 characters long');
  }

  if (!data.slug || !/^[a-zA-Z0-9-]+$/.test(data.slug)) {
    errors.push('Slug must contain only letters, numbers, and hyphens');
  }

  if (!data.startAt) {
    errors.push('Start date is required');
  }

  if (data.endAt && new Date(data.endAt) < new Date(data.startAt)) {
    errors.push('End date cannot be before start date');
  }

  if (!['SINGLE_ELIMINATION', 'DOUBLE_ELIMINATION', 'ROUND_ROBIN'].includes(data.type)) {
    errors.push('Invalid tournament type');
  }

  if (data.numAttendees && (isNaN(data.numAttendees) || data.numAttendees < 0)) {
    errors.push('Number of attendees must be a positive number');
  }

  return errors;
};

export const createTournament = async (tournamentData) => {
  try {
    const validationErrors = validateTournamentData(tournamentData);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }

    logger.debug('Attempting to create tournament in database', {
      name: tournamentData.name,
      slug: tournamentData.slug
    });

    const tournament = new Tournament({
      name: tournamentData.name,
      description: tournamentData.description,
      slug: tournamentData.slug,
      organizerId: tournamentData.organizerId,
      startAt: new Date(tournamentData.startAt),
      endAt: tournamentData.endAt ? new Date(tournamentData.endAt) : undefined,
      type: tournamentData.type,
      location: {
        city: tournamentData.location?.city || '',
        state: tournamentData.location?.state || '',
        country: tournamentData.location?.country || '',
        venueAddress: tournamentData.location?.venueAddress || ''
      },
      numAttendees: tournamentData.numAttendees,
      images: Array.isArray(tournamentData.images) ? tournamentData.images : []
    });

    const savedTournament = await tournament.save();
    logger.debug('Tournament saved successfully', { 
      tournamentId: savedTournament._id 
    });
    
    return savedTournament;
  } catch (error) {
    logger.error('Database error while creating tournament', {
      error: error.message,
      stack: error.stack,
      tournamentData: {
        name: tournamentData.name,
        slug: tournamentData.slug,
        organizerId: tournamentData.organizerId
      }
    });
    throw new Error(`Error creating tournament: ${error.message}`);
  }
}; 