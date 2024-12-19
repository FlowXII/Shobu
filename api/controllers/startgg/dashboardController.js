import { fetchDashboardData } from '../../services/startgg/dashboard/dashboardService.js';
import User from '../../models/User.js';

export const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user?.startgg?.accessToken) {
      return res.status(401).json({ error: 'Start.gg not connected' });
    }

    const dashboardData = await fetchDashboardData(user.startgg.accessToken);
    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
