import express from 'express';
import { verifyToken } from '../auth/startgg/startgg.middleware.js';
import { createSet, getSets, updateSetStatus } from '../controllers/setController.js';

const router = express.Router();

router.post('/', verifyToken, createSet);
router.get('/', getSets);
router.patch('/:setId/status', verifyToken, updateSetStatus);

export default router;