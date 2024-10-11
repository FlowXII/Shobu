import axios from 'axios';

// Helper function to make GraphQL requests
export const fetchGraphQLData = async (accessToken, query, variables = {}) => {
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
