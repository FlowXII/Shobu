// front/src/components/tickets/TicketSection.jsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
  Select,
  Option,
} from "@material-tailwind/react";
import { Plus, AlertCircle, CheckCircle, Clock, Inbox } from 'lucide-react';
import { toast } from 'react-toastify';
import { fetchTournamentTickets, createTicket } from '../../loaders/ticketLoader';
import { Link } from 'react-router-dom';

const TicketSection = ({ tournamentId }) => {
  const [tickets, setTickets] = useState([]);
  const [open, setOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    tournament: tournamentId
  });

  useEffect(() => {
    loadTickets();
  }, [tournamentId]);

  const loadTickets = async () => {
    try {
      const fetchedTickets = await fetchTournamentTickets(tournamentId);
      setTickets(fetchedTickets);
    } catch (error) {
      toast.error('Failed to load tickets');
    }
  };

  const handleOpen = () => setOpen(!open);

  const handleSubmit = async () => {
    try {
      const ticketToCreate = {
        title: newTicket.title,
        description: newTicket.description,
        priority: newTicket.priority,
        tournament: tournamentId
      };
      
      await createTicket(tournamentId, ticketToCreate);
      toast.success('Ticket created successfully');
      handleOpen();
      loadTickets();
      setNewTicket({
        title: '',
        description: '',
        priority: 'MEDIUM',
        tournament: tournamentId
      });
    } catch (error) {
      toast.error('Failed to create ticket');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'text-red-500';
      case 'MEDIUM': return 'text-yellow-500';
      case 'LOW': return 'text-green-500';
      default: return 'text-blue-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'RESOLVED':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'IN_PROGRESS':
        return <Clock className="text-yellow-500" size={20} />;
      default:
        return <AlertCircle className="text-red-500" size={20} />;
    }
  };

  return (
    <Card className="bg-gray-900 border-2 border-blue-500/50 mb-6">
      <CardBody>
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h5" color="blue" className="mb-2">
            Support Tickets
          </Typography>
          <Button
            color="blue"
            className="flex items-center gap-2"
            onClick={handleOpen}
          >
            <Plus size={20} />
            Create Ticket
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {tickets.length === 0 ? (
            <Card className="bg-gray-800/50 border border-gray-700">
              <CardBody className="flex flex-col items-center justify-center py-8">
                <Inbox className="w-16 h-16 text-gray-500 mb-4" />
                <Typography variant="h6" color="gray" className="mb-2">
                  No Tickets Yet
                </Typography>
                <Typography color="gray" className="text-center text-gray-500">
                  Create a support ticket if you need assistance.
                </Typography>
              </CardBody>
            </Card>
          ) : (
            tickets.map((ticket) => (
              <Card key={ticket._id} className="bg-gray-800/50 border border-gray-700">
                <CardBody>
                  <div className="flex flex-col gap-4">
                    {/* Ticket Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(ticket.status)}
                          <Typography variant="h6" className="text-gray-200">
                            {ticket.title}
                          </Typography>
                        </div>
                        <Typography className="text-gray-400 mt-2">
                          {ticket.description}
                        </Typography>
                        <div className="mt-2 text-sm text-gray-400">
                          Created by: {' '}
                          <Link 
                            to={`/profile/${ticket.creator?.username}`}
                            className="text-blue-400 hover:underline"
                          >
                            {ticket.creator?.username}
                          </Link>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <Typography className={`font-bold ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </Typography>
                      </div>
                    </div>

                    {/* Comments Section */}
                    {ticket.comments && ticket.comments.length > 0 && (
                      <div className="mt-4">
                        <Typography variant="h6" className="text-gray-300 mb-2">
                          Responses ({ticket.comments.length})
                        </Typography>
                        <div className="space-y-3 max-h-[200px] overflow-y-auto">
                          {ticket.comments.map((comment, index) => (
                            <div 
                              key={index}
                              className={`p-3 rounded-lg ${
                                comment.user.isOrganizer 
                                  ? 'bg-blue-900/30 border border-blue-500/30' 
                                  : 'bg-gray-700/30'
                              }`}
                            >
                              <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center gap-2">
                                  <Link 
                                    to={`/profile/${comment.user.username}`}
                                    className={`font-medium text-sm hover:underline ${
                                      comment.user.isOrganizer 
                                        ? 'text-blue-300' 
                                        : 'text-gray-300'
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
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        ticket.status === 'RESOLVED' 
                          ? 'bg-green-900/50 text-green-200' 
                          : ticket.status === 'IN_PROGRESS' 
                            ? 'bg-blue-900/50 text-blue-200' 
                            : 'bg-yellow-900/50 text-yellow-200'
                      }`}>
                        {ticket.status}
                      </span>
                      <Typography className="text-gray-400 text-sm">
                        Last updated: {new Date(ticket.updatedAt).toLocaleString()}
                      </Typography>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>

        {/* Create Ticket Dialog */}
        <Dialog 
          open={open} 
          handler={handleOpen} 
          size="md"
          className="bg-gray-900 text-gray-200"
        >
          <DialogHeader className="text-gray-200">Create New Support Ticket</DialogHeader>
          <DialogBody className="text-gray-300">
            <div className="flex flex-col gap-4">
              <Input
                label="Title"
                value={newTicket.title}
                onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                className="text-gray-200"
                labelProps={{
                  className: "text-gray-400"
                }}
              />
              <Textarea
                label="Description"
                value={newTicket.description}
                onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                className="text-gray-200"
                labelProps={{
                  className: "text-gray-400"
                }}
              />
              <Select
                label="Priority"
                value={newTicket.priority}
                onChange={(value) => setNewTicket({...newTicket, priority: value})}
                className="text-gray-200"
                labelProps={{
                  className: "text-gray-400"
                }}
              >
                <Option value="LOW">Low</Option>
                <Option value="MEDIUM">Medium</Option>
                <Option value="HIGH">High</Option>
              </Select>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="text" color="red" onClick={handleOpen} className="mr-1">
              Cancel
            </Button>
            <Button variant="gradient" color="blue" onClick={handleSubmit}>
              Create
            </Button>
          </DialogFooter>
        </Dialog>
      </CardBody>
    </Card>
  );
};

export default TicketSection;