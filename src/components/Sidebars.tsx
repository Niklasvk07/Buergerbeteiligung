"use client";

import Link from "next/link";
import { getProject, polls } from "@/lib/data";
import { useStore } from "@/lib/store";

export function OpenPollsCard() {
  const { votes } = useStore();
  const open = polls.filter((p) => p.daysLeft > 0).sort((a, b) => a.daysLeft - b.daysLeft);
  return (
    <div className="card p-5">
      <h3 className="text-[15px] font-semibold">Deine Stimme zählt</h3>
      <ul className="mt-3 space-y-1">
        {open.map((p) => {
          const project = getProject(p.projectId)!;
          const done = votes[p.id] != null;
          return (
            <li key={p.id}>
              <Link
                href={`/projekte/${project.id}`}
                className="-mx-2 flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-black/[0.03]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={project.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                <span className="min-w-0 flex-1 leading-tight">
                  <span className="block truncate text-[14px] font-semibold">{project.title}</span>
                  <span className={`text-[12px] ${done ? "text-good" : "text-muted"}`}>
                    {done ? "✓ Abgestimmt" : `noch ${p.daysLeft} Tage`}
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
