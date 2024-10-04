import axios from 'axios';

export const fetchUserName = async (accessToken) => {
  const userNameQuery = `
    query {
      currentUser {
        name
      }
    }
  `;

  const response = await axios.post('https://api.start.gg/gql/alpha', 
    { query: userNameQuery },
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data.data.currentUser.name;
};

export const fetchDashboardData = async (accessToken, userName) => {
  const dashboardQuery = `
    query DashboardQuery {
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
        tournaments(query: {
          perPage: 1,
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
                filter: { name: "${userName}" }
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
    }
  `;

  const response = await axios.post('https://api.start.gg/gql/alpha', 
    { query: dashboardQuery },
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data;
};
