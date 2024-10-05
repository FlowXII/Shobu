import { fetchDashboardData } from '../services/dashboardService.js';
import jwt from 'jsonwebtoken';
import config from '../config/startgg.config.js';

export const getDashboard = async (req, res) => {
  console.log('Dashboard route accessed');

  const token = req.cookies.auth_token;
  if (!token) {
    console.log('Unauthorized access attempt');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Verify and decode the JWT token
    const decoded = jwt.verify(token, config.startgg.jwtSecret);
    const accessToken = decoded.startgg_access_token;

    console.log('Access token retrieved:', accessToken ? 'Yes' : 'No');

    const dashboardData = await fetchDashboardData(accessToken);
    console.log('Dashboard data retrieved successfully');

    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching user dashboard:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
