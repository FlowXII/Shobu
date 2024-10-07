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
      },
      timeout: 30000  // 30 seconds timeout
    }
  );

  return response.data.data.currentUser;
};

export const fetchTournamentData = async (accessToken, userName) => {
  const tournamentQuery = `
    query TournamentQuery($userName: String!) {
      currentUser {
        tournaments(query: {
          perPage: 5,
          filter: { upcoming: false }
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
      },
      timeout: 30000  // 30 seconds timeout
    }
  );

  console.log('Tournament API Response:', JSON.stringify(response.data, null, 2));

  if (response.data && response.data.data && response.data.data.currentUser && response.data.data.currentUser.tournaments) {
    return response.data.data.currentUser.tournaments.nodes;
  } else {
    console.error('Unexpected API response structure:', response.data);
    throw new Error('Unexpected API response structure');
  }
};

export const fetchSetsData = async (accessToken, eventId) => {
  const setsQuery = `
    query SetsQuery($eventId: ID!) {
      event(id: $eventId) {
        id
        sets(
          page: 1
          perPage: 20
          filters: { state: [2, 6] }  # State 2 is Ongoing, State 6 is Called
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
  `;

  const response = await axios.post('https://api.start.gg/gql/alpha',
    {
      query: setsQuery,
      variables: { eventId }
    },
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000  // 30 seconds timeout
    }
  );

  if (response.data && response.data.data && response.data.data.event) {
    return response.data.data.event.sets.nodes;
  } else {
    console.error('Unexpected API response structure for sets:', response.data);
    throw new Error('Unexpected API response structure for sets');
  }
};

export const fetchDashboardData = async (accessToken) => {
  try {
    console.time('fetchDashboardData');
    
    console.time('fetchUserData');
    const userData = await fetchUserData(accessToken);
    console.timeEnd('fetchUserData');
    console.log('User Data:', userData);
    
    if (!userData || !userData.player || !userData.player.gamerTag) {
      throw new Error('User data is incomplete or missing gamerTag');
    }
    
    console.time('fetchTournamentData');
    const tournamentData = await fetchTournamentData(accessToken, userData.player.gamerTag);
    console.timeEnd('fetchTournamentData');
    console.log('Tournament Data:', JSON.stringify(tournamentData, null, 2));
    
    console.time('fetchSetsData');
    // Fetch sets data only for events where the user is an entrant
    const setsPromises = tournamentData.flatMap(tournament => 
      tournament.events
        .filter(event => event.entrants.nodes.length > 0)
        .map(event => fetchSetsData(accessToken, event.id))
    );

    const setsResults = await Promise.all(setsPromises);
    console.timeEnd('fetchSetsData');

    // Assign sets data back to the events
    let setIndex = 0;
    for (const tournament of tournamentData) {
      for (const event of tournament.events) {
        if (event.entrants.nodes.length > 0) {
          event.sets = setsResults[setIndex++];
        } else {
          event.sets = { nodes: [] };
        }
      }
    }
    
    console.timeEnd('fetchDashboardData');
    return {
      user: userData,
      tournaments: tournamentData
    };
  } catch (error) {
    console.error('Error in fetchDashboardData:', error.message);
    throw error;
  }
};
