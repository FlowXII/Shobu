import { fetchGraphQLData } from './dashboardFetch.js';
import { userInfoQuery, userTournamentsAndSetsQuery } from './dashboardGQL.js';
import { processData } from './dashboardDataProcessing.js';

// Main function to fetch dashboard data
export const fetchDashboardData = async (accessToken) => {
  console.time('fetchDashboardData');
  
  try {
    // Step 1: Fetch basic user information
    const userInfoResponse = await fetchGraphQLData(accessToken, userInfoQuery);
    const userData = userInfoResponse.data?.currentUser;

    if (!userData) {
      throw new Error('User data not found');
    }

    // Step 2: Fetch user's tournament, event, and set data
    const userName = userData.player?.gamerTag;
    const playerId = userData.player?.id;
    if (!userName || !playerId) {
      throw new Error('User name or ID not found');
    }

    // Ensure the query includes state 1
    const tournamentsAndSetsResponse = await fetchGraphQLData(accessToken, userTournamentsAndSetsQuery, { 
      userName, 
      playerIds: [playerId] // Pass as an array
    });
    const tournamentsAndSetsData = tournamentsAndSetsResponse.data.currentUser?.tournaments?.nodes || [];

    // Step 3: Process and combine the data
    const processedData = processData(userData, tournamentsAndSetsData);
    console.timeEnd('fetchDashboardData');
    
    return processedData;
  } catch (error) {
    console.error('Error in fetchDashboardData:', error.message);
    console.timeEnd('fetchDashboardData');
    throw error;
  }
};
