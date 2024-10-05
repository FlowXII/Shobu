import axios from 'axios';

export const fetchUserData = async (accessToken) => {
  const userQuery = `
    query {
      currentUser {
        name
        id
        location {
          city
          state
          country
          countryId
        }
        images {
          id
          type
          url
        }
        slug
        player {
          id
          gamerTag
          prefix
        }
      }
    }
  `;

  const response = await axios.post('https://api.start.gg/gql/alpha', 
    { query: userQuery },
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data.data.currentUser;
};

export const fetchTournamentData = async (accessToken, userName) => {
  const tournamentQuery = `
    query TournamentQuery($userName: String!) {
      tournaments(query: {
        perPage: 5,
        filter: { upcoming: true }
      }) {
        nodes {
          id
          name
          startAt
          endAt
          venueAddress
          city
          state
          countryCode
          slug
          events {
            id
            name
            startAt
            state
            numEntrants
            slug
            entrants(query: {
                page: 1,
                perPage: 20,
                filter: { name: $userName }
              }) {
                nodes {
                  id
                  name
                }
              }
            sets(
              page: 1
              perPage: 20
              filters: { state: [2, 6] }
            ) {
              nodes {
                id
                state
                station {
                  id
                  number
                }
                slots {
                  id
                  entrant {
                    id
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await axios.post('https://api.start.gg/gql/alpha', 
    { 
      query: tournamentQuery,
      variables: { userName }
    },
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );

  console.log('Tournament API Response:', JSON.stringify(response.data, null, 2));

  if (response.data && response.data.data && response.data.data.tournaments) {
    return response.data.data.tournaments.nodes;
  } else {
    console.error('Unexpected API response structure:', response.data);
    throw new Error('Unexpected API response structure');
  }
};

export const fetchDashboardData = async (accessToken) => {
  try {
    const userData = await fetchUserData(accessToken);
    console.log('User Data:', userData);
    
    if (!userData || !userData.player || !userData.player.gamerTag) {
      throw new Error('User data is incomplete or missing gamerTag');
    }
    
    const tournamentData = await fetchTournamentData(accessToken, userData.player.gamerTag);
    
    return {
      user: userData,
      tournaments: tournamentData
    };
  } catch (error) {
    console.error('Error in fetchDashboardData:', error);
    throw error;
  }
};
