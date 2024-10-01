// back/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';  // Import the cors package
import upcomingTournamentsRoute from './routes/upcomingTournamentsRoute.js';

dotenv.config();

const app = express();

// Set up CORS
app.use(cors());

app.use(express.json());  // Add this line to parse JSON request bodies
app.use('/api/tournaments', upcomingTournamentsRoute);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;