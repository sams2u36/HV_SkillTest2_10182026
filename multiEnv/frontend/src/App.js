import React, { useState, useEffect } from 'react';

function App() {
  const path = window.location.pathname;
  const initialEnv = path.includes('/prod') ? 'prod' : 'dev';

  const [env, setEnv] = useState(initialEnv);
  const [tickets, setTickets] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(false);

  // This makes sure the browser makes HTTP requests directly to your EC2 Public IP
  const hostIP = window.location.hostname;
  const DEV_URL = `http://${hostIP}:3001`;
  const PROD_URL = `http://${hostIP}:3002`;
  const currentBackend = env === 'dev' ? DEV_URL : PROD_URL;

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${currentBackend}/api/tickets`);
      const data = await response.json();
      setTickets(data.tickets || []);
    } catch (err) {
      console.error('Error connecting to backend:', err);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [env]);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      const response = await fetch(`${currentBackend}/api/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle })
      });
      if (response.ok) {
        setNewTitle('');
        fetchTickets();
      }
    } catch (err) { console.error('Error posting ticket:', err); }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Ticket Control Dashboard</h2>
      <p>Current Browser Route Profile: <code>{path}</code></p>

      <div style={{ margin: '20px 0', padding: '15px', background: '#f4f4f9', borderRadius: '5px' }}>
        <button onClick={() => { setEnv('dev'); window.history.pushState({}, '', '/dev'); }} style={{ marginRight: '10px', padding: '10px', background: env === 'dev' ? '#007bff' : '#6c757d', color: '#fff', border:
 'none', borderRadius: '3px', cursor: 'pointer' }}>
          Dev Environment (Port 3001)
        </button>
        <button onClick={() => { setEnv('prod'); window.history.pushState({}, '', '/prod'); }} style={{ padding: '10px', background: env === 'prod' ? '#dc3545' : '#6c757d', color: '#fff', border: 'none', borderRad
ius: '3px', cursor: 'pointer' }}>
          Prod Environment (Port 3002)
        </button>
      </div>

      <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '5px' }}>
        <h3>Active Target: {env.toUpperCase()} Environment</h3>
        <form onSubmit={handleCreateTicket} style={{ marginBottom: '20px' }}>
          <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Enter new ticket description..." style={{ width: '70%', padding: '8px', marginRight: '10px' }} />
          <button type="submit" style={{ padding: '8px 15px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '3px' }}>Submit Ticket</button>
        </form>

        {loading ? <p>Loading data from backend...</p> : (
          <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
            {tickets.map(t => (
              <li key={t.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                <b>#{t.id}</b> {t.title} — <span style={{ color: t.status === 'Open' ? 'green' : 'orange' }}>[{t.status}]</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
export default App;

