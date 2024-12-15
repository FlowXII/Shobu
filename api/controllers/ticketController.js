import * as ticketService from '../services/ticketService.js';

export const createTicket = async (req, res) => {
  try {
    const ticketData = {
      ...req.body,
      creator: req.user.userId,
      assignedTo: req.user.userId,
    };
    const ticket = await ticketService.createTicket(ticketData);
    res.status(201).json(ticket);
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
};

export const getTicketsByTournament = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const tickets = await ticketService.getTicketsByTournament(tournamentId);
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = await ticketService.getTicketById(ticketId);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json(ticket);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
};

export const updateTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;
    const ticket = await ticketService.updateTicketStatus(ticketId, status, req.user.userId);
    res.json(ticket);
  } catch (error) {
    console.error('Error updating ticket status:', error);
    res.status(500).json({ error: 'Failed to update ticket status' });
  }
};

export const addComment = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { content } = req.body;
    const ticket = await ticketService.addTicketComment(ticketId, req.user.userId, content);
    res.json(ticket);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

export const deleteTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    await ticketService.deleteTicket(ticketId);
    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    res.status(500).json({ error: 'Failed to delete ticket' });
  }
}; 