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

// Serverless function handler
export default async function handler(req, res) {
  await new Promise((resolve, reject) => {
    app(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
