import { fetchDashboardData } from '../../../services/dashboard/dashboardService.js';
import { fetchGraphQLData } from '../../../services/dashboard/dashboardFetch.js';

// Mock the fetchGraphQLData function
jest.mock('../../../services/dashboard/dashboardFetch.js');

describe('Dashboard Service', () => {
  const mockAccessToken = 'mock-token';
  const mockUserData = {
    data: {
      currentUser: {
        name: 'Test User',
        player: {
          gamerTag: 'TestPlayer',
          id: '123'
        }
      }
    }
  };

  beforeEach(() => {
    fetchGraphQLData.mockClear();
  });

  it('should fetch dashboard data successfully', async () => {
    fetchGraphQLData.mockResolvedValueOnce(mockUserData)
      .mockResolvedValueOnce({
        data: {
          currentUser: {
            tournaments: {
              nodes: []
            }
          }
        }
      });

    const result = await fetchDashboardData(mockAccessToken);
    expect(result).toBeDefined();
    expect(fetchGraphQLData).toHaveBeenCalledTimes(2);
  });

  it('should handle errors when fetching dashboard data', async () => {
    fetchGraphQLData.mockRejectedValue(new Error('API Error'));
    await expect(fetchDashboardData(mockAccessToken)).rejects.toThrow('API Error');
  });
}); 