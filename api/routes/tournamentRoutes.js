import express from 'express';
import { createTournamentController, getTournamentController, getAllTournamentsController, getOrganizerTournamentsController, updateTournamentController, deleteTournamentController } from '../controllers/tournamentController.js';
import { authenticate } from '../middleware/auth.js';
import { isOrganizer } from '../middleware/isOrganizer.js';

const router = express.Router();

router.post('/create', authenticate, createTournamentController);
router.get('/organizer', authenticate, getOrganizerTournamentsController);
router.get('/:slug', getTournamentController);
router.get('/', getAllTournamentsController);
router.put('/:slug', authenticate, isOrganizer, updateTournamentController);
router.delete('/:slug', authenticate, isOrganizer, deleteTournamentController);

export default router; 