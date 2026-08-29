import { useEffect, useState } from 'react';
import AuthPage from './AuthPage.jsx';
import CreateProfile from './CreateProfile.jsx';
import ProfileList from './ProfileList.jsx';
import { getCurrentUser, getStoredUser, logoutUser } from './api.js';

function App() {
  const [user, setUser] = useState(getStoredUser());
  const [view, setView] = useState('create');
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoadingUser(false);
      return;
    }

    getCurrentUser()
      .then((currentUser) => {
        const parsedUser = {
          name: currentUser.name || '',
          email: currentUser.email || '',
          role: currentUser.role || 'USER'
        };
        localStorage.setItem('userName', parsedUser.name);
        localStorage.setItem('userEmail', parsedUser.email);
        localStorage.setItem('userRole', parsedUser.role);
        setUser(parsedUser);
      })
      .catch(() => {
        logoutUser();
        setUser(null);
      })
      .finally(() => setLoadingUser(false));
  }, []);

  if (loadingUser) {
    return <main className="container"><p>Loading session...</p></main>;
  }

  if (!user) {
    return <AuthPage onLogin={setUser} />;
  }

  return (
    <main className="container">
      <header className="topbar">
        <div>
          <h1>Translator Profiles</h1>
          <p>Welcome, {user.name || user.email}</p>
        </div>
        <button type="button" className="logout-button" onClick={() => {
          logoutUser();
          setUser(null);
        }}>Logout</button>
      </header>

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
