import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  TextField,
  Button,
  CircularProgress,
  Container
} from '@mui/material';

const REFRESH_INTERVAL = 5000;

function StationViewer() {
  const [eventId, setEventId] = useState('');
  const [submittedEventId, setSubmittedEventId] = useState(null);
  const [tournamentData, setTournamentData] = useState(null);

  useEffect(() => {
    if (submittedEventId) {
      const interval = setInterval(() => {
        fetchTournaments();
      }, REFRESH_INTERVAL);

      return () => clearInterval(interval);
    }
  }, [submittedEventId]);

  const url = `${import.meta.env.VITE_API_BASE_URL}/stations/${submittedEventId}`;
  console.log(url);

  const fetchTournaments = async () => {
    try {
      const response = await fetch(url);
      console.log('Submitted event ID:', submittedEventId); 
      console.log('Response status:', response.status); 

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (!data.data || !data.data.event || !data.data.event.sets || !data.data.event.sets.nodes) {
        throw new Error('Unexpected data structure from API');
      }

      setTournamentData(data.data);
    } catch (error) {
      console.error('Error fetching tournaments:', error.message);
      setTournamentData(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedEventId(eventId); 
    setEventId(''); 
    console.log('Submitted event ID:', eventId);
  };

  return (
    <Container sx={{ mt: 4 }}>
      {!submittedEventId ? (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant='h3' gutterBottom>Station Viewer</Typography>
          <form onSubmit={handleSubmit} style={{ margin: '20px 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
              <Grid item>
                <TextField
                  label="Enter Event ID"
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item>
                <Button type="submit" variant="contained" color="primary">Submit</Button>
              </Grid>
            </Grid>
          </form>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Warning, this feature is meant for now for TO's and testing purposes only! <br />
            The event ID can be found in the URL of the admin event page on start.gg <br />
            (https://www.start.gg/admin/tournament/tournament-for-testing-1/brackets/1140299/1664029/2480004)<br />
            There, the event ID would be 1140299. (use this number if you wanna test this)
          </Typography>
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant='h4' gutterBottom>Station Viewer</Typography>
          <Typography variant="h5" gutterBottom>
            Current Matches:
          </Typography>
          {tournamentData === null ? (
            <CircularProgress />
          ) : (
            tournamentData.event && tournamentData.event.sets && tournamentData.event.sets.nodes ? (
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {tournamentData.event.sets.nodes.map(({ id, state, station, slots }) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={id}>
                    <Card sx={{ borderColor: state === 2 ? 'white' : state === 6 ? 'orange' : 'inherit', borderWidth: 2, borderStyle: 'solid' }}>
                      <CardContent>
                        <Typography variant="h4" component="div">
                          Station {station.number}
                        </Typography>
                        <Typography variant="h6" component="div" sx={{ color: state === 6 ? 'orange' : 'inherit' }}>
                          {state === 2 ? 'Ongoing' : 'Called'}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 2 }}>
                          <Card sx={{ width: '100%', bgcolor: '#102385', color: 'white' }}>
                            <CardContent>
                              <Typography variant="h6">
                                {slots[0]?.entrant?.name || 'TBD'}
                              </Typography>
                            </CardContent>
                          </Card>
                          <Card sx={{ width: '100%', bgcolor: '#102385', color: 'white' }}>
                            <CardContent>
                              <Typography variant="h6">
                                {slots[1]?.entrant?.name || 'TBD'}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1">
                No data available for this event.
              </Typography>
            )
          )}
        </Box>
      )}
    </Container>
  );
}

export default StationViewer;
