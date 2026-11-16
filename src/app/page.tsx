"use client";

import { useState } from "react";
import { projects, type Category } from "@/lib/data";
import { ProjectPost } from "@/components/ProjectPost";
import { EventsCard, OpenPollsCard, ProfileCard } from "@/components/Sidebars";

const FILTERS: ("Alle" | Category)[] = ["Alle", "Verkehr", "Bildung", "Umwelt", "Freizeit", "Stadtbild"];

export default function Home() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Alle");
  const list = filter === "Alle" ? projects : projects.filter((p) => p.category === filter);

  return (
    <div className="grid gap-6 md:grid-cols-[225px_1fr] lg:grid-cols-[225px_1fr_300px]">
      <aside className="hidden md:block">
        <div className="sticky top-[72px]">
          <ProfileCard />
        </div>
      </aside>

      <section className="min-w-0 space-y-2 sm:space-y-3">
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-1 sm:px-0">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-[14px] font-semibold transition-colors ${
                filter === f
                  ? "bg-good text-white"
                  : "bg-white text-muted shadow-[inset_0_0_0_1px_#8c8c8c] hover:bg-black/5 hover:text-ink"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        {list.map((p) => (
          <ProjectPost key={p.id} project={p} />
        ))}
      </section>

      <aside className="hidden lg:block">
        <div className="sticky top-[72px] space-y-3">
          <OpenPollsCard />
          <EventsCard />
        </div>
      </aside>
    </div>
  );
}
