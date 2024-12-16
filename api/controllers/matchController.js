// controllers/match.controller.js
import Match from '../models/Match.js';
import Set from '../models/Set.js';

export const createMatch = async (req, res) => {
  try {
    const {
      setId,
      matchNumber,
      stage
    } = req.body;

    const newMatch = await Match.create({
      setId,
      matchNumber,
      stage
    });

    res.status(201).json(newMatch);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateMatchScore = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { player1Score, player2Score, winner } = req.body;

    const updatedMatch = await Match.findByIdAndUpdate(
      matchId,
      {
        player1Score,
        player2Score,
        winner
      },
      { new: true }
    );

    // Check if set is complete
    const match = await Match.findById(matchId);
    const set = await Set.findById(match.setId);
    const matches = await Match.find({ setId: match.setId });
    
    const player1Wins = matches.filter(m => m.winner?.toString() === set.player1.toString()).length;
    const player2Wins = matches.filter(m => m.winner?.toString() === set.player2.toString()).length;
    
    if (player1Wins > set.bestOf/2 || player2Wins > set.bestOf/2) {
      await Set.findByIdAndUpdate(match.setId, {
        status: 'COMPLETED',
        winner: player1Wins > player2Wins ? set.player1 : set.player2,
        endTime: new Date()
      });
    }

    res.json(updatedMatch);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};