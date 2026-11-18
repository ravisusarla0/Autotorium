const ICONS = {
  101: (
    <>
      <path d="M4 14a8 8 0 1 1 16 0" />
      <path d="M12 14l4-4" />
      <circle cx="12" cy="14" r="1.4" fill="currentColor" stroke="none" />
      <path d="M4 18h16" />
    </>
  ),
  102: (
    <>
      <path d="M12 3c3.2 4.2 5.2 6.8 5.2 9.2a5.2 5.2 0 0 1-10.4 0C6.8 9.8 8.8 7.2 12 3Z" />
      <path d="M9.4 13.2a2.8 2.8 0 0 0 2.2 2.6" />
    </>
  ),
  103: (
    <>
      <path d="M7.5 4.5c0-1 .7-1.5 1.6-1.5s1.6.5 1.6 1.5V11l-1 6.5H8.5L7.5 11V4.5Z" />
      <path d="M13.3 4.5C13.3 3.5 14 3 15 3s1.7.5 1.7 1.5V13c0 2.2-1 4-2.6 5.5" />
      <path d="M4.5 20.5h15" />
    </>
  ),
  104: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="2.2" />
      <path d="M12 3.8v4M12 16.2v4M3.8 12h4M16.2 12h4" />
    </>
  ),
}

export default function CategoryIcon({ categoryId }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ICONS[categoryId] ?? ICONS[101]}
    </svg>
  )
}
