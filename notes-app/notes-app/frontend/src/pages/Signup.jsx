import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotebookIcon from '../components/NotebookIcon';
import '../styles/auth.css';

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);
    try {
      await register(form);
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
          <h1>Create your account</h1>
          <p className="auth-subtitle">Start capturing your ideas in a private, organized space.</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Muhammad Abdullah"
                required
                minLength={2}
              />
            </div>
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
                placeholder="At least 6 characters"
                required
                minLength={6}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? <span className="spinner" /> : 'Create account'}
            </button>
          </form>

          <div className="auth-footer-link">
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </div>
      </div>

      <div className="auth-showcase">
        <div className="auth-showcase-content">
          <span className="eyebrow">Your private notebook</span>
          <h2>Every idea deserves a page of its own.</h2>
          <p>
            Write, format, and organize your notes with a distraction-free rich text editor —
            synced securely to your account and accessible only to you.
          </p>
        </div>
      </div>
    </div>
  );
}
