import Tournament from '../models/Tournament.js';
import Event from '../models/Event.js';
import logger from '../utils/logger.js';
import mongoose from 'mongoose';

export const isOrganizer = async (req, res, next) => {
  try {
    logger.info('isOrganizer middleware started', {
      params: req.params,
      userId: req.user._id
    });

    let tournamentId;

    // If tournamentId is directly in params (for tournament operations)
    if (req.params.tournamentId) {
      tournamentId = req.params.tournamentId;
    } 
    // If eventId is in params (for event operations)
    else if (req.params.eventId) {
      const event = await Event.findById(req.params.eventId);
      if (!event) {
        return res.status(404).json({
          success: false,
          error: 'Event not found'
        });
      }
      tournamentId = event.tournamentId;
    }

    if (!mongoose.Types.ObjectId.isValid(tournamentId)) {
      logger.warn('Invalid tournament ID format');
      return res.status(400).json({
        success: false,
        error: 'Invalid tournament ID format'
      });
    }

    const tournament = await Tournament.findById(tournamentId);
    
    if (!tournament) {
      logger.warn('Tournament not found');
      return res.status(404).json({
        success: false,
        error: 'Tournament not found'
      });
    }

    if (tournament.organizerId.toString() !== req.user._id.toString()) {
      logger.warn('User is not the tournament organizer', {
        userId: req.user._id,
        organizerId: tournament.organizerId
      });
      return res.status(403).json({
        success: false,
        error: 'Not authorized to perform this action'
      });
    }

    // Attach tournament to request object for later use
    req.tournament = tournament;
    next();
  } catch (error) {
    logger.error('Error in isOrganizer middleware', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      error: 'Internal server error checking organizer status'
    });
  }
}; 