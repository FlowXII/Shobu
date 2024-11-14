import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardBody,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import axios from 'axios';
import { setUser, setError } from '../store/slices/userSlice';

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.username || formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    if (!formData.password || formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        dispatch(setUser(response.data.data));
        navigate('/dashboard');
      }
    } catch (error) {
      dispatch(setError(error.response?.data?.error || 'Registration failed'));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" 
           style={{ 
             maskImage: 'linear-gradient(to bottom, transparent, black)', 
             WebkitMaskImage: 'linear-gradient(to bottom, transparent, black)' 
           }}>
      </div>
      
      <Card className="w-full max-w-md bg-gradient-to-br from-gray-800 to-gray-950 text-white shadow-xl border border-white border-opacity-20">
        <CardBody className="flex flex-col gap-4">
          <Typography variant="h3" color="white" className="text-center mb-2">
            Create Account
          </Typography>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Input
                type="text"
                name="username"
                label="Username"
                value={formData.username}
                onChange={handleChange}
                className="!text-white !border-white/20"
                labelProps={{
                  className: "!text-gray-400",
                }}
                error={!!formErrors.username}
              />
              {formErrors.username && (
                <Typography color="red" className="mt-1 text-xs">
                  {formErrors.username}
                </Typography>
              )}
            </div>

            <div>
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
                error={!!formErrors.email}
              />
              {formErrors.email && (
                <Typography color="red" className="mt-1 text-xs">
                  {formErrors.email}
                </Typography>
              )}
            </div>

            <div>
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
                error={!!formErrors.password}
              />
              {formErrors.password && (
                <Typography color="red" className="mt-1 text-xs">
                  {formErrors.password}
                </Typography>
              )}
            </div>

            <div>
              <Input
                type="password"
                name="confirmPassword"
                label="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="!text-white !border-white/20"
                labelProps={{
                  className: "!text-gray-400",
                }}
                error={!!formErrors.confirmPassword}
              />
              {formErrors.confirmPassword && (
                <Typography color="red" className="mt-1 text-xs">
                  {formErrors.confirmPassword}
                </Typography>
              )}
            </div>

            <Button
              type="submit"
              className="mt-4 bg-red-500 hover:bg-red-600"
              disabled={loading}
              fullWidth
            >
              {loading ? 'Creating Account...' : 'Register'}
            </Button>
          </form>

          <Typography className="text-center mt-4 text-sm text-gray-400">
            Already have an account?{' '}
            <a href="/login" className="text-red-400 hover:text-red-300">
              Login here
            </a>
          </Typography>
        </CardBody>
      </Card>
    </div>
  );
}

export default Register;
