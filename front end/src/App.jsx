import { useState } from 'react';
import CreateProfile from './CreateProfile.jsx';
import ProfileList from './ProfileList.jsx';

function App() {
  const [view, setView] = useState('create');

  return (
    <main className="container">
      <h1>Translator Profiles</h1>
      <p>React frontend connected to the Spring Boot backend.</p>
      <nav className="view-switcher" aria-label="Profile actions">
        <button className={view === 'create' ? 'active' : ''} onClick={() => setView('create')}>Create profile</button>
        <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>Show profiles</button>
      </nav>
      <div className="view">
        {view === 'create' ? <CreateProfile /> : <ProfileList />}
      </div>
    </main>
  );
}

export default App;
