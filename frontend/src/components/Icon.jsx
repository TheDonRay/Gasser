const PATHS = {
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  fuel: (
    <>
      <rect x="3" y="3" width="10" height="18" rx="2" />
      <path d="M3 10h10M13 8h2a2 2 0 0 1 2 2v6a2 2 0 0 0 4 0V8l-3-3" />
    </>
  ),
  chart: <path d="M4 20V10M10 20V4M16 20v-7M2 20h20" />,
  list: <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
  sparkle: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />,
  moon: <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />,
  car: (
    <>
      <path d="M3 16v-4l2.2-5.2A2 2 0 0 1 7 5.6h10a2 2 0 0 1 1.8 1.2L21 12v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zM3 12h18" />
      <circle cx="7.5" cy="17" r="1.8" />
      <circle cx="16.5" cy="17" r="1.8" />
    </>
  ),
  arrow:<path d="M5 12h14M13 6l6 6-6 6" />,
  reset: <path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" />,
}

const Icon = ({ name, size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {PATHS[name]}
  </svg>
)

export default Icon
