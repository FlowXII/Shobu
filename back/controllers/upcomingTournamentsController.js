import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

export const getUpcomingTournaments = async (req, res) => {
  const { countryCode, perPage, videogameId } = req.query;
  
  console.log(`STARTGG_TOKEN: ${process.env.STARTGG_TOKEN}`);
  console.log(`Fetching tournaments for countryCode: ${countryCode}, perPage: ${perPage}, videogameId: ${videogameId}`);

  try {
    const response = await fetch('https://api.start.gg/gql/alpha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STARTGG_TOKEN}`,
      },
      body: JSON.stringify({
        query: `
          query TournamentsByCountry($cCode: String!, $perPage: Int!, $videogameId: ID!) {
            tournaments(query: {
              perPage: $perPage
              filter: {
                upcoming: true
                past: false
                countryCode: $cCode
                videogameIds: [$videogameId]
              }
            }) {
              nodes {
                id
                name
                countryCode
                startAt
                endAt
                venueAddress
                city
                slug
              }
            }
          }
        `,
        variables: { 
          cCode: countryCode, 
          perPage: parseInt(perPage, 10), 
          videogameId 
        },
      }),
    });

    console.log(`Response status: ${response.status}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Response data: ${JSON.stringify(data, null, 2)}`);

    res.json(data);
  } catch (error) {
    console.error(`Error fetching tournaments: ${error.message}`);
    res.status(500).json({ error: 'Error fetching tournaments' });
  }
};
