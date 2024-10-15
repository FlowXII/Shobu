import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import upcomingTournamentsRoute from './routes/upcomingTournamentsRoute.js';
import stationViewerRoute from './routes/stationViewerRoute.js';
import startggAuthRoutes from './routes/auth/startgg.routes.js';
import cookieParser from 'cookie-parser';
import dashboardRoute from './routes/dashboardRoute.js';
import pushNotificationsRoute from './routes/pushNotificationsRoute.js';

dotenv.config();

const app = express();

// Set up CORS
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// API routes
app.use('/api/tournaments', upcomingTournamentsRoute);
app.use('/api', stationViewerRoute);
app.use('/api', startggAuthRoutes);
app.use('/api', dashboardRoute);
app.use('/api/notifications', pushNotificationsRoute);

// Export the app
export default app;
