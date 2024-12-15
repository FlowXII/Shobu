import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true // Important for sending cookies
});

export const fetchTournamentTickets = async (tournamentId) => {
  try {
    const response = await api.get(`/tournaments/${tournamentId}/tickets`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error('Authentication error: User not logged in or token expired');
    }
    throw error;
  }
};

export const createTicket = async (tournamentId, ticketData) => {
  try {
    const response = await api.post(
      `/tournaments/${tournamentId}/tickets`, 
      ticketData
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error('Authentication error: User not logged in or token expired');
    }
    throw error;
  }
};

export const updateTicketStatus = async (ticketId, status) => {
  try {
    const response = await api.patch(
      `/tickets/${ticketId}/status`,
      { status }
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error('Authentication error: User not logged in or token expired');
    }
    throw error;
  }
};

export const addTicketComment = async (ticketId, content) => {
  try {
    const response = await api.post(
      `/tickets/${ticketId}/comments`,
      { content }
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error('Authentication error: User not logged in or token expired');
    }
    throw error;
  }
};

export const deleteTicket = async (ticketId) => {
  try {
    const response = await api.delete(`/tickets/${ticketId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error('Authentication error: User not logged in or token expired');
    }
    throw error;
  }
}; 