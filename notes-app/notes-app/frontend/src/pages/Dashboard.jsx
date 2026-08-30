import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import NoteCard from '../components/NoteCard';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { getNotesApi, updateNoteApi } from '../api/notes.api';
import '../styles/dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotes = useCallback(async (term) => {
    setLoading(true);
    setError('');
    try {
      const res = await getNotesApi(term);
      setNotes(res.data.notes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search input so we don't hit the API on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => fetchNotes(search), 300);
    return () => clearTimeout(timer);
  }, [search, fetchNotes]);

  const handleTogglePin = async (note) => {
    // Optimistic update for a snappy feel
    setNotes((prev) => prev.map((n) => (n.id === note.id ? { ...n, isPinned: !n.isPinned } : n)));
    try {
      await updateNoteApi(note.id, { isPinned: !note.isPinned });
    } catch {
      setNotes((prev) => prev.map((n) => (n.id === note.id ? { ...n, isPinned: note.isPinned } : n)));
    }
  };

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <>
      <Navbar />
      <main className="container">
        <div className="dash-header">
          <div>
            <span className="eyebrow">Dashboard</span>
            <h1>Hi {firstName}, here are your notes</h1>
          </div>
          <SearchBar value={search} onChange={setSearch} />
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <Loader label="Loading your notes…" dark />
        ) : (
          <div className="notes-grid">
            <div className="new-note-card" onClick={() => navigate('/notes/new')} role="button" tabIndex={0}>
              <span className="new-note-card-icon">+</span>
              <span>New note</span>
            </div>

            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onOpen={(id) => navigate(`/notes/${id}`)}
                onTogglePin={handleTogglePin}
              />
            ))}

            {notes.length === 0 && (
              <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                {search ? (
                  <>
                    <h3>No notes match &quot;{search}&quot;</h3>
                    <p>Try a different search term.</p>
                  </>
                ) : (
                  <>
                    <h3>Your notebook is empty</h3>
                    <p>Create your first note to get started.</p>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
