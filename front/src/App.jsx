import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SidebarProvider, useSidebar } from './contexts/SidebarContext';
import Sidebar from './components/layout/Sidebar';
import Home from './pages/Home';
import StartGGLogin from './pages/startGG/startGGOauth/StartGGLogin';
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import CreateTournament from './pages/organiser/CreateTournament';
import UpcomingTournaments from './pages/startGG/startGGTournaments/UpcomingTournaments';
import StationViewer from './pages/startGG/startGGStations/StationViewer';
import Dashboard from './pages/startGG/startGGDashboard/Dashboard';
import ViewTournament from './pages/tournaments/ViewTournament';
import Profile from './pages/user/Profile';
import { Provider } from 'react-redux';
import store from './store';
import Tournaments from './pages/tournaments/Tournaments';
import Feed from './pages/social/Feed';
import StatisticsViewer from './pages/stats/StatisticsViewer';
import Spaces from './pages/social/Spaces';
import Messages from './pages/social/Messages';
import Streams from './pages/social/Streams';
import TournamentDetails from './pages/tournaments/TournamentDetails';
import EventDetails from './pages/events/EventDetails';
import EventRegistration from './pages/events/EventRegistration';
import DebugBar from './components/debug/DebugBar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData } from './store/thunks/userThunks';
import LoadingIndicator from './components/layout/LoadingIndicator';
import OrganizerDashboard from './pages/organiser/OrganizerDashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  EventDetailsTO,
  EventParticipantsTO,
  EventBracketsTO,
  EventSettingsTO,
  TournamentDetailsTO,
  TournamentEventsTO,
  TournamentOverviewTO,
  TournamentParticipantsTO,
  TournamentSettingsTO
} from './components/organiser';

// Create a layout component to handle the sidebar and main content
const Layout = ({ children }) => {
    const { isOpen } = useSidebar();
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-800 to-black">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" style={{ maskImage: 'linear-gradient(to bottom, transparent, black)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black)' }}></div>
            <Sidebar />
            <div className={`flex-1 min-h-screen transition-all duration-300 ${isOpen ? 'ml-56' : 'ml-16'}`}>
                {children}
            </div>
        </div>
    );
};

function App() {
    const dispatch = useDispatch();
    const initialized = useSelector(state => state.auth.initialized);

    useEffect(() => {
        // Check authentication status on app load
        dispatch(fetchUserData());
    }, [dispatch]);

    // Optional: Show loading state while checking auth
    if (!initialized) {
        return <LoadingIndicator />;
    }

    return (
        <SidebarProvider>
            <Router>
                <div className="relative">
                    {process.env.NODE_ENV === 'development' && <DebugBar />}
                    <Layout>
                        <div className="p-4 max-w-full h-full">
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
                                <Route path="/tournaments/:tournamentId/to" element={<TournamentDetailsTO />} />
                                <Route path="/tournaments/:id" element={<ViewTournament />} />
                                <Route path="/tournaments/:tournamentId/events/:eventId/to" element={<EventDetailsTO />} />
                                <Route path="/tournaments/:tournamentId/events/:eventId/view" element={<EventDetails />} />
                                <Route path="/tournaments/:tournamentId/events/:eventId/register" element={<EventRegistration />} />
                                <Route path="/tournaments" element={<Tournaments />} />
                                <Route path="/feed" element={<Feed />} />
                                <Route path="/statistics" element={<StatisticsViewer />} />
                                <Route path="/spaces" element={<Spaces />} />
                                <Route path="/messages" element={<Messages />} />
                                <Route path="/streams" element={<Streams />} />
                                <Route path="/organizer" element={<OrganizerDashboard />} />
                            </Routes>
                        </div>
                    </Layout>
                </div>
            </Router>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </SidebarProvider>
    );
}

export default App;
