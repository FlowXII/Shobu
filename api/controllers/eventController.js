import Event from '../models/Event.js';
import Tournament from '../models/Tournament.js';
import { createEvent, getEventById, registerParticipant } from '../services/event/eventService.js';
import logger from '../utils/logger.js';
import mongoose from 'mongoose';
import { catchAsync } from '../utils/catchAsync.js';
import { ValidationError, NotFoundError, AuthenticationError } from '../utils/errors.js';
import { 
  sendCreatedResponse,
  sendSuccessResponse,
  sendUpdatedResponse,
  sendDeletedResponse,
  sendListResponse
} from '../utils/responseHandler.js';

const createEventController = catchAsync(async (req, res) => {
  logger.info('Create event controller started', {
    tournamentId: req.params.tournamentId,
    body: req.body
  });

  const tournament = req.tournament;
  
  const eventData = {
    ...req.body,
    tournamentId: tournament._id,
    gameName: req.body.game,
    entryFee: Number(req.body.entryFee),
    startAt: req.body.startAt,
    maxEntrants: Number(req.body.maxEntrants)
  };

  logger.debug('Creating event with data', { eventData });
  const event = await createEvent(eventData);

  logger.debug('Event created, updating tournament', {
    eventId: event._id,
    tournamentId: tournament._id
  });

  await Tournament.findByIdAndUpdate(
    tournament._id,
    { $push: { events: event._id } }
  );

  const eventObject = event.toObject ? event.toObject() : event;
  
  return sendCreatedResponse({
    res,
    data: eventObject,
    message: 'Event created successfully'
  });
});

const getTournamentEventsController = catchAsync(async (req, res) => {
  const { tournamentId } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(tournamentId)) {
    throw new ValidationError('Invalid tournament ID format');
  }

  const events = await Event.find({ tournamentId });
  
  return sendListResponse({
    res,
    data: events
  });
});

const registerForEventController = catchAsync(async (req, res) => {
  const { eventId } = req.params;
  const user = req.user;

  if (!user || !user._id) {
    throw new AuthenticationError('User not authenticated');
  }

  // Check if user is already registered
  const existingEvent = await Event.findOne({
    _id: eventId,
    'participants.userId': user._id
  });

  if (existingEvent) {
    return sendSuccessResponse({
      res,
      data: existingEvent,
      message: 'User is already registered for this event'
    });
  }

  const updatedEvent = await registerParticipant(eventId, user);

  return sendSuccessResponse({
    res,
    data: updatedEvent,
    message: 'Successfully registered for event'
  });
});

const getEventController = catchAsync(async (req, res) => {
  const { eventId } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new ValidationError('Invalid event ID format');
  }

  const event = await Event.findById(eventId)
    .populate('phases')
    .populate('participants');

  if (!event) {
    throw new NotFoundError('Event');
  }

  return sendSuccessResponse({
    res,
    data: event
  });
});

const updateEventController = catchAsync(async (req, res) => {
  const { eventId } = req.params;
  
  logger.info('Updating event', { 
    eventId,
    updateData: req.body
  });

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new ValidationError('Invalid event ID format');
  }

  const event = await Event.findById(eventId);
  if (!event) {
    throw new NotFoundError('Event');
  }

  const updateData = {};
  const updateableFields = [
    'participants', 'name', 'description', 'format', 
    'maxEntrants', 'startAt', 'entryFee', 'rules'
  ];
  
  updateableFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updateData[field] = field.match(/Entrants|Fee/) 
        ? Number(req.body[field]) 
        : req.body[field];
    }
  });

  const updatedEvent = await Event.findByIdAndUpdate(
    eventId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate('tournamentId', 'name slug');

  logger.info('Event updated successfully', { 
    eventId,
    updatedEvent: updatedEvent._id 
  });

  return sendUpdatedResponse({
    res,
    data: updatedEvent,
    message: 'Event updated successfully'
  });
});

const deleteEventController = catchAsync(async (req, res) => {
  const { eventId } = req.params;
  
  logger.info('Deleting event', { eventId });

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new ValidationError('Invalid event ID format');
  }

  const event = await Event.findById(eventId);
  if (!event) {
    throw new NotFoundError('Event');
  }

  await Tournament.findByIdAndUpdate(
    event.tournamentId,
    { $pull: { events: eventId } }
  );

  await Event.findByIdAndDelete(eventId);

  logger.info('Event deleted successfully', { eventId });

  return sendDeletedResponse({
    res,
    message: 'Event deleted successfully'
  });
});

const generateParticipantsController = catchAsync(async (req, res) => {
  // Get the eventId and participants from the request body
  const { eventId } = req.params;
  const { participants } = req.body;
  

  logger.info('Generating participants for event', { 
    eventId,
    count: participants?.length 
  });

  // Check if the eventId is a valid mongoose object id
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new ValidationError('Invalid event ID format');
  }

  // Find the event by its id
  const event = await Event.findById(eventId);
  if (!event) {
    throw new NotFoundError('Event');
  }

  // Update the event by its id and push the participants to the event by mapping over the participants array and adding the participants to the event
  const updatedEvent = await Event.findByIdAndUpdate(
    eventId,
    { 
      $push: { 
        participants: { 
          $each: participants.map(p => ({
            ...p,
            registeredAt: new Date(),
            checkedIn: false
          }))
        }
      }
    },
    { new: true, runValidators: true }
  ).populate('tournamentId', 'name slug');

  logger.info('Participants generated successfully', { 
    eventId,
    count: participants.length
  });

  return sendUpdatedResponse({
    res,
    data: updatedEvent,
    message: `Successfully generated ${participants.length} participants`
  });
});

// Export the controllers
export {
  createEventController,
  getEventController,
  getTournamentEventsController,
  registerForEventController,
  updateEventController,
  deleteEventController,
  generateParticipantsController
}; 