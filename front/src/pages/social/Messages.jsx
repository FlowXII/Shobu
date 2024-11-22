import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  Typography,
  Avatar,
  CardBody,
  Spinner,
  Button,
} from "@material-tailwind/react";
import { MessageSquare, User, MoreVertical, Send } from "lucide-react"; 
import { useSocket } from '../../hooks/useSocket';
import axios from 'axios';
import NewConversation from '../../components/social/NewConversation';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newConversationOpen, setNewConversationOpen] = useState(false);
  
  const socket = useSocket();
  const messagesEndRef = useRef(null);
  
  const user = useSelector(state => state.user.user);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const userLoading = useSelector(state => state.user.loading.user);

  const navigate = useNavigate();

  const getOtherParticipant = (conversation) => {
    if (!conversation || !conversation.participants) return null;
    return conversation.participants.find(p => p?.username !== user?.username);
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await api.get('/conversations');
        setConversations(response.data.conversations || []);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setError('Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const handleConversationSelect = (conv) => {
    console.log('Selecting conversation:', conv);
    setSelectedConversation(conv);
  };

  useEffect(() => {
    if (selectedConversation) {
      console.log('Selected conversation changed:', selectedConversation);
      
      const fetchMessages = async () => {
        try {
          console.log('Fetching messages for conversation:', selectedConversation._id);
          const response = await api.get(
            `/conversations/${selectedConversation._id}/messages`
          );
          console.log('Fetched messages:', response.data);
          setMessages(response.data.messages);
          markMessagesAsRead();
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      fetchMessages();
      socket?.emit('join_conversation', selectedConversation._id);
    }

    return () => {
      if (selectedConversation) {
        socket?.emit('leave_conversation', selectedConversation._id);
      }
    };
  }, [selectedConversation]);

  useEffect(() => {
    if (!socket) return;

    socket.on('new_message', (message) => {
      console.log('New message received:', message);
      setMessages(prev => [...prev, message]);
      if (message.sender._id !== user?._id) {
        markMessagesAsRead();
      }
    });

    return () => {
      socket.off('new_message');
    };
  }, [socket, user]);

  const markMessagesAsRead = async () => {
    if (!selectedConversation) return;
    
    try {
      await api.post(
        `/conversations/${selectedConversation._id}/read`
      );
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const response = await api.post('/messages', {
        conversationId: selectedConversation._id,
        content: newMessage.trim()
      });

      console.log('Sent message response:', response.data);
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleNewConversation = (conversation) => {
    setConversations(prev => [conversation, ...prev]);
    setSelectedConversation(conversation);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (selectedConversation) {
      markMessagesAsRead();
    }
  }, [selectedConversation]);

  if (userLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Typography color="red">User not found</Typography>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-2rem)] max-w-6xl mx-auto">
      <Card className="w-full bg-gray-900 text-white">
        <div className="flex h-full">
          <div className="w-1/3 border-r border-white/10">
            <div className="p-6 border-b border-white/10">
              <div className="flex justify-between items-center mb-4">
                <Typography variant="h5" color="white">
                  Messages
                </Typography>
                <Button
                  variant="filled"
                  color="blue"
                  className="p-2"
                  onClick={() => setNewConversationOpen(true)}
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="overflow-y-auto h-[calc(100vh-10rem)]">
              {conversations.length > 0 ? (
                conversations
                  .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                  .map((conv) => (
                    <div
                      key={conv._id}
                      onClick={() => handleConversationSelect(conv)}
                      className={`p-6 flex items-start gap-4 hover:bg-gray-800/50 cursor-pointer transition-all
                        ${selectedConversation?._id === conv._id ? 'bg-gray-800/80 border-l-4 border-blue-500' : ''}`}
                    >
                      <Avatar 
                        src={getOtherParticipant(conv)?.startgg?.profile?.images[0]?.url}
                        alt={getOtherParticipant(conv)?.username}
                        className="w-12 h-12 rounded-lg" 
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <Typography color="white" className="font-semibold">
                            {getOtherParticipant(conv)?.username}
                          </Typography>
                          <Typography className="text-gray-400 text-sm">
                            {new Date(conv.updatedAt).toLocaleDateString()}
                          </Typography>
                        </div>
                        <Typography className="text-gray-400 text-sm truncate">
                          {conv.lastMessage?.content || 'No messages yet'}
                        </Typography>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="p-6 text-center text-gray-400">
                  No conversations yet
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col h-full">
            {selectedConversation ? (
              <>
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar 
                      src={getOtherParticipant(selectedConversation)?.startgg?.profile?.images[0]?.url}
                      alt={getOtherParticipant(selectedConversation)?.username}
                      className="w-10 h-10 rounded-lg"
                    />
                    <Typography variant="h6" color="white">
                      {getOtherParticipant(selectedConversation)?.username || 'Loading...'}
                    </Typography>
                  </div>
                  <Button
                    variant="text"
                    color="blue"
                    className="flex items-center gap-2"
                    onClick={() => navigate(`/profile/${getOtherParticipant(selectedConversation)?.username}`)}
                  >
                    <User className="h-4 w-4" />
                    View Profile
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 h-[calc(100vh-16rem)]">
                  {Object.entries(
                    messages
                      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                      .reduce((groups, message) => {
                        const date = new Date(message.createdAt).toLocaleDateString();
                        if (!groups[date]) {
                          groups[date] = [];
                        }
                        groups[date].push(message);
                        return groups;
                      }, {})
                  )
                    .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
                    .map(([date, dateMessages]) => (
                      <div key={date} className="mb-6">
                        <div className="flex justify-center mb-4">
                          <Typography className="text-gray-400 text-sm bg-gray-800/50 px-3 py-1 rounded-full">
                            {date === new Date().toLocaleDateString() 
                              ? 'Today'
                              : date === new Date(Date.now() - 86400000).toLocaleDateString()
                                ? 'Yesterday'
                                : date}
                          </Typography>
                        </div>
                        
                        {dateMessages
                          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                          .map((message) => {
                            const isOwnMessage = message.sender.username === user?.username;
                            
                            return (
                              <div
                                key={message._id}
                                className={`mb-6 flex ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}
                              >
                                <div className="flex flex-col items-center">
                                  <Avatar
                                    src={message.sender?.startgg?.profile?.images[0]?.url}
                                    alt={message.sender.username}
                                    className="w-8 h-8 rounded-full"
                                    variant="circular"
                                    placeholder="U"
                                  />
                                </div>
                                
                                <div className="flex flex-col max-w-[60%]">
                                  <div 
                                    className={`p-3 rounded-lg ${
                                      isOwnMessage 
                                        ? 'bg-blue-500 text-white rounded-tr-none' 
                                        : 'bg-gray-800 text-gray-200 rounded-tl-none'
                                    }`}
                                  >
                                    <Typography>{message.content}</Typography>
                                  </div>
                                  <div className={`flex items-center gap-2 mt-1 ${
                                    isOwnMessage ? 'justify-end' : 'justify-start'
                                  }`}>
                                    <Typography className="text-xs text-gray-400">
                                      {message.sender.username}
                                    </Typography>
                                    <Typography className="text-xs text-gray-400">•</Typography>
                                    <Typography className="text-xs text-gray-400">
                                      {new Date(message.createdAt).toLocaleTimeString([], { 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                      })}
                                    </Typography>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    ))}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={sendMessage} className="p-4 border-t border-white/10">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button 
                      type="submit"
                      color="blue"
                      className="flex items-center gap-2"
                      disabled={!newMessage.trim()}
                    >
                      <Send className="h-4 w-4" />
                      Send
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <Typography className="text-gray-400">
                  Select a conversation to start messaging
                </Typography>
              </div>
            )}
          </div>
        </div>
      </Card>
      <NewConversation
        open={newConversationOpen}
        onClose={() => setNewConversationOpen(false)}
        onConversationCreated={handleNewConversation}
      />
    </div>
  );
};

export default Messages; 