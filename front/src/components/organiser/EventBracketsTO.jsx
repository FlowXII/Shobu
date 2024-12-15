import React, { useState, useEffect } from 'react';
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
  styles: {
    container: "m-2 p-4",
    headerRow: "mb-4 grid grid-flow-col grid-cols-[repeat(auto-fit,minmax(0,1fr))] items-center border-0 border-b-2 border-gray-200 text-center text-lg font-bold uppercase",
    bracketsGrid: "grid grid-flow-col grid-cols-[repeat(auto-fit,minmax(0,1fr))] items-center gap-8",
    roundColumn: "grid grid-flow-row auto-rows-min",
    match: "w-48 bg-gray-800/90 p-2 text-white shadow-xl rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-200",
    matchSlot: "flex items-center justify-between py-1",
    playerSection: "flex items-center flex-1 min-w-0",
    playerName: "truncate text-white text-sm",
    score: "ml-2 text-white font-semibold bg-gray-700/50 px-2 py-0.5 rounded min-w-[2rem] text-center",
    roundIdentifier: "text-xs text-gray-400 mb-1",
  },
  
  spacing: {
    baseSpacing: 1,
    round2Spacing: 2,

    getColumnStyles: (roundIndex, totalRounds) => {
      const base = BRACKET_CONFIG.spacing.baseSpacing;
      const round2 = BRACKET_CONFIG.spacing.round2Spacing;
      
      let gap;
      if (roundIndex === 1) {
        gap = `${round2 * base}rem`;
      } else {
        gap = `${Math.pow(2, roundIndex) * base}rem`;
      }

      const isFinalRound = roundIndex === totalRounds - 1;
      
      return {
        display: 'grid',
        gridAutoRows: 'min-content',
        gap,
        alignContent: isFinalRound ? 'center' : 'start',
        paddingRight: `${base}rem`,
        ...(isFinalRound && {
          height: '100%',
          alignSelf: 'stretch'
        })
      };
    },

    getMatchStyles: (roundIndex) => {
      const base = BRACKET_CONFIG.spacing.baseSpacing;
      const round2 = BRACKET_CONFIG.spacing.round2Spacing;

      if (roundIndex === 0) {
        return { 
          marginTop: '0',
          transition: 'margin 0.3s ease-in-out'
        };
      }

      let marginTop;
      if (roundIndex === 1) {
        marginTop = `${(round2) * base + 0.5}rem`;
      } else {
        marginTop = `${(Math.pow(2, roundIndex) - 1) * base}rem`;
      }

      return {
        marginTop,
        transition: 'margin 0.3s ease-in-out'
      };
    }
  }
};

const EventBracketsTO = ({ event, onBracketsGenerated }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [seeding, setSeeding] = useState('random');
  const [bracketType, setBracketType] = useState(event?.format || 'SINGLE_ELIMINATION');
  const [loading, setLoading] = useState(false);
  const [brackets, setBrackets] = useState(null);

  useEffect(() => {
    if (event?.phases?.length > 0) {
      const bracketPhase = event.phases.find(phase => phase.type === 'bracket');
      if (bracketPhase) {
        setBrackets(bracketPhase);
      }
    }
  }, [event]);

  const handleGenerateBrackets = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
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

  const renderBrackets = () => {
    if (!brackets?.sets?.length) return null;

    const rounds = brackets.sets.reduce((acc, set) => {
      const roundNumber = set.fullRoundText?.match(/Round (\d+)/)?.[1] || '1';
      acc[roundNumber] = acc[roundNumber] || [];
      acc[roundNumber].push(set);
      return acc;
    }, {});

    const sortedRoundNumbers = Object.keys(rounds).sort((a, b) => Number(a) - Number(b));
    const totalRounds = sortedRoundNumbers.length;

    return (
      <div className={BRACKET_CONFIG.styles.container}>
        <div className={BRACKET_CONFIG.styles.headerRow}>
          {sortedRoundNumbers.map((round) => (
            <div key={round}>Round {round}</div>
          ))}
        </div>

        <div className={BRACKET_CONFIG.styles.bracketsGrid}>
          {sortedRoundNumbers.map((round, roundIndex) => {
            const columnStyles = BRACKET_CONFIG.spacing.getColumnStyles(roundIndex, totalRounds);
            
            return (
              <div 
                key={round}
                className={BRACKET_CONFIG.styles.roundColumn}
                style={columnStyles}
              >
                {rounds[round].map((set, index) => {
                  const matchStyles = BRACKET_CONFIG.spacing.getMatchStyles(roundIndex);
                  
                  return (
                    <div 
                      key={set._id || index}
                      className={BRACKET_CONFIG.styles.match}
                      style={matchStyles}
                    >
                      {set.slots?.map((slot, slotIndex) => (
                        <div 
                          key={slotIndex}
                          className={BRACKET_CONFIG.styles.matchSlot}
                        >
                          <div className={BRACKET_CONFIG.styles.playerSection}>
                            <div className={`w-3 h-3 ${slotIndex === 0 ? 'bg-blue-500' : 'bg-red-500'} rounded-full mr-2 flex-shrink-0`} />
                            <p className={BRACKET_CONFIG.styles.playerName}>
                              {slot?.entrant?.name || slot?.displayName || 'BYE'}
                            </p>
                          </div>
                          <p className={BRACKET_CONFIG.styles.score}>
                            {slot?.score || '0'}
                          </p>
                        </div>
                      ))}
                    </div>
                  );
                })}
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

          {loading ? (
            <div className="text-center py-8 text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              Generating brackets...
            </div>
          ) : brackets ? (
            renderBrackets()
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