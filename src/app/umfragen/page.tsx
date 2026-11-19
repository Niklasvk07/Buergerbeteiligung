"use client";

import Link from "next/link";
import { getProject, polls, type Poll } from "@/lib/data";
import { RatingPoll } from "@/components/RatingPoll";

export default function Umfragen() {
  const open = polls.filter((p) => p.daysLeft > 0).sort((a, b) => a.daysLeft - b.daysLeft);
  const closed = polls.filter((p) => p.daysLeft <= 0);

  return (
    <div className="mx-auto max-w-[680px] space-y-2 sm:space-y-3">
      <h1 className="px-4 pb-1 text-[22px] font-semibold sm:px-0">Umfragen</h1>
      {open.map((p) => (
        <PollCard key={p.id} poll={p} />
      ))}
      {closed.length > 0 && (
        <>
          <h2 className="px-4 pb-1 pt-4 text-[16px] font-semibold text-muted sm:px-0">Beendet</h2>
          {closed.map((p) => (
            <PollCard key={p.id} poll={p} />
          ))}
        </>
      )}
    </div>
  );
}

function PollCard({ poll }: { poll: Poll }) {
  const project = getProject(poll.projectId)!;
  return (
    <article className="card overflow-hidden max-sm:rounded-none">
      <Link href={`/projekte/${project.id}`} className="flex items-center gap-3 border-b border-line p-3 hover:bg-black/[0.02]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={project.image} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover" />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-[14px] font-semibold">{project.title}</p>
          <p className="text-[12px] text-muted">
            {project.district} · {poll.daysLeft > 0 ? `noch ${poll.daysLeft} Tage` : "beendet"}
          </p>
        </div>
      </Link>
      <div className="p-5">
        <h2 className="mb-4 text-[17px] font-semibold leading-snug">{poll.question}</h2>
        <RatingPoll poll={poll} />
      </div>
    </article>
  );
}
