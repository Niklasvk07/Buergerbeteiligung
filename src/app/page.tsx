"use client";

import { useState } from "react";
import { CATEGORIES, feed, KOMMUNE, type Category } from "@/lib/data";
import { NewsPost, ProjectPost } from "@/components/ProjectPost";
import { OpenPollsCard } from "@/components/Sidebars";

const FILTERS: ("Alle" | "Meldungen" | Category)[] = ["Alle", "Meldungen", ...CATEGORIES];

export default function Home() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Alle");
  const list = feed.filter((f) =>
    filter === "Alle"
      ? true
      : filter === "Meldungen"
        ? f.kind === "news"
        : f.kind === "project" && f.item.category === filter,
  );

  return (
    <div className="mx-auto grid max-w-[980px] gap-6 lg:grid-cols-[1fr_300px]">
      <section className="min-w-0 space-y-3">
        <div className="px-4 pt-1 sm:px-0">
          <p className="text-[13px] font-medium text-muted">Neues aus</p>
          <h1 className="text-[26px] font-semibold leading-tight tracking-[-0.02em]">{KOMMUNE.name}</h1>
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-1 sm:px-0">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`h-8 shrink-0 rounded-full px-3.5 text-[13px] font-semibold transition-colors ${
                filter === f ? "bg-ink text-white" : "bg-white text-muted shadow-[0_0_0_1px_rgba(0,0,0,0.08)] hover:text-ink"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        {list.map((f) =>
          f.kind === "project" ? (
            <ProjectPost key={f.item.id} project={f.item} />
          ) : (
            <NewsPost key={f.item.id} news={f.item} />
          ),
        )}
      </section>

      <aside className="hidden lg:block">
        <div className="sticky top-[76px] space-y-3 pt-[76px]">
          <OpenPollsCard />
        </div>
      </aside>
    </div>
  );
}
