import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

export const fetchUpcomingTournaments = async (countryCode, perPage, videogameId) => {
  const response = await fetch('https://api.start.gg/gql/alpha', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.STARTGG_TOKEN}`,
    },
    body: JSON.stringify({
      query: `
        query TournamentsByCountry($cCode: String!, $perPage: Int!, $videogameIds: [ID]!) {
          tournaments(query: {
            perPage: $perPage
            filter: {
              upcoming: true
              past: false
              countryCode: $cCode
              videogameIds: $videogameIds
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
              numAttendees
              images {
                url
                type
              }
              events(filter: { videogameId: $videogameIds }) {
                name
                numEntrants
                images {
                  url
                  type
                }
              }
            }
          }
        }
      `,
      variables: { 
        cCode: countryCode, 
        perPage: parseInt(perPage, 10), 
        videogameIds: [videogameId] // Pass as an array
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  console.log('API Response:', JSON.stringify(data, null, 2)); // Log the entire response
  return data;
};