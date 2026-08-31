import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = (user?.name || '?')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
    : null;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <Navbar />
      <main className="container" style={{ maxWidth: 580, paddingTop: 48, paddingBottom: 60 }}>
        <span className="eyebrow">Profile</span>
        <h1 style={{ marginBottom: 28, fontSize: 30 }}>Your account</h1>

        <div className="profile-card">
          <div className="profile-header">
            <div
              className="profile-avatar"
              style={{
                background: '#6ee7b7',
                color: '#064e3b',
                border: 'none',
                fontWeight: 700,
              }}
            >
              {initials}
            </div>
            <div>
              <h3 style={{ marginBottom: 4, fontSize: 18, color: 'var(--color-ink)' }}>{user?.name}</h3>
              <span className="text-muted" style={{ fontSize: 13.5 }}>{user?.email}</span>
            </div>
          </div>

          <div className="field">
            <label>Full name</label>
            <input value={user?.name || ''} disabled />
          </div>
          <div className="field">
            <label>Email address</label>
            <input value={user?.email || ''} disabled />
          </div>
          {memberSince && (
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Member since</label>
              <input value={memberSince} disabled />
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => navigate('/dashboard')}
          >
            ← Back to dashboard
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleLogout}
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              borderColor: 'rgba(239, 68, 68, 0.25)',
              color: '#f87171',
            }}
          >
            Log out
          </button>
        </div>
      </main>
    </>
  );
}
