import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SidebarProvider, useSidebar } from './contexts/SidebarContext';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TournamentCreationForm from './pages/CreateTournament';
import UpcomingTournaments from './pages/UpcomingTournaments';
import StationViewer from './pages/StationViewer';
import Dashboard from './pages/Dashboard';

// Create a layout component to handle the sidebar and main content
const Layout = ({ children }) => {
    const { isOpen } = useSidebar();
    return (
        <div className="flex min-h-screen bg-gradient-to-r from-blue-900 via-purple-900 to-red-900">
            <Sidebar />
            <div className={`flex-1 min-h-screen transition-all duration-300 ${isOpen ? 'ml-48' : 'ml-16'}`}>
                <div className={`p-4 max-w-full h-full ${isOpen ? 'lg:ml-16' : 'lg:ml-16'}`}>
                    {children}
                </div>
            </div>
        </div>
    );
};

function App() {
    return (
        <SidebarProvider>
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/create" element={<TournamentCreationForm />} />
                        <Route path="/upcoming" element={<UpcomingTournaments />} />
                        <Route path="/station-viewer" element={<StationViewer />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Routes>
                </Layout>
            </Router>
        </SidebarProvider>
    );
}

export default App;