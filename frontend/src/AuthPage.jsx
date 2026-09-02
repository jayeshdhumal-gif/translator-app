
import { useState } from 'react';
import { loginUser, registerUser } from './api.js';
import './AuthPage.css';

const initialForm = {
  name: '',
  email: '',
  password: '',
  role: 'USER'
};

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function updateForm(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  }

  function switchMode(newMode) {
    setMode(newMode);
    setMessage('');
    setIsError(false);
    setShowPassword(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage('');
    setIsError(false);
    setIsLoading(true);

    try {
      if (mode === 'register') {
        const response = await registerUser({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role
        });

        setMessage(
          response || 'Account created successfully. Please login.'
        );

        setMode('login');

        setForm({
          ...initialForm,
          email: form.email
        });

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
      setMessage(error.message || 'Something went wrong.');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  const isLogin = mode === 'login';

  return (
    <div className="auth-page">

      {/* Decorative background */}
      <div className="auth-background auth-background-one"></div>
      <div className="auth-background auth-background-two"></div>

      {/* Top branding */}
      <header className="auth-brand">
        <div className="auth-brand-icon">L</div>

        <div>
          <strong>LinguaFlow</strong>
          <span>Translator Network</span>
        </div>
      </header>

      <main className="auth-container">

        {/* Left side */}
        <section className="auth-intro">

          <div className="intro-badge">
            <span>✦</span>
            Language professionals
          </div>

          <h1>
            Your words,
            <br />
            <span>without boundaries.</span>
          </h1>

          <p>
            Connect with translators, create your professional profile,
            and discover language experts from around the world.
          </p>

          <div className="intro-features">

            <div className="intro-feature">
              <div className="feature-icon">🌍</div>
              <div>
                <strong>Global community</strong>
                <span>Connect with language professionals</span>
              </div>
            </div>

            <div className="intro-feature">
              <div className="feature-icon">⚡</div>
              <div>
                <strong>Simple & fast</strong>
                <span>Find the right translator quickly</span>
              </div>
            </div>

            <div className="intro-feature">
              <div className="feature-icon">🔒</div>
              <div>
                <strong>Secure access</strong>
                <span>Your account stays protected</span>
              </div>
            </div>

          </div>

        </section>

        {/* Authentication card */}
        <section className="auth-card">

          <div className="auth-card-header">
            <div className="auth-card-icon">
              {isLogin ? '👋' : '✨'}
            </div>

            <div>
              <h2>
                {isLogin ? 'Welcome back' : 'Create your account'}
              </h2>

              <p>
                {isLogin
                  ? 'Sign in to continue to your workspace.'
                  : 'Join our growing translator community.'}
              </p>
            </div>
          </div>

          {/* Login / Register switch */}
          <div className="auth-toggle">

            <button
              type="button"
              className={isLogin ? 'active' : ''}
              onClick={() => switchMode('login')}
            >
              Login
            </button>

            <button
              type="button"
              className={!isLogin ? 'active' : ''}
              onClick={() => switchMode('register')}
            >
              Register
            </button>

          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            {/* Name */}
            {!isLogin && (
              <label className="auth-field">
                <span className="field-label">Full name</span>

                <div className="input-wrapper">
                  <span className="input-icon">👤</span>

                  <input
                    name="name"
                    value={form.name}
                    onChange={updateForm}
                    required
                    placeholder="Enter your full name"
                    autoComplete="name"
                  />
                </div>
              </label>
            )}

            {/* Email */}
            <label className="auth-field">
              <span className="field-label">Email address</span>

              <div className="input-wrapper">
                <span className="input-icon">✉</span>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={updateForm}
                  required
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            </label>

            {/* Password */}
            <label className="auth-field">
              <span className="field-label">Password</span>

              <div className="input-wrapper">
                <span className="input-icon">🔒</span>

                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={updateForm}
                  required
                  placeholder="Enter your password"
                  autoComplete={
                    isLogin ? 'current-password' : 'new-password'
                  }
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
            </label>

            {/* Role */}
{!isLogin && (
  <label className="auth-field">
    <span className="field-label">I want to register as</span>

    <div className="input-wrapper role-wrapper">
      <span className="input-icon">👤</span>

      <select
        name="role"
        value={form.role}
        onChange={updateForm}
        className="role-select"
        required
      >
        <option value="USER">User</option>
        <option value="TRANSLATOR">Translator</option>
      </select>
    </div>
  </label>
)}

            {/* Login helper */}
            {isLogin && (
              <div className="form-helper">
                <label className="remember-option">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  className="forgot-button"
                  onClick={() =>
                    setMessage(
                      'Password reset is not available yet.'
                    )
                  }
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="auth-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="button-spinner"></span>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                <>
                  {isLogin ? 'Sign in' : 'Create account'}
                  <span className="submit-arrow">→</span>
                </>
              )}
            </button>

            {/* Message */}
            {message && (
              <div
                className={
                  isError
                    ? 'auth-message error'
                    : 'auth-message success'
                }
              >
                <span>
                  {isError ? '!' : '✓'}
                </span>

                <p>{message}</p>
              </div>
            )}

          </form>

          <div className="auth-bottom">
            {isLogin ? (
              <>
                Don't have an account?
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                >
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                >
                  Sign in
                </button>
              </>
            )}
          </div>

        </section>

      </main>

      <footer className="auth-footer">
        <span>© 2026 LinguaFlow</span>
        <span>•</span>
        <span>Language connects us</span>
      </footer>

    </div>
  );
}
