import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotebookIcon from './NotebookIcon';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = (user?.name || '?')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/dashboard" className="navbar-brand">
          <NotebookIcon size={28} />
          <span>Notebook</span>
        </Link>
        <div className="navbar-actions">
          <button
            type="button"
            className="navbar-avatar"
            title={user?.name}
            onClick={() => navigate('/profile')}
            aria-label="Open profile"
            style={{
              background: '#6ee7b7',
              color: '#064e3b',
              border: 'none',
              fontWeight: 700,
            }}
          >
            {initials}
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={handleLogout}
            aria-label="Log out of your account"
            style={{
              background: 'rgba(30, 41, 59, 0.7)',
              borderColor: 'rgba(148, 163, 184, 0.15)',
              color: '#cbd5e1',
              borderRadius: '8px',
              padding: '8px 16px',
            }}
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
