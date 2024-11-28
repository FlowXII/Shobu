import { Outlet } from 'react-router-dom';
import Home from '../pages/Home';
import StartGGLogin from '../pages/startGG/startGGOauth/StartGGLogin';
import Login from '../pages/user/Login';
import Register from '../pages/user/Register';
import UpcomingTournaments from '../pages/startGG/startGGTournaments/UpcomingTournaments';
import StationViewer from '../pages/startGG/startGGStations/StationViewer';
import Dashboard from '../pages/startGG/startGGDashboard/Dashboard';
import ViewTournament from '../pages/tournaments/ViewTournament';
import Profile from '../pages/user/Profile';
import Tournaments from '../pages/tournaments/Tournaments';
import Feed from '../pages/social/Feed';
import StatisticsViewer from '../pages/stats/StatisticsViewer';
import Spaces from '../pages/social/Spaces';
import Messages from '../pages/social/Messages';
import Streams from '../pages/social/Streams';
import {
  organizerLoader,
  tournamentDetailsLoader
} from '../loaders/tournamentLoader';
import { eventDetailsLoader } from '../loaders/eventLoader';

// Organizer Pages
import OrganizerDashboard from '../pages/organiser/OrganizerDashboard';
import CreateTournament from '../pages/organiser/CreateTournament';
import TournamentDetailsTO from '../pages/organiser/TournamentDetailsTO';
import EventDetailsTO from '../pages/organiser/EventDetailsTO';
import TournamentOverviewTO from '../pages/organiser/TournamentOverviewTO';

// Organizer Components
import TournamentEventsTO from '../components/organiser/TournamentEventsTO';
import TournamentParticipantsTO from '../components/organiser/TournamentParticipantsTO';
import TournamentSettingsTO from '../components/organiser/TournamentSettingsTO';
import EventParticipantsTO from '../components/organiser/EventParticipantsTO';
import EventBracketsTO from '../components/organiser/EventBracketsTO';
import EventSettingsTO from '../components/organiser/EventSettingsTO';

// Dashboard Components
import UserHero from '../components/organiser/OrganiserDashboard/UserHero';
import DashboardStats from '../components/organiser/OrganiserDashboard/DashboardStats';
import TournamentGrid from '../components/organiser/OrganiserDashboard/TournamentGrid';

export const routes = [
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/startgg-login",
    element: <StartGGLogin />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/tournaments",
    children: [
      {
        path: "",
        element: <Tournaments />
      },
      {
        path: "create",
        element: <CreateTournament />
      },
      {
        path: ":tournamentId/to",
        element: <TournamentDetailsTO />,
        loader: tournamentDetailsLoader
      },
      {
        path: ":tournamentId",
        element: <ViewTournament />,
        loader: tournamentDetailsLoader
      },
      {
        path: ":tournamentId/events/:eventId/to",
        element: <EventDetailsTO />,
        loader: eventDetailsLoader
      }
    ]
  },
  {
    path: "/upcoming",
    element: <UpcomingTournaments />
  },
  {
    path: "/station-viewer",
    element: <StationViewer />
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  },
  {
    path: "/profile",
    children: [
      {
        path: "",
        element: <Profile />
      },
      {
        path: ":username",
        element: <Profile />
      }
    ]
  },
  {
    path: "/feed",
    element: <Feed />
  },
  {
    path: "/statistics",
    element: <StatisticsViewer />
  },
  {
    path: "/spaces",
    element: <Spaces />
  },
  {
    path: "/messages",
    element: <Messages />
  },
  {
    path: "/streams",
    element: <Streams />
  },
  {
    path: "/organizer",
    element: <OrganizerDashboard />,
    loader: organizerLoader
  }
]; 