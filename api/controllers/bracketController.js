import Event from '../models/Event.js';
import Phase from '../models/Phase.js';
import Set from '../models/Set.js';
import Match from '../models/Match.js';
import logger from '../utils/logger.js';
import mongoose from 'mongoose';

export const generateBrackets = async (req, res) => {
  try {
    const { eventId, tournamentId } = req.params;

    logger.info('Generating brackets - Received IDs', {
      eventId,
      tournamentId,
      eventIdType: typeof eventId,
      tournamentIdType: typeof tournamentId
    });

    // Validate both IDs
    if (!mongoose.Types.ObjectId.isValid(eventId) || !mongoose.Types.ObjectId.isValid(tournamentId)) {
      logger.warn('Invalid ID format', { 
        eventId,
        tournamentId,
        isValidEventId: mongoose.Types.ObjectId.isValid(eventId),
        isValidTournamentId: mongoose.Types.ObjectId.isValid(tournamentId)
      });
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid ID format' 
      });
    }

    const { type = 'SINGLE_ELIMINATION', seeding = 'random' } = req.body;

    // Convert IDs to ObjectId
    const eventObjectId = new mongoose.Types.ObjectId(eventId);
    const tournamentObjectId = new mongoose.Types.ObjectId(tournamentId);

    // Fetch event with populated participants and phases
    const event = await Event.findOne({
      _id: eventObjectId,
      tournamentId: tournamentObjectId
    }).select('participants phases'); // Add phases to selection

    logger.info('Found event', {
      eventId,
      participantsCount: event?.participants?.length || 0,
      phasesCount: event?.phases?.length || 0
    });

    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    // Initialize phases array if it doesn't exist
    if (!event.phases) {
      event.phases = [];
    }

    if (!event.participants || event.participants.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'No participants found in the event' 
      });
    }

    // Get participants and shuffle if random seeding
    let participants = [...event.participants];
    logger.info('Prepared participants array', {
      participantsCount: participants.length,
      firstParticipant: participants[0],
      seeding
    });

    if (seeding === 'random') {
      participants = participants.sort(() => Math.random() - 0.5);
    } else if (seeding === 'manual') {
      participants.sort((a, b) => (a.seed || Infinity) - (b.seed || Infinity));
    }

    // Pad the participants array to the nearest power of 2 with byes
    const numRounds = Math.ceil(Math.log2(participants.length));
    const totalSlots = Math.pow(2, numRounds);
    
    while (participants.length < totalSlots) {
      participants.push(null); // Add bye slots
    }

    // Create the bracket phase
    const phase = await Phase.create({
      eventId: eventObjectId,
      name: `${type} Bracket`,
      type: 'bracket',
      metadata: {
        bracketType: type,
        seedingType: seeding,
        numberOfRounds: numRounds,
        totalParticipants: event.participants.length,
        totalSlots: totalSlots,
        startedAt: null,
        completedAt: null,
        status: 'created',
        participants: participants.map(p => ({
          displayName: p?.displayName || 'BYE',
          seed: p?.seed || null,
          initialSeedNumber: p?.seed || null,
          isBye: !p
        }))
      }
    });

    logger.info('Created phase', {
      phaseId: phase._id,
      name: phase.name,
      type: phase.type
    });

    // Generate the bracket structure
    const sets = await generateBracketSets(participants, phase._id, eventObjectId);

    // Update phase with generated sets
    phase.sets = sets.map(set => set._id);
    await phase.save();

    logger.info('Updated phase with sets', {
      phaseId: phase._id,
      setsCount: sets.length
    });

    // Update event with the new phase
    event.phases.push(phase._id);
    await event.save();

    logger.info('Updated event with new phase', {
      eventId: event._id,
      phasesCount: event.phases.length
    });

    // Populate the sets in the phase for the response
    const populatedPhase = await Phase.findById(phase._id)
      .populate('sets')
      .lean();

    res.json({
      success: true,
      phase: populatedPhase
    });

  } catch (error) {
    logger.error('Failed to generate brackets', {
      error: error.message,
      params: req.params,
      stack: error.stack
    });
    res.status(500).json({ success: false, error: error.message });
  }
};

