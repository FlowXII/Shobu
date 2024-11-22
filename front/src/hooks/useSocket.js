import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';

export const useSocket = () => {
  const socket = useRef(null);
  const user = useSelector(state => state.user.user);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    socket.current = io(import.meta.env.VITE_API_URL, {
      auth: { token: localStorage.getItem('token') },
      withCredentials: true,
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [isAuthenticated, user]);

  return socket.current;
}; 