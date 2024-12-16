import express from 'express';
import { verifyToken } from '../auth/startgg/startgg.middleware.js';
import { createMatch, updateMatchScore } from '../controllers/matchController.js';

const router = express.Router();

router.post('/', verifyToken, createMatch);
router.patch('/:matchId/score', verifyToken, updateMatchScore);

export default router;