import Phase from '../models/Phase.js';
import Set from '../models/Set.js';
import Seeding from '../models/Seeding.js';

export const generateBrackets = async (eventId, phaseId, bracketType = 'SINGLE_ELIMINATION') => {
  try {
    // Get seeding information
    const seeding = await Seeding.findOne({ 
      eventId, 
      phaseId, 
      status: 'final' 
    });

    if (!seeding) {
      throw new Error('No finalized seeding found for this phase');
    }

    // Sort seeds by seed number
    const sortedSeeds = seeding.seeds.sort((a, b) => a.seedNumber - b.seedNumber);

    // Generate bracket structure based on number of participants
    const numParticipants = sortedSeeds.length;
    const numRounds = Math.ceil(Math.log2(numParticipants));
    const totalSets = Math.pow(2, numRounds) - 1;

    // Create sets array
    const sets = [];
    let currentRound = 1;
    let setsInRound = Math.pow(2, numRounds - 1);
    let setIndex = 0;

    while (currentRound <= numRounds) {
      for (let i = 0; i < setsInRound; i++) {
        const set = new Set({
          eventId,
          phaseId,
          fullRoundText: `Round ${currentRound} - Match ${i + 1}`,
          state: 1, // PENDING
          slots: []
        });

        // For first round, assign players based on seeding
        if (currentRound === 1) {
          const player1Index = i * 2;
          const player2Index = i * 2 + 1;

          set.slots = [
            {
              entrant: player1Index < sortedSeeds.length ? 
                sortedSeeds[player1Index].participantId : null,
              score: 0
            },
            {
              entrant: player2Index < sortedSeeds.length ? 
                sortedSeeds[player2Index].participantId : null,
              score: 0
            }
          ];
        } else {
          // For other rounds, create empty slots
          set.slots = [
            { entrant: null, score: 0 },
            { entrant: null, score: 0 }
          ];
        }

        sets.push(set);
        setIndex++;
      }

      currentRound++;
      setsInRound = setsInRound / 2;
    }

    // Save all sets
    const savedSets = await Set.insertMany(sets);

    // Update phase with sets
    await Phase.findByIdAndUpdate(phaseId, {
      $set: {
        sets: savedSets.map(set => set._id),
        'metadata.bracketType': bracketType,
        'metadata.numberOfRounds': numRounds,
        'metadata.totalSets': totalSets
      }
    });

    return savedSets;
  } catch (error) {
    console.error('Error generating brackets:', error);
    throw error;
  }
}; 