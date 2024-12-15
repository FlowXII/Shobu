import express from 'express';
import { verifyToken } from '../auth/startgg/startgg.middleware.js';
import * as ticketController from '../controllers/ticketController.js';

const router = express.Router();

// Create a new ticket
router.post('/tournaments/:tournamentId/tickets', verifyToken, ticketController.createTicket);

// Get all tickets for a tournament
router.get('/tournaments/:tournamentId/tickets', verifyToken, ticketController.getTicketsByTournament);

// Get specific ticket
router.get('/tickets/:ticketId', verifyToken, ticketController.getTicketById);

// Update ticket status
router.patch('/tickets/:ticketId/status', verifyToken, ticketController.updateTicketStatus);

// Add comment to ticket
router.post('/tickets/:ticketId/comments', verifyToken, ticketController.addComment);

// Delete ticket
router.delete('/tickets/:ticketId', verifyToken, ticketController.deleteTicket);

export default router; 