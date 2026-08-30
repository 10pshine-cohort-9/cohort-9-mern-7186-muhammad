const stripHtml = (html = '') => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

// Modern accent colors matching the reference screenshot design
const PALETTE = ['#3B82F6', '#F59E0B', '#10B981', '#8B5CF6', '#EC4899', '#06B6D4', '#6366F1', '#14B8A6'];

const getColorForNote = (note) => {
  const str = String(note.id || note.title || 'note');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PALETTE.length;
  return PALETTE[index];
};

export default function NoteCard({ note, onOpen, onTogglePin }) {
  const preview = stripHtml(note.content) || 'No content yet…';
  const accentColor = getColorForNote(note);

  return (
    <div
      className={`note-card ${note.isPinned ? 'pinned' : ''}`}
      onClick={() => onOpen(note.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpen(note.id)}
      style={{
        '--card-glow': `${accentColor}cc`,
        '--card-glow-shadow': `${accentColor}25`,
        '--card-glow-hover': `${accentColor}45`,
        borderColor: `${accentColor}30`,
      }}
    >
      <div className="note-card-top">
        <h3>{note.title}</h3>
      </div>
      <p className="note-card-preview">{preview}</p>

      <div className="note-card-footer">
        <span className="note-card-date">{formatDate(note.updatedAt)}</span>
        <button
          type="button"
          className={`note-card-pin ${note.isPinned ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(note);
          }}
          title={note.isPinned ? 'Unpin note' : 'Pin note'}
          aria-label={note.isPinned ? 'Unpin note' : 'Pin note'}
        >
          {note.isPinned ? '★' : '☆'}
        </button>
      </div>
    </div>
  );
}
