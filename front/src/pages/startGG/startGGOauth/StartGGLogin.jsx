import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, Typography } from "@material-tailwind/react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/startgg`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-96">
        <CardBody className="flex flex-col gap-4">
          <Typography variant="h5" color="blue-gray" className="mb-2">
            Start.gg Integration
          </Typography>
          <Button
            color="blue"
            className="flex items-center gap-3"
            onClick={handleLogin}
          >
            Login with Start.gg
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}

export default Login;
