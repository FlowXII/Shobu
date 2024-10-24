import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const STARTGG_TOKEN = process.env.STARTGG_TOKEN;

export async function reportSet(setId, player1Id, player2Id, player1Score, player2Score, accessToken) {
  console.log('Reporting set:', { setId, player1Id, player2Id, player1Score, player2Score });
  try {
    const winnerId = player1Score > player2Score ? player1Id : player2Id;
    console.log('Determined winner ID:', winnerId);

    const totalGames = player1Score + player2Score;
    const gameData = [];

    for (let i = 1; i <= totalGames; i++) {
      if (i <= player1Score) {
        gameData.push({ winnerId: player1Id, gameNum: i });
      } else {
        gameData.push({ winnerId: player2Id, gameNum: i });
      }
    }

    const response = await fetch('https://api.start.gg/gql/alpha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: `
          mutation ReportBracketSet($setId: ID!, $winnerId: ID, $gameData: [BracketSetGameDataInput]) {
            reportBracketSet(setId: $setId, winnerId: $winnerId, gameData: $gameData) {
              id
              state
            }
          }
        `,
        variables: {
          setId,
          winnerId,
          gameData
        },
      }),
    });

    console.log('API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error response:', errorData);
      throw new Error(errorData.errors?.[0]?.message || `HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API success response:', data);
    return data;
  } catch (error) {
    console.error(`Error reporting set: ${error.message}`);
    throw error;
  }
}

export async function resetSet(setId, resetDependentSets, accessToken) {
  try {
    const response = await fetch('https://api.start.gg/gql/alpha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: `
          mutation ResetSet($setId: ID!, $resetDependentSets: Boolean) {
            resetSet(setId: $setId, resetDependentSets: $resetDependentSets) {
              id
              state
            }
          }
        `,
        variables: {
          setId,
          resetDependentSets
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors?.[0]?.message || `HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error resetting set: ${error.message}`);
    throw error;
  }
}

export async function markSetCalled(setId, accessToken) {
  try {
    const response = await fetch('https://api.start.gg/gql/alpha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: `
          mutation MarkSetCalled($setId: ID!) {
            markSetCalled(setId: $setId) {
              id
              state
            }
          }
        `,
        variables: {
          setId
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors?.[0]?.message || `HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error marking set as called: ${error.message}`);
    throw error;
  }
}

export async function markSetInProgress(setId, accessToken) {
  try {
    const response = await fetch('https://api.start.gg/gql/alpha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: `
          mutation MarkSetInProgress($setId: ID!) {
            markSetInProgress(setId: $setId) {
              id
              state
            }
          }
        `,
        variables: {
          setId
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors?.[0]?.message || `HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error marking set as in progress: ${error.message}`);
    throw error;
  }
}
