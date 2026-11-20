import type { PieceId } from "@/lib/data";

/** Kleine Draufsicht-Illustrationen der Spielplatz-Elemente (viewBox 48×48) */
export function PieceIcon({ id, size = 40 }: { id: PieceId; size?: number | string }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden className="drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]">
      {ART[id]}
    </svg>
  );
}

const shadow = <ellipse cx="24" cy="42" rx="15" ry="3" fill="#000" opacity="0.12" />;

const ART: Record<PieceId, React.ReactNode> = {
  schaukel: (
    <>
      {shadow}
      <path d="M8 40 L14 8 M40 40 L34 8" stroke="#b5532c" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M11 8 H37" stroke="#ef8354" strokeWidth="4" strokeLinecap="round" />
      <path d="M18 9 V28 M23 9 V28 M27 9 V24 M32 9 V24" stroke="#6b4a36" strokeWidth="1.4" />
      <rect x="16" y="27" width="9" height="3.5" rx="1.5" fill="#ef8354" />
      <rect x="25.5" y="23" width="8" height="3.5" rx="1.5" fill="#f4a261" />
    </>
  ),
  rutsche: (
    <>
      {shadow}
      <path d="M10 40 V12 M17 40 V12" stroke="#2f6fb5" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M10 18 H17 M10 25 H17 M10 32 H17" stroke="#2f6fb5" strokeWidth="2" />
      <rect x="8" y="9" width="12" height="5" rx="2" fill="#4f9de8" />
      <path d="M19 12 C 30 14, 30 34, 42 38 L 40 42 C 27 38, 27 18, 17 16 Z" fill="#7fb8f0" stroke="#4f9de8" strokeWidth="1.5" />
    </>
  ),
  sandkasten: (
    <>
      <rect x="6" y="9" width="36" height="32" rx="6" fill="#c79a4a" />
      <rect x="9" y="12" width="30" height="26" rx="4" fill="#f2d28b" />
      <circle cx="17" cy="20" r="1.2" fill="#d8b36a" />
      <circle cx="29" cy="31" r="1.2" fill="#d8b36a" />
      <circle cx="33" cy="18" r="1.2" fill="#d8b36a" />
      <path d="M20 30 l4 -6 l4 6 z" fill="#e76f51" />
      <circle cx="31" cy="25" r="3.5" fill="#4f9de8" />
    </>
  ),
  kletter: (
    <>
      {shadow}
      <path d="M8 40 C 8 12, 40 12, 40 40" fill="#efe9fb" stroke="#8d6cd8" strokeWidth="3" />
      <path d="M16 40 C 16 22, 32 22, 32 40 M24 15 V40 M10 30 H38 M13 22 H35" stroke="#8d6cd8" strokeWidth="2" fill="none" />
    </>
  ),
  wippe: (
    <>
      {shadow}
      <path d="M20 40 L24 30 L28 40 Z" fill="#9b4a63" />
      <rect x="5" y="26" width="38" height="5" rx="2.5" fill="#e76f8a" transform="rotate(-10 24 28)" />
      <circle cx="9" cy="31" r="3.5" fill="#f4a3b5" />
      <circle cx="39" cy="24.5" r="3.5" fill="#f4a3b5" />
    </>
  ),
  karussell: (
    <>
      {shadow}
      <circle cx="24" cy="25" r="16" fill="#2a9d8f" />
      <path d="M24 9 V41 M8 25 H40 M12.7 13.7 L35.3 36.3 M35.3 13.7 L12.7 36.3" stroke="#a7e3dc" strokeWidth="1.6" />
      <circle cx="24" cy="25" r="5" fill="#e9c46a" stroke="#fff" strokeWidth="1.5" />
    </>
  ),
  baum: (
    <>
      <ellipse cx="26" cy="42" rx="14" ry="3" fill="#000" opacity="0.15" />
      <rect x="22" y="30" width="5" height="11" rx="2" fill="#7a5034" />
      <circle cx="24" cy="20" r="13" fill="#3f8f4f" />
      <circle cx="18" cy="16" r="7" fill="#57a866" />
      <circle cx="30" cy="22" r="6" fill="#2f7a3f" />
    </>
  ),
  bank: (
    <>
      {shadow}
      <rect x="7" y="16" width="34" height="5" rx="2" fill="#b07b52" />
      <rect x="7" y="23" width="34" height="5" rx="2" fill="#9c6b45" />
      <rect x="7" y="30" width="34" height="5" rx="2" fill="#b07b52" />
      <path d="M11 35 V41 M37 35 V41" stroke="#4b5563" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  eimer: (
    <>
      {shadow}
      <path d="M15 14 H33 L31 41 H17 Z" fill="#6b7280" />
      <rect x="13" y="10" width="22" height="5" rx="2" fill="#4b5563" />
      <path d="M20 19 V37 M24 19 V37 M28 19 V37" stroke="#9ca3af" strokeWidth="1.5" />
    </>
  ),
  brunnen: (
    <>
      {shadow}
      <rect x="18" y="20" width="12" height="21" rx="3" fill="#94a3b8" />
      <rect x="14" y="16" width="20" height="6" rx="3" fill="#64748b" />
      <path d="M24 4 C 20 10, 19 12, 19 14 a5 5 0 0 0 10 0 c0 -2 -1 -4 -5 -10 z" fill="#38bdf8" />
    </>
  ),
};
