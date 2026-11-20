"use client";

import { useState } from "react";
import { ChevronDown, Info } from "lucide-react";

/** Aufklappbare Infos zur Umfrage, damit man weiß, worüber man abstimmt */
export function PollInfo({ items, defaultOpen = false }: { items: string[]; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-4 overflow-hidden rounded-2xl bg-[#f6f5f2]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left text-[14px] font-semibold"
        aria-expanded={open}
      >
        <Info size={16} className="text-brand" />
        <span className="flex-1">Worum geht&apos;s?</span>
        <ChevronDown size={18} className={`text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul className="animate-fade space-y-1.5 px-4 pb-4">
          {items.map((i) => (
            <li key={i} className="flex gap-2.5 text-[14px] leading-snug">
              <span className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-ink/50" />
              {i}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
