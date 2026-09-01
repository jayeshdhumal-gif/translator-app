
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
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-logo">L</div>
          <div className="loading-spinner"></div>
          <h2>Loading your workspace</h2>
          <p>Please wait a moment...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onLogin={setUser} />;
  }

  const displayName = user.name || user.email?.split('@')[0] || 'User';

  function handleLogout() {
    logoutUser();
    setUser(null);
  }

  return (
    <div className="app-shell">

      {/* Background decoration */}
      <div className="background-glow glow-one"></div>
      <div className="background-glow glow-two"></div>

      <header className="navbar">
        <div className="navbar-inner">

          <div className="brand">
            <div className="brand-icon">L</div>

            <div className="brand-text">
              <span className="brand-name">LinguaFlow</span>
              <span className="brand-tagline">Translator Network</span>
            </div>
          </div>

          <div className="user-area">

            <div className="user-info">
              <div className="user-avatar">
                {displayName.charAt(0).toUpperCase()}
              </div>

              <div className="user-details">
                <strong>{displayName}</strong>
                <span>{user.role}</span>
              </div>
            </div>

            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              <span>↪</span>
              Logout
            </button>

          </div>

        </div>
      </header>

      <main className="main-container">

        {/* Hero section */}
        <section className="hero-section">

          <div className="hero-badge">
            <span className="status-dot"></span>
            Translator community
          </div>

          <h1>
            Connect with
            <span> language experts.</span>
          </h1>

          <p>
            Create your translator profile, discover talented professionals,
            and connect with people who speak your language.
          </p>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-icon">🌍</span>
              <div>
                <strong>Multiple</strong>
                <small>Languages</small>
              </div>
            </div>

            <div className="hero-stat">
              <span className="stat-icon">⚡</span>
              <div>
                <strong>Fast</strong>
                <small>Connections</small>
              </div>
            </div>

            <div className="hero-stat">
              <span className="stat-icon">🔒</span>
              <div>
                <strong>Secure</strong>
                <small>Platform</small>
              </div>
            </div>
          </div>

        </section>

        {/* Navigation */}
        <nav className="view-switcher" aria-label="Profile actions">

          <button
            type="button"
            className={view === 'create' ? 'active' : ''}
            onClick={() => setView('create')}
          >
            <span className="nav-icon">＋</span>
            Create Profile
          </button>

          <button
            type="button"
            className={view === 'list' ? 'active' : ''}
            onClick={() => setView('list')}
          >
            <span className="nav-icon">◉</span>
            Explore Profiles
          </button>

        </nav>

        {/* Current page */}
        <section className="content-section">
          {view === 'create' ? <CreateProfile /> : <ProfileList />}
        </section>

      </main>

      <footer className="app-footer">
        <p>
          © 2026 LinguaFlow · Built for language professionals
        </p>
      </footer>

    </div>
  );
}

export default App;

