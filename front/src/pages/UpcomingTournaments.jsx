import React, { useState } from 'react';
import { Card, CardBody, Input, Select, Option, Button, Typography } from '@material-tailwind/react';

function UpcomingTournaments() {
  const [cCode, setCCode] = useState("FR");  // Changed setCode to setCCode and set default to "FR"
  const [perPage, setPerPage] = useState("64");
  const [videogameId, setVideogameId] = useState("1386"); // Default to Super Smash Bros Ultimate ID
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  // Remove the type annotation
  const [data, setData] = useState(null);  // Remove the type annotation here as well

  // Options for videogame IDs
  const videogameOptions = [
    { id: "1386", name: "Super Smash Bros Ultimate" },
    { id: "43868", name: "Street Fighter 6" },
    { id: "33945", name: "Guilty Gear -STRIVE-" },
    { id: "49783", name: "Tekken 8" },
    { id: "287", name: "Dragon Ball FighterZ" },
    { id: "1", name: "Super Smash Bros Melee" },
    { id: "48548", name: "Granblue Fantasy Versus: Rising" },
    { id: "48559", name: "Mortal Kombat 1" },
    { id: "36963", name: "The King of Fighters XV" },
    { id: "36865", name: "Melty Blood - Type Lumina -" },
    { id: "50203", name: "Under Night In-Birth II Sys:Celes" }, 
  ];

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const url = `${import.meta.env.VITE_API_BASE_URL}/tournaments/upcoming`;
    console.log('url in env', import.meta.env.VITE_API_BASE_URL);
    console.log('Sending request with:', { cCode, perPage, videogameId });
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cCode, perPage, videogameId }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const result = await response.json();
      console.log('Received data:', result); // Add this line
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
      setData(result.data);
      console.log('Set data:', result.data); // Add this line
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 h-full w-full bg-gray-900 text-white flex items-center justify-center p-4 overflow-auto">
      <Card className="w-full max-w-4xl bg-gray-800 p-6 rounded-lg shadow-lg">
        <CardBody>
          <Typography variant="h4" color="yellow" className="mb-6 text-center">Upcoming Tournaments</Typography>
          <form onSubmit={handleFormSubmit} className="mb-6">
            <div className="flex flex-col gap-4">
              <Input
                label="Country Code"
                value={cCode}
                onChange={(e) => setCCode(e.target.value)}  // Changed setCode to setCCode
                color="yellow"
                className="text-white"
              />
              <Input
                label="Maximum Displayed"
                type="number"
                value={perPage}
                onChange={(e) => setPerPage(e.target.value)}
                color="yellow"
                className="text-white"
              />
              <Select
                label="Select Game"
                value={videogameId}
                onChange={(value) => setVideogameId(value || "")}
                color="yellow"
              >
                {videogameOptions.map((option) => (
                  <Option key={option.id} value={option.id}>
                    {option.name}
                  </Option>
                ))}
              </Select>
              <Button type="submit" color="yellow" ripple={true} disabled={loading}>
                {loading ? 'Loading...' : 'Submit'}
              </Button>
            </div>
          </form>
          {error && (
            <Typography color="red" className="mb-4">
              Error: {error}
              <br />
              Please check the console for more details.
            </Typography>
          )}
          {loading && (
            <Typography color="blue" className="mb-4">Loading tournaments...</Typography>
          )}
          {data && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.tournaments && data.tournaments.nodes ? (
                data.tournaments.nodes.map((tournament) => (
                  <Card key={tournament.id} className="bg-gray-700 p-4 rounded-lg">
                    <Typography variant="h6" color="yellow" className="cursor-pointer mb-2" onClick={() => window.open(`http://start.gg/${tournament.slug}`, '_blank')}>
                      {tournament.name}
                    </Typography>
                    <Typography color="gray" className="text-sm"><strong>Start Date:</strong> {new Date(tournament.startAt * 1000).toLocaleDateString()}</Typography>
                    <Typography color="gray" className="text-sm"><strong>End Date:</strong> {new Date(tournament.endAt * 1000).toLocaleDateString()}</Typography>
                    <Typography color="gray" className="text-sm"><strong>Venue Address:</strong> {tournament.venueAddress}</Typography>
                    <Typography color="gray" className="text-sm"><strong>City:</strong> {tournament.city}</Typography>
                    <Typography color="gray" className="text-sm"><strong>Country Code:</strong> {tournament.countryCode}</Typography>
                    {tournament.countryCode === 'US' && tournament.state && (
                      <Typography color="gray" className="text-sm"><strong>State:</strong> {tournament.state}</Typography>
                    )}
                  </Card>
                ))
              ) : (
                <Typography color="red">No tournaments found or unexpected data structure.</Typography>
              )}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default UpcomingTournaments;