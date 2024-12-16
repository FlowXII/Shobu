import { asyncHandler } from '../middleware/asyncHandler.js';
import { generateBrackets } from '../services/bracketService.js';
import Seeding from '../models/Seeding.js';

export const generateEventBrackets = asyncHandler(async (req, res) => {
  const { eventId, phaseId } = req.params;
  const { bracketType } = req.body;

  // Check if seeding exists and is finalized
  const seeding = await Seeding.findOne({ 
    eventId, 
    phaseId, 
    status: 'final' 
  });

  if (!seeding) {
    return res.status(400).json({
      success: false,
      error: 'Please finalize seeding before generating brackets'
    });
  }

  const brackets = await generateBrackets(eventId, phaseId, bracketType);

  res.status(201).json({
    success: true,
    data: brackets
  });
}); 