import express from 'express';
import { getUpcomingTournaments } from '../controllers/upcomingTournamentsController.js';

const router = express.Router();

router.post('/upcoming', async (req, res) => {
  const { cCode, perPage, videogameId } = req.body;
  console.log('Received request in route with:', { cCode, perPage, videogameId });

  try {
    await getUpcomingTournaments(
      { query: { countryCode: cCode, perPage, videogameId } },
      res
    );
  } catch (error) {
    console.error('Error in route handler:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;