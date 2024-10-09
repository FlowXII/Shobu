import { useState } from 'react';

const useTournamentData = (videogameOptions) => {
  const [cCode, setCCode] = useState("FR");
  const [perPage, setPerPage] = useState("64");
  const [videogameId, setVideogameId] = useState("1386");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [boxArt, setBoxArt] = useState(null);

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
      console.log('Received data:', result);
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
      setData(result.data);
      console.log('Set data:', result.data);

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

  return {
    cCode, setCCode,
    perPage, setPerPage,
    videogameId, setVideogameId,
    loading, error, data, boxArt,
    handleFormSubmit
  };
};

export default useTournamentData;
