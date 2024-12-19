import { FetchStations } from '../../services/startgg/Stations/stationViewerService.js';

export const getStations = async (req, res) => {
  const { eventId } = req.params; // Assuming eventId is passed as a URL parameter

  console.log(`Received request to fetch stations for event ID: ${eventId}`);

  try {
    const data = await FetchStations(eventId);
    res.json(data);
  } catch (error) {
    console.error(`Error in getStations: ${error.message}`);
    res.status(500).json({ error: 'Error fetching stations' });
  }
};
