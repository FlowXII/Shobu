import Tournament from '../../models/Tournament.js';
import logger from '../../utils/logger.js';
import User from '../../models/User.js';
import mongoose from 'mongoose';
import { ValidationError, NotFoundError, AppError } from '../../utils/errors.js';

const updateInProgressMap = new Map();

const isUpdateInProgress = (userId) => {
  return updateInProgressMap.get(userId) === true;
};

const setUpdateInProgress = (userId, value) => {
  if (value) {
    updateInProgressMap.set(userId, true);
  } else {
    updateInProgressMap.delete(userId);
  }
};

const validateTournamentData = (data) => {
  if (!data.name || data.name.trim().length < 3) {
    throw new ValidationError('Tournament name must be at least 3 characters long');
  }

  if (!data.slug || !/^[a-zA-Z0-9-]+$/.test(data.slug)) {
    throw new ValidationError('Slug must contain only letters, numbers, and hyphens');
  }

  if (!data.startAt) {
    throw new ValidationError('Start date is required');
  }

  if (data.endAt && new Date(data.endAt) < new Date(data.startAt)) {
    throw new ValidationError('End date cannot be before start date');
  }

  if (data.registrationStartAt && data.registrationEndAt) {
    const regStart = new Date(data.registrationStartAt);
    const regEnd = new Date(data.registrationEndAt);
    const tournamentStart = new Date(data.startAt);

    if (regEnd < regStart) {
      throw new ValidationError('Registration end date cannot be before registration start date');
    }
    if (regEnd > tournamentStart) {
      throw new ValidationError('Registration must end before tournament starts');
    }
  }

  if (!['SINGLE_ELIMINATION', 'DOUBLE_ELIMINATION', 'ROUND_ROBIN'].includes(data.type)) {
    throw new ValidationError('Invalid tournament type');
  }

  if (data.maxAttendees && (isNaN(data.maxAttendees) || data.maxAttendees < 2)) {
    throw new ValidationError('Maximum attendees must be at least 2');
  }

  if (data.events) {
    data.events.forEach((event, index) => {
      if (!event.eventId) {
        throw new ValidationError(`Event at index ${index} must have an eventId`);
      }
      if (event.startAt && event.endAt && new Date(event.endAt) < new Date(event.startAt)) {
        throw new ValidationError(`Event at index ${index} cannot end before it starts`);
      }
      if (!['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].includes(event.status)) {
        throw new ValidationError(`Invalid status for event at index ${index}`);
      }
    });
  }

  if (data.location) {
    if (data.location.country && data.location.country.length < 2) {
      throw new ValidationError('Country name must be at least 2 characters long');
    }
    if (data.location.venueAddress && data.location.venueAddress.length < 5) {
      throw new ValidationError('Venue address must be at least 5 characters long');
    }
  }
};

export const createTournament = async (tournamentData) => {
  try {
    validateTournamentData(tournamentData);

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
    
    if (!savedTournament) {
      throw new AppError('Failed to create tournament', 500);
    }

    return savedTournament;
  } catch (error) {
    if (error instanceof AppError) throw error;
    
    logger.error('Database error while creating tournament', {
      error: error.message,
      stack: error.stack,
      tournamentData: {
        name: tournamentData.name,
        slug: tournamentData.slug,
        organizerId: tournamentData.organizerId
      }
    });
    throw new AppError(`Error creating tournament: ${error.message}`, 500);
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
    throw new NotFoundError('Tournament');
  }

  if (!tournament.isRegistrationOpen) {
    throw new ValidationError('Tournament registration is closed');
  }

  if (tournament.attendees.length >= tournament.maxParticipants) {
    throw new ValidationError('Tournament is at full capacity');
  }

  tournament.attendees.push({
    userId,
    status: 'REGISTERED',
    registeredAt: new Date()
  });

  await updateUserTournamentStats(userId);
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

  await updateUserTournamentStats(userId);
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

  await updateUserTournamentStats(userId);
  return await tournament.save();
};

const updateUserTournamentStats = async (userId) => {
  if (isUpdateInProgress(userId)) {
    return;
  }

  try {
    setUpdateInProgress(userId, true);
    
    const [organizerCount, participantCount, recentTournaments] = await Promise.all([
      Tournament.countDocuments({ organizerId: userId }),
      Tournament.countDocuments({ 'attendees.userId': userId }),
      Tournament.find({ 
        'attendees.userId': userId,
        status: { $in: ['COMPLETED', 'IN_PROGRESS'] }
      })
      .sort({ startAt: -1 })
      .limit(5)
      .select('_id name startAt attendees')
    ]);

    // Calculate placements from recent tournaments
    const recentResults = recentTournaments.map(tournament => {
      const attendee = tournament.attendees.find(a => 
        a.userId.toString() === userId.toString()
      );
      return {
        tournamentId: tournament._id,
        placement: attendee?.placement || null,
        date: tournament.startAt
      };
    }).filter(result => result.placement !== null);

    // Calculate total matches and wins from all tournaments
    const [totalMatches, totalWins] = await Tournament.aggregate([
      { 
        $match: { 
          'attendees.userId': new mongoose.Types.ObjectId(userId) 
        } 
      },
      { $unwind: '$attendees' },
      { 
        $match: { 
          'attendees.userId': new mongoose.Types.ObjectId(userId) 
        } 
      },
      {
        $group: {
          _id: null,
          totalMatches: { $sum: '$attendees.matchesPlayed' },
          totalWins: { $sum: '$attendees.matchesWon' }
        }
      }
    ]).then(result => result[0] ? [result[0].totalMatches, result[0].totalWins] : [0, 0]);

    // Use atomic operations for updates
    await User.findByIdAndUpdate(userId, {
      $set: {
        'statsCache.tournamentsOrganized': organizerCount,
        'statsCache.tournamentsParticipated': participantCount,
        'statsCache.lastUpdated': new Date(),
        'statsCache.totalMatches': totalMatches,
        'statsCache.totalWins': totalWins,
        'statsCache.recentResults': recentResults
      }
    }, { 
      new: true,
      // Only update if cache is older than 5 minutes
      condition: { 
        $or: [
          { 'statsCache.lastUpdated': { $exists: false } },
          { 'statsCache.lastUpdated': { $lt: new Date(Date.now() - 5 * 60 * 1000) } }
        ]
      }
    });
  } finally {
    setUpdateInProgress(userId, false);
  }
};

export const updateTournamentResults = async (tournamentId, results) => {
  const tournament = await Tournament.findById(tournamentId);
  if (!tournament) {
    throw new Error('Tournament not found');
  }

  // Validate results format
  if (!Array.isArray(results) || !results.every(r => r.userId && r.placement)) {
    throw new Error('Invalid results format');
  }

  // Update placements for each attendee
  for (const result of results) {
    const attendee = tournament.attendees.find(
      a => a.userId.toString() === result.userId.toString()
    );
    if (attendee) {
      attendee.placement = result.placement;
      attendee.matchesPlayed = result.matchesPlayed || 0;
      attendee.matchesWon = result.matchesWon || 0;
    }
  }

  // Update tournament status
  tournament.status = 'COMPLETED';
  await tournament.save();

  // Update stats for all participants
  const updatePromises = tournament.attendees.map(attendee => 
    updateUserTournamentStats(attendee.userId)
  );
  await Promise.all(updatePromises);

  return tournament;
}; 