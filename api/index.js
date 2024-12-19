import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Core Routes
// Auth and user routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Tournament and event routes
import tournamentRoutes from './routes/tournamentRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import phaseRoutes from './routes/phaseRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';

// Post and message routes
import postRoutes from './routes/postRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';

// StartGG related Routes
import upcomingTournamentsRoute from './routes/startgg/upcomingTournamentsRoute.js';
import stationViewerRoute from './routes/startgg/stationViewerRoute.js';
import startggAuthRoutes from './routes/auth/startgg.routes.js';
import stationReportingRoute from './routes/startgg/stationReportingRoute.js';
import dashboardRoute from './routes/startgg/dashboardRoute.js';
import pushNotificationsRoute from './routes/pushNotificationsRoute.js';

// Error handling
import { errorHandler } from './utils/errorHandler.js';

dotenv.config();

const app = express();

// Set up CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

// Auth routes
app.use('/api/auth', authRoutes);
app.use('/api/auth/startgg', startggAuthRoutes);

// User routes (non-auth)
app.use('/api/users', userRoutes);

// Tournament and event routes
app.use('/api/tournaments', tournamentRoutes);
app.use('/api', eventRoutes);
app.use('/api', ticketRoutes);
app.use('/api', phaseRoutes);

// Post and message routes
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/conversations', conversationRoutes);

// StartGG related routes
app.use('/api/tournaments', upcomingTournamentsRoute);
app.use('/api/stations', stationViewerRoute);
app.use('/api/dashboard', dashboardRoute);
app.use('/api/stations/reporting', stationReportingRoute);
app.use('/api/notifications', pushNotificationsRoute);

// Error handling middleware
app.use(errorHandler);

export default app;
