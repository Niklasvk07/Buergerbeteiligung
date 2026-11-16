"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Home, Map, Search, SlidersHorizontal } from "lucide-react";
import { polls } from "@/lib/data";
import { useStore } from "@/lib/store";

const items = [
  { href: "/", label: "Start", icon: Home },
  { href: "/umfragen", label: "Umfragen", icon: SlidersHorizontal },
  { href: "/karte", label: "Karte", icon: Map },
  { href: "/mitteilungen", label: "Mitteilungen", icon: Bell },
];

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="mitreden Startseite">
      <span className="grid h-[34px] w-[34px] place-items-center rounded-[6px] bg-brand text-[19px] font-bold text-white">
        m
      </span>
    </Link>
  );
}

export function Nav() {
  const path = usePathname();
  const { votes, ready } = useStore();
  const openPolls = ready ? polls.filter((p) => p.daysLeft > 0 && votes[p.id] == null).length : 0;

  const isActive = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-white">
        <div className="mx-auto flex h-[52px] max-w-[1128px] items-center gap-2 px-4">
          <Logo />
          <label className="ml-1 hidden h-[34px] w-[280px] items-center gap-2 rounded-[4px] bg-[#edf3f8] px-3 text-sm text-muted sm:flex">
            <Search size={16} />
            <input
              placeholder="Projekte suchen"
              className="w-full bg-transparent outline-none placeholder:text-muted"
            />
          </label>
          <span className="ml-1 text-[15px] font-semibold sm:hidden">mitreden</span>

          <nav className="ml-auto hidden h-full items-stretch md:flex">
            {items.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              const badge = href === "/umfragen" && openPolls > 0 ? openPolls : 0;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative flex w-[84px] flex-col items-center justify-center gap-0.5 text-[12px] transition-colors ${
                    active ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  <span className="relative">
                    <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
                    {badge > 0 && (
                      <span className="absolute -right-2 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-bad px-1 text-[10px] font-semibold text-white">
                        {badge}
                      </span>
                    )}
                  </span>
                  {label}
                  {active && <span className="absolute bottom-0 h-[2px] w-full bg-ink" />}
                </Link>
              );
            })}
            <div className="ml-2 flex items-center border-l border-line pl-4">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#dfe8f0] text-[12px] font-semibold text-brand-dark">
                Du
              </span>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Tab-Bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
        {items.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          const badge = href === "/umfragen" && openPolls > 0 ? openPolls : 0;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] ${
                active ? "text-ink" : "text-muted"
              }`}
            >
              <span className="relative">
                <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
                {badge > 0 && (
                  <span className="absolute -right-2 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-bad px-1 text-[10px] font-semibold text-white">
                    {badge}
                  </span>
                )}
              </span>
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
