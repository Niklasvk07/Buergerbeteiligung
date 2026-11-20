"use client";

/** Bildnachweis für frei lizenzierte Fotos – als span, damit er auch innerhalb von Links gültig ist */
export function PhotoCredit({
  credit,
  className = "",
}: {
  credit?: { author: string; license: string; source: string };
  className?: string;
}) {
  if (!credit) return null;
  return (
    <span
      role="link"
      tabIndex={0}
      title="Bildquelle öffnen"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(credit.source, "_blank", "noopener");
      }}
      className={`cursor-pointer rounded bg-black/45 px-1.5 py-0.5 text-[10px] text-white/90 backdrop-blur hover:bg-black/60 ${className}`}
    >
      Foto: {credit.author} · {credit.license}
    </span>
  );
}
