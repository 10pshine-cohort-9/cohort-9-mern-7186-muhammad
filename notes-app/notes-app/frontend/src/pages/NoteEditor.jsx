import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Loader from '../components/Loader';
import { getNoteApi, createNoteApi, updateNoteApi, deleteNoteApi } from '../api/notes.api';
import '../styles/editor.css';

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    ['link'],
    ['clean'],
  ],
};

export default function NoteEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (isNew) return;
    const loadNote = async () => {
      setLoading(true);
      try {
        const res = await getNoteApi(id);
        setTitle(res.data.note.title);
        setContent(res.data.note.content || '');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadNote();
  }, [id, isNew]);

  const handleSave = useCallback(async () => {
    if (!title.trim()) {
      setError('Please give your note a title before saving.');
      return;
    }
    setError('');
    setSaving(true);
    setStatus('');
    try {
      if (isNew) {
        const res = await createNoteApi({ title, content });
        setStatus('Saved');
        navigate(`/notes/${res.data.note.id}`, { replace: true });
      } else {
        await updateNoteApi(id, { title, content });
        setStatus('Saved');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }, [title, content, isNew, id, navigate]);

  const handleDelete = async () => {
    if (isNew) return;
    if (!window.confirm('Delete this note? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await deleteNoteApi(id);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  };

  if (loading) return <Loader label="Opening your note…" dark />;

  return (
    <div className="editor-page">
      <header className="editor-toolbar">
        <div className="container editor-toolbar-inner">
          <div className="editor-toolbar-left">
            <button
              type="button"
              className="editor-back"
              onClick={() => navigate('/dashboard')}
              aria-label="Back to dashboard"
            >
              ←
            </button>
            <input
              className="editor-title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled note"
              maxLength={200}
            />
          </div>
          <div className="editor-toolbar-actions">
            {status && !saving && <span className="editor-status">{status}</span>}
            {!isNew && (
              <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            )}
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/dashboard')}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? <span className="spinner" /> : 'Save note'}
            </button>
          </div>
        </div>
      </header>

      <main className="editor-body container">
        {error && <div className="alert alert-error">{error}</div>}
        <div className="editor-canvas">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={QUILL_MODULES}
            placeholder="Start writing…"
          />
        </div>
      </main>
    </div>
  );
}
