import Seeding from '../models/Seeding.js';
import Event from '../models/Event.js';
import Phase from '../models/Phase.js';

export const seedingService = {
  async createSeeding(eventId, phaseId, type = 'manual') {
    const event = await Event.findById(eventId);
    if (!event) throw new Error('Event not found');

    const phase = await Phase.findById(phaseId);
    if (!phase) throw new Error('Phase not found');

    // Create initial seeding with participants in random order if type is random
    const seeds = event.participants.map((participant, index) => ({
      participantId: participant._id,
      seedNumber: type === 'random' ? Math.random() : index + 1,
      displayName: participant.displayName
    }));

    if (type === 'random') {
      seeds.sort((a, b) => a.seedNumber - b.seedNumber);
      seeds.forEach((seed, index) => {
        seed.seedNumber = index + 1;
      });
    }

    const seeding = new Seeding({
      eventId,
      phaseId,
      seeds,
      type,
      status: 'draft'
    });

    await seeding.save();
    return seeding;
  },

  async updateSeeding(eventId, phaseId, seeds) {
    const seeding = await Seeding.findOne({ eventId, phaseId });
    if (!seeding) throw new Error('Seeding not found');

    seeding.seeds = seeds;
    await seeding.save();
    return seeding;
  },

  async finalizeSeeding(eventId, phaseId) {
    const seeding = await Seeding.findOne({ eventId, phaseId });
    if (!seeding) throw new Error('Seeding not found');

    seeding.status = 'final';
    await seeding.save();
    return seeding;
  },

  async getSeeding(eventId, phaseId) {
    return await Seeding.findOne({ eventId, phaseId })
      .populate('seeds.participantId');
  }
}; 