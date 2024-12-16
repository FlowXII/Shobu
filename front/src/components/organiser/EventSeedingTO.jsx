import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardBody,
  Typography,
  Button,
  List,
  ListItem,
  IconButton
} from "@material-tailwind/react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ArrowUp, ArrowDown, Save, Check } from 'lucide-react';
import { 
  fetchSeeding, 
  createSeeding, 
  updateSeeding, 
  finalizeSeeding 
} from '../../loaders/seedingLoader';

const EventSeedingTO = ({ event, onSeedingFinalized }) => {
  const { tournamentId, eventId } = useParams();
  const [seeding, setSeeding] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (event?.phases?.[0]?._id) {
      loadSeeding();
    }
  }, [event]);

  const loadSeeding = async () => {
    try {
      setLoading(true);
      const phaseId = event.phases[0]._id;
      console.log('Fetching seeding for:', { tournamentId, eventId, phaseId }); // Debug log
      const seedingData = await fetchSeeding(tournamentId, eventId, phaseId);
      console.log('Received seeding data:', seedingData); // Debug log
      setSeeding(seedingData);
    } catch (error) {
      console.error('Error in loadSeeding:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSeeding = async (type) => {
    setLoading(true);
    try {
      const phaseId = event.phases[0]._id;
      const newSeeding = await createSeeding(tournamentId, eventId, phaseId, type);
      setSeeding(newSeeding);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(seeding.seeds);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update seed numbers
    const updatedSeeds = items.map((seed, index) => ({
      ...seed,
      seedNumber: index + 1
    }));

    setSeeding({ ...seeding, seeds: updatedSeeds });
  };

  const handleSaveSeeding = async () => {
    setLoading(true);
    try {
      const phaseId = event.phases[0]._id;
      await updateSeeding(tournamentId, eventId, phaseId, seeding.seeds);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizeSeeding = async () => {
    if (!window.confirm('Are you sure you want to finalize the seeding? This cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const phaseId = event.phases[0]._id;
      await finalizeSeeding(tournamentId, eventId, phaseId);
      onSeedingFinalized?.();
    } finally {
      setLoading(false);
    }
  };

  if (!event?.participants?.length) {
    return (
      <Card>
        <CardBody>
          <Typography>No participants to seed</Typography>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 text-white shadow-xl">
      <CardBody>
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h5" className="text-white">Seeding</Typography>
          {!seeding && (
            <div className="space-x-2">
              <Button 
                className="bg-blue-500 hover:bg-blue-600"
                onClick={() => handleCreateSeeding('manual')}
                disabled={loading}
              >
                Manual Seeding
              </Button>
              <Button 
                className="bg-blue-500 hover:bg-blue-600"
                onClick={() => handleCreateSeeding('random')}
                disabled={loading}
              >
                Random Seeding
              </Button>
            </div>
          )}
        </div>

        {loading && <Typography className="text-white">Loading...</Typography>}

        {seeding && (
          <>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="seeds">
                {(provided) => (
                  <List {...provided.droppableProps} ref={provided.innerRef} className="bg-gray-800 rounded-lg">
                    {seeding.seeds.map((seed, index) => (
                      <Draggable 
                        key={seed.participantId} 
                        draggableId={seed.participantId} 
                        index={index}
                      >
                        {(provided) => (
                          <ListItem
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="flex justify-between items-center p-2 border-b border-gray-700 text-white hover:bg-gray-700"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{index + 1}.</span>
                              <span>{seed.displayName}</span>
                            </div>
                          </ListItem>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </List>
                )}
              </Droppable>
            </DragDropContext>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                className="bg-blue-500 hover:bg-blue-600"
                onClick={handleSaveSeeding}
                disabled={loading}
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button
                className="bg-green-500 hover:bg-green-600"
                onClick={handleFinalizeSeeding}
                disabled={loading}
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default EventSeedingTO; 