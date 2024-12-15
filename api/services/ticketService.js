import Ticket from '../models/Ticket.js';
import Tournament from '../models/Tournament.js';

export const createTicket = async (ticketData) => {
  const ticket = new Ticket(ticketData);
  return await ticket.save();
};

export const getTicketsByTournament = async (tournamentId) => {
  return await Ticket.find({ tournament: tournamentId })
    .populate('creator', 'username email')
    .populate('assignedTo', 'username email')
    .populate('comments.user', 'username email isOrganizer')
    .sort({ createdAt: -1 });
};

export const getTicketById = async (ticketId) => {
  return await Ticket.findById(ticketId)
    .populate('creator', 'username email')
    .populate('assignedTo', 'username email')
    .populate('comments.user', 'username email isOrganizer');
};

export const updateTicketStatus = async (ticketId, status, userId) => {
  return await Ticket.findByIdAndUpdate(
    ticketId,
    { 
      status,
      updatedAt: Date.now()
    },
    { new: true }
  );
};

export const addTicketComment = async (ticketId, userId, content) => {
  return await Ticket.findByIdAndUpdate(
    ticketId,
    {
      $push: { 
        comments: {
          user: userId,
          content,
          createdAt: Date.now()
        }
      },
      updatedAt: Date.now()
    },
    { new: true }
  ).populate('comments.user', 'username email');
};

export const deleteTicket = async (ticketId) => {
  return await Ticket.findByIdAndDelete(ticketId);
}; 