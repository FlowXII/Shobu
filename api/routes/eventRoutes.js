import express from 'express';
import logger from '../utils/logger.js';
import { 
  createEventController, 
  getEventController,
  getTournamentEventsController,
  registerForEventController
} from '../controllers/eventController.js';
import { authenticate } from '../middleware/auth.js';
import { isOrganizer } from '../middleware/isOrganizer.js';

const router = express.Router();

// Add logging middleware
router.use((req, res, next) => {
  logger.info('Event route accessed', {
    method: req.method,
    path: req.path,
    params: req.params,
    query: req.query,
    body: req.body
  });
  next();
});

// Create new event for a tournament (organizer only)
router.post('/tournaments/:tournamentId/events', 
  authenticate, 
  isOrganizer, 
  createEventController
);

// Get specific event
router.get('/events/:eventId', getEventController);

// Get all events for a tournament
router.get('/tournaments/:tournamentId/events', getTournamentEventsController);

// Register for an event
router.post('/events/:eventId/register', authenticate, registerForEventController);

// Add this new route for getting a specific event
router.get('/tournaments/:tournamentId/events/:eventId', getEventController);

export default router; 