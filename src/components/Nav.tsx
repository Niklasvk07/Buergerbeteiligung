"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Home, MapPin, SlidersHorizontal, UserRound } from "lucide-react";
import { polls } from "@/lib/data";
import { useStore } from "@/lib/store";

const items = [
  { href: "/", label: "Start", icon: Home },
  { href: "/umfragen", label: "Umfragen", icon: SlidersHorizontal },
  { href: "/mitteilungen", label: "Mitteilungen", icon: Bell },
  { href: "/profil", label: "Profil", icon: UserRound },
];

export function Nav() {
  const path = usePathname();
  const { votes, ready, profile } = useStore();
  const openPolls = ready ? polls.filter((p) => p.daysLeft > 0 && votes[p.id] == null).length : 0;
  const isActive = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  const Badge = ({ href }: { href: string }) =>
    href === "/umfragen" && openPolls > 0 ? (
      <span className="absolute -right-2 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-bad px-1 text-[10px] font-semibold text-white">
        {openPolls}
      </span>
    ) : null;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[980px] items-center gap-3 px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-[9px] bg-brand text-[17px] font-bold text-white">m</span>
            <span className="text-[17px] font-semibold tracking-[-0.02em]">mitreden</span>
          </Link>
          <Link
            href="/profil"
            className="ml-1 inline-flex items-center gap-1 rounded-full bg-[#f1f0ed] px-2.5 py-1 text-[12px] font-semibold text-muted hover:text-ink"
          >
            <MapPin size={12} /> {profile.kommune}
          </Link>
          <span className="rounded-full border border-dashed border-faint px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-faint">
            Demo
          </span>

          <nav className="ml-auto hidden items-center gap-1 md:flex">
            {items.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex h-9 items-center gap-2 rounded-full px-3.5 text-[14px] font-semibold transition-colors ${
                    active ? "bg-ink text-white" : "text-muted hover:bg-black/5 hover:text-ink"
                  }`}
                >
                  <span className="relative">
                    <Icon size={17} />
                    {!active && <Badge href={href} />}
                  </span>
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-black/[0.06] bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
        {items.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${
                active ? "text-ink" : "text-faint"
              }`}
            >
              <span className="relative">
                <Icon size={22} strokeWidth={active ? 2.3 : 1.8} />
                <Badge href={href} />
              </span>
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
