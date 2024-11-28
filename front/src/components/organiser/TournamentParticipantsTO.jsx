import React, { useState, useEffect } from 'react';
import { Typography, Card, CardBody, Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input, Select, Option } from "@material-tailwind/react";
import { Users, UserPlus, Trash2, Shield, Wand2, Search, User } from 'lucide-react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { addParticipant, removeParticipant } from '../../loaders/tournamentLoader';
import { searchUsers } from '../../loaders/userLoader';
import { fetchUserById } from '../../loaders/userLoader';
import { generateRandomUsername } from '../../utils/generators';
import { toast } from 'react-toastify';
import { fetchUserProfiles } from '../../loaders/userLoader';

const TournamentParticipantsTO = () => {
  const navigate = useNavigate();
  const { tournament } = useLoaderData();
  const [attendeesWithProfiles, setAttendeesWithProfiles] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newParticipantEmail, setNewParticipantEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [openGenerateDialog, setOpenGenerateDialog] = useState(false);
  const [generatingCount, setGeneratingCount] = useState(32);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const loadAttendeeProfiles = async () => {
      setLoading(true);
      try {
        const userIds = [...new Set(tournament.attendees.map(attendee => attendee.userId))];
        console.log('Unique User IDs to fetch:', userIds);

        const profiles = await fetchUserProfiles(userIds);
        console.log('Fetched Profiles:', profiles);

        const attendeesWithProfiles = tournament.attendees.map(attendee => {
          const profile = profiles[attendee.userId];
          console.log('Assigning profile to attendee:', {
            attendeeId: attendee._id,
            userId: attendee.userId,
            profile
          });

          return {
            ...attendee,
            profile: profile || {
              username: 'Unknown User',
              email: 'No email provided',
              avatar: null
            }
          };
        });
        
        console.log('Final attendees with profiles:', attendeesWithProfiles);
        setAttendeesWithProfiles(attendeesWithProfiles);
      } catch (error) {
        console.error('Error loading attendee profiles:', error);
        toast.error('Failed to load some attendee profiles');
      } finally {
        setLoading(false);
      }
    };

    if (tournament.attendees?.length) {
      loadAttendeeProfiles();
    } else {
      setAttendeesWithProfiles([]);
    }
  }, [tournament.attendees]);

  useEffect(() => {
    const searchUsersDebounced = async () => {
      if (!searchQuery.trim() || searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        setSearching(true);
        const response = await searchUsers(searchQuery);
        setSearchResults(response);
      } catch (error) {
        console.error('Error searching users:', error);
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    };

    const debounce = setTimeout(searchUsersDebounced, 800);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleAddParticipant = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const result = await addParticipant(tournament._id, selectedUser._id);
      if (result) {
        setOpenAddDialog(false);
        setSearchQuery('');
        setSelectedUser(null);
        setSearchResults([]);
        navigate(0); // Refresh to get updated data
        toast.success('Attendee added successfully');
      }
    } catch (error) {
      console.error('Add participant error:', error);
      toast.error('Failed to add attendee');
    }
  };

  const handleRemoveParticipant = async (participantId) => {
    const result = await removeParticipant(tournament._id, participantId);
    if (result) {
      navigate(0); // Refresh to get updated data
    }
  };

  const handleGenerateParticipants = async (e) => {
    e.preventDefault();
    try {
      const participants = Array.from({ length: generatingCount }, () => {
        const username = generateRandomUsername();
        return {
          email: `${username.toLowerCase()}@example.com`,
          displayName: username
        };
      });

      // Assuming you'll create a bulk add function in your loader
      const result = await Promise.all(
        participants.map(participant => 
          addParticipant(tournament._id, participant.email)
        )
      );

      setOpenGenerateDialog(false);
      navigate(0);
      toast.success(`Generated ${generatingCount} participants successfully`);
    } catch (error) {
      console.error('Generate participants error:', error);
      toast.error('Failed to generate participants');
    }
  };

  return (
    <Card className="bg-gray-800/50 border border-white/10">
      <CardBody>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Users className="text-gray-400" size={20} />
            <Typography variant="h6">
              Attendees ({tournament.numAttendees || 0})
            </Typography>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex items-center gap-2 bg-purple-500"
              onClick={() => setOpenGenerateDialog(true)}
            >
              <Wand2 size={16} />
              Generate Attendees
            </Button>
            <Button
              size="sm"
              className="flex items-center gap-2 bg-blue-600"
              onClick={() => setOpenAddDialog(true)}
            >
              <UserPlus size={16} />
              Add Attendee
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Typography>Loading attendees...</Typography>
          </div>
        ) : (
          <div className="space-y-3">
            {attendeesWithProfiles.map((attendee) => (
              <Card key={attendee._id} className="bg-gray-700/50 hover:bg-gray-700 transition-colors">
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      {/* Avatar Section */}
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-500/10 border-2 border-blue-500/20">
                          {attendee.profile?.avatar ? (
                            <img 
                              src={attendee.profile.avatar} 
                              alt={attendee.profile.username} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Users className="w-full h-full p-2.5 text-blue-400" />
                          )}
                        </div>
                        {attendee.status === "REGISTERED" && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800" />
                        )}
                      </div>

                      {/* User Info */}
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <Typography className="font-semibold text-white">
                            {attendee.profile?.username || 'Unknown User'}
                          </Typography>
                          {tournament.organizerId === attendee.userId && (
                            <Shield className="h-4 w-4 text-blue-400" />
                          )}
                        </div>
                        <Typography className="text-sm text-gray-400">
                          Joined {new Date(attendee.registeredAt).toLocaleDateString()}
                        </Typography>
                      </div>

                      {/* Stats */}
                      <div className="flex gap-6 ml-6">
                        <div className="flex flex-col items-center">
                          <Typography className="text-sm font-medium text-gray-300">Matches</Typography>
                          <Typography className="text-lg font-semibold text-blue-400">
                            {attendee.matchesPlayed}
                          </Typography>
                        </div>
                        <div className="flex flex-col items-center">
                          <Typography className="text-sm font-medium text-gray-300">Wins</Typography>
                          <Typography className="text-lg font-semibold text-green-400">
                            {attendee.matchesWon}
                          </Typography>
                        </div>
                        <div className="flex flex-col items-center">
                          <Typography className="text-sm font-medium text-gray-300">Win Rate</Typography>
                          <Typography className="text-lg font-semibold text-purple-400">
                            {attendee.matchesPlayed > 0 
                              ? `${Math.round((attendee.matchesWon / attendee.matchesPlayed) * 100)}%` 
                              : '0%'}
                          </Typography>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    {tournament.isOrganizer && !attendee.isOrganizer && (
                      <Button
                        size="sm"
                        variant="text"
                        color="red"
                        className="flex items-center gap-2"
                        onClick={() => handleRemoveParticipant(attendee._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {/* Add Attendee Dialog */}
        <Dialog 
          open={openAddDialog} 
          handler={() => setOpenAddDialog(false)}
          className="bg-gray-900 text-white"
        >
          <form onSubmit={handleAddParticipant}>
            <DialogHeader>Add Attendee</DialogHeader>
            <DialogBody className="overflow-y-auto max-h-[60vh]">
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-800 text-white rounded-xl pl-12 pr-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/10"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                {searching ? (
                  <div className="text-center py-4">
                    <Typography className="text-gray-400">Searching...</Typography>
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((user) => (
                    <div
                      key={user._id}
                      onClick={() => setSelectedUser(user)}
                      className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all
                        ${selectedUser?._id === user._id ? 'bg-gray-800 border-2 border-blue-500' : 'hover:bg-gray-800/50 border border-white/10'}`}
                    >
                      <div className="bg-gray-800 p-2 rounded-lg">
                        <User className="h-8 w-8 text-gray-400" />
                      </div>
                      <Typography color="white" className="font-semibold">
                        {user.username}
                      </Typography>
                    </div>
                  ))
                ) : searchQuery.length >= 2 ? (
                  <div className="text-center py-4">
                    <Typography className="text-gray-400">No users found</Typography>
                  </div>
                ) : null}
              </div>
            </DialogBody>
            <DialogFooter className="border-t border-white/10">
              <Button 
                variant="text" 
                color="gray" 
                onClick={() => {
                  setOpenAddDialog(false);
                  setSearchQuery('');
                  setSelectedUser(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-blue-500"
                disabled={!selectedUser}
              >
                Add Attendee
              </Button>
            </DialogFooter>
          </form>
        </Dialog>

        {/* Add Generate Participants Dialog */}
        <Dialog 
          open={openGenerateDialog} 
          handler={() => setOpenGenerateDialog(false)}
          className="bg-gray-900 text-white"
        >
          <form onSubmit={handleGenerateParticipants}>
            <DialogHeader>Generate Random Attendees</DialogHeader>
            <DialogBody>
              <div className="space-y-4">
                <Typography className="text-gray-400">
                  Generate random attendees for testing purposes.
                </Typography>
                <Select
                  label="Number of Attendees"
                  value={String(generatingCount)}
                  onChange={(value) => setGeneratingCount(Number(value))}
                  className="!text-white"
                >
                  <Option value="8">8 Attendees</Option>
                  <Option value="16">16 Attendees</Option>
                  <Option value="32">32 Attendees</Option>
                  <Option value="64">64 Attendees</Option>
                  <Option value="128">128 Attendees</Option>
                </Select>
              </div>
            </DialogBody>
            <DialogFooter>
              <Button
                variant="text"
                color="gray"
                onClick={() => setOpenGenerateDialog(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-purple-500"
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate'}
              </Button>
            </DialogFooter>
          </form>
        </Dialog>
      </CardBody>
    </Card>
  );
};

export default TournamentParticipantsTO; 