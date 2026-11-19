"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { X } from "lucide-react";
import { getProject, polls } from "@/lib/data";
import { useStore } from "@/lib/store";
import { RatingPoll } from "./RatingPoll";

const SEEN = "mitreden-popup-seen";

/** Poppt auf der Startseite auf, wenn eine offene Umfrage noch nicht beantwortet wurde. */
export function PollPopup() {
  const path = usePathname();
  const { ready, votes } = useStore();
  const [open, setOpen] = useState(false);
  const [votedId, setVotedId] = useState<string | null>(null);
  const done = votedId != null;

  const poll = polls
    .filter((p) => p.daysLeft > 0 && votes[p.id] == null)
    .sort((a, b) => a.daysLeft - b.daysLeft)[0];

  useEffect(() => {
    if (!ready || path !== "/" || !poll) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN) === "1";
    } catch {}
    if (seen) return;
    const t = setTimeout(() => setOpen(true), 900);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, path]);

  const close = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(SEEN, "1");
    } catch {}
  };

  if (!open) return null;
  const shown = votedId ? polls.find((p) => p.id === votedId) : poll;
  if (!shown) return null;
  const project = getProject(shown.projectId)!;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center animate-fade" onClick={close}>
      <div
        className="animate-rise w-full max-w-[440px] overflow-hidden rounded-t-3xl bg-white sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.image} alt="" className="h-[140px] w-full object-cover" />
          <button
            onClick={close}
            className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/30 text-white hover:bg-black/45"
            aria-label="Schließen"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-brand">
            Neue Umfrage · noch {shown.daysLeft} Tage
          </p>
          <h3 className="mt-1 text-[18px] font-semibold leading-snug">{shown.question}</h3>
          <div className="mt-4">
            <RatingPoll
              poll={shown}
              onVoted={() => setVotedId(shown.id)}
            />
          </div>
          {done ? (
            <button
              onClick={close}
              className="mt-5 w-full rounded-full bg-brand py-2.5 text-[15px] font-semibold text-white hover:bg-brand-dark"
            >
              Fertig
            </button>
          ) : (
            <Link
              href={`/projekte/${project.id}`}
              onClick={close}
              className="mt-4 block text-center text-[14px] font-semibold text-muted hover:text-ink"
            >
              Erst mehr zum Projekt lesen
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
