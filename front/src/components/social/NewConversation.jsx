import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Avatar,
  Typography,
} from "@material-tailwind/react";
import { Search, MessageSquare, User } from "lucide-react";
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

const NewConversation = ({ open, onClose, onConversationCreated }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery.trim() || searchQuery.length < 2) {
        setUsers([]);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/users/search?q=${searchQuery}`);
        setUsers(response.data.users || []);
      } catch (error) {
        console.error('Error searching users:', error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchUsers, 800);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleCreateConversation = async () => {
    if (!selectedUser) return;

    try {
      const response = await api.post('/conversations', {
        participantIds: [selectedUser._id],
        type: 'DIRECT'
      });

      onConversationCreated(response.data);
      onClose();
      setSelectedUser(null);
      setSearchQuery('');
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  return (
    <Dialog 
      open={open} 
      handler={onClose}
      size="sm"
      className="bg-gray-900 border border-white/10 backdrop-blur-xl"
    >
      <DialogHeader className="border-b border-white/10">
        <Typography variant="h5" color="white" className="font-bold">
          New Conversation
        </Typography>
      </DialogHeader>

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
          {loading ? (
            <div className="text-center py-4">
              <Typography className="text-gray-400">Searching...</Typography>
            </div>
          ) : users.length > 0 ? (
            users.map((user) => (
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

      <DialogFooter className="border-t border-white/10 gap-2">
        <Button 
          variant="text" 
          color="white" 
          onClick={onClose}
          className="hover:bg-gray-800"
        >
          Cancel
        </Button>
        <Button 
          color="blue" 
          onClick={handleCreateConversation}
          disabled={!selectedUser}
          className="flex items-center gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          Start Conversation
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default NewConversation; 