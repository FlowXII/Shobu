import Tournament from '../models/Tournament.js';
import logger from '../utils/logger.js';
import mongoose from 'mongoose';

export const isOrganizer = async (req, res, next) => {
  logger.info('isOrganizer middleware started', {
    params: req.params,
    userId: req.user?._id
  });

  try {
    const { tournamentId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(tournamentId)) {
      logger.warn('Invalid tournament ID format');
      return res.status(400).json({
        success: false,
        error: 'Invalid tournament ID format'
      });
    }

    logger.debug('Finding tournament', { tournamentId });
    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) {
      logger.warn('Tournament not found', { tournamentId });
      return res.status(404).json({
        success: false,
        error: 'Tournament not found'
      });
    }

    logger.debug('Tournament found, checking organizer', {
      tournamentId: tournament._id,
      userId: userId
    });

    if (tournament.organizerId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized: Only tournament organizers can perform this action'
      });
    }

    req.tournament = tournament;
    next();
  } catch (error) {
    logger.error('Error in organizer middleware', {
      error: error.message,
      userId: req.user._id,
      tournamentId: req.params.tournamentId,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}; 