import { fetchUpcomingTournaments } from '../../services/startgg/upcoming/upcomingTournamentsService.js';

export const getUpcomingTournaments = async (req, res) => {
  const { countryCode, perPage, videogameId } = req.query;
  
  console.log(`Fetching tournaments for countryCode: ${countryCode}, perPage: ${perPage}, videogameId: ${videogameId}`);

  try {
    const data = await fetchUpcomingTournaments(countryCode, perPage, videogameId);
    res.json(data);
  } catch (error) {
    console.error(`Error fetching tournaments: ${error.message}`);
    res.status(500).json({ error: 'Error fetching tournaments' });
  }
};
