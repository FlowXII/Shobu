// controllers/set.controller.js
import Set from '../models/Set.js';

export const createSet = async (req, res) => {
  try {
    const {
      eventId,
      phaseId,
      player1,
      player2,
      bestOf,
      round
    } = req.body;

    const newSet = await Set.create({
      eventId,
      phaseId,
      player1,
      player2,
      bestOf,
      round
    });

    res.status(201).json(newSet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSets = async (req, res) => {
  try {
    const { eventId, phaseId } = req.query;
    const query = {};
    
    if (eventId) query.eventId = eventId;
    if (phaseId) query.phaseId = phaseId;

    const sets = await Set.find(query)
      .populate('player1', 'username')
      .populate('player2', 'username')
      .populate('winner', 'username');

    res.json(sets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSetStatus = async (req, res) => {
  try {
    const { setId } = req.params;
    const { status, station } = req.body;

    const updatedSet = await Set.findByIdAndUpdate(
      setId,
      { 
        status,
        ...(station && { station }),
        ...(status === 'IN_PROGRESS' && { startTime: new Date() }),
        ...(status === 'COMPLETED' && { endTime: new Date() })
      },
      { new: true }
    );

    res.json(updatedSet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

