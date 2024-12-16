import React, { useState } from 'react';
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
import { generateBrackets, updateSetScore } from '../../loaders/eventLoader';
import { useNavigate } from 'react-router-dom';

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

const EventBracketsTO = ({ event }) => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [seeding, setSeeding] = useState('random');
  const [bracketType, setBracketType] = useState(event?.format || 'SINGLE_ELIMINATION');
  const [loading, setLoading] = useState(false);
  const [selectedSet, setSelectedSet] = useState(null);
  const [selectedScores, setSelectedScores] = useState({ player1: null, player2: null });

  const bracketPhase = event?.phases?.find(phase => phase.type === 'bracket');

  const handleGenerateBrackets = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const tournamentId = typeof event.tournamentId === 'object' 
        ? event.tournamentId._id 
        : event.tournamentId;

      await generateBrackets(
        tournamentId,
        event._id,
        bracketType, 
        seeding
      );
      
      navigate('.', { replace: true }); // Refresh the page data
      toast.success('Brackets generated successfully');
      setOpenDialog(false);
    } catch (error) {
      toast.error(error.message || 'Failed to generate brackets');
    } finally {
      setLoading(false);
    }
  };

  const handleSetClick = (set) => {
    setSelectedSet(set);
  };

  const handleCloseModal = () => {
    setSelectedSet(null);
    setSelectedScores({ player1: null, player2: null });
  };

  const handleScoreSelect = (playerNum, score) => {
    setSelectedScores(prev => ({
      ...prev,
      [`player${playerNum}`]: score
    }));
  };

  const handleReportSet = async () => {
    if (selectedScores.player1 === null || selectedScores.player2 === null) return;
    
    setLoading(true);
    try {
      await updateSetScore(selectedSet._id, [
        selectedScores.player1,
        selectedScores.player2
      ]);

      toast.success('Scores reported successfully');
      handleCloseModal();
      navigate('.', { replace: true }); // Refresh the page data
    } catch (error) {
      toast.error(error.message || 'Error reporting scores');
    } finally {
      setLoading(false);
    }
  };

  const renderBrackets = () => {
    if (!bracketPhase?.sets?.length) return null;

    const rounds = bracketPhase.sets.reduce((acc, set) => {
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
                      className={`${BRACKET_CONFIG.styles.match} cursor-pointer hover:border-blue-500`}
                      style={matchStyles}
                      onClick={() => handleSetClick(set)}
                    >
                      {set.slots?.map((slot, slotIndex) => {
                        console.log('Detailed slot info:', {
                          slotFull: slot,
                          entrantInfo: slot?.entrant,
                          displayName: slot?.entrant?.displayName,
                          allParticipants: event.participants?.map(p => p.displayName)
                        });

                        // Try direct access to slot data
                        const displayName = slot?.entrant?.displayName || 'TBD';
                        
                        return (
                          <div 
                            key={slotIndex}
                            className={BRACKET_CONFIG.styles.matchSlot}
                          >
                            <div className={BRACKET_CONFIG.styles.playerSection}>
                              <div className={`w-3 h-3 ${slotIndex === 0 ? 'bg-blue-500' : 'bg-red-500'} rounded-full mr-2 flex-shrink-0`} />
                              <p className={BRACKET_CONFIG.styles.playerName}>
                                {displayName}
                              </p>
                            </div>
                            <p className={BRACKET_CONFIG.styles.score}>
                              {slot?.score || '0'}
                            </p>
                          </div>
                        );
                      })}
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
          ) : bracketPhase ? (
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

      <Dialog
        open={selectedSet !== null}
        handler={handleCloseModal}
        className="bg-gray-900 text-white max-w-[600px]"
      >
        {selectedSet && (
          <div className="p-6">
            <DialogHeader className="text-white">Report Set Scores</DialogHeader>
            <DialogBody className="space-y-6">
              {/* Match Information */}
              <div className="bg-gray-800 p-4 rounded-lg">
                <Typography className="text-gray-400">
                  {selectedSet.slots[0]?.entrant?.name || 'TBD'} vs {selectedSet.slots[1]?.entrant?.name || 'TBD'}
                </Typography>
                <Typography variant="small" className="text-gray-500">
                  {selectedSet.fullRoundText}
                </Typography>
              </div>

              {/* Score Selection */}
              {selectedSet.slots.map((slot, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <Typography variant="h6" className="text-white font-bold">
                    {slot.entrant?.name || 'TBD'}
                  </Typography>
                  <div className="grid grid-cols-5 gap-2">
                    {[-1, 0, 1, 2, 3].map((score) => (
                      <Button
                        key={score}
                        size="sm"
                        onClick={() => handleScoreSelect(index + 1, score)}
                        className={`
                          px-4 py-2 
                          ${selectedScores[`player${index + 1}`] === score 
                            ? 'bg-blue-500 hover:bg-blue-600' 
                            : 'bg-gray-600 hover:bg-gray-700'}
                        `}
                      >
                        {score}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </DialogBody>
            <DialogFooter className="space-x-2">
              <Button
                variant="text"
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleReportSet}
                disabled={selectedScores.player1 === null || selectedScores.player2 === null || loading}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {loading ? 'Submitting...' : 'Submit Scores'}
              </Button>
            </DialogFooter>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default EventBracketsTO; 