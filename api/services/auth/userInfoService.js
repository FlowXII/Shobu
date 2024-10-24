import { fetchGraphQLData } from '../dashboard/dashboardFetch.js';
import jwt from 'jsonwebtoken';
import config from '../../config/startgg.config.js';

// Using the same query from dashboardGQL.js
const userInfoQuery = `
query UserInfoQuery {
  currentUser {
    name
    id
    bio
    genderPronoun
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

export const fetchAndEncodeUserInfo = async (accessToken) => {
  try {
    const userInfoResponse = await fetchGraphQLData(accessToken, userInfoQuery);
    const userData = userInfoResponse.data?.currentUser;

    if (!userData) {
      throw new Error('User data not found');
    }

    // Create a JWT containing user info
    const userInfoToken = jwt.sign(
      { user: userData },
      config.startgg.jwtSecret,
      { expiresIn: '7d' }
    );

    return userInfoToken;
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
};
