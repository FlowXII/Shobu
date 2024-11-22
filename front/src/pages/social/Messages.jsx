import React, { useState } from 'react';
import {
  Card,
  Typography,
  Avatar,
  CardBody,
} from "@material-tailwind/react";
import { MessageSquare, User, MoreVertical, Send } from "lucide-react";

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);

  // Updated placeholder data with message history
  const conversations = [
    {
      id: 1,
      name: "IZI Modzai",
      lastMessage: "Kazuya c'est trop...",
      timestamp: "2h ago",
      avatar: "https://placeholder.com/150",
      messages: [
        { id: 1, sender: "IZI Modzai", content: "Mehdi ptn", timestamp: "2h ago" },
        { id: 2, sender: "me", content: "Yavuz bordel", timestamp: "2h ago" },
        { id: 3, sender: "IZI Modzai", content: "Kazuya", timestamp: "2h ago" },
      ]
    },
    // ... other conversations with similar message history structure ...
  ];

  return (
    <div className="flex flex-col items-center justify-start p-8 overflow-x-hidden">
      {/* Simplified Header */}
      <div className="w-full max-w-[80rem] mb-6">
        <Typography variant="h4" className="text-white">
          Messages
        </Typography>
      </div>

      {/* Updated Messages Container with new styling */}
      <div className="w-full max-w-[80rem] flex bg-gray-900 border border-white/10 rounded-lg overflow-hidden relative z-0">
        {/* Left sidebar with updated styling */}
        <div className="w-96 border-r border-white/10 relative z-10">
          <div className="p-6 border-b border-white/10 bg-gray-800/50">
            <Typography variant="h5" className="text-white font-bold">Conversations</Typography>
          </div>
          
          <div className="overflow-y-auto h-[calc(100vh-300px)]">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`p-6 flex items-start gap-4 hover:bg-gray-800/50 cursor-pointer transition-all
                  ${selectedConversation?.id === conv.id ? 'bg-gray-800/80 border-l-4 border-blue-500' : ''}`}
              >
                <Avatar src={conv.avatar} alt={conv.name} className="w-12 h-12 rounded-lg" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <Typography color="white" className="font-semibold">{conv.name}</Typography>
                    <Typography className="text-gray-400 text-sm">{conv.timestamp}</Typography>
                  </div>
                  <Typography className="text-gray-400 text-sm truncate">
                    {conv.lastMessage}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side with updated styling */}
        <div className="flex-1 flex flex-col relative z-10">
          {selectedConversation ? (
            <>
              {/* Updated conversation header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gray-800/50 relative z-20">
                <div className="flex items-center gap-4">
                  <Avatar src={selectedConversation.avatar} alt={selectedConversation.name} className="w-12 h-12 rounded-lg" />
                  <Typography variant="h6" className="text-white font-bold">{selectedConversation.name}</Typography>
                </div>
                <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title="View profile">
                  <User className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Updated messages container */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6 relative z-10">
                {selectedConversation.messages ? (
                  selectedConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] p-4 rounded-xl ${
                          message.sender === 'me'
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                            : 'bg-gradient-to-r from-gray-800 to-gray-700 text-white'
                        }`}
                      >
                        <Typography className="text-sm font-medium">{message.content}</Typography>
                        <Typography className="text-xs mt-2 opacity-80">{message.timestamp}</Typography>
                      </div>
                    </div>
                  ))
                ) : (
                  <Typography className="text-gray-400 text-center p-6 bg-gray-800/50 rounded-xl">
                    No messages in this conversation yet. Start chatting!
                  </Typography>
                )}
              </div>

              {/* Updated message input */}
              <div className="p-6 border-t border-white/10 bg-gray-800/50 relative z-20">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-700 text-white rounded-xl px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/10"
                  />
                  <button 
                    className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue:600 hover:to-blue-700 rounded-xl transition-all"
                    title="Send message"
                  >
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center relative z-10">
              <Typography className="text-gray-400 bg-gray-800/50 p-6 rounded-lg">
                Select a conversation to start messaging
              </Typography>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages; 