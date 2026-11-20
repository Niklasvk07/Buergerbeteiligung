"use client";

import { useMemo, useState } from "react";
import { CalendarPlus, ChevronLeft, ChevronRight, Clock, MapPin, X } from "lucide-react";
import { events, type CalEvent } from "@/lib/data";

const TODAY = "2026-11-20";
const MONTHS = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
const WD = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

export const TYPE_STYLE: Record<CalEvent["type"], { dot: string; chip: string }> = {
  Markt: { dot: "#d93025", chip: "bg-[#fde8e7] text-bad" },
  Termin: { dot: "#0a66c2", chip: "bg-brand-soft text-brand" },
  Kundgebung: { dot: "#c2710c", chip: "bg-[#fdf0e1] text-warn" },
  Abstimmung: { dot: "#7c3aed", chip: "bg-[#efe8fd] text-[#6d28d9]" },
  Workshop: { dot: "#0b7a4b", chip: "bg-[#e3f3ea] text-good" },
  Kultur: { dot: "#db2777", chip: "bg-[#fde7f1] text-[#be185d]" },
};

const iso = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
const fmtDay = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("de-DE", { weekday: "short", day: "numeric", month: "short" });
};

/** Mehrtägige Events (Weihnachtsmarkt) gelten nur für den Starttag als „Punkt“, sonst wäre jeder Tag voll */
const startsOn = (e: CalEvent, day: string) => e.date === day;
const runsOn = (e: CalEvent, day: string) => e.date <= day && (e.end ?? e.date) >= day;

