import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button } from "@material-tailwind/react";
import { clearUser } from '../store/slices/userSlice';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

function LogoutButton({ className }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, { 
        method: 'POST', 
        credentials: 'include' 
      });
      dispatch(clearUser());
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Button
      size="sm"
      color="red"
      className={`flex items-center gap-2 ${className}`}
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
}

export default LogoutButton; 