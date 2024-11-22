import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button } from "@material-tailwind/react";
import { logoutUser } from '../store/thunks/userThunks';

function LogoutButton({ className }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
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