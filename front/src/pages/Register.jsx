// frontend/src/pages/Register.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Input, Button, Card, CardBody } from '@material-tailwind/react';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            const response = await axios.post('/api/users/register', { username, password });
            console.log('Registration successful:', response.data);
        } catch (error) {
            console.error('Error registering:', error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-96">
                <CardBody>
                    <h1 className="text-2xl font-bold mb-4">Register</h1>
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
                    <Button color="blue" onClick={handleRegister}>Register</Button>
                </CardBody>
            </Card>
        </div>
    );
}

export default Register;
