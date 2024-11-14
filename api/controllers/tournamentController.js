import Tournament from '../models/Tournament.js';
import { createTournament } from '../services/tournament/tournamentService.js';
import logger from '../utils/logger.js';

export const createTournamentController = async (req, res) => {
  try {
    logger.info('Creating tournament', { userId: req.user._id });
    logger.debug('Tournament creation payload:', req.body);

    const tournamentData = {
      ...req.body,
      organizerId: req.user._id
    };

    const tournament = await createTournament(tournamentData);
    logger.info('Tournament created successfully', { 
      tournamentId: tournament._id,
      slug: tournament.slug 
    });
    
    res.status(201).json({ success: true, data: tournament });
  } catch (error) {
    logger.error('Failed to create tournament', { 
      error: error.message,
      userId: req.user._id,
      stack: error.stack 
    });
    res.status(400).json({ success: false, error: error.message });
  }
}; 

export const getTournamentController = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const tournament = await Tournament.findOne({ slug });
    
    if (!tournament) {
      return res.status(404).json({
        success: false,
        error: 'Tournament not found'
      });
    }

    res.status(200).json({
      success: true,
      data: tournament
    });
  } catch (error) {
    logger.error('Failed to fetch tournament', { 
      error: error.message,
      slug: req.params.slug,
      stack: error.stack 
    });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tournament details'
    });
  }
}; 

export const getAllTournamentsController = async (req, res) => {
  try {
    const tournaments = await Tournament.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(50); // Limit to 50 tournaments for now
    
    res.status(200).json({
      success: true,
      data: tournaments
    });
  } catch (error) {
    logger.error('Failed to fetch tournaments', { 
      error: error.message,
      stack: error.stack 
    });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tournaments'
    });
  }
}; 