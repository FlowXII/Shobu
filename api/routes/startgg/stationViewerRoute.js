import express from 'express';
import { getStations } from '../../controllers/startgg/stationViewerController.js'; // Updated casing

const router = express.Router();

router.get('/stations/:eventId', getStations); // Route to fetch stations by event ID

export default router;
