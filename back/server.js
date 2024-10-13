import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import upcomingTournamentsRoute from './routes/upcomingTournamentsRoute.js';
import stationViewerRoute from './routes/stationViewerRoute.js';
import startggAuthRoutes from './routes/auth/startgg.routes.js';
import cookieParser from 'cookie-parser';
import dashboardRoute from './routes/dashboardRoute.js';
import pushNotificationsRoute from './routes/pushNotificationsRoute.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '..', 'front', 'dist')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'front', 'dist', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
