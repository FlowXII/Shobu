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
        <div className="fixed top-0 left-0 h-full w-full bg-gray-900 text-white flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
                <CardBody>
                    <h1 className="text-2xl font-semibold mb-6 text-yellow-400 text-center">Login</h1>
                    <div className="mb-4">
                        <Input
                            type="text"
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="text-white"
                            containerProps={{ className: 'mb-4' }}
                            inputProps={{
                                className: 'text-yellow-400 placeholder-yellow-400 focus:text-white focus:border-yellow-400 focus:ring-yellow-400'
                            }}
                            labelProps={{
                                className: 'text-yellow-400 peer-focus:text-white peer-focus:border-yellow-400'
                            }}
                        />
                    </div>
                    <div className="mb-6">
                        <Input
                            type="password"
                            label="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="text-white"
                            containerProps={{ className: 'mb-4' }}
                            inputProps={{
                                className: 'text-yellow-400 placeholder-yellow-400 focus:text-white focus:border-yellow-400 focus:ring-yellow-400'
                            }}
                            labelProps={{
                                className: 'text-yellow-400 peer-focus:text-white peer-focus:border-yellow-400'
                            }}
                        />
                    </div>
                    <Button color="yellow" onClick={handleLogin} fullWidth>Login</Button>
                </CardBody>
            </Card>
        </div>
    );
}

export default Login;
