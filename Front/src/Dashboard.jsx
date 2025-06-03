import { useState } from 'react';
import { spotifyAPI } from './api/spotifyAPI';

// Dashboard component serves as the main interface for searching songs on Spotify,
// displaying search results, retrieving available playback devices, and playing selected tracks.
const Dashboard = () => {
    // Array of selectable search types supported by Spotify API.
    const selectTypes = [
        'album',
        'artist',
        'playlist',
        'track',
        'show',
        'episode',
        'audiobook',
    ];

    // State to manage the search input values:
    // 'song' for the search query and 'types' for the selected search category.
    const [search, setSearch] = useState({
        song: '',
        types: '',
    });

    // State to hold the search results returned by the Spotify API.
    const [results, setResults] = useState([]);

    // State to store the Spotify device ID for playback.
    const [deviceId, setDeviceId] = useState(null);

    // Handler for updating the search state when input fields change.
    // It dynamically updates either the 'song' or 'types' field based on the input's name attribute.
    const handleChange = (e) => {
        const { value, name } = e.target;
        const newFom = {
            ...search,
            [name]: value,
        };

        setSearch(newFom);
    };

    // Function to perform the search request to the Spotify API.
    // Validates input fields, constructs query parameters, and updates results state with fetched tracks.
    const handleSearch = async () => {
        // Check if both search song and type are provided.
        if (!search.song || !search.types) {
            alert('Please enter a song and select a type.');
            return;
        }

        // Prepare query parameters for the Spotify search API.
        const params = new URLSearchParams();
        // Use 'remaster track:' prefix to refine search to remastered tracks matching the song title.
        params.append('q', encodeURIComponent(`remaster track:${search.song}`));
        params.append('type', search.types);

        const queryString = params.toString();
        const url = 'https://api.spotify.com/v1/search';

        // Construct full URL with query parameters.
        const updateURL = `${url}?${queryString}`;
        // Retrieve stored Spotify access token from local storage.
        const token = localStorage.getItem('access_token');

        try {
            // Make API call to Spotify using custom spotifyAPI helper.
            const response = await spotifyAPI(updateURL, 'GET', null, token);
            // Check if response contains tracks and update results state accordingly.
            if (response && response.tracks && response.tracks.items) {
                setResults(response.tracks.items);
            } else {
                // Log warning and clear results if no tracks found.
                console.warn("No se encontraron resultados.");
                setResults([]);
            }
        } catch (error) {
            // Log error and clear results in case of request failure.
            console.error("Error al buscar tracks:", error);
            setResults([]);
        }
    };

    // Function to retrieve the user's available Spotify playback devices.
    // Updates deviceId state with the first available device's ID.
    const getDeviceId = async () => {
        // Retrieve access token from local storage.
        const token = localStorage.getItem('access_token');
        const url = "https://api.spotify.com/v1/me/player/devices";

        try {
            // Call Spotify API to get devices.
            const response = await spotifyAPI(url, 'GET', null, token);
            if (response && response.devices && response.devices.length > 0) {
                // Set deviceId to the first available device's ID.
                setDeviceId(response.devices[0].id);
            } else {
                // Warn if no devices are found.
                console.warn("No se encontraron dispositivos.");
            }
        } catch (error) {
            // Log error if request fails.
            console.error("Error al obtener dispositivos:", error);
        }
    };

    // Function to initiate playback of a selected song URI on the specified device.
    const handlePlay = async (song) => {
        // Retrieve access token.
        const token = localStorage.getItem('access_token');
        // Prepare request payload with the song URI.
        const data = {
            uris: [song]
        };

        // Construct URL to play on the selected device.
        const url = `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`;

        try {
            // Make PUT request to Spotify API to start playback.
            const play = await spotifyAPI(url, 'PUT', JSON.stringify(data), token);
            console.log(play);
        } catch (error) {
            // Log any errors during playback.
            console.error("Error al reproducir la canción:", error);
        }
    };

    // JSX to render the dashboard UI.
    return (
      <div style={{
        minHeight: '100vh',
        padding: '40px',
        background: 'linear-gradient(135deg, #121212, #1DB954)',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
        color: 'white'
      }}>
        {/* Main heading */}
        <h1 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '36px' }}>Dashboard</h1>

        {/* Container for search inputs and results */}
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          backgroundColor: '#1e1e1e',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}>
          {/* Search input and controls */}
          <div style={{ marginBottom: '20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
            {/* Text input for song search */}
            <input
              name="song"
              type="text"
              value={search.song}
              onChange={handleChange}
              placeholder="Search song..."
              style={{
                flex: 1,
                padding: '10px 15px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '16px'
              }}
            />
            {/* Dropdown to select search type */}
            <select
              name="types"
              value={search.types}
              onChange={handleChange}
              style={{
                padding: '10px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '16px'
              }}
            >
              {/* Populate options dynamically */}
              {selectTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {/* Button to trigger search */}
            <button
              onClick={handleSearch}
              style={{
                padding: '10px 20px',
                backgroundColor: '#1DB954',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Search
            </button>
          </div>

          {/* Button to fetch and set the Spotify playback device ID */}
          <button
            onClick={getDeviceId}
            style={{
              width: '100%',
              marginBottom: '20px',
              padding: '10px',
              backgroundColor: '#535353',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Get Device ID
          </button>

          {/* Display the current device ID or 'None' if not set */}
          <p style={{ color: '#ccc', textAlign: 'center' }}>Device ID: {deviceId || 'None'}</p>

          {/* Container for displaying search results in a grid layout */}
          <div style={{ display: 'grid', gap: '20px' }}>
            {/* Show message if no results are found */}
            {results.length === 0 && (
              <p style={{ textAlign: 'center', color: '#bbb' }}>
                No results found. Try a different search.
              </p>
            )}
            {/* Map through results and render each item */}
            {results.map((result, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#2a2a2a',
                borderRadius: '8px',
                padding: '10px',
                gap: '20px'
              }}>
                {/* Display album artwork */}
                <img
                  src={result.album.images[0].url}
                  width={80}
                  height={80}
                  alt="Song"
                  style={{ borderRadius: '4px' }}
                />
                {/* Display artist name and song title */}
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
                    {result.artists[0].name}
                  </p>
                  <p style={{ margin: 0, fontSize: '14px', color: '#ccc' }}>
                    {result.name}
                  </p>
                </div>
                {/* Button to play the selected track */}
                <button
                  onClick={() => handlePlay(result.uri)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#1DB954',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Play
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
};

export default Dashboard;