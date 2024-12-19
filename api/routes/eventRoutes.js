import express from 'express';
import logger from '../utils/logger.js';
import { 
  createEventController, 
  getEventController,
  getTournamentEventsController,
  registerForEventController,
  updateEventController,
  deleteEventController,
  generateParticipantsController
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

// Event routes
router.post('/tournaments/:tournamentId/events', authenticate, isOrganizer, createEventController);
router.get('/tournaments/:tournamentId/events/:eventId', getEventController);
router.get('/tournaments/:tournamentId/events', getTournamentEventsController);
router.post('/tournaments/:tournamentId/events/:eventId/register', authenticate, registerForEventController);
router.put('/tournaments/:tournamentId/events/:eventId', authenticate, isOrganizer, updateEventController);
router.delete('/tournaments/:tournamentId/events/:eventId', authenticate, isOrganizer, deleteEventController);
router.post(
  '/tournaments/:tournamentId/events/:eventId/participants/generate', 
  authenticate, 
  isOrganizer, 
  generateParticipantsController
);


export default router; 