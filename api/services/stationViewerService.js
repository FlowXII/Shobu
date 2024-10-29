import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const STARTGG_TOKEN = process.env.STARTGG_TOKEN;

export async function FetchStations(eventId) {
  console.log(`Fetching tournaments for event ID: ${eventId}`);

  try {
    const response = await fetch('https://api.start.gg/gql/alpha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STARTGG_TOKEN}`,
      },
      body: JSON.stringify({
        query: `
          query SetsAtStation($eventId: ID!) {
            event(id: $eventId) {
              id
              name
              numEntrants
              sets(
                page: 1
                perPage: 128
                filters: {
                  state: [1, 2, 3, 4, 6, 7],
                  hideEmpty: false
                }
              ) {
                nodes {
                  id
                  fullRoundText
                  state
                  round
                  identifier
                  station {
                    id
                    number
                  }
                  slots {
                    id
                    slotIndex
                    entrant
                   {
                      id
                      name
                      seeds {
                      seedNum
                      }
                    }
                  }
                }
              }
            }
          }
        `,
        variables: { eventId },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching tournaments: ${error.message}`);
    throw error; // Re-throw the error for further handling
  }
}
