import express from 'express';
import { startGGAuth, startGGCallback, protectedRoute } from '../../auth/startgg/startgg.controller.js';
import { verifyToken } from '../../auth/startgg/startgg.middleware.js';

const router = express.Router();

router.get('/auth/startgg', startGGAuth);
router.get('/auth/startgg/callback', startGGCallback);
router.get('/protected', verifyToken, protectedRoute);

export default router;