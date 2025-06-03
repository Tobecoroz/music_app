import './App.css';
import { getToken } from './getToken';
import { useNavigate } from 'react-router';

import { useEffect } from 'react';

import { authFlow, getDataAuth } from './setup';

function App() {
  const navigate = useNavigate();

  const handleSetup = async () => {
    const code = await getDataAuth();
    authFlow(code)
  };

  const handleGetToken = () => {
    getToken();
    navigate('/dashboard')
  };

  const getUsers = async() => {
  const url = "http://localhost:3000/api/users";
   const res = await spotifyAPI(url, 'GET', null);
   console.log(res);
 }

  useEffect(() => {
    getUsers();
  }, [])

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #1DB954, #191414)',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '50px 40px',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        width: '100%',
        maxWidth: '500px',
        margin: '0 20px',
        textAlign: 'center',
      }}>
        <h1 style={{
          marginBottom: '30px',
          color: '#191414',
          fontSize: '28px',
          fontWeight: '600'
        }}>
          Spotify Auth Portal
        </h1>
        <button
          onClick={handleSetup}
          style={{
            padding: '14px',
            marginBottom: '20px',
            width: '100%',
            backgroundColor: '#1DB954',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
        >
          Start Setup
        </button>
        <button
          onClick={handleGetToken}
          style={{
            padding: '14px',
            width: '100%',
            backgroundColor: '#191414',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
        >
          Get Token
        </button>
      </div>
    </div>
  );
}

export default App;