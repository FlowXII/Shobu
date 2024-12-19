import Phase from "../models/Phase.js";
import Tournament from "../models/Tournament.js";
import Event from "../models/Event.js";
import logger from "../utils/logger.js"
import {createPhase, getPhase, deletePhase, generateBracketPhase} from "../services/phases/phaseService.js"
import { 
        sendCreatedResponse,
        sendSuccessResponse,
        sendUpdatedResponse,
        sendDeletedResponse,
        sendListResponse
      } from '../utils/responseHandler.js';

import { catchAsync } from "../utils/catchAsync.js";

const createPhaseController = catchAsync(async(req, res) => {
    logger.info('Create phase controller started', {
        tournamentId: req.params.tournamentId,
        eventId: req.params.eventId,
        body: req.body
    });
  
    const tournament = req.tournament;
    const event = req.event;
    
    const phase = await createPhase(tournament, event, req.body);
    
    logger.info('Phase created successfully', { phaseId: phase._id });
    return sendCreatedResponse(res, phase);
});

const getPhaseController = catchAsync(async(req, res) => {
    logger.info('Get phase controller started', {
        phaseId: req.params.phaseId
    });

    const phase = await getPhase(req.params.phaseId);
    
    logger.info('Phase retrieved successfully', { phaseId: phase._id });
    return sendSuccessResponse(res, phase);
});

const deletePhaseController = catchAsync(async(req, res) => {
    logger.info('Delete phase controller started', {
        phaseId: req.params.phaseId
    });

    await deletePhase(req.params.phaseId);
    
    logger.info('Phase deleted successfully', { phaseId: req.params.phaseId });
    return sendDeletedResponse(res);
});

const generateBracketPhaseController = catchAsync(async (req, res) => {
  logger.info('Generate bracket phase controller started', {
    tournamentId: req.params.tournamentId,
    eventId: req.params.eventId,
    body: req.body
  });

  try {
    const phase = await generateBracketPhase(req.params.eventId, req.body);
    
    if (!phase) {
      return sendSuccessResponse({ 
        res, 
        success: false,
        message: 'Failed to generate bracket phase'
      });
    }

    logger.info('Bracket phase generated successfully', { phaseId: phase._id });
    
    return sendCreatedResponse({ 
      res, 
      data: phase,
      message: 'Bracket phase generated successfully'
    });
  } catch (error) {
    logger.error('Error in generateBracketPhaseController:', {
      error: error.message,
      stack: error.stack
    });
    
    return sendSuccessResponse({ 
      res, 
      success: false,
      message: error.message || 'Failed to generate bracket phase'
    });
  }
});

export {
    createPhaseController,
    getPhaseController,
    deletePhaseController,
    generateBracketPhaseController
};
                