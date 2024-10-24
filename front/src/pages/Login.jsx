import React, { useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, CardBody, Typography } from "@material-tailwind/react";
import { fetchUserData } from '../store/thunks/userThunks';
import { clearUser } from '../store/slices/userSlice';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/startgg`;
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
      dispatch(clearUser());
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-red-900">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" style={{ maskImage: 'linear-gradient(to bottom, transparent, black)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black)' }}></div>
      <Card className="w-96 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg">
        <CardBody className="flex flex-col items-center">
          <Typography variant="h4" color="white" className="mb-4">
            {user ? 'Welcome Back!' : 'Login with Start.gg'}
          </Typography>
          <Typography color="gray" className="mt-1 mb-8 font-normal text-gray-300">
            {user ? `Logged in as ${user.name}` : 'Connect your Start.gg account to access tournament data.'}
          </Typography>
          <Button
            size="lg"
            color={user ? "red" : "blue"}
            className="flex items-center gap-3"
            onClick={user ? handleLogout : handleLogin}
          >
            {user ? 'Logout' : 'Login with Start.gg'}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}

export default Login;
