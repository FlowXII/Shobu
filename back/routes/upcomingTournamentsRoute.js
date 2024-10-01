import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

router.post('/upcoming', async (req, res) => {
  const { cCode, perPage, videogameId } = req.body;
  console.log('Received request with:', { cCode, perPage, videogameId });

  // ... rest of your backend code ...
});

export default router;