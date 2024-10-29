import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Card, CardBody, Typography, Spinner } from "@material-tailwind/react";

// Group related constants together in a single object
const BRACKET_CONFIG = {
  LAYOUT: {
    MATCH_CARD_HEIGHT: 90,
    ROUND_SPACING_WIDTH: 250,
    MIN_GAP_BETWEEN_MATCHES: 10
  },
  TYPES: {
    WINNERS: 'winners',
    LOSERS: 'losers'
  },
  ROUND_ORDER: [
    'Winners Round 1', 'Winners Round 2', 'Winners Round 3',
    'Winners Round 4', 'Winners Round 5', 'Winners Quarter-Final',
    'Winners Semi-Final', 'Winners Final', 'Grand Finals',
    'Losers Round 1', 'Losers Round 2', 'Losers Round 3',
    'Losers Round 4', 'Losers Round 5', 'Losers Quarters',
    'Losers Semi', 'Losers Finals'
  ],
  MATCH_STATES: {
    1: { color: "blue", label: "In Progress" },    // CREATED
    2: { color: "yellow", label: "In Queue" },     // CALLED
    3: { color: "green", label: "Complete" },      // COMPLETED
    4: { color: "red", label: "Invalid" },         // INVALID
  }
};

const BracketViewer = () => {
  const { eventId } = useParams();
  const location = useLocation();
  const containerRef = useRef(null);
  
  const [tournamentData, setTournamentData] = useState(location.state?.tournamentData || null);
  const [loading, setLoading] = useState(!tournamentData);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    if (!tournamentData) {
      fetchTournamentData();
    }
  }, [eventId]);

  useEffect(() => {
    const updateContainerHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.offsetHeight);
      }
    };

    updateContainerHeight();
    window.addEventListener('resize', updateContainerHeight);
    return () => window.removeEventListener('resize', updateContainerHeight);
  }, []);

  const fetchTournamentData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/stations/${eventId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setTournamentData(data.data);
    } catch (error) {
      console.error('Error fetching tournament data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Simplify the organizeSets function
  const organizeSets = (sets) => {
    return sets.reduce((acc, set) => {
      const round = set.fullRoundText || 'Unknown Round';
      if (!acc[round]) acc[round] = [];
      acc[round].push(set);
      acc[round].sort((a, b) => 
        a.identifier.length === b.identifier.length 
          ? a.identifier.localeCompare(b.identifier)
          : a.identifier.length - b.identifier.length
      );
      return acc;
    }, {});
  };

  const calculateLayoutMetrics = (roundIndex, matches, totalRounds) => {
    const { MATCH_CARD_HEIGHT, ROUND_SPACING_WIDTH, MIN_GAP_BETWEEN_MATCHES } = BRACKET_CONFIG.LAYOUT;
    const matchesInRound = matches.length;
    
    // Handle final rounds
    if (matchesInRound === 1 && matches[0].fullRoundText.toLowerCase().includes('final')) {
      return {
        verticalSpacing: 0,
        verticalOffset: (containerHeight - MATCH_CARD_HEIGHT) / 2,
        roundWidth: ROUND_SPACING_WIDTH
      };
    }

    // Calculate spacing for regular rounds
    const totalAvailableSpace = containerHeight - (matchesInRound * MATCH_CARD_HEIGHT);
    const verticalSpacing = Math.max(
      totalAvailableSpace / (matchesInRound + 1),
      MIN_GAP_BETWEEN_MATCHES
    );

    return {
      verticalSpacing,
      verticalOffset: roundIndex === 0 ? MIN_GAP_BETWEEN_MATCHES : verticalSpacing,
      roundWidth: ROUND_SPACING_WIDTH
    };
  };

  const sortRounds = (rounds) => {
    return rounds.sort((a, b) => {
      const aIndex = BRACKET_CONFIG.ROUND_ORDER.findIndex(r => a.toLowerCase().includes(r.toLowerCase()));
      const bIndex = BRACKET_CONFIG.ROUND_ORDER.findIndex(r => b.toLowerCase().includes(r.toLowerCase()));
      
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return 0;
    });
  };

  // Simplify MatchCard component
  const MatchCard = ({ set }) => {
    const stateStyle = BRACKET_CONFIG.MATCH_STATES[parseInt(set?.state, 10)] || 
                      { color: "gray", label: "Unknown" };

    return (
      <Card className={`w-48 bg-gray-800 text-white border-2 border-${stateStyle.color}-500 shadow-xl`}>
        <CardBody className="p-2">
          <div className="absolute top-0 left-0 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-br-lg">
            {set.identifier}
          </div>
          <Typography variant="small" className={`text-${stateStyle.color}-500`}>
            {set.fullRoundText || 'Unknown Round'}
          </Typography>
          {set.slots.map((slot, index) => (
            <div key={`slot-${index}`} className="flex items-center">
              <div className={`w-4 h-4 ${index === 0 ? 'bg-blue-500' : 'bg-red-500'} rounded-full mr-2`} />
              <Typography variant="small" className="truncate text-white">
                {slot.entrant 
                  ? `${slot.entrant.name} (Seed ${slot.entrant.seeds?.[0]?.seedNum || 'N/A'})`
                  : 'TBD'}
              </Typography>
              {slot.standing && (
                <Typography variant="small" className="ml-2 text-white">
                  {slot.standing.score}
                </Typography>
              )}
            </div>
          ))}
        </CardBody>
      </Card>
    );
  };

  const BracketSection = ({ rounds, roundSets, title }) => {
    const sortedRounds = sortRounds(rounds);
    const totalRounds = sortedRounds.length;

    return (
      <div>
        <Typography variant="h5" color="white">{title}</Typography>
        <div ref={containerRef} className="flex" style={{ height: '100%', position: 'relative' }}>
          {sortedRounds.map((round, roundIndex) => {
            const matches = roundSets[round];
            const { verticalSpacing, verticalOffset, roundWidth } = calculateLayoutMetrics(
              roundIndex,
              matches,
              totalRounds
            );

            return (
              <div
                key={round}
                style={{
                  marginTop: `${verticalOffset}px`,
                  width: `${roundWidth}px`,
                  position: 'relative'
                }}
              >
                <Typography variant="h6" color="white">{round}</Typography>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: `${verticalSpacing}px`
                  }}
                >
                  {matches.map((set, index) => (
                    <div key={index}>
                      <MatchCard set={set} />
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

  if (loading) {
    return <Spinner />;
  }

  if (!tournamentData?.event?.sets?.nodes) {
    return <Typography>No bracket data available</Typography>;
  }

  const roundSets = organizeSets(tournamentData.event.sets.nodes);
  const rounds = Object.keys(roundSets);
  const winnerRounds = rounds.filter(round => 
    round.toLowerCase().includes(BRACKET_CONFIG.TYPES.WINNERS)
  );
  const loserRounds = rounds.filter(round => 
    round.toLowerCase().includes(BRACKET_CONFIG.TYPES.LOSERS)
  );

  return (
    <div className="p-8 bg-gray-950 min-h-screen">
      <Typography variant="h4" color="white" className="mb-8">
        Tournament Bracket
      </Typography>
      <div className="space-y-16">
        <BracketSection 
          rounds={winnerRounds} 
          roundSets={roundSets} 
          title="Winners Bracket" 
        />
        <BracketSection 
          rounds={loserRounds} 
          roundSets={roundSets} 
          title="Losers Bracket" 
        />
      </div>
    </div>
  );
};

export default BracketViewer;