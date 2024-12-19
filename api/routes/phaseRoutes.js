import express from 'express';
import logger from '../utils/logger.js';
import {
    createPhaseController,
    getPhaseController,
    deletePhaseController,
    generateBracketPhaseController
} from '../controllers/phaseController.js';
import { authenticate } from '../middleware/auth.js';
import { isOrganizer } from '../middleware/isOrganizer.js';

const router = express.Router({ mergeParams: true });

router.use((req, res, next) => {
    logger.info('Phase route accessed', {
        method: req.method,
        path: req.path,
        params: req.params,
        query: req.query,
        body: req.body
    });
    next();
});

// Phase Routes
router.post('/tournaments/:tournamentId/events/:eventId/phases', authenticate, isOrganizer, createPhaseController);
router.get('/tournaments/:tournamentId/events/:eventId/phases/:phaseId', authenticate, getPhaseController);
router.delete('/tournaments/:tournamentId/events/:eventId/phases/:phaseId', authenticate, isOrganizer, deletePhaseController);
router.post('/tournaments/:tournamentId/events/:eventId/phases/brackets', authenticate, isOrganizer, generateBracketPhaseController);

export default router;