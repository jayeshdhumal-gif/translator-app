
import { useState } from 'react';
import { createProfile } from './api.js';
import './CreateProfile.css';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  city: '',
  languages: '',
  bio: '',
  hourlyRate: ''
};

export default function CreateProfile() {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function updateForm(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage('');
    setIsError(false);
    setIsLoading(true);

    try {
      await createProfile({
        ...form,
        phone: form.phone || null,
        languages: form.languages
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        hourlyRate: Number(form.hourlyRate)
      });

      setForm(initialForm);
      setMessage('Your translator profile was created successfully.');
    } catch (error) {
      setIsError(true);
      setMessage(error.message || 'Unable to create profile.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      className="create-profile modern-card"
      onSubmit={handleSubmit}
    >
      <div className="profile-form-header">
        <div className="form-header-icon">
          👤
        </div>

        <div>
          <span className="section-label">YOUR PROFILE</span>
          <h2>Create your translator profile</h2>
          <p>
            Tell clients and other translators a little about yourself.
          </p>
        </div>
      </div>

      {/* Personal information */}
      <div className="form-section">

        <div className="form-section-title">
          <span>01</span>
          <div>
            <strong>Personal information</strong>
            <small>Your basic contact details</small>
          </div>
        </div>

        <div className="form-grid">

          <Field
            label="Full name"
            name="name"
            value={form.name}
            onChange={updateForm}
            placeholder="e.g. Rahul Sharma"
            required
          />

          <Field
            label="Email address"
            name="email"
            type="email"
            value={form.email}
            onChange={updateForm}
            placeholder="you@example.com"
            required
          />

          <Field
            label="Phone number"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={updateForm}
            placeholder="+91 98765 43210"
          />

          <Field
            label="City"
            name="city"
            value={form.city}
            onChange={updateForm}
            placeholder="e.g. Mumbai"
            required
          />

        </div>
      </div>

      {/* Languages */}
      <div className="form-section">

        <div className="form-section-title">
          <span>02</span>
          <div>
            <strong>Languages</strong>
            <small>Languages you can translate</small>
          </div>
        </div>

        <label className="modern-field full-field">
          <span>Languages</span>

          <div className="input-with-icon">
            <span>🌍</span>

            <input
              name="languages"
              value={form.languages}
              onChange={updateForm}
              placeholder="English, Hindi, Marathi"
              required
            />
          </div>

          <small className="field-hint">
            Separate multiple languages with commas.
          </small>
        </label>

        {form.languages && (
          <div className="language-preview">
            {form.languages
              .split(',')
              .map((language) => language.trim())
              .filter(Boolean)
              .map((language, index) => (
                <span key={`${language}-${index}`}>
                  {language}
                </span>
              ))}
          </div>
        )}

      </div>

      {/* About */}
      <div className="form-section">

        <div className="form-section-title">
          <span>03</span>
          <div>
            <strong>About you</strong>
            <small>Introduce yourself</small>
          </div>
        </div>

        <label className="modern-field full-field">
          <span>Professional bio</span>

          <textarea
            name="bio"
            value={form.bio}
            onChange={updateForm}
            placeholder="Tell people about your translation experience, expertise and languages..."
            required
          />

          <small className="field-hint">
            A short, professional introduction works best.
          </small>
        </label>

      </div>

      {/* Pricing */}
      <div className="form-section">

        <div className="form-section-title">
          <span>04</span>
          <div>
            <strong>Your rate</strong>
            <small>Set your hourly translation rate</small>
          </div>
        </div>

        <label className="modern-field rate-field">
          <span>Hourly rate</span>

          <div className="rate-input">
            <span>₹</span>

            <input
              name="hourlyRate"
              type="number"
              min="0"
              step="1"
              value={form.hourlyRate}
              onChange={updateForm}
              placeholder="500"
              required
            />

            <span className="rate-suffix">/ hour</span>
          </div>
        </label>

      </div>

      {/* Submit */}
      <div className="profile-form-footer">

        {message && (
          <div
            className={
              isError
                ? 'profile-form-message error'
                : 'profile-form-message success'
            }
          >
            <span>{isError ? '!' : '✓'}</span>
            <p>{message}</p>
          </div>
        )}

        <button
          type="submit"
          className="create-profile-button"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="create-spinner"></span>
              Creating profile...
            </>
          ) : (
            <>
              Create profile
              <span>→</span>
            </>
          )}
        </button>

      </div>

    </form>
  );
}

function Field({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  required
}) {
  return (
    <label className="modern-field">
      <span>{label}</span>

      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </label>
  );
}

