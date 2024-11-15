import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import upcomingTournamentsRoute from './routes/upcomingTournamentsRoute.js';
import stationViewerRoute from './routes/stationViewerRoute.js';
import startggAuthRoutes from './routes/auth/startgg.routes.js';
import cookieParser from 'cookie-parser';
import dashboardRoute from './routes/dashboardRoute.js';
import pushNotificationsRoute from './routes/pushNotificationsRoute.js';
import stationReportingRoute from './routes/stationReportingRoute.js';
import tournamentRoutes from './routes/tournamentRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
dotenv.config();

const app = express();

// Set up CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Your Vite frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

// API routes
app.use('/api/tournaments', upcomingTournamentsRoute);
app.use('/api', stationViewerRoute);
app.use('/api', startggAuthRoutes);
app.use('/api', dashboardRoute);
app.use('/api/notifications', pushNotificationsRoute);
// API reporting routes
app.use('/api', stationReportingRoute);

// Tournament routes
app.use('/api/tournaments', tournamentRoutes); 

// User routes
app.use('/api/auth', userRoutes);

// Post routes
app.use('/api', postRoutes);

// Event routes
app.use('/api', eventRoutes);

// Export the app
export default app;
