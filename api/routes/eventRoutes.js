import express from 'express';
import { 
  createEventController, 
  getEventController,
  getTournamentEventsController
} from '../controllers/eventController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Create new event for a tournament
router.post('/tournaments/:tournamentId/events', authenticate, createEventController);

// Get specific event
router.get('/events/:eventId', getEventController);

// Get all events for a tournament
router.get('/tournaments/:tournamentId/events', getTournamentEventsController);

export default router; 