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

    // Check for both id and tournamentId in params
    if (req.params.tournamentId || req.params.id) {
      // Handle case where tournamentId might be a MongoDB object
      tournamentId = req.params.tournamentId?._id || req.params.tournamentId || req.params.id?._id || req.params.id;
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
      // Handle case where tournamentId might be a MongoDB object
      tournamentId = event.tournamentId?._id || event.tournamentId;
    }

    // Convert to string if it's an object
    if (typeof tournamentId === 'object' && tournamentId !== null) {
      tournamentId = tournamentId.toString();
    }

    logger.debug('Processing tournament ID', {
      originalId: req.params.tournamentId,
      processedId: tournamentId,
      type: typeof tournamentId
    });

    if (!tournamentId) {
      logger.warn('No tournament ID found in request');
      return res.status(400).json({
        success: false,
        error: 'Tournament ID is required'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(tournamentId)) {
      logger.warn('Invalid tournament ID format', { 
        tournamentId,
        type: typeof tournamentId
      });
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
      stack: error.stack,
      params: req.params
    });
    res.status(500).json({
      success: false,
      error: 'Internal server error checking organizer status'
    });
  }
}; 