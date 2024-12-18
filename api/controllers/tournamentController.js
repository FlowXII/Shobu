import Tournament from '../models/Tournament.js';
import { createTournament } from '../services/tournament/tournamentService.js';
import logger from '../utils/logger.js';
import { 
  registerForTournament, 
  updateTournament, 
  checkInAttendee,
  cancelRegistration,
  updateTournamentResults
} from '../services/tournament/tournamentService.js';
import { validateTournamentData } from '../validators/tournamentValidator.js';
import mongoose from 'mongoose';

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
    const { id } = req.params;

    // Log the incoming tournament ID
    console.log('Received tournament ID:', id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('Invalid tournament ID format:', id);
      return res.status(400).json({
        success: false,
        error: 'Invalid tournament ID format'
      });
    }

    const tournament = await Tournament.findById(id)
      .populate({
        path: 'events',
        model: 'Event'
      });

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
    console.error('Failed to fetch tournament', { 
      error: error.message,
      id: req.params.id,
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

export const updateTournamentController = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Add detailed logging for debugging
    logger.info('Update tournament request received', {
      id,
      idType: typeof id,
      idLength: id?.length,
      body: req.body,
      isValidObjectId: mongoose.Types.ObjectId.isValid(id)
    });

    // Test creating an ObjectId
    try {
      const testObjectId = new mongoose.Types.ObjectId(id);
      logger.info('Successfully created ObjectId', { testObjectId: testObjectId.toString() });
    } catch (err) {
      logger.warn('Failed to create ObjectId', { error: err.message });
    }

    // Improved ID validation
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      logger.warn('Invalid tournament ID format', { 
        id,
        type: typeof id,
        length: id?.length,
        isValidObjectId: mongoose.Types.ObjectId.isValid(id)
      });
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid tournament ID format' 
      });
    }

    const tournament = await Tournament.findById(id);
    
    if (!tournament) {
      logger.warn('Tournament not found', { id });
      return res.status(404).json({ 
        success: false, 
        error: 'Tournament not found' 
      });
    }

    // Check if user is the organizer
    if (tournament.organizerId.toString() !== req.user._id.toString()) {
      logger.warn('Unauthorized tournament update attempt', { 
        userId: req.user._id,
        tournamentId: id 
      });
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized' 
      });
    }

    const updatedTournament = await Tournament.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    logger.info('Tournament updated successfully', { 
      tournamentId: id,
      userId: req.user._id 
    });

    res.status(200).json({ success: true, data: updatedTournament });
  } catch (error) {
    logger.error('Failed to update tournament', { 
      error: error.message, 
      id: req.params.id,
      stack: error.stack 
    });
    res.status(400).json({ success: false, error: error.message });
  }
};

