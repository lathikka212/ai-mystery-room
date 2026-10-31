import React, { useState, useEffect } from 'react';
import { checkBackend, sendGameAction } from './services/api';
import './App.css';

function App() {
  const [backendStatus, setBackendStatus] = useState('Connecting to backend...');
  const [roomState, setRoomState] = useState({
    title: 'The Abandoned Study',
    description: 'You wake up in a dimly lit Victorian study. Dust motes dance in the moonlight filtering through barred windows. A heavy oak desk sits in the center with a flickering candle and an old typewriter.',
    clues: ['A locked brass drawer', 'A torn journal page on the floor', 'A grandfather clock stuck at 3:15'],
    inventory: []
  });
  const [playerInput, setPlayerInput] = useState('');
  const [chatLog, setChatLog] = useState([
    { sender: 'Game Master', text: 'Welcome to the Mystery Room. Examine your surroundings carefully. What would you like to do?' }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkBackend().then(data => {
      if (data) {
        setBackendStatus(data.message);
      } else {
        setBackendStatus('Backend offline - check server terminal');
      }
    });
  }, []);

  const handleAction = async (e) => {
    e.preventDefault();
    if (!playerInput.trim() || loading) return;

    const actionText = playerInput;
    setPlayerInput('');
    
    // Add player action to chat
    const updatedChat = [...chatLog, { sender: 'You', text: actionText }];
    setChatLog(updatedChat);
    setLoading(true);

    // Call Gemini via backend
    const aiReply = await sendGameAction(actionText, roomState, updatedChat);

    setChatLog(prev => [
      ...prev,
      { sender: 'Game Master', text: aiReply }
    ]);
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', backgroundColor: '#121212', color: '#e0e0e0', minHeight: '100vh', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '15px', marginBottom: '20px' }}>
        <h1 style={{ margin: 0, color: '#ffb74d' }}>🕵️‍♂️ AI Mystery Room</h1>
        <span style={{ fontSize: '0.85rem', color: backendStatus.includes('Running') ? '#81c784' : '#e57373' }}>
          ● {backendStatus}
        </span>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Left Column: Room View & Chat */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
            <h2 style={{ marginTop: 0, color: '#90caf9' }}>{roomState.title}</h2>
            <p style={{ lineHeight: '1.6', fontSize: '1.1rem' }}>{roomState.description}</p>
          </div>

          <div style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '8px', border: '1px solid #333', height: '350px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginTop: 0, fontSize: '1rem', color: '#b0bec5' }}>Investigation Log</h3>
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '15px', paddingRight: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {chatLog.map((msg, idx) => (
                <div key={idx} style={{ padding: '10px 14px', borderRadius: '6px', backgroundColor: msg.sender === 'You' ? '#2c3e50' : '#2d2d2d', alignSelf: msg.sender === 'You' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                  <strong style={{ fontSize: '0.8rem', color: msg.sender === 'You' ? '#64b5f6' : '#ffb74d' }}>{msg.sender}:</strong>
                  <div style={{ marginTop: '4px' }}>{msg.text}</div>
                </div>
              ))}
              {loading && (
                <div style={{ padding: '10px 14px', borderRadius: '6px', backgroundColor: '#2d2d2d', alignSelf: 'flex-start', color: '#aaa', fontStyle: 'italic' }}>
                  Game Master is thinking...
                </div>
              )}
            </div>

            <form onSubmit={handleAction} style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                value={playerInput}
                onChange={(e) => setPlayerInput(e.target.value)}
                placeholder="Type your action (e.g., 'Inspect the desk drawer')..."
                disabled={loading}
                style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#2a2a2a', color: '#fff', fontSize: '1rem' }}
              />
              <button type="submit" disabled={loading} style={{ padding: '0 20px', backgroundColor: '#1976d2', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                {loading ? '...' : 'Action'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Clues & Inventory */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
            <h3 style={{ marginTop: 0, color: '#ffb74d' }}>🔍 Visible Clues</h3>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
              {roomState.clues.test ? roomState.clues.map((c, i) => <li key={i}>{c}</li>) : roomState.clues.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>

          <div style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
            <h3 style={{ marginTop: 0, color: '#81c784' }}>🎒 Inventory</h3>
            <p style={{ color: '#888', fontStyle: 'italic' }}>Your pockets are currently empty.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;