import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';  // Import the Sidebar component
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TournamentCreationForm from './pages/CreateTournament';

function App() {
    return (
        <Router>
            <div className="flex">
                <Sidebar />
                <div className="flex-1 bg-gray-900 min-h-screen flex justify-center items-center">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/create" element={<TournamentCreationForm />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;

