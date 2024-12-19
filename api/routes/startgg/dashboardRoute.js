import express from 'express';
import { getDashboard } from '../../controllers/startgg/dashboardController.js';
import { verifyToken } from '../../auth/startgg/startgg.middleware.js';

const router = express.Router();

router.get('/dashboard', verifyToken, getDashboard);

export default router;
