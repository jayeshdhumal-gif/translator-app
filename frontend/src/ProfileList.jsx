import { useState } from 'react';
import { getProfiles } from './api.js';
import './ProfileList.css';

export default function ProfileList() {
  const [profiles, setProfiles] = useState([]);
  const [message, setMessage] = useState('');

  async function loadProfiles() {
    setMessage('Loading profiles...');
    try {
      setProfiles(await getProfiles());
      setMessage('');
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <section className="profile-list card">
      <div className="section-heading"><h2>Profiles</h2><button type="button" onClick={loadProfiles}>Load profiles</button></div>
      {message && <p className="list-message">{message}</p>}
      {!profiles.length && <p className="empty">No profiles loaded.</p>}
      {profiles.map((profile) => <article className="profile" key={profile.id}>
        <h3>{profile.name}</h3>
        <p>{profile.city} | {profile.email}</p>
        <p>{profile.bio}</p>
        <small>{profile.languages.join(', ')} | INR {profile.hourlyRate}/hour</small>
      </article>)}
    </section>
  );
}
