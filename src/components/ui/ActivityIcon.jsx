// Hand-drawn line icons for the nine resort activities (48 x 48 grid, 1.25 stroke).
// Custom SVG instead of a library so every activity has a fitting icon and no import can break.
const ICONS = {
  football: (
    <>
      <circle cx="24" cy="24" r="17" />
      <path d="M24 17l6.7 4.9-2.6 7.7h-8.2l-2.6-7.7z" />
      <path d="M24 17V8M30.7 21.9L39 19M28.1 29.6L33 37M19.9 29.6L15 37M17.3 21.9L9 19" />
    </>
  ),
  volleyball: (
    <>
      <circle cx="24" cy="24" r="17" />
      <path d="M8 19c9 2 17-1 22-11" />
      <path d="M24 41c-2-9 4-17 16-19" />
      <path d="M10 35c6-3 10-9 9-19" />
    </>
  ),
  badminton: (
    <>
      <circle cx="24" cy="38" r="4" />
      <path d="M20.5 35L14 9M27.5 35L34 9M24 34V8" />
      <path d="M14 9q10-5 20 0" />
      <path d="M17.5 22q6.5 3 13 0" />
    </>
  ),
  cricket: (
    <>
      <g transform="rotate(40 24 24)">
        <rect x="20" y="4" width="8" height="24" rx="1.5" />
        <path d="M24 28v14" />
      </g>
      <circle cx="38" cy="38" r="4" />
    </>
  ),
  chess: (
    <>
      <circle cx="24" cy="13" r="5" />
      <path d="M20 20h8" />
      <path d="M21 20c-2 8-6 11-6 17h18c0-6-4-9-6-17" />
      <path d="M12 41h24" />
    </>
  ),
  ludo: (
    <>
      <rect x="8" y="8" width="32" height="32" rx="2" />
      <path d="M8 19h32M8 29h32M19 8v32M29 8v32" />
      <circle cx="13.5" cy="13.5" r="2.5" />
      <circle cx="34.5" cy="13.5" r="2.5" />
      <circle cx="13.5" cy="34.5" r="2.5" />
      <circle cx="34.5" cy="34.5" r="2.5" />
    </>
  ),
  carrom: (
    <>
      <rect x="7" y="7" width="34" height="34" rx="3" />
      <rect x="12" y="12" width="24" height="24" />
      <circle cx="24" cy="24" r="5" />
      <circle cx="12" cy="12" r="2.5" />
      <circle cx="36" cy="12" r="2.5" />
      <circle cx="12" cy="36" r="2.5" />
      <circle cx="36" cy="36" r="2.5" />
    </>
  ),
  frisbee: (
    <>
      <ellipse cx="24" cy="26" rx="18" ry="7" />
      <ellipse cx="24" cy="25" rx="11" ry="3.5" />
      <path d="M6 26c0-8 8-12 18-12s18 4 18 12" />
      <path d="M8 39h10M22 42h8" />
    </>
  ),
  'tug-of-war': (
    <>
      <path d="M4 24q20 8 40 0" />
      <circle cx="12" cy="25.5" r="2" />
      <circle cx="36" cy="25.5" r="2" />
      <path d="M24 27v-9l7 3-7 3" />
      <path d="M4 39h40" />
    </>
  ),
};

export default function ActivityIcon({ id, size = 48, className = '' }) {
  const shape = ICONS[id];
  if (!shape) return null;
  return (
    <svg
      className={`activity-icon ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {shape}
    </svg>
  );
}
