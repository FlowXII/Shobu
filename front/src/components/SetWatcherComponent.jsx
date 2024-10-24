import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Card,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import SetCardComponent from './SetCardComponent';

const SetWatcherComponent = ({ tournaments }) => {
  const [prevSets, setPrevSets] = useState({});
  const [subscription, setSubscription] = useState(null);

  const activeSets = useMemo(() => {
    return (tournaments || []).flatMap(tournament => 
      (tournament?.events || []).flatMap(event => 
        (event?.sets || []).map(set => ({
          ...set,
          tournamentName: tournament?.name || 'Unknown Tournament',
          eventName: event?.name || 'Unknown Event',
          fullRoundText: set.fullRoundText || 'Unknown Round'
        }))
      )
    ).filter(set => [1, 2, 4, 6, 7].includes(set.state));
  }, [tournaments]);

  const sendNotification = useCallback(async (set) => {
    if (!subscription) {
      console.log('No push subscription available. Cannot send notification.');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/notifications/send-set-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription,
          set: {
            id: set.id,
            state: set.state,
            tournamentName: set.tournamentName,
            eventName: set.eventName,
            fullRoundText: set.fullRoundText,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send notification: ${response.status}`);
      }

      console.log('Set state change notification sent successfully');
    } catch (error) {
      console.error('Error sending set state change notification:', error);
    }
  }, [subscription]);

  useEffect(() => {
    activeSets.forEach(set => {
      const prevSet = prevSets[set.id];
      if (!prevSet || prevSet.state !== set.state) {
        if (
          (prevSet && prevSet.state === 1 && set.state === 2) || // Created to In Progress
          (prevSet && prevSet.state === 2 && set.state === 6) || // In Progress to Called
          (!prevSet && (set.state === 2 || set.state === 6)) // New set that's In Progress or Called
        ) {
          console.log('Sending notification for set:', set);
          sendNotification(set);
        }
        setPrevSets(prev => ({ ...prev, [set.id]: set }));
      }
    });
  }, [activeSets, sendNotification]);

  return (
    <Card className="w-full bg-gray-900 text-white shadow-xl border border-white border-opacity-20 rounded-lg">
      <CardBody className="p-4">
        <Typography variant="h6" className="text-sm text-center mb-2">Active Sets</Typography>
        {activeSets.length > 0 ? (
          <div className="space-y-2">
            {activeSets.map((set, index) => (
              <SetCardComponent key={index} set={set} />
            ))}
          </div>
        ) : (
          <Typography className="text-center text-xs">No active sets available.</Typography>
        )}
      </CardBody>
    </Card>
  );
};

export default SetWatcherComponent;
