import React, { useState, useEffect } from 'react';
import { 
  fetchTournamentTickets, 
  updateTicketStatus, 
  addTicketComment, 
  deleteTicket 
} from '../../../loaders/ticketLoader';
import { Inbox, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const TicketManager = ({ tournaments }) => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTickets = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const ticketPromises = tournaments.map(tournament =>
          fetchTournamentTickets(tournament._id)
        );
        
        try {
          const responses = await Promise.all(ticketPromises);
          const allTickets = responses.flatMap(tickets => tickets);
          setTickets(allTickets);
        } catch (error) {
          if (error.response?.status === 401) {
            setError('Please log in again to view tickets.');
          } else {
            setError('Failed to load tickets. Please try again later.');
          }
          console.error('Failed to load tickets:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    if (tournaments.length > 0) {
      loadTickets();
    } else {
      setLoading(false);
    }
  }, [tournaments]);

  const handleStatusUpdate = async (ticketId, newStatus) => {
    try {
      const updatedTicket = await updateTicketStatus(ticketId, newStatus);
      setTickets(tickets.map(ticket => 
        ticket._id === ticketId ? updatedTicket : ticket
      ));
      toast.success(`Ticket status updated to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update ticket status:', error);
      toast.error('Failed to update ticket status');
    }
  };

  const handleAddComment = async (ticketId) => {
    if (!newComment.trim()) return;
    
    try {
      const updatedTicket = await addTicketComment(ticketId, newComment);
      setTickets(tickets.map(ticket => 
        ticket._id === ticketId ? updatedTicket : ticket
      ));
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteTicket(ticketId);
      toast.success('Ticket deleted successfully');
      setTickets(tickets.filter(ticket => ticket._id !== ticketId));
      if (selectedTicket?._id === ticketId) {
        setSelectedTicket(null);
      }
    } catch (error) {
      console.error('Failed to delete ticket:', error);
      toast.error('Failed to delete ticket');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-900 rounded-lg shadow-md p-6 border border-gray-800">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-400">Loading tickets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-900 rounded-lg shadow-md p-6 border border-gray-800">
        <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
        <p className="text-red-400 text-center">{error}</p>
        {error.includes('log in') && (
          <button
            onClick={() => window.location.href = '/login'}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go to Login
          </button>
        )}
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-900 rounded-lg shadow-md p-6 border border-gray-800">
        <Inbox className="w-16 h-16 text-gray-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-300 mb-2">No Tickets Yet</h3>
        <p className="text-gray-400 text-center">
          When participants create support tickets for your tournaments, they'll appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg shadow-md p-6 border border-gray-800 relative z-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-200">Support Tickets</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket List */}
        <div className="space-y-4 relative z-20">
          {tickets.map(ticket => (
            <div 
              key={ticket._id}
              className={`bg-gray-800 border rounded-lg p-4 cursor-pointer transition-all duration-200 relative z-30 ${
                selectedTicket?._id === ticket._id ? 'border-blue-500 shadow-md' : 'border-gray-700 hover:border-blue-400'
              }`}
              onClick={() => setSelectedTicket(ticket)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg text-gray-200">{ticket.title}</h3>
                  <div className="text-sm text-gray-400 mt-1">
                    Created by: {' '}
                    <Link 
                      to={`/profile/${ticket.creator?.username}`}
                      className="text-blue-400 hover:underline"
                    >
                      {ticket.creator?.username}
                    </Link>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  ticket.priority === 'HIGH' ? 'bg-red-900/50 text-red-200' :
                  ticket.priority === 'MEDIUM' ? 'bg-yellow-900/50 text-yellow-200' :
                  'bg-green-900/50 text-green-200'
                }`}>
                  {ticket.priority}
                </span>
              </div>
              
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                {ticket.description}
              </p>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    ticket.status === 'RESOLVED' ? 'bg-green-900/50 text-green-200' :
                    ticket.status === 'IN_PROGRESS' ? 'bg-blue-900/50 text-blue-200' :
                    'bg-yellow-900/50 text-yellow-200'
                  }`}>
                    {ticket.status}
                  </span>
                  <span className="text-xs text-gray-400">
                    Created: {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  By: {ticket.creator?.username || 'Unknown'}
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    ticket.status === 'RESOLVED' ? 'bg-green-900/50 text-green-200' :
                    ticket.status === 'IN_PROGRESS' ? 'bg-blue-900/50 text-blue-200' :
                    'bg-yellow-900/50 text-yellow-200'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTicket(ticket);
                    }}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTicket(ticket._id);
                    }}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ticket Details */}
        {selectedTicket && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 relative z-20">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-200">{selectedTicket.title}</h3>
              <button
                onClick={() => handleDeleteTicket(selectedTicket._id)}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Delete Ticket
              </button>
            </div>
            <div className="mb-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-200">{selectedTicket.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedTicket.priority === 'HIGH' ? 'bg-red-900/50 text-red-200' :
                  selectedTicket.priority === 'MEDIUM' ? 'bg-yellow-900/50 text-yellow-200' :
                  'bg-green-900/50 text-green-200'
                }`}>
                  {selectedTicket.priority}
                </span>
              </div>
              <p className="text-gray-400">{selectedTicket.description}</p>
              
              {/* Creator Info */}
              <div className="mt-4 p-3 bg-gray-700/30 rounded-lg">
                <div className="text-sm text-gray-300">
                  <span className="font-semibold">Created by:</span> {selectedTicket.creator?.username}
                </div>
                <div className="text-sm text-gray-400">
                  <span className="font-semibold">Created on:</span> {new Date(selectedTicket.createdAt).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Status Management */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-400 mb-2">Update Status</h4>
              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusUpdate(selectedTicket._id, 'PENDING')}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    selectedTicket.status === 'PENDING' 
                      ? 'bg-yellow-500 text-white' 
                      : 'bg-yellow-900/30 text-yellow-200 hover:bg-yellow-900/50'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedTicket._id, 'IN_PROGRESS')}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    selectedTicket.status === 'IN_PROGRESS' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-blue-900/30 text-blue-200 hover:bg-blue-900/50'
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedTicket._id, 'RESOLVED')}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    selectedTicket.status === 'RESOLVED' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-green-900/30 text-green-200 hover:bg-green-900/50'
                  }`}
                >
                  Resolved
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-200">
                Comments ({selectedTicket.comments?.length || 0})
              </h4>
              <div className="max-h-[300px] overflow-y-auto space-y-3">
                {selectedTicket.comments?.map((comment, index) => (
                  <div 
                    key={index} 
                    className={`bg-gray-700/30 rounded-lg p-3 ${
                      comment.user.isOrganizer ? 'border border-blue-500/30 bg-blue-900/30' : ''
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <Link 
                          to={`/profile/${comment.user.username}`}
                          className={`font-medium text-sm hover:underline ${
                            comment.user.isOrganizer ? 'text-blue-300' : 'text-gray-300'
                          }`}
                        >
                          {comment.user.username}
                        </Link>
                        {comment.user.isOrganizer && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-blue-500/20 text-blue-300">
                            Organizer
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-4">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg px-3 py-2 placeholder-gray-400"
                />
                <button
                  onClick={() => handleAddComment(selectedTicket._id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketManager; 