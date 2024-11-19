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

  if (data.registrationStartAt && data.registrationEndAt) {
    const regStart = new Date(data.registrationStartAt);
    const regEnd = new Date(data.registrationEndAt);
    const tournamentStart = new Date(data.startAt);

    if (regEnd < regStart) {
      errors.push('Registration end date cannot be before registration start date');
    }
    if (regEnd > tournamentStart) {
      errors.push('Registration must end before tournament starts');
    }
  }

  if (!['SINGLE_ELIMINATION', 'DOUBLE_ELIMINATION', 'ROUND_ROBIN'].includes(data.type)) {
    errors.push('Invalid tournament type');
  }

  if (data.maxAttendees && (isNaN(data.maxAttendees) || data.maxAttendees < 2)) {
    errors.push('Maximum attendees must be at least 2');
  }

  if (data.events) {
    data.events.forEach((event, index) => {
      if (!event.eventId) {
        errors.push(`Event at index ${index} must have an eventId`);
      }
      if (event.startAt && event.endAt && new Date(event.endAt) < new Date(event.startAt)) {
        errors.push(`Event at index ${index} cannot end before it starts`);
      }
      if (!['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].includes(event.status)) {
        errors.push(`Invalid status for event at index ${index}`);
      }
    });
  }

  if (data.location) {
    if (data.location.country && data.location.country.length < 2) {
      errors.push('Country name must be at least 2 characters long');
    }
    if (data.location.venueAddress && data.location.venueAddress.length < 5) {
      errors.push('Venue address must be at least 5 characters long');
    }
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
      location: tournamentData.location ? {
        city: tournamentData.location.city || '',
        state: tournamentData.location.state || '',
        country: tournamentData.location.country || '',
        venueAddress: tournamentData.location.venueAddress || ''
      } : undefined,
      registrationStartAt: tournamentData.registrationStartAt ? new Date(tournamentData.registrationStartAt) : undefined,
      registrationEndAt: tournamentData.registrationEndAt ? new Date(tournamentData.registrationEndAt) : undefined,
      maxAttendees: tournamentData.maxAttendees,
      events: Array.isArray(tournamentData.events) ? tournamentData.events.map(event => ({
        eventId: event.eventId,
        startAt: event.startAt ? new Date(event.startAt) : undefined,
        endAt: event.endAt ? new Date(event.endAt) : undefined,
        venue: event.venue,
        status: event.status || 'SCHEDULED'
      })) : [],
      images: Array.isArray(tournamentData.images) ? tournamentData.images : [],
      status: tournamentData.status || 'DRAFT'
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

export const updateTournament = async (tournamentId, updateData) => {
  try {
    const validationErrors = validateTournamentData(updateData);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }

    const tournament = await Tournament.findByIdAndUpdate(
      tournamentId,
      { 
        ...updateData,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!tournament) {
      throw new Error('Tournament not found');
    }

    return tournament;
  } catch (error) {
    logger.error('Error updating tournament', {
      error: error.message,
      tournamentId,
      updateData
    });
    throw error;
  }
};

export const registerForTournament = async (tournamentId, userId) => {
  const tournament = await Tournament.findById(tournamentId);
  if (!tournament) {
    throw new Error('Tournament not found');
  }

  if (!tournament.canUserRegister(userId)) {
    throw new Error('Registration is not available');
  }

  tournament.attendees.push({
    userId,
    status: 'REGISTERED',
    registeredAt: new Date()
  });

  return await tournament.save();
};

export const checkInAttendee = async (tournamentId, userId) => {
  const tournament = await Tournament.findById(tournamentId);
  if (!tournament) {
    throw new Error('Tournament not found');
  }

  const attendee = tournament.attendees.find(a => a.userId.toString() === userId.toString());
  if (!attendee) {
    throw new Error('Attendee not found');
  }

  if (attendee.status !== 'REGISTERED') {
    throw new Error('Attendee cannot be checked in');
  }

  attendee.status = 'CHECKED_IN';
  attendee.checkedInAt = new Date();

  return await tournament.save();
};

export const cancelRegistration = async (tournamentId, userId) => {
  const tournament = await Tournament.findById(tournamentId);
  if (!tournament) {
    throw new Error('Tournament not found');
  }

  const attendee = tournament.attendees.find(a => a.userId.toString() === userId.toString());
  if (!attendee) {
    throw new Error('Registration not found');
  }

  if (attendee.status === 'CANCELLED') {
    throw new Error('Registration already cancelled');
  }

  attendee.status = 'CANCELLED';
  attendee.cancelledAt = new Date();

  return await tournament.save();
}; 