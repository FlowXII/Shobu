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

const EventBracketsTO = ({ event, currentPhase, onBracketGenerate }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [seeding, setSeeding] = useState('random');
  const [bracketType, setBracketType] = useState(event?.format || 'SINGLE_ELIMINATION');
  const [loading, setLoading] = useState(false);

  const handleGenerateBrackets = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent multiple submissions
    
    setLoading(true);
    
    try {
      const result = await onBracketGenerate({
        type: bracketType,
        seeding
      });
      
      // Only show success if we get a result back
      if (result) {
        toast.success('Brackets generated successfully');
        setOpenDialog(false);
      }
    } catch (error) {
      // Only show error toast here, as the parent might also handle errors
      toast.error(error.message || 'Failed to generate brackets');
    } finally {
      setLoading(false);
    }
  };

  const renderBrackets = () => {
    if (!currentPhase?.sets?.length) {
      return null;
    }

    const rounds = currentPhase.sets.reduce((acc, set) => {
      const roundNumber = set.fullRoundText?.match(/Round (\d+)/)?.[1] || '1';
      acc[roundNumber] = acc[roundNumber] || [];
      acc[roundNumber].push(set);
      return acc;
    }, {});

    const sortedRoundNumbers = Object.keys(rounds).sort((a, b) => Number(a) - Number(b));
    const totalRounds = sortedRoundNumbers.length;

    return (
      <div className="m-2 p-4">
        <div className="mb-4 grid grid-flow-col grid-cols-[repeat(auto-fit,minmax(0,1fr))] items-center border-0 border-b-2 border-gray-200 text-center text-lg font-bold uppercase">
          {sortedRoundNumbers.map((round) => (
            <div key={round}>Round {round}</div>
          ))}
        </div>

        <div className="grid grid-flow-col grid-cols-[repeat(auto-fit,minmax(0,1fr))] items-center gap-8">
          {sortedRoundNumbers.map((round, roundIndex) => {
            const columnStyles = {
              display: 'grid',
              gridAutoRows: 'min-content',
              gap: `${Math.pow(2, roundIndex) * 1}rem`,
              alignContent: roundIndex === totalRounds - 1 ? 'center' : 'start',
              paddingRight: '1rem',
              ...(roundIndex === totalRounds - 1 && {
                height: '100%',
                alignSelf: 'stretch'
              })
            };
            
            return (
              <div 
                key={round}
                className="grid grid-flow-row auto-rows-min"
                style={columnStyles}
              >
                {rounds[round].map((set, index) => {
                  const matchStyles = {
                    marginTop: roundIndex === 0 ? '0' : `${(Math.pow(2, roundIndex) - 1) * 1}rem`,
                    transition: 'margin 0.3s ease-in-out'
                  };
                  
                  return (
                    <div 
                      key={set._id || index}
                      className="w-48 bg-gray-800/90 p-2 text-white shadow-xl rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-200"
                      style={matchStyles}
                    >
                      {set.slots?.map((slot, slotIndex) => (
                        <div 
                          key={slotIndex}
                          className="flex items-center justify-between py-1"
                        >
                          <div className="flex items-center flex-1 min-w-0">
                            <div className={`w-3 h-3 ${slotIndex === 0 ? 'bg-blue-500' : 'bg-red-500'} rounded-full mr-2 flex-shrink-0`} />
                            <p className="truncate text-white text-sm">
                              {slot?.entrant?.name || slot?.displayName || 'BYE'}
                            </p>
                          </div>
                          <p className="ml-2 text-white font-semibold bg-gray-700/50 px-2 py-0.5 rounded min-w-[2rem] text-center">
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
          ) : currentPhase ? (
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