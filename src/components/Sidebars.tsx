"use client";

import Link from "next/link";
import { getProject, polls, events } from "@/lib/data";
import { useStore } from "@/lib/store";

export function ProfileCard() {
  const { votes, follows, ready } = useStore();
  return (
    <div className="card overflow-hidden">
      <div className="h-14 bg-[linear-gradient(120deg,#a0b4b7,#d8e1e3)]" />
      <div className="px-4 pb-4">
        <span className="-mt-8 grid h-16 w-16 place-items-center rounded-full border-2 border-white bg-[#dfe8f0] text-[20px] font-semibold text-brand-dark">
          Du
        </span>
        <p className="mt-2 text-[18px] font-semibold leading-tight">Hallo!</p>
        <p className="text-[13px] text-muted">Lindenfeld · Altstadt</p>
      </div>
      <div className="border-t border-line px-4 py-3 text-[12px]">
        <Row label="Abgestimmt" value={ready ? Object.keys(votes).length : 0} />
        <Row label="Projekte gefolgt" value={ready ? follows.length : 0} />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between py-0.5">
      <span className="font-semibold text-muted">{label}</span>
      <span className="font-semibold text-brand">{value}</span>
    </div>
  );
}

export function OpenPollsCard() {
  const { votes } = useStore();
  const open = polls.filter((p) => p.daysLeft > 0);
  return (
    <div className="card p-4">
      <h3 className="text-[16px] font-semibold">Deine Stimme zählt</h3>
      <ul className="mt-3 space-y-3">
        {open.map((p) => {
          const project = getProject(p.projectId)!;
          const done = votes[p.id] != null;
          return (
            <li key={p.id}>
              <Link href={`/projekte/${project.id}#umfrage`} className="group flex items-start gap-2">
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${done ? "bg-good" : "bg-brand"}`}
                />
                <span className="leading-tight">
                  <span className="block text-[14px] font-semibold group-hover:text-brand group-hover:underline">
                    {project.title}
                  </span>
                  <span className="text-[12px] text-muted">
                    {done ? "Abgestimmt" : `noch ${p.daysLeft} Tage`}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function EventsCard() {
  return (
    <div className="card p-4">
      <h3 className="text-[16px] font-semibold">Termine</h3>
      <ul className="mt-3 space-y-3">
        {events.map((e) => (
          <li key={e.title} className="flex gap-3">
            <span className="w-10 shrink-0 overflow-hidden rounded-md text-center shadow-[0_0_0_1px_rgba(0,0,0,0.08)]">
              <span className="block bg-bad py-0.5 text-[10px] font-semibold uppercase text-white">{e.month}</span>
              <span className="block py-0.5 text-[15px] font-semibold">{e.date}</span>
            </span>
            <span className="leading-tight">
              <span className="block text-[14px] font-semibold">{e.title}</span>
              <span className="text-[12px] text-muted">{e.place}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
