import { BadgeCheck } from "lucide-react";
import { STAGES } from "@/lib/data";

export function PersonAvatar({ name, size = 32 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
  const palette = ["#dbe6f2", "#f2e4d8", "#e0ecdb", "#ebe0f2", "#f4e7c6"];
  const bg = palette[name.length % palette.length];
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full font-semibold text-ink/70"
      style={{ width: size, height: size, background: bg, fontSize: size * 0.38 }}
    >
      {initials}
    </span>
  );
}

export function CityAvatar({ size = 32 }: { size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full bg-brand font-bold text-white"
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      S
    </span>
  );
}

export function Verified() {
  return <BadgeCheck size={14} className="inline -mt-0.5 text-brand" aria-label="offiziell" />;
}

/** Fortschritt als 5 Segmente – schlicht statt Punkte-Leiste */
export function Progress({ stage, labels = false }: { stage: number; labels?: boolean }) {
  const done = stage === STAGES.length - 1;
  return (
    <div>
      <div className="flex gap-1">
        {STAGES.map((s, i) => (
          <span
            key={s}
            className={`h-1.5 flex-1 rounded-full ${
              i <= stage ? (done ? "bg-good" : "bg-brand") : "bg-[#e6e4df]"
            }`}
          />
        ))}
      </div>
      {labels ? (
        <div className="mt-2 flex text-[12px]">
          {STAGES.map((s, i) => (
            <span key={s} className={`flex-1 ${i === stage ? "font-semibold text-ink" : "text-faint"}`}>
              {s}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-1.5 text-[12px] text-muted">
          <span className={`font-semibold ${done ? "text-good" : "text-ink"}`}>{STAGES[stage]}</span>
          <span className="text-faint"> · Schritt {stage + 1} von 5</span>
        </p>
      )}
    </div>
  );
}

export function Chip({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-white/95 px-2.5 py-1 text-[12px] font-semibold text-ink shadow-sm backdrop-blur ${className}`}
    >
      {children}
    </span>
  );
}
