import express from 'express';
import { createTournamentController, getTournamentController, getAllTournamentsController, getOrganizerTournamentsController, updateTournamentController, deleteTournamentController, registerForTournamentController, checkInAttendeeController, cancelRegistrationController } from '../controllers/tournamentController.js';
import { authenticate } from '../middleware/auth.js';
import { isOrganizer } from '../middleware/isOrganizer.js';

const router = express.Router();

router.post('/create', authenticate, createTournamentController);
router.get('/organizer', authenticate, getOrganizerTournamentsController);
router.get('/:id', getTournamentController);
router.get('/', getAllTournamentsController);
router.put('/:id', authenticate, isOrganizer, updateTournamentController);
router.delete('/:id', authenticate, isOrganizer, deleteTournamentController);
router.post('/:id/register', authenticate, registerForTournamentController);
router.post('/:id/check-in/:userId', authenticate, isOrganizer, checkInAttendeeController);
router.post('/:id/cancel-registration', authenticate, cancelRegistrationController);

export default router; 