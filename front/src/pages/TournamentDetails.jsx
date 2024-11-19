import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Card,
  CardBody,
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
  Tabs,
  TabsHeader,
  Tab,
  TabsBody,
  TabPanel,
} from "@material-tailwind/react";
import { Settings, Trash2, Calendar, MapPin, Users, Trophy } from 'lucide-react';
import { toast } from 'react-toastify';
import LoadingIndicator from '../components/LoadingIndicator';
import TournamentOverviewTO from '../components/organiser/TournamentOverviewTO';
import TournamentEventsTO from '../components/organiser/TournamentEventsTO';
import TournamentParticipantsTO from '../components/organiser/TournamentParticipantsTO';
import TournamentSettingsTO from '../components/organiser/TournamentSettingsTO';

const TournamentDetails = () => {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (!tournamentId) {
      navigate('/tournaments');
      return;
    }
    fetchTournament();
  }, [tournamentId, navigate]);

  const fetchTournament = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/tournaments/${tournamentId}`,
        { credentials: 'include' }
      );
      if (!response.ok) throw new Error('Failed to fetch tournament');
      const data = await response.json();
      setTournament(data.data);
      setFormData(data.data);
    } catch (error) {
      toast.error('Failed to load tournament');
      navigate('/tournaments');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/tournaments/${tournamentId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) throw new Error('Failed to update tournament');
      const data = await response.json();
      setTournament(data.data);
      setEditMode(false);
      toast.success('Tournament updated successfully');
    } catch (error) {
      toast.error('Failed to update tournament');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/tournaments/${tournamentId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );
      if (!response.ok) throw new Error('Failed to delete tournament');
      toast.success('Tournament deleted successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to delete tournament');
    }
  };

  if (loading) return <LoadingIndicator />;

  if (!tournament) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Typography variant="h4" className="text-red-500">
          Tournament not found
        </Typography>
      </div>
    );
  }

  const isOrganizer = tournament?.organizerId === user?._id;

  return (
    <div className="flex flex-col gap-8 p-8">
      <Card className="bg-gray-800/50 border border-white/10">
        <CardBody>
          <div className="flex justify-between items-start">
            <div>
              <Typography variant="h3" className="text-white">
                {tournament.name}
              </Typography>
              <div className="flex items-center gap-4 mt-2 text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <Typography className="text-sm">
                    {new Date(tournament.startAt).toLocaleDateString()}
                  </Typography>
                </div>
                {tournament.location?.city && (
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <Typography className="text-sm">
                      {tournament.location.city}, {tournament.location.country}
                    </Typography>
                  </div>
                )}
              </div>
            </div>
            
            {isOrganizer && (
              <div className="flex gap-2">
                <Button
                  variant="outlined"
                  className="flex items-center gap-2"
                  onClick={() => setEditMode(!editMode)}
                >
                  <Settings size={16} />
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="red"
                  className="flex items-center gap-2"
                  onClick={() => setDeleteDialog(true)}
                >
                  <Trash2 size={16} />
                  Delete
                </Button>
              </div>
            )}
          </div>

          {/* Tabs for different sections */}
          <Tabs value={activeTab} className="mt-8">
            <TabsHeader>
              <Tab value="overview">Overview</Tab>
              <Tab value="events">Events</Tab>
              <Tab value="participants">Participants</Tab>
              {isOrganizer && <Tab value="settings">Settings</Tab>}
            </TabsHeader>
            <TabsBody>
              <TabPanel value="overview">
                <TournamentOverviewTO tournament={tournament} />
              </TabPanel>
              <TabPanel value="events">
                <TournamentEventsTO 
                  tournament={tournament} 
                  isOrganizer={isOrganizer}
                  onUpdate={() => fetchTournament()} 
                />
              </TabPanel>
              <TabPanel value="participants">
                <TournamentParticipantsTO tournament={tournament} />
              </TabPanel>
              {isOrganizer && (
                <TabPanel value="settings">
                  <TournamentSettingsTO 
                    tournament={tournament}
                    onUpdate={handleUpdate}
                    formData={formData}
                    setFormData={setFormData}
                  />
                </TabPanel>
              )}
            </TabsBody>
          </Tabs>
        </CardBody>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} handler={() => setDeleteDialog(false)}>
        <DialogHeader>Confirm Deletion</DialogHeader>
        <DialogBody>
          Are you sure you want to delete this tournament? This action cannot be undone.
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="gray"
            onClick={() => setDeleteDialog(false)}
          >
            Cancel
          </Button>
          <Button variant="gradient" color="red" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default TournamentDetails; 