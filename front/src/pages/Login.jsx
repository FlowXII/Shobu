import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Button, 
  Card, 
  CardBody, 
  Typography,
  Input
} from "@material-tailwind/react";
import { fetchUserData } from '../store/thunks/userThunks';
import axios from 'axios';
import { setUser, setError } from '../store/slices/userSlice';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting login with:', formData);
      
      const loginResponse = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, formData, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Login response:', loginResponse.data);
      
      if (loginResponse.data.success) {
        dispatch(setUser(loginResponse.data.user));
        
        navigate('/profile');
      }
    } catch (error) {
      console.error('Login error:', error);
      dispatch(setError(error.response?.data?.error || 'Invalid credentials'));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" 
           style={{ 
             maskImage: 'linear-gradient(to bottom, transparent, black)', 
             WebkitMaskImage: 'linear-gradient(to bottom, transparent, black)' 
           }}>
      </div>
      
      <Card className="w-96 bg-gradient-to-br from-gray-800 to-gray-950 text-white shadow-xl border border-white border-opacity-20">
        <CardBody className="flex flex-col items-center">
          <Typography variant="h4" color="white" className="mb-4">
            Welcome Back
          </Typography>
          
          <Typography className="mt-1 mb-8 font-normal text-gray-400">
            Login to access your account
          </Typography>

          {error && (
            <Typography color="red" className="mb-4 text-sm">
              {error}
            </Typography>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <Input
              type="email"
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              className="!text-white !border-white/20"
              labelProps={{
                className: "!text-gray-400",
              }}
              required
            />

            <Input
              type="password"
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              className="!text-white !border-white/20"
              labelProps={{
                className: "!text-gray-400",
              }}
              required
            />

            <Button
              type="submit"
              className="mt-4 bg-red-500 hover:bg-red-600"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <Typography className="mt-4 text-sm text-gray-400">
            Don't have an account?{' '}
            <a href="/register" className="text-red-400 hover:text-red-300">
              Register here
            </a>
          </Typography>
        </CardBody>
      </Card>
    </div>
  );
}

export default Login; 