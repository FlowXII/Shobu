import React, { useState, useEffect } from 'react';
import { Card, CardBody, Input, Select, Option, Button, Typography } from '@material-tailwind/react';
import SSBUBoxArt from  "../assets/img/SSBUBoxArt.jpg";
import SF6BoxArt from "../assets/img/SF6BoxArt.jpg";
import Tekken8BoxArt from "../assets/img/Tekken8BoxArt.jpg";
import DBFZBoxArt from "../assets/img/DBFZBoxArt.jpg";

function UpcomingTournaments() {
  const [cCode, setCCode] = useState("FR");
  const [perPage, setPerPage] = useState("64");
  const [videogameId, setVideogameId] = useState("1386");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [boxArt, setBoxArt] = useState(null);

  const videogameOptions = [
    { id: "1386", name: "Super Smash Bros Ultimate", image: SSBUBoxArt },
    { id: "43868", name: "Street Fighter 6", image: SF6BoxArt },
    { id: "33945", name: "Guilty Gear -STRIVE-", image: null },
    { id: "49783", name: "Tekken 8", image: Tekken8BoxArt },
    { id: "287", name: "Dragon Ball FighterZ", image: DBFZBoxArt },
    { id: "1", name: "Super Smash Bros Melee", image: null },
    { id: "48548", name: "Granblue Fantasy Versus: Rising", image: null },
    { id: "48559", name: "Mortal Kombat 1", image: null },
    { id: "36963", name: "The King of Fighters XV", image: null },
    { id: "36865", name: "Melty Blood - Type Lumina -", image: null },
    { id: "50203", name: "Under Night In-Birth II Sys:Celes", image: null },
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

      // Set box art only after successfully fetching data
      const game = videogameOptions.find(option => option.id === videogameId);
      setBoxArt(game ? game.image : null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen w-screen bg-gradient-to-r from-blue-900 via-purple-900 to-red-900 p-4 overflow-auto">
      <Card className="w-full max-w-4xl bg-gray-900 p-6 rounded-lg shadow-lg mb-6">
        <CardBody>
          <Typography variant="h4" className="mb-6 text-center text-red-700 font-bold">Upcoming Tournaments</Typography>
          <form onSubmit={handleFormSubmit} className="mb-6">
            <div className="flex flex-col gap-4">
              <Input
                label="Country Code"
                value={cCode}
                onChange={(e) => setCCode(e.target.value)}
                color="red"
                className="text-white"
              />
              <Input
                label="Maximum Displayed"
                type="number"
                value={perPage}
                onChange={(e) => setPerPage(e.target.value)}
                color="red"
                className="text-white"
              />
              <Select
                label="Select Game"
                value={videogameId}
                onChange={(value) => setVideogameId(value || "")}
                color="red"
              >
                {videogameOptions.map((option) => (
                  <Option key={option.id} value={option.id}>
                    {option.name}
                  </Option>
                ))}
              </Select>
              <Button type="submit" color="red" ripple={true} disabled={loading}>
                {loading ? 'Loading...' : 'Submit'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {error && (
        <Typography className="mb-4 text-red-700">
          Error: {error}
          <br />
          Please check the console for more details.
        </Typography>
      )}
      {loading && (
        <Typography className="mb-4 text-blue-500">Loading tournaments...</Typography>
      )}
      {data && (
        <div className="w-full max-w-4xl">
          {data.tournaments && data.tournaments.nodes ? (
            data.tournaments.nodes.map((tournament) => (
              <Card key={tournament.id} className="bg-gray-900 p-4 rounded-lg mb-4 flex flex-col">
                <div className="flex">
                  {tournament.images && tournament.images.length > 0 && (
                    <img src={tournament.images[0].url} alt={tournament.name} className="w-52 h-52 object-contain rounded-lg mr-4" />
                  )}
                  <div className="flex flex-col justify-between">
                    <Typography variant="h5" className="cursor-pointer mb-2 text-red-700 font-semibold text-lg" onClick={() => window.open(`http://start.gg/${tournament.slug}`, '_blank')}>
                      {tournament.name}
                    </Typography>
                    <Typography className="text-white text-lg"><strong>Start Date:</strong> {new Date(tournament.startAt * 1000).toLocaleDateString()}</Typography>
                    <Typography className="text-white text-lg"><strong>City:</strong> {tournament.city}</Typography>
                    <Typography className="text-white text-lg"><strong>Number of Attendees:</strong> {tournament.numAttendees}</Typography>
                  </div>
                </div>
                {tournament.events && tournament.events.length > 0 && (
                  <div className="mt-4">
                    <Typography variant="h6" className="text-red-700 font-semibold text-lg">Events:</Typography>
                    {tournament.events.map((event, index) => (
                      <Card key={index} className="bg-gray-800 p-4 rounded-lg mt-2">
                        <div className="flex">
                          {boxArt && (
                            <img src={boxArt} alt={event.name} className="w-32 h-32 object-contain rounded-lg mr-4" />
                          )}
                          <div className="flex flex-col justify-between">
                            <Typography className="text-white text-lg"><strong>Event Name:</strong> {event.name}</Typography>
                            <Typography className="text-white text-lg"><strong>Number of Entrants:</strong> {event.numEntrants}</Typography>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </Card>
            ))
          ) : (
            <Typography className="text-red-700">No tournaments found or unexpected data structure.</Typography>
          )}
        </div>
      )}
    </div>
  );
}

export default UpcomingTournaments;