async function generateBracketSets(participants, phaseId, eventId) {
  logger.info('Generating bracket sets', {
    participantsCount: participants?.length || 0,
    phaseId,
    eventId
  });

  const numRounds = Math.ceil(Math.log2(participants.length));
  const totalSlots = Math.pow(2, numRounds);
  
  logger.info('Bracket configuration', {
    numRounds,
    totalSlots,
    actualParticipants: participants.length
  });

  // Track sets by round for easier progression linking
  const setsByRound = new Map();
  
  // Prepare all sets data first
  const setsToCreate = [];
  
  // Generate all rounds
  for (let round = 1; round <= numRounds; round++) {
    const matchesInRound = Math.pow(2, numRounds - round);
    const roundSets = [];
    
    for (let match = 0; match < matchesInRound; match++) {
      let slots;
      
      if (round === 1) {
        const player1Idx = match;
        const player2Idx = totalSlots - 1 - match;
        
        slots = [
          createParticipantSlot(participants[player1Idx]),
          createParticipantSlot(participants[player2Idx])
        ];
      } else {
        slots = [
          { entrant: null, seedNumber: null },
          { entrant: null, seedNumber: null }
        ];
      }

      const setData = {
        eventId,
        phaseId,
        fullRoundText: `Round ${round} - Match ${match + 1}`,
        round,
        matchNumber: match + 1,
        state: round === 1 && slots[0].entrant && slots[1].entrant ? 1 : 0,
        slots,
        metadata: {
          isLosersBracket: false,
          roundName: getRoundName(numRounds, round),
          nextMatchId: null,
          previousMatchIds: []
        }
      };

      setsToCreate.push(setData);
      roundSets.push(setData);
    }
    
    setsByRound.set(round, roundSets);
  }

  try {
    // Bulk create all sets at once
    const createdSets = await Set.insertMany(setsToCreate);
    
    logger.info('Created sets', {
      count: createdSets.length,
      firstSetId: createdSets[0]?._id,
      setsToCreate: setsToCreate.length
    });

    // Sort created sets by round and match number for consistent ordering
    const sortedSets = createdSets.sort((a, b) => {
      if (a.round === b.round) {
        return a.matchNumber - b.matchNumber;
      }
      return a.round - b.round;
    });

    // Map created sets to their rounds
    const createdSetsByRound = new Map();
    for (let round = 1; round <= numRounds; round++) {
      createdSetsByRound.set(round, sortedSets.filter(set => set.round === round));
    }

    logger.info('Sets mapped by round', {
      roundsCount: createdSetsByRound.size,
      setsPerRound: Array.from(createdSetsByRound.entries()).map(([round, sets]) => ({
        round,
        count: sets.length
      }))
    });

    // Prepare updates for linking matches
    const setUpdates = [];
    
    for (let round = 1; round < numRounds; round++) {
      const currentRoundSets = createdSetsByRound.get(round);
      const nextRoundSets = createdSetsByRound.get(round + 1);

      if (!currentRoundSets || !nextRoundSets) {
        logger.warn('Missing round sets', { 
          round, 
          hasCurrentRound: !!currentRoundSets, 
          hasNextRound: !!nextRoundSets,
          currentRoundCount: currentRoundSets?.length,
          nextRoundCount: nextRoundSets?.length
        });
        continue;
      }

      for (let i = 0; i < currentRoundSets.length; i += 2) {
        const nextRoundIndex = Math.floor(i / 2);
        const nextSet = nextRoundSets[nextRoundIndex];
        
        if (!nextSet) {
          logger.warn('Missing next set', { round, i, nextRoundIndex });
          continue;
        }

        const set1 = currentRoundSets[i];
        const set2 = currentRoundSets[i + 1];

        if (set1) {
          setUpdates.push({
            updateOne: {
              filter: { _id: set1._id },
              update: { 'metadata.nextMatchId': nextSet._id }
            }
          });
        }

        if (set2) {
          setUpdates.push({
            updateOne: {
              filter: { _id: set2._id },
              update: { 'metadata.nextMatchId': nextSet._id }
            }
          });
        }

        if (set1 || set2) {
          setUpdates.push({
            updateOne: {
              filter: { _id: nextSet._id },
              update: { 
                $push: { 
                  'metadata.previousMatchIds': {
                    $each: [set1?._id, set2?._id].filter(Boolean)
                  }
                }
              }
            }
          });
        }
      }
    }

    // Bulk update all sets with their links
    if (setUpdates.length > 0) {
      await Set.bulkWrite(setUpdates);
      logger.info('Updated set links', { updateCount: setUpdates.length });
    }

    return sortedSets;

  } catch (error) {
    logger.error('Error in generateBracketSets', {
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}

function createParticipantSlot(participant) {
  logger.info('Creating participant slot', { participant });

  // Special handling for development/test data
  if (participant && !participant.userId && participant.displayName) {
    return {
      entrant: {
        id: `dev_${participant.displayName.replace(/\s+/g, '_')}`, // Create a fake ID for development
        name: participant.displayName,
        seedNumber: participant.seed || null,
        isDevelopmentData: true
      },
      seedNumber: participant.seed || null
    };
  }

  if (!participant || !participant.userId) {
    return { 
      entrant: null, 
      seedNumber: null,
      isBye: true
    };
  }

  try {
    return {
      entrant: {
        id: participant.userId.toString(),
        name: participant.displayName || 'Unknown Player',
        seedNumber: participant.seed || null
      },
      seedNumber: participant.seed || null
    };
  } catch (error) {
    logger.error('Error creating participant slot', {
      error: error.message,
      participant
    });
    return { 
      entrant: null, 
      seedNumber: null,
      isBye: true
    };
  }
}

function getRoundName(totalRounds, currentRound) {
  const roundsFromFinal = totalRounds - currentRound;
  switch (roundsFromFinal) {
    case 0: return 'Grand Finals';
    case 1: return 'Finals';
    case 2: return 'Semi-Finals';
    case 3: return 'Quarter-Finals';
    default: return `Round ${currentRound}`;
  }
} 