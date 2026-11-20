"use client";

import { useEffect, useState } from "react";
import { LayoutGrid, Megaphone, Newspaper } from "lucide-react";
import { feed, KOMMUNE, news } from "@/lib/data";
import { ArticleTeaser, NewsPost, ProjectPost } from "@/components/ProjectPost";
import { OpenPollsCard } from "@/components/Sidebars";
import { Stadtblatt } from "@/components/Stadtblatt";
import { ChatCard } from "@/components/Chat";

const TABS = [
  { id: "alle", label: "Alle", icon: LayoutGrid },
  { id: "meldungen", label: "Meldungen", icon: Megaphone },
  { id: "stadtblatt", label: "Stadtblatt", icon: Newspaper },
] as const;
type Tab = (typeof TABS)[number]["id"];

export default function Home() {
  const [tab, setTab] = useState<Tab>("alle");

  // gewählten Tab beim Zurückkehren behalten
  useEffect(() => {
    try {
      const t = sessionStorage.getItem("mitreden-tab") as Tab | null;
      if (t) setTab(t);
    } catch {}
  }, []);
  const choose = (t: Tab) => {
    setTab(t);
    try {
      sessionStorage.setItem("mitreden-tab", t);
    } catch {}
  };

  return (
    <div className="mx-auto grid max-w-[1040px] gap-6 lg:grid-cols-[1fr_300px]">
      <section className="min-w-0 space-y-3">
        <div className="px-4 pt-1 sm:px-0">
          <p className="text-[13px] font-medium text-muted">Neues aus</p>
          <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.02em]">{KOMMUNE.name}</h1>
        </div>

        <div className="px-4 sm:px-0">
          <div className="grid grid-cols-3 gap-1 rounded-2xl bg-[#e8e6e1] p-1">
            {TABS.map(({ id, label, icon: Icon }) => {
              const on = tab === id;
              return (
                <button
                  key={id}
                  onClick={() => choose(id)}
                  className={`flex h-11 items-center justify-center gap-2 rounded-xl text-[15px] font-semibold transition-all ${
                    on ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink"
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {tab === "alle" &&
          feed.map((f) =>
            f.kind === "project" ? (
              <ProjectPost key={f.item.id} project={f.item} />
            ) : f.kind === "news" ? (
              <NewsPost key={f.item.id} news={f.item} />
            ) : (
              <ArticleTeaser key={f.item.id} article={f.item} />
            ),
          )}
        {tab === "meldungen" && news.map((n) => <NewsPost key={n.id} news={n} />)}
        {tab === "stadtblatt" && <Stadtblatt />}
      </section>

      <aside className="hidden lg:block">
        <div className="sticky top-[76px] space-y-3 pt-[88px]">
          <OpenPollsCard />
          <ChatCard />
        </div>
      </aside>
    </div>
  );
}
