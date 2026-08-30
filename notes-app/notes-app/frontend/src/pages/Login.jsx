import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotebookIcon from '../components/NotebookIcon';
import '../styles/auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-panel">
        <div className="auth-card">
          <div className="auth-brand">
            <NotebookIcon size={34} />
            <span className="auth-brand-name">Notebook</span>
          </div>
          <h1>Welcome back</h1>
          <p className="auth-subtitle">Log in to pick up right where you left off.</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Your password"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? <span className="spinner" /> : 'Log in'}
            </button>
          </form>

          <div className="auth-footer-link">
            Don&apos;t have an account? <Link to="/signup">Sign up</Link>
          </div>
        </div>
      </div>

      <div className="auth-showcase">
        <div className="auth-showcase-content">
          <span className="eyebrow">Welcome back</span>
          <h2>Your notes, exactly where you left them.</h2>
          <p>
            Every note is private to your account, backed by a secure sign-in and kept safely in
            sync across your sessions.
          </p>
        </div>
      </div>
    </div>
  );
}
