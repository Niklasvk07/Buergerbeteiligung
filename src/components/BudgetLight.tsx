import { formatMio, type Project } from "@/lib/data";

const COPY = {
  gruen: { title: "Im Budget", text: "Die Kosten liegen im oder unter dem Plan." },
  gelb: { title: "Leicht über Plan", text: "Mehrkosten bis 10 % – die Stadt beobachtet das." },
  rot: { title: "Deutlich über Plan", text: "Mehr als 10 % Mehrkosten – der Stadtrat muss nachsteuern." },
} as const;

const LIGHTS = [
  { level: "rot", on: "#e5484d" },
  { level: "gelb", on: "#f5a524" },
  { level: "gruen", on: "#17a34a" },
] as const;

/** Budget-Ampel: Prognose im Vergleich zum ursprünglichen Plan */
export function BudgetLight({
  project,
  status,
}: {
  project: Project;
  status: { diff: number; level: "gruen" | "gelb" | "rot" };
}) {
  const pct = Math.round(status.diff * 100);
  const copy = COPY[status.level];
  return (
    <div className="mt-5 flex items-center gap-4 rounded-2xl bg-[#f6f5f2] p-4">
      <div className="flex flex-col gap-1.5 rounded-xl bg-[#23262b] p-2 shadow-inner" aria-hidden>
        {LIGHTS.map((l) => {
          const on = l.level === status.level;
          return (
            <span
              key={l.level}
              className="h-4 w-4 rounded-full transition-all"
              style={{
                background: on ? l.on : "#3b3f46",
                boxShadow: on ? `0 0 10px ${l.on}` : "none",
              }}
            />
          );
        })}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-muted">Budget-Ampel</p>
        <p className="text-[16px] font-semibold leading-tight">
          {copy.title}
          <span className={`ml-2 text-[14px] ${pct > 0 ? "text-bad" : "text-good"}`}>
            {pct > 0 ? `+${pct} %` : pct < 0 ? `${pct} %` : "±0 %"}
          </span>
        </p>
        <p className="mt-0.5 text-[13px] leading-snug text-muted">
          Plan {formatMio(project.planMio)} · aktuell {formatMio(project.costMio)}. {copy.text}
        </p>
      </div>
    </div>
  );
}
