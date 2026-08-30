export default function NotebookIcon({ size = 28, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
      aria-label="Notebook icon"
    >
      <defs>
        <linearGradient id="nbCover" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="45%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="nbSpine" x1="0" y1="0" x2="10" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#064e3b" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="nbHighlight" x1="0" y1="0" x2="0" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Main cover */}
      <rect x="4" y="3" width="24" height="26" rx="4.5" fill="url(#nbCover)" />
      {/* Top light reflection */}
      <rect x="4" y="3" width="24" height="26" rx="4.5" fill="url(#nbHighlight)" />
      {/* Left dark spine */}
      <path d="M4 7.5C4 5.01472 6.01472 3 8.5 3H10V29H8.5C6.01472 29 4 26.9853 4 24.5V7.5Z" fill="url(#nbSpine)" />
      {/* Spine seam line */}
      <line x1="10" y1="3" x2="10" y2="29" stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
      {/* Hanging mint bookmark ribbon */}
      <path d="M15 3V12L17.5 10.2L20 12V3H15Z" fill="#a7f3d0" />
      {/* Subtle notebook page lines */}
      <line x1="14" y1="17" x2="22" y2="17" stroke="rgba(255,255,255,0.5)" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="14" y1="21" x2="19" y2="21" stroke="rgba(255,255,255,0.35)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
