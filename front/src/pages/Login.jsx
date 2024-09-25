// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Input, Button, Card, CardBody } from '@material-tailwind/react';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('/api/users/login', { username, password });
            console.log('Login successful:', response.data);
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-96">
                <CardBody>
                    <h1 className="text-2xl font-bold mb-4">Login</h1>
                    <Input
                        type="text"
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="mb-4"
                    />
                    <Input
                        type="password"
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mb-4"
                    />
                    <Button color="blue" onClick={handleLogin}>Login</Button>
                </CardBody>
            </Card>
        </div>
    );
}

export default Login;
