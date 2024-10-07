import axios from 'axios';

// Query to fetch basic user information
const userInfoQuery = `
query UserInfoQuery {
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

// Query to fetch user's tournament and event data
const userTournamentsQuery = `
query UserTournamentsQuery($userName: String!) {
  currentUser {
    tournaments(query: {
      perPage: 15
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
            filter: { name: $userName }
          }) {
            nodes {
              id
            }
          }
        }
      }
    }
  }
}
`;

// Main function to fetch dashboard data
export const fetchDashboardData = async (accessToken) => {
  console.time('fetchDashboardData');
  
  try {
    // Step 1: Fetch basic user information
    const userInfoResponse = await fetchGraphQLData(accessToken, userInfoQuery);
    const userData = userInfoResponse.data.currentUser;
    console.log('User Info:', JSON.stringify(userData, null, 2));

    // Step 2: Fetch user's tournament and event data
    const userName = userData.player.gamerTag;
    console.log(userName);
    if (!userName) {
      throw new Error('User name not found');
    }

    const tournamentsResponse = await fetchGraphQLData(accessToken, userTournamentsQuery, { userName });
    console.log('Raw Tournaments Response:', JSON.stringify(tournamentsResponse, null, 2));

    const tournamentsData = tournamentsResponse.data.currentUser?.tournaments?.nodes || [];
    console.log('Tournaments Data:', JSON.stringify(tournamentsData, null, 2));

    // Step 3: Process and combine the data
    const processedData = processData(userData, tournamentsData);
    console.log('Processed Data:', JSON.stringify(processedData, null, 2));

    console.log('Dashboard data fetched successfully');
    console.timeEnd('fetchDashboardData');
    
    return processedData;
  } catch (error) {
    console.error('Error in fetchDashboardData:', error.message);
    console.timeEnd('fetchDashboardData');
    throw error;
  }
};

// Helper function to make GraphQL requests
const fetchGraphQLData = async (accessToken, query, variables = {}) => {
  const response = await axios.post('https://api.start.gg/gql/alpha',
    { query, variables },
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    }
  );

  if (response.data?.errors) {
    throw new Error(`GraphQL Error: ${response.data.errors[0].message}`);
  }

  return response.data;
};

// Function to process and combine user and tournament data
const processData = (userData, tournamentsData) => {
  console.log('Processing user and tournament data...');

  // Filter tournaments to only include those where the user participated in events
  const filteredTournaments = tournamentsData.map(tournament => {
    console.log(`Processing tournament: ${tournament.name}`);
    const filteredEvents = tournament.events.filter(event => {
      const hasUserEntrant = event.entrants.nodes.length > 0;
      console.log(`  Event: ${event.name}, User participated: ${hasUserEntrant}`);
      return hasUserEntrant;
    });
    return { ...tournament, events: filteredEvents };
  }).filter(tournament => {
    const hasEvents = tournament.events.length > 0;
    console.log(`Tournament ${tournament.name} has events: ${hasEvents}`);
    return hasEvents;
  });

  // Combine user info and filtered tournaments
  const processedData = {
    user: {
      name: userData.name,
      id: userData.id,
      location: userData.location,
      images: userData.images,
      slug: userData.slug,
      player: userData.player
    },
    tournaments: filteredTournaments
  };

  console.log('Processed data structure:');
  console.log(JSON.stringify(processedData, null, 2));

  return processedData;
};
