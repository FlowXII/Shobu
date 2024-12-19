import express from 'express';
import { handleReportSet, handleResetSet, handleMarkSetCalled, handleMarkSetInProgress } from '../../controllers/startgg/stationReportingController.js';
import { verifyToken } from '../../auth/startgg/startgg.middleware.js';

const router = express.Router();

router.post('/report-set', verifyToken, handleReportSet);
router.post('/reset-set', verifyToken, handleResetSet);
router.post('/mark-set-called', verifyToken, handleMarkSetCalled);
router.post('/mark-set-in-progress', verifyToken, handleMarkSetInProgress);

export default router;
