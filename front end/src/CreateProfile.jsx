import { useState } from 'react';
import { createProfile } from './api.js';
import './CreateProfile.css';

const initialForm = { name: '', email: '', phone: '', city: '', languages: '', bio: '', hourlyRate: '' };

export default function CreateProfile() {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');

  function updateForm(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('Saving profile...');
    try {
      await createProfile({
        ...form,
        phone: form.phone || null,
        languages: form.languages.split(',').map((item) => item.trim()).filter(Boolean),
        hourlyRate: Number(form.hourlyRate)
      });
      setForm(initialForm);
      setMessage('Profile created successfully.');
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <form className="create-profile card" onSubmit={handleSubmit}>
      <h2>Create profile</h2>
      <Field label="Name" name="name" value={form.name} onChange={updateForm} required />
      <Field label="Email" name="email" type="email" value={form.email} onChange={updateForm} required />
      <Field label="Phone" name="phone" value={form.phone} onChange={updateForm} />
      <Field label="City" name="city" value={form.city} onChange={updateForm} required />
      <Field label="Languages" name="languages" placeholder="English, Hindi" value={form.languages} onChange={updateForm} required />
      <label>Bio<textarea name="bio" value={form.bio} onChange={updateForm} required /></label>
      <Field label="Hourly rate (INR)" name="hourlyRate" type="number" value={form.hourlyRate} onChange={updateForm} required />
      <button type="submit">Create profile</button>
      {message && <p className="create-message">{message}</p>}
    </form>
  );
}

function Field({ label, name, type = 'text', placeholder, value, onChange, required }) {
  return <label>{label}<input name={name} type={type} placeholder={placeholder} value={value} onChange={onChange} required={required} /></label>;
}
