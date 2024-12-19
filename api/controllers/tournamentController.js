import Tournament from '../models/Tournament.js';
import logger from '../utils/logger.js';
import { 
  registerForTournament, 
  updateTournament, 
  checkInAttendee,
  cancelRegistration,
  updateTournamentResults,
  createTournament
} from '../services/tournament/tournamentService.js';
import mongoose from 'mongoose';
import { 
  sendCreatedResponse,
  sendSuccessResponse,
  sendUpdatedResponse,
  sendDeletedResponse,
  sendListResponse
} from '../utils/responseHandler.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ValidationError, NotFoundError, AuthorizationError } from '../utils/errors.js';

export const createTournamentController = catchAsync(async (req, res) => {
  logger.info('Creating tournament', { userId: req.user._id });
  
  // Add the organizerId to the tournament data
  const tournamentData = {
    ...req.body,
    organizerId: req.user._id
  };

  const tournament = await createTournament(tournamentData);
  
  return sendCreatedResponse({
    res,
    data: tournament,
    message: 'Tournament created successfully'
  });
});


export const getTournamentController = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ValidationError('Invalid tournament ID format');
  }

  const tournament = await Tournament.findById(id)
    .populate({
      path: 'events',
      model: 'Event'
    });

  if (!tournament) {
    throw new NotFoundError('Tournament');
  }

  return sendSuccessResponse({
    res,
    data: tournament
  });
});

// Get all tournaments
export const getAllTournamentsController = catchAsync(async (req, res) => {
  const tournaments = await Tournament.find()
    .sort({ createdAt: -1 })
    .limit(50);
  
  return sendListResponse({
    res,
    data: tournaments
  });
});

export const updateTournamentController = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ValidationError('Invalid tournament ID format');
  }

  const tournament = await Tournament.findById(id);
  
  if (!tournament) {
    throw new NotFoundError('Tournament');
  }
  
// Check if the user is the organizer of the tournament
  if (tournament.organizerId.toString() !== req.user._id.toString()) {
    throw new AuthorizationError('Not authorized to update this tournament');
  }

  const updatedTournament = await updateTournament(id, req.body);

  return sendUpdatedResponse({
    res,
    data: updatedTournament,
    message: 'Tournament updated successfully'
  });
});

export const deleteTournamentController = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  const tournament = await Tournament.findById(id);
  
  if (!tournament) {
    throw new NotFoundError('Tournament');
  }

  if (tournament.organizerId.toString() !== req.user._id.toString()) {
    throw new AuthorizationError('Not authorized to delete this tournament');
  }

  await Tournament.findByIdAndDelete(id);

  return sendDeletedResponse({
    res,
    message: 'Tournament deleted successfully'
  });
});

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
      return res.status(404).json({ 
        success: false, 
        error: 'Tournament not found' 
      });
    }

    const updatedTournament = await checkInAttendee(tournament._id, userId);
    
    logger.info('Attendee checked in', {
      userId,
      tournamentId: tournament._id,
      checkedInBy: req.user._id
    });

    res.status(200).json({
      success: true,
      data: updatedTournament
    });
  } catch (error) {
    logger.error('Failed to check in attendee', {
      error: error.message,
      userId: req.params.userId,
      id: req.params.id
    });
    res.status(400).json({
      success: false,
      error: error.message
    });
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