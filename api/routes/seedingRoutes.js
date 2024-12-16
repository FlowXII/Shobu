import express from 'express';
import { seedingController } from '../controllers/seedingController.js';
import { authenticate } from '../middleware/auth.js';
import { isOrganizer } from '../middleware/isOrganizer.js';

const router = express.Router({ mergeParams: true });

router.use(authenticate);
router.use(isOrganizer);

router
  .route('/')
  .post(seedingController.createSeeding)
  .get(seedingController.getSeeding);

router
  .route('/update')
  .put(seedingController.updateSeeding);

router
  .route('/finalize')
  .put(seedingController.finalizeSeeding);

export default router; 