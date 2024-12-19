import { reportSet, resetSet, markSetCalled, markSetInProgress } from '../../services/startgg/Stations/stationReportingService.js';

export const handleReportSet = async (req, res) => {
  const { setId, player1Id, player2Id, player1Score, player2Score } = req.body;
  const accessToken = req.user.startgg_access_token;

  try {
    const result = await reportSet(setId, player1Id, player2Id, player1Score, player2Score, accessToken);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const handleResetSet = async (req, res) => {
  const { setId, resetDependentSets } = req.body;
  const accessToken = req.user.startgg_access_token;

  try {
    const result = await resetSet(setId, resetDependentSets, accessToken);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const handleMarkSetCalled = async (req, res) => {
  const { setId } = req.body;
  const accessToken = req.user.startgg_access_token;

  try {
    const result = await markSetCalled(setId, accessToken);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const handleMarkSetInProgress = async (req, res) => {
  const { setId } = req.body;
  const accessToken = req.user.startgg_access_token;

  try {
    const result = await markSetInProgress(setId, accessToken);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
