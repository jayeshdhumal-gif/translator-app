import { useState } from 'react';
import { loginUser, registerUser } from './api.js';

const initialForm = { name: '', email: '', password: '' };

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  function updateForm(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setIsError(false);

    try {
      if (mode === 'register') {
        const response = await registerUser({
          name: form.name,
          email: form.email,
          password: form.password
        });

        setMessage(response || 'User registered successfully. Please login.');
        setMode('login');
        setForm({ ...initialForm, email: form.email });
        return;
      }

      const response = await loginUser({
        email: form.email,
        password: form.password
      });

      onLogin({
        name: response.name,
        email: response.email,
        role: response.role
      });
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-box">
        <div className="auth-toggle">
          <button
            type="button"
            className={mode === 'login' ? 'active' : ''}
            onClick={() => setMode('login')}
          >Login</button>
          <button
            type="button"
            className={mode === 'register' ? 'active' : ''}
            onClick={() => setMode('register')}
          >Register</button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <label>
              Name
              <input
                name="name"
                value={form.name}
                onChange={updateForm}
                required
                placeholder="Enter your name"
              />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={updateForm}
              required
              placeholder="Enter your email"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={updateForm}
              required
              placeholder="Enter your password"
            />
          </label>

          <button type="submit">{mode === 'login' ? 'Login' : 'Register'}</button>

          {message && (
            <p className={isError ? 'form-message form-error' : 'form-message'}>{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}
