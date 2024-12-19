import Phase from "../../models/Phase.js";
import { AppError } from "../../utils/errors.js";
import Set from "../../models/Set.js";
import Event from "../../models/Event.js";
import logger from "../../utils/logger.js";
import mongoose from "mongoose";

/**
 * Creates a new phase
 * @param {Tournament} tournament - Tournament object
 * @param {Event} event - Event object
 * @param {Object} phaseData - Phase data from request body
 * @returns {Promise<Phase>} Created phase
 */
const createPhase = async (tournament, event, phaseData) => {
    // Validate required fields
    const requiredFields = ['name', 'type', 'metadata'];
    const missingFields = requiredFields.filter(field => !phaseData[field]);
    if (missingFields.length > 0) {
        throw new AppError(`Missing required fields: ${missingFields.join(', ')}`, 400);
    }

    // Validate metadata fields based on phase type
    const {
        bracketType,
        seedingType,
        numberOfRounds,
        totalParticipants,
        participants
    } = phaseData.metadata;

    if (phaseData.type === 'bracket' && !bracketType) {
        throw new AppError('Bracket type is required for bracket phases', 400);
    }

    const phase = new Phase({
        eventId: event._id,
        name: phaseData.name,
        type: phaseData.type,
        metadata: {
            bracketType: bracketType || null,
            seedingType: seedingType || 'random',
            numberOfRounds,
            totalParticipants,
            participants: participants || [],
            status: 'created'
        }
    });

    await phase.save();
    return phase;
};

/**
 * Gets a phase by ID
 * @param {string} phaseId - Phase ID
 * @returns {Promise<Phase>} Phase object
 */
const getPhase = async (phaseId) => {
    const phase = await Phase.findById(phaseId);
    if (!phase) {
        throw new AppError('Phase not found', 404);
    }
    return phase;
};

/**
 * Deletes a phase
 * @param {string} phaseId - Phase ID
 * @returns {Promise<void>}
 */
const deletePhase = async (phaseId) => {
    const phase = await Phase.findById(phaseId);
    if (!phase) {
        throw new AppError('Phase not found', 404);
    }

    // Check if phase can be deleted (e.g., not in progress)
    if (phase.metadata.status === 'in_progress') {
        throw new AppError('Cannot delete a phase that is in progress', 400);
    }

    await Phase.findByIdAndDelete(phaseId);
};

/**
 * Generates sets for a bracket phase
 * @param {Array} participants - Array of seeded participants
 * @param {string} phaseId - Phase ID
 * @param {string} eventId - Event ID
 * @returns {Promise<Array>} Array of created sets
 */
const generateBracketSets = async (participants, phaseId, eventId) => {
    const numParticipants = participants.length;
    const numRounds = Math.ceil(Math.log2(numParticipants));
    const sets = [];

    // First round sets
    for (let i = 0; i < numParticipants; i += 2) {
        const player1 = participants[i];
        const player2 = participants[i + 1] || null; // Might be a bye

        const set = await Set.create({
            phaseId,
            eventId,
            roundNumber: 1,
            fullRoundText: getRoundName(numRounds, 1),
            slots: [
                { entrant: player1?._id || null, score: 0 },
                { entrant: player2?._id || null, score: 0 }
            ],
            state: 'pending',
            metadata: {
                isComplete: false,
                winnerId: null,
                loserId: null
            }
        });

        sets.push(set);
    }

    // Generate placeholder sets for subsequent rounds
    let currentRoundSets = [...sets];
    for (let round = 2; round <= numRounds; round++) {
        const roundSets = [];
        for (let i = 0; i < currentRoundSets.length; i += 2) {
            const set = await Set.create({
                phaseId,
                eventId,
                roundNumber: round,
                fullRoundText: getRoundName(numRounds, round),
                slots: [
                    { entrant: null, score: 0 },
                    { entrant: null, score: 0 }
                ],
                state: 'pending',
                metadata: {
                    isComplete: false,
                    winnerId: null,
                    loserId: null
                }
            });
            roundSets.push(set);
        }
        currentRoundSets = roundSets;
        sets.push(...roundSets);
    }

    return sets;
};

/**
 * Gets the name of a round based on its position from the finals
 */
const getRoundName = (totalRounds, currentRound) => {
    const roundsFromFinal = totalRounds - currentRound + 1;
    switch (roundsFromFinal) {
        case 1: return 'Grand Finals';
        case 2: return 'Finals';
        case 3: return 'Semi-Finals';
        case 4: return 'Quarter-Finals';
        default: return `Round ${currentRound}`;
    }
};

/**
 * Generates a bracket phase for an event
 * @param {string} eventId - Event ID
 * @param {Object} options - Bracket options
 * @returns {Promise<Phase>} Created phase with brackets
 */
const generateBracketPhase = async (eventId, options = {}) => {
    const { type = 'SINGLE_ELIMINATION', seeding = 'random' } = options;

    const event = await Event.findById(eventId).select('participants phases');
    if (!event) {
        throw new AppError('Event not found', 404);
    }

    if (!event.participants?.length) {
        throw new AppError('No participants found in the event', 400);
    }

    // Get participants and handle seeding
    let participants = [...event.participants];
    if (seeding === 'random') {
        participants = participants.sort(() => Math.random() - 0.5);
    } else if (seeding === 'manual') {
        participants.sort((a, b) => (a.seed || Infinity) - (b.seed || Infinity));
    }

    // Calculate bracket structure
    const numRounds = Math.ceil(Math.log2(participants.length));
    const totalSlots = Math.pow(2, numRounds);

    // Create phase
    const phase = await Phase.create({
        eventId,
        name: `${type} Bracket`,
        type: 'bracket',
        metadata: {
            bracketType: type,
            seedingType: seeding,
            numberOfRounds: numRounds,
            totalParticipants: participants.length,
            participants: participants.map(p => ({
                displayName: p?.displayName || 'BYE',
                seed: p?.seed || null,
                initialSeedNumber: p?.seed || null,
                isBye: !p
            }))
        }
    });

    // Generate sets
    const sets = await generateBracketSets(participants, phase._id, eventId);
    
    // Update phase with sets
    phase.sets = sets.map(set => set._id);
    await phase.save();

    return phase;
};

export {
    createPhase,
    getPhase,
    deletePhase,
    generateBracketPhase
};