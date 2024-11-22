import express from 'express';
import logger from '../utils/logger.js';
import { 
  createEventController, 
  getEventController,
  getTournamentEventsController,
  registerForEventController,
  updateEventController,
  deleteEventController
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
router.get('/events/:eventId', getEventController);
router.get('/tournaments/:tournamentId/events', getTournamentEventsController);
router.post('/events/:eventId/register', authenticate, registerForEventController);
router.put('/events/:eventId', authenticate, isOrganizer, updateEventController);
router.delete('/events/:eventId', authenticate, isOrganizer, deleteEventController);

export default router; 