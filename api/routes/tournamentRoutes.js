import express from 'express';
import { createTournamentController, getTournamentController, getAllTournamentsController, getUserTournamentsController, updateTournamentController, deleteTournamentController, registerForTournamentController, checkInAttendeeController, cancelRegistrationController, completeTournamentController, addAttendeeController } from '../controllers/tournamentController.js';
import { authenticate } from '../middleware/auth.js';
import { isOrganizer } from '../middleware/isOrganizer.js';

const router = express.Router();

router.get('/user', authenticate, getUserTournamentsController);
router.post('/create', authenticate, createTournamentController);
router.get('/:id', getTournamentController);
router.get('/', getAllTournamentsController);
router.put('/:id', authenticate, isOrganizer, updateTournamentController);
router.delete('/:id', authenticate, isOrganizer, deleteTournamentController);
router.post('/:id/register', authenticate, registerForTournamentController);
router.post('/:id/check-in/:userId', authenticate, isOrganizer, checkInAttendeeController);
router.post('/:id/cancel-registration', authenticate, cancelRegistrationController);
router.post('/:id/complete', authenticate, isOrganizer, completeTournamentController);
router.post('/:id/attendees', authenticate, isOrganizer, addAttendeeController);

export default router; 