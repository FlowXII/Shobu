import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SidebarProvider, useSidebar } from './contexts/SidebarContext';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import StartGGLogin from './pages/StartGGLogin';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateTournament from './pages/CreateTournament';
import UpcomingTournaments from './pages/UpcomingTournaments';
import StationViewer from './pages/StationViewer';
import Dashboard from './pages/Dashboard';
import ViewTournament from './pages/ViewTournament';
import Profile from './pages/Profile';
import { Provider } from 'react-redux';
import store from './store';
import BracketViewer from './pages/BracketViewer';
import Tournaments from './pages/Tournaments';
import Feed from './pages/Feed';
import StatisticsViewer from './pages/StatisticsViewer';
import Spaces from './pages/Spaces';
import Messages from './pages/Messages';
import Streams from './pages/Streams';

// Create a layout component to handle the sidebar and main content
const Layout = ({ children }) => {
    const { isOpen } = useSidebar();
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-800 to-black">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" style={{ maskImage: 'linear-gradient(to bottom, transparent, black)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black)' }}></div>
            <Sidebar />
            <div className={`flex-1 min-h-screen transition-all duration-300 ${isOpen ? 'ml-56' : 'ml-16'}`}>
                <div className="p-4 max-w-full h-full">
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
                        <Route path="/startgg-login" element={<StartGGLogin />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/tournaments/create" element={<CreateTournament />} />
                        <Route path="/upcoming" element={<UpcomingTournaments />} />
                        <Route path="/station-viewer" element={<StationViewer />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/bracket/:eventId" element={<BracketViewer />} />
                        <Route path="/tournaments/:slug" element={<ViewTournament />} />
                        <Route path="/tournaments" element={<Tournaments />} />
                        <Route path="/feed" element={<Feed />} />
                        <Route path="/statistics" element={<StatisticsViewer />} />
                        <Route path="/spaces" element={<Spaces />} />
                        <Route path="/messages" element={<Messages />} />
                        <Route path="/streams" element={<Streams />} />
                    </Routes>
                </Layout>
            </Router>
        </SidebarProvider>
    );
}

export default App;
