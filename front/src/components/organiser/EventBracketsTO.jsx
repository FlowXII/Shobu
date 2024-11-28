import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardBody,
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select,
  Option,
} from "@material-tailwind/react";
import { Trophy, Users, Brackets, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import { generateBrackets } from '../../loaders/eventLoader';

const BRACKET_CONFIG = {
  LAYOUT: {
    MATCH_HEIGHT: 80,
    MATCH_WIDTH: 220,
    CONNECTOR_WIDTH: 20,
    ROUND_SPACING: 60,
    MATCH_SPACING: 10
  }
};

const bracketStyles = {
  bracketContainer: "relative p-4 overflow-x-auto max-h-[800px]",
  roundColumn: "flex flex-col items-center min-w-[240px]",
  roundsWrapper: "flex gap-12 items-start",
  matchCard: "border border-gray-700 rounded p-2 bg-gray-800/50 w-[220px]",
  matchPlayer: "py-1 px-2 my-1 bg-gray-700/50 rounded text-sm flex items-center justify-between",
  connector: "absolute bg-gray-600",
  roundLabel: "text-gray-400 text-sm font-medium mb-2"
};

const EventBracketsTO = ({ event, onBracketsGenerated }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [seeding, setSeeding] = useState('random');
  const [bracketType, setBracketType] = useState(event?.format || 'SINGLE_ELIMINATION');
  const [loading, setLoading] = useState(false);
  const [brackets, setBrackets] = useState(null);
  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    if (event?.phases?.length > 0) {
      // Find the bracket phase
      const bracketPhase = event.phases.find(phase => phase.type === 'bracket');
      if (bracketPhase) {
        console.log('Found bracket phase:', bracketPhase); // Debug log
        setBrackets(bracketPhase);
      }
    }
  }, [event]);

  useEffect(() => {
    console.log('Full event object:', event);
  }, [event]);

  const handleGenerateBrackets = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Get the correct tournament ID
      const tournamentId = typeof event.tournamentId === 'object' 
        ? event.tournamentId._id 
        : event.tournamentId;

      const result = await generateBrackets(
        tournamentId,
        event._id,
        bracketType, 
        seeding
      );
      
      setBrackets(result.phase);
      if (onBracketsGenerated) {
        onBracketsGenerated(result);
      }
      
      toast.success('Brackets generated successfully');
      setOpenDialog(false);
    } catch (error) {
      toast.error(error.message || 'Failed to generate brackets');
    } finally {
      setLoading(false);
    }
  };

  const organizeSets = (sets) => {
    return sets?.reduce((acc, set) => {
      const round = set.fullRoundText || `Round ${set.round || 1}`;
      if (!acc[round]) acc[round] = [];
      acc[round].push(set);
      return acc;
    }, {}) || {};
  };

  const MatchCard = ({ set }) => (
    <div className={bracketStyles.matchCard}>
      {set.slots?.map((slot, index) => (
        <div key={`slot-${index}`} className={bracketStyles.matchPlayer}>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-blue-500' : 'bg-red-500'}`} />
            <Typography variant="small">
              {slot?.entrant?.name || slot?.displayName || 'BYE'}
            </Typography>
          </div>
          {slot?.seedNumber && (
            <Typography variant="small" className="text-gray-500">
              #{slot.seedNumber}
            </Typography>
          )}
        </div>
      ))}
    </div>
  );

  const renderBrackets = () => {
    if (!brackets?.sets?.length) return null;

    const roundSets = organizeSets(brackets.sets);
    const rounds = Object.keys(roundSets);

    // Modified spacing calculation
    const getMatchSpacing = (roundIndex) => {
      // Use a more controlled scaling factor
      return BRACKET_CONFIG.LAYOUT.MATCH_SPACING * (roundIndex + 1);
    };

    return (
      <div className={bracketStyles.bracketContainer}>
        <div className={bracketStyles.roundsWrapper}>
          {rounds.map((round, roundIndex) => {
            const matchesInRound = roundSets[round];
            const spacing = getMatchSpacing(roundIndex);
            
            return (
              <div key={round} className={bracketStyles.roundColumn} style={{
                marginTop: spacing
              }}>
                <Typography className={bracketStyles.roundLabel}>
                  {round}
                </Typography>
                
                <div className="flex flex-col" style={{ gap: `${spacing}px` }}>
                  {matchesInRound.map((set, matchIndex) => (
                    <div key={set._id || matchIndex} className="relative">
                      <MatchCard set={set} />
                      
                      {roundIndex < rounds.length - 1 && (
                        <>
                          <div className={bracketStyles.connector} style={{
                            width: `${BRACKET_CONFIG.LAYOUT.CONNECTOR_WIDTH}px`,
                            height: '2px',
                            right: `-${BRACKET_CONFIG.LAYOUT.CONNECTOR_WIDTH}px`,
                            top: '50%',
                            transform: 'translateY(-50%)'
                          }} />
                          
                          {matchIndex % 2 === 0 && (
                            <div className={bracketStyles.connector} style={{
                              width: '2px',
                              height: `${spacing + BRACKET_CONFIG.LAYOUT.MATCH_HEIGHT/2}px`,
                              right: `-${BRACKET_CONFIG.LAYOUT.CONNECTOR_WIDTH}px`,
                              top: '50%'
                            }} />
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gray-800/50">
        <CardBody>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Brackets className="text-gray-400" size={20} />
              <Typography variant="h6">Tournament Brackets</Typography>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex items-center gap-2 bg-blue-600"
                onClick={() => setOpenDialog(true)}
                disabled={!event?.participants?.length}
              >
                <Plus size={16} />
                Generate Brackets
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              Generating brackets...
            </div>
          ) : brackets ? (
            <div className="bracket-display overflow-x-auto">
              {renderBrackets()}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No brackets generated yet. Add participants and generate brackets to get started.
            </div>
          )}
        </CardBody>
      </Card>

      <Dialog
        open={openDialog}
        handler={() => setOpenDialog(false)}
        className="bg-gray-900 text-white"
      >
        <form onSubmit={handleGenerateBrackets}>
          <DialogHeader className="text-white">Generate Brackets</DialogHeader>
          <DialogBody className="space-y-4">
            <Select
              label="Bracket Type"
              value={bracketType}
              onChange={(value) => setBracketType(value)}
              className="!text-white"
            >
              <Option value="SINGLE_ELIMINATION">Single Elimination</Option>
              <Option value="DOUBLE_ELIMINATION">Double Elimination</Option>
              <Option value="ROUND_ROBIN">Round Robin</Option>
            </Select>
            
            <Select
              label="Seeding Method"
              value={seeding}
              onChange={(value) => setSeeding(value)}
              className="!text-white"
            >
              <Option value="random">Random</Option>
              <Option value="manual">Manual</Option>
              <Option value="skill">Skill-based</Option>
            </Select>
          </DialogBody>
          <DialogFooter className="space-x-2">
            <Button
              variant="text"
              onClick={() => setOpenDialog(false)}
              className="text-gray-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-500"
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate'}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
};

export default EventBracketsTO; 