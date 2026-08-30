export default function Loader({ label = 'Loading…', dark = false }) {
  return (
    <div className="page-loading">
      <span className={`spinner ${dark ? 'spinner-dark' : ''}`} />
      <span>{label}</span>
    </div>
  );
}
