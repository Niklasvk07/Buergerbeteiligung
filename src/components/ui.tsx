import { Bike, Baby, Landmark, Trees, Waves, BadgeCheck } from "lucide-react";
import type { Category, Project } from "@/lib/data";
import { CATEGORY_COLORS, STAGES } from "@/lib/data";

export const CATEGORY_ICONS = {
  Verkehr: Bike,
  Bildung: Baby,
  Umwelt: Trees,
  Freizeit: Waves,
  Stadtbild: Landmark,
} satisfies Record<Category, unknown>;

export function OfficeAvatar({ size = 48 }: { size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-[6px] bg-[#1d2226] text-white"
      style={{ width: size, height: size }}
    >
      <Landmark size={size * 0.48} strokeWidth={1.8} />
    </span>
  );
}

export function PersonAvatar({ name, size = 40 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
  const palette = ["#dfe8f0", "#f0e4da", "#e3ecdc", "#ece1f2", "#f5e6c8"];
  const bg = palette[name.length % palette.length];
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full font-semibold text-ink/70"
      style={{ width: size, height: size, background: bg, fontSize: size * 0.36 }}
    >
      {initials}
    </span>
  );
}

export function Verified() {
  return <BadgeCheck size={15} className="inline text-brand" aria-label="offiziell" />;
}

export function Cover({ project, className = "" }: { project: Project; className?: string }) {
  const Icon = CATEGORY_ICONS[project.category];
  const [a, b] = project.hue;
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${a}, ${b})` }}
    >
      <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10" />
      <div className="absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-black/10" />
      <Icon className="absolute bottom-5 right-6 text-white/90" size={64} strokeWidth={1.4} />
      <span className="absolute left-4 top-4 rounded-full bg-white/90 px-2.5 py-1 text-[12px] font-semibold text-ink">
        {project.category}
      </span>
    </div>
  );
}

export function CategoryDot({ category }: { category: Category }) {
  return (
    <span className="inline-block h-2 w-2 rounded-full" style={{ background: CATEGORY_COLORS[category] }} />
  );
}

/** Kompakter Fortschritt im Paketverfolgungs-Stil */
export function StageTracker({ stage, full = false }: { stage: number; full?: boolean }) {
  const done = stage === STAGES.length - 1;
  return (
    <div>
      <div className="relative flex items-center justify-between">
        <div className="absolute inset-x-1.5 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-line" />
        <div
          className={`absolute left-1.5 top-1/2 h-[3px] -translate-y-1/2 rounded-full ${done ? "bg-good" : "bg-brand"}`}
          style={{ width: `calc(${(stage / (STAGES.length - 1)) * 100}% - 12px)` }}
        />
        {STAGES.map((s, i) => (
          <span
            key={s}
            className={`relative z-10 rounded-full border-2 ${
              i < stage
                ? done
                  ? "h-3 w-3 border-good bg-good"
                  : "h-3 w-3 border-brand bg-brand"
                : i === stage
                  ? done
                    ? "h-4 w-4 border-good bg-good ring-4 ring-good/15"
                    : "h-4 w-4 border-brand bg-white ring-4 ring-brand/15"
                  : "h-3 w-3 border-line bg-white"
            }`}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[12px]">
        {STAGES.map((s, i) => (
          <span
            key={s}
            className={`${i === stage ? "font-semibold text-ink" : "text-faint"} ${
              !full && i !== stage ? "invisible sm:visible" : ""
            } ${i === 0 ? "text-left" : i === STAGES.length - 1 ? "text-right" : "text-center"} w-14`}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

export function BudgetLight({ status }: { status: Project["budget"] }) {
  const map = {
    gruen: { c: "bg-good", t: "im Plan" },
    gelb: { c: "bg-warn", t: "leicht über Plan" },
    rot: { c: "bg-bad", t: "deutlich über Plan" },
  } as const;
  const { c, t } = map[status];
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2.5 w-2.5 rounded-full ${c}`} />
      {t}
    </span>
  );
}

export function formatCount(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace(".", ",")} Tsd.` : String(n);
}
