import express from 'express';
import { createTournamentController, getTournamentController, getAllTournamentsController } from '../controllers/tournamentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/create', authenticate, createTournamentController);
router.get('/:slug', getTournamentController);
router.get('/', getAllTournamentsController);

export default router; 