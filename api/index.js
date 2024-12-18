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
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
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

// Core API routes
app.use('/api/tournaments', upcomingTournamentsRoute);
app.use('/api/stations', stationViewerRoute);
app.use('/api/dashboard', dashboardRoute);
app.use('/api/tickets', ticketRoutes);
app.use('/api/notifications', pushNotificationsRoute);
app.use('/api/stations/reporting', stationReportingRoute);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/events', eventRoutes);

// Auth routes
app.use('/api/auth', authRoutes);
app.use('/api/auth/startgg', startggAuthRoutes);

// User routes (non-auth)
app.use('/api/users', userRoutes);

// Messaging routes
app.use('/api/messages', messageRoutes);
app.use('/api/conversations', conversationRoutes);

export default app;