export function EventCalendar() {
  const [month, setMonth] = useState({ y: 2026, m: 10 }); // November 2026
  const [selected, setSelected] = useState<string>(TODAY);
  const [detail, setDetail] = useState<CalEvent | null>(null);

  const cells = useMemo(() => {
    const first = new Date(month.y, month.m, 1);
    const offset = (first.getDay() + 6) % 7; // Montag zuerst
    const days = new Date(month.y, month.m + 1, 0).getDate();
    return [...Array(offset).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  }, [month]);

  const shift = (d: number) =>
    setMonth(({ y, m }) => {
      const n = m + d;
      return { y: y + Math.floor(n / 12), m: ((n % 12) + 12) % 12 };
    });

  const dayEvents = events.filter((e) => runsOn(e, selected));
  const upcoming = events
    .filter((e) => (e.end ?? e.date) >= TODAY)
    .sort((a, b) => (a.date < TODAY ? TODAY : a.date).localeCompare(b.date < TODAY ? TODAY : b.date));

  return (
    <div className="card overflow-hidden max-sm:rounded-none">
      <div className="flex items-center justify-between px-5 pb-2 pt-4">
        <h2 className="text-[17px] font-semibold">Kalender</h2>
        <div className="flex items-center gap-1">
          <button onClick={() => shift(-1)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-black/5" aria-label="Vorheriger Monat">
            <ChevronLeft size={18} />
          </button>
          <span className="w-[120px] text-center text-[14px] font-semibold">
            {MONTHS[month.m]} {month.y}
          </span>
          <button onClick={() => shift(1)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-black/5" aria-label="Nächster Monat">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 px-3 text-center text-[11px] font-semibold text-faint">
        {WD.map((d) => (
          <span key={d} className="py-1">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-0.5 px-3 pb-3">
        {cells.map((d, i) => {
          if (!d) return <span key={`x${i}`} />;
          const day = iso(month.y, month.m, d);
          const evs = events.filter((e) => startsOn(e, day) || (e.end && runsOn(e, day) && e.type !== "Markt"));
          const market = events.some((e) => e.type === "Markt" && runsOn(e, day));
          const isSel = day === selected;
          const isToday = day === TODAY;
          return (
            <button
              key={day}
              onClick={() => setSelected(day)}
              className={`relative mx-auto flex h-11 w-11 flex-col items-center justify-center rounded-full text-[14px] transition-colors ${
                isSel ? "bg-ink font-semibold text-white" : isToday ? "font-semibold text-brand" : "hover:bg-black/5"
              } ${market && !isSel ? "bg-[#fdf2f1]" : ""}`}
            >
              {d}
              <span className="absolute bottom-1.5 flex gap-0.5">
                {evs.slice(0, 3).map((e) => (
                  <span key={e.id} className="h-1 w-1 rounded-full" style={{ background: isSel ? "#fff" : TYPE_STYLE[e.type].dot }} />
                ))}
              </span>
            </button>
          );
        })}
      </div>

      {/* gewählter Tag */}
      <div className="border-t border-line px-5 py-4">
        <p className="text-[13px] font-semibold text-muted">{fmtDay(selected)}</p>
        {dayEvents.length === 0 ? (
          <p className="mt-1 text-[14px] text-faint">Keine Termine an diesem Tag.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {dayEvents.map((e) => (
              <EventRow key={e.id} e={e} onClick={() => setDetail(e)} />
            ))}
          </ul>
        )}
      </div>

      {/* Demnächst */}
      <div className="border-t border-line px-5 py-4">
        <p className="text-[13px] font-semibold text-muted">Demnächst</p>
        <ul className="mt-2 space-y-2">
          {upcoming.map((e) => (
            <EventRow key={e.id} e={e} withDate onClick={() => setDetail(e)} />
          ))}
        </ul>
      </div>

      {detail && <EventSheet e={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}

function EventRow({ e, withDate, onClick }: { e: CalEvent; withDate?: boolean; onClick: () => void }) {
  const [, m, d] = e.date.split("-").map(Number);
  return (
    <li>
      <button onClick={onClick} className="-mx-2 flex w-[calc(100%+16px)] items-center gap-3 rounded-xl px-2 py-1.5 text-left hover:bg-black/[0.03]">
        {withDate && (
          <span className="w-10 shrink-0 overflow-hidden rounded-lg text-center shadow-[0_0_0_1px_rgba(0,0,0,0.08)]">
            <span className="block py-0.5 text-[9px] font-bold uppercase text-white" style={{ background: TYPE_STYLE[e.type].dot }}>
              {MONTHS[m - 1].slice(0, 3)}
            </span>
            <span className="block py-0.5 text-[15px] font-semibold">{d}</span>
          </span>
        )}
        {!withDate && <span className="h-8 w-1 shrink-0 rounded-full" style={{ background: TYPE_STYLE[e.type].dot }} />}
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block truncate text-[14px] font-semibold">{e.title}</span>
          <span className="block truncate text-[12px] text-muted">
            {e.end ? `bis ${fmtDay(e.end)} · ` : ""}
            {e.time}
          </span>
        </span>
      </button>
    </li>
  );
}

function EventSheet({ e, onClose }: { e: CalEvent; onClose: () => void }) {
  const [added, setAdded] = useState(false);
  return (
    <div className="animate-fade fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <div className="animate-rise w-full max-w-[440px] rounded-t-3xl bg-white p-6 sm:rounded-3xl" onClick={(ev) => ev.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <span className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${TYPE_STYLE[e.type].chip}`}>{e.type}</span>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-black/5" aria-label="Schließen">
            <X size={17} />
          </button>
        </div>
        <h3 className="mt-3 text-[22px] font-semibold leading-tight tracking-[-0.02em]">{e.title}</h3>
        <ul className="mt-4 space-y-2 text-[14px]">
          <li className="flex items-center gap-2.5">
            <Clock size={16} className="text-muted" />
            {fmtDay(e.date)}
            {e.end ? ` – ${fmtDay(e.end)}` : ""} · {e.time}
          </li>
          <li className="flex items-center gap-2.5">
            <MapPin size={16} className="text-muted" />
            {e.place}
          </li>
        </ul>
        <p className="mt-4 text-[15px] leading-snug text-ink/85">{e.text}</p>
        <button
          onClick={() => setAdded(true)}
          className={`mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full text-[15px] font-semibold ${
            added ? "bg-[#e3f3ea] text-good" : "bg-brand text-white hover:bg-brand-dark"
          }`}
        >
          <CalendarPlus size={17} /> {added ? "Erinnerung gesetzt" : "Erinnern"}
        </button>
      </div>
    </div>
  );
}
