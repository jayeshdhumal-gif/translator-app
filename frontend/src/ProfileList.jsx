
import { useState } from 'react';
import { getProfiles } from './api.js';
import './ProfileList.css';

export default function ProfileList() {
  const [profiles, setProfiles] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function loadProfiles() {
    setMessage('');
    setIsLoading(true);

    try {
      const data = await getProfiles();
      setProfiles(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage(error.message || 'Unable to load profiles.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="profile-list modern-card">

      <div className="profiles-header">

        <div>
          <span className="section-label">
            TRANSLATOR NETWORK
          </span>

          <h2>Explore translators</h2>

          <p>
            Discover language professionals and their expertise.
          </p>
        </div>

        <button
          type="button"
          className="load-profiles-button"
          onClick={loadProfiles}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="list-spinner"></span>
              Loading...
            </>
          ) : (
            <>
              <span>↻</span>
              Load profiles
            </>
          )}
        </button>

      </div>

      {message && (
        <div className="list-message error">
          <span>!</span>
          {message}
        </div>
      )}

      {!profiles.length && !isLoading && !message && (
        <div className="empty-profiles">

          <div className="empty-icon">
            🌍
          </div>

          <h3>No profiles loaded yet</h3>

          <p>
            Click "Load profiles" to discover translators.
          </p>

        </div>
      )}

      {isLoading && (
        <div className="profile-loading">
          <div className="large-spinner"></div>
          <p>Finding translator profiles...</p>
        </div>
      )}

      {!isLoading && profiles.length > 0 && (
        <div className="profiles-grid">

          {profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
            />
          ))}

        </div>
      )}

    </section>
  );
}


function ProfileCard({ profile }) {

  const name = profile.name || 'Translator';

  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();

  const languages = Array.isArray(profile.languages)
    ? profile.languages
    : [];

  return (
    <article className="translator-card">

      <div className="translator-card-top">

        <div className="translator-avatar">
          {initials || 'T'}
        </div>

        <div className="translator-availability">
          <span></span>
          Available
        </div>

      </div>

      <div className="translator-info">

        <h3>{name}</h3>

        <p className="translator-location">
          <span>📍</span>
          {profile.city || 'Location not provided'}
        </p>

      </div>

      <p className="translator-bio">
        {profile.bio || 'Professional translator.'}
      </p>

      {languages.length > 0 && (
        <div className="language-tags">

          {languages.slice(0, 4).map((language, index) => (
            <span key={`${language}-${index}`}>
              {language}
            </span>
          ))}

          {languages.length > 4 && (
            <span className="more-languages">
              +{languages.length - 4}
            </span>
          )}

        </div>
      )}

      <div className="translator-card-footer">

        <div className="translator-rate">
          <small>HOURLY RATE</small>

          <strong>
            ₹{profile.hourlyRate || 0}
          </strong>

          <span>/hr</span>
        </div>

        <button
          type="button"
          className="view-profile-button"
        >
          View
          <span>→</span>
        </button>

      </div>

    </article>
  );
}