export const deleteTournamentController = async (req, res) => {
  try {
    const { id } = req.params;
    const tournament = await Tournament.findById(id);
    
    if (!tournament) {
      return res.status(404).json({ success: false, error: 'Tournament not found' });
    }

    // Check if user is the organizer
    if (tournament.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    await Tournament.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Tournament deleted successfully' });
  } catch (error) {
    logger.error('Failed to delete tournament', { error: error.message, id: req.params.id });
    res.status(400).json({ success: false, error: error.message });
  }
}; 

export const registerForTournamentController = async (req, res) => {
  try {
    const { id } = req.params;
    const tournament = await Tournament.findById(id);
    
    if (!tournament) {
      return res.status(404).json({ 
        success: false, 
        error: 'Tournament not found' 
      });
    }

    // Check if registration is open
    if (!tournament.isRegistrationOpen) {
      return res.status(400).json({
        success: false,
        error: 'Tournament registration is closed'
      });
    }

    // Check if tournament is at capacity
    if (tournament.attendees.length >= tournament.maxParticipants) {
      return res.status(400).json({
        success: false,
        error: 'Tournament is at full capacity'
      });
    }

    const updatedTournament = await registerForTournament(tournament._id, req.user._id);
    
    logger.info('User registered for tournament', {
      userId: req.user._id,
      tournamentId: tournament._id
    });

    res.status(200).json({
      success: true,
      data: updatedTournament
    });
  } catch (error) {
    logger.error('Failed to register for tournament', {
      error: error.message,
      userId: req.user._id,
      id: req.params.id
    });
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const checkInAttendeeController = async (req, res) => {
  try {
    const { id, userId } = req.params;

    const tournament = await Tournament.findById(id);
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    // Check if user is registered
    if (!tournament.attendees.includes(userId)) {
      return res.status(400).json({ error: 'Attendee not found' });
    }

    // Check-in logic here
    // For example, mark the user as checked in
    tournament.checkedInAttendees.push(userId);
    await tournament.save();

    res.status(200).json({ success: true, data: tournament });
  } catch (error) {
    console.error('Error checking in attendee', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const cancelRegistrationController = async (req, res) => {
  try {
    const { id } = req.params;
    const tournament = await Tournament.findById(id);
    
    if (!tournament) {
      return res.status(404).json({ 
        success: false, 
        error: 'Tournament not found' 
      });
    }

    const updatedTournament = await cancelRegistration(tournament._id, req.user._id);
    
    logger.info('Registration cancelled', {
      userId: req.user._id,
      tournamentId: tournament._id
    });

    res.status(200).json({
      success: true,
      data: updatedTournament
    });
  } catch (error) {
    logger.error('Failed to cancel registration', {
      error: error.message,
      userId: req.user._id,
      id: req.params.id
    });
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}; 

export const completeTournamentController = async (req, res) => {
  try {
    const { id } = req.params;
    const { results } = req.body;

    if (!Array.isArray(results)) {
      return res.status(400).json({
        success: false,
        error: 'Results must be an array'
      });
    }

    const updatedTournament = await updateTournamentResults(id, results);
    
    res.status(200).json({
      success: true,
      data: updatedTournament
    });
  } catch (error) {
    logger.error('Failed to complete tournament', {
      error: error.message,
      id: req.params.id,
      stack: error.stack
    });
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}; 

export const getUserTournamentsController = async (req, res) => {
  try {
    logger.info('Accessing user tournaments', { userId: req.user._id });

    const tournaments = await Tournament.find({
      $or: [
        { organizerId: req.user._id },
        { 'attendees.userId': req.user._id }
      ]
    })
    .populate('events')
    .sort({ createdAt: -1 });
    
    logger.info('Fetched tournaments:', { tournaments });

    const organizing = tournaments.filter(t => t.organizerId.toString() === req.user._id.toString());
    const participating = tournaments.filter(t => 
      t.organizerId.toString() !== req.user._id.toString() && 
      t.attendees.some(a => a.userId.toString() === req.user._id.toString())
    );

    res.status(200).json({
      success: true,
      data: {
        organizing,
        participating
      }
    });
  } catch (error) {
    logger.error('Failed to fetch user tournaments', { 
      error: error.message,
      userId: req.user._id,
      stack: error.stack 
    });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tournaments'
    });
  }
}; 

export const addAttendeeController = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format'
      });
    }

    const tournament = await Tournament.findById(id);
    
    if (!tournament) {
      return res.status(404).json({ 
        success: false, 
        error: 'Tournament not found' 
      });
    }

    // Check if user is already registered
    if (tournament.attendees.some(attendee => attendee.userId.toString() === userId)) {
      return res.status(400).json({
        success: false,
        error: 'User is already registered for this tournament'
      });
    }

    // Add the attendee
    tournament.attendees.push({
      userId,
      status: 'REGISTERED',
      registeredAt: new Date()
    });

    await tournament.save();

    logger.info('Attendee added to tournament', {
      userId,
      tournamentId: id,
      addedBy: req.user._id
    });

    res.status(200).json({
      success: true,
      data: tournament
    });
  } catch (error) {
    logger.error('Failed to add attendee', {
      error: error.message,
      id: req.params.id,
      stack: error.stack
    });
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}; 