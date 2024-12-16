import { seedingService } from '../services/seedingService.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const seedingController = {
  createSeeding: asyncHandler(async (req, res) => {
    const { eventId, phaseId } = req.params;
    const { type } = req.body;

    const seeding = await seedingService.createSeeding(eventId, phaseId, type);
    res.status(201).json({ success: true, data: seeding });
  }),

  updateSeeding: asyncHandler(async (req, res) => {
    const { eventId, phaseId } = req.params;
    const { seeds } = req.body;

    const seeding = await seedingService.updateSeeding(eventId, phaseId, seeds);
    res.json({ success: true, data: seeding });
  }),

  finalizeSeeding: asyncHandler(async (req, res) => {
    const { eventId, phaseId } = req.params;

    const seeding = await seedingService.finalizeSeeding(eventId, phaseId);
    res.json({ success: true, data: seeding });
  }),

  getSeeding: asyncHandler(async (req, res) => {
    const { eventId, phaseId } = req.params;

    const seeding = await seedingService.getSeeding(eventId, phaseId);
    res.json({ success: true, data: seeding });
  })
}; 