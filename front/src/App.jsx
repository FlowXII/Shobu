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
import Profile from './pages/Profile';
import { Provider } from 'react-redux';
import store from './store';

// Create a layout component to handle the sidebar and main content
const Layout = ({ children }) => {
    const { isOpen } = useSidebar();
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-blue-900 to-red-900">
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
        <Provider store={store}>
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
                            <Route path="/profile" element={<Profile />} />
                        </Routes>
                    </Layout>
                </Router>
            </SidebarProvider>
        </Provider>
    );
}

export default App;
