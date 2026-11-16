"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CATEGORY_COLORS, projects, STAGES } from "@/lib/data";
import { CATEGORY_ICONS } from "@/components/ui";

export default function Karte() {
  const [active, setActive] = useState(projects[0].id);
  const project = projects.find((p) => p.id === active)!;

  return (
    <div className="space-y-3">
      <div className="card relative overflow-hidden max-sm:rounded-none">
        <div className="relative aspect-[4/5] w-full sm:aspect-[16/9]">
          <CityMap />
          {projects.map((p) => {
            const Icon = CATEGORY_ICONS[p.category];
            const on = p.id === active;
            return (
              <button
                key={p.id}
                onClick={() => setActive(p.id)}
                className="absolute -translate-x-1/2 -translate-y-full transition-transform"
                style={{ left: `${p.map.x}%`, top: `${p.map.y}%`, zIndex: on ? 10 : 1 }}
                aria-label={p.title}
              >
                <span
                  className={`flex items-center gap-1.5 rounded-full border-2 border-white py-1 pl-1 shadow-md transition-all ${
                    on ? "scale-110 pr-3" : "pr-1"
                  }`}
                  style={{ background: CATEGORY_COLORS[p.category] }}
                >
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-white/20">
                    <Icon size={14} className="text-white" />
                  </span>
                  {on && <span className="whitespace-nowrap text-[12px] font-semibold text-white">{p.title}</span>}
                </span>
                <span
                  className="mx-auto block h-2 w-2 -translate-y-1 rotate-45"
                  style={{ background: CATEGORY_COLORS[p.category] }}
                />
              </button>
            );
          })}

          <Link
            href={`/projekte/${project.id}`}
            key={project.id}
            className="animate-rise absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-xl bg-white p-3 shadow-lg sm:left-auto sm:right-4 sm:bottom-4 sm:w-[340px]"
          >
            <span
              className="h-11 w-11 shrink-0 rounded-lg"
              style={{ background: `linear-gradient(135deg, ${project.hue[0]}, ${project.hue[1]})` }}
            />
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block truncate text-[15px] font-semibold">{project.title}</span>
              <span className="text-[12px] text-muted">
                {project.district} · {STAGES[project.stage]}
              </span>
            </span>
            <ChevronRight size={20} className="text-muted" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function CityMap() {
  return (
    <svg viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
      <rect width="1000" height="560" fill="#eef0eb" />
      {/* Grünflächen */}
      <path d="M520 40 h170 v120 h-170z" fill="#d5e8cf" rx="12" />
      <path d="M120 360 q60 -40 140 0 v120 h-140z" fill="#d5e8cf" />
      <circle cx="780" cy="420" r="70" fill="#d5e8cf" />
      {/* Fluss */}
      <path
        d="M-20 300 C 120 280, 200 380, 330 360 S 520 260, 640 330 S 860 470, 1020 430"
        fill="none"
        stroke="#bcd7ee"
        strokeWidth="34"
        strokeLinecap="round"
      />
      {/* Straßen */}
      <g stroke="#ffffff" strokeLinecap="round" fill="none">
        <path d="M0 230 H1000" strokeWidth="16" />
        <path d="M460 0 V560" strokeWidth="16" />
        <path d="M0 120 L1000 70" strokeWidth="9" />
        <path d="M0 470 L1000 520" strokeWidth="9" />
        <path d="M200 0 L260 560" strokeWidth="9" />
        <path d="M760 0 L700 560" strokeWidth="9" />
        <path d="M330 140 L620 320" strokeWidth="6" />
        <path d="M560 420 L900 200" strokeWidth="6" />
        <path d="M80 30 L380 200" strokeWidth="5" />
      </g>
      {/* Häuserblöcke */}
      <g fill="#e2e3de">
        <rect x="280" y="150" width="70" height="55" rx="6" />
        <rect x="370" y="150" width="70" height="55" rx="6" />
        <rect x="490" y="250" width="80" height="50" rx="6" />
        <rect x="290" y="250" width="70" height="40" rx="6" />
        <rect x="800" y="260" width="90" height="60" rx="6" />
        <rect x="560" y="440" width="90" height="50" rx="6" />
        <rect x="40" y="150" width="120" height="60" rx="6" />
      </g>
      <g fill="#8c8c8c" fontSize="15" fontWeight="600" fontFamily="system-ui" letterSpacing="2">
        <text x="300" y="215">ALTSTADT</text>
        <text x="560" y="190">NORDVIERTEL</text>
        <text x="610" y="520">SÜDSTADT</text>
        <text x="60" y="440">MÜHLBACH</text>
        <text x="840" y="230">OSTEND</text>
      </g>
    </svg>
  );
}
