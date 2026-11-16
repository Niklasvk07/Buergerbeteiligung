"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPoll, getProject, STAGES } from "@/lib/data";
import { RatingPoll } from "@/components/RatingPoll";
import { Comments } from "@/components/Comments";
import { FollowButton } from "@/components/ProjectPost";
import { EventsCard, OpenPollsCard } from "@/components/Sidebars";
import { BudgetLight, Cover, OfficeAvatar, StageTracker, Verified } from "@/components/ui";

export function ProjectDetail({ id }: { id: string }) {
  const project = getProject(id)!;
  const poll = getPoll(project.pollId);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="min-w-0 space-y-2 sm:space-y-3">
        <article className="card overflow-hidden max-sm:rounded-none">
          <div className="relative">
            <Cover project={project} className="h-[200px] sm:h-[240px]" />
            <Link
              href="/"
              className="absolute left-3 top-14 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink shadow hover:bg-white"
              aria-label="Zurück"
            >
              <ArrowLeft size={18} />
            </Link>
          </div>
          <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-[24px] font-semibold leading-tight">{project.title}</h1>
                <p className="mt-1 text-[15px] text-ink/80">{project.teaser}</p>
                <p className="mt-2 flex items-center gap-1.5 text-[13px] text-muted">
                  <OfficeAvatar size={20} />
                  {project.office} <Verified /> · {project.district}
                </p>
              </div>
              <FollowButton id={project.id} />
            </div>

            <div className="mt-6">
              <StageTracker stage={project.stage} full />
            </div>

            <dl className="mt-6 grid grid-cols-3 divide-x divide-line rounded-lg border border-line">
              <Fact label="Kosten" value={project.cost} />
              <Fact label="Zeitraum" value={project.timeframe} />
              <Fact label="Budget" value={<BudgetLight status={project.budget} />} />
            </dl>

            <ul className="mt-5 space-y-2">
              {project.facts.map((f) => (
                <li key={f} className="flex gap-2.5 text-[14px]">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-ink/60" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </article>

        {poll && (
          <section id="umfrage" className="card scroll-mt-20 p-5 sm:p-6 max-sm:rounded-none">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-brand">
              {poll.daysLeft > 0 ? `Umfrage · noch ${poll.daysLeft} Tage` : "Umfrage beendet"}
            </p>
            <h2 className="mb-4 mt-1 text-[18px] font-semibold leading-snug">{poll.question}</h2>
            <RatingPoll poll={poll} />
          </section>
        )}

        <section className="card p-5 sm:p-6 max-sm:rounded-none">
          <h2 className="text-[18px] font-semibold">Verlauf</h2>
          <ol className="mt-4">
            {project.updates.map((u, i) => (
              <li key={i} className="relative flex gap-4 pb-5 last:pb-0">
                {i < project.updates.length - 1 && (
                  <span className="absolute left-[5px] top-4 h-full w-[2px] bg-line" />
                )}
                <span
                  className={`relative mt-1.5 h-3 w-3 shrink-0 rounded-full ${i === 0 ? "bg-brand" : "bg-[#c7c7c7]"}`}
                />
                <div className="leading-snug">
                  <p className="text-[12px] text-muted">
                    {u.date} · {STAGES[u.stage]}
                  </p>
                  <p className="text-[14px]">{u.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="kommentare" className="card scroll-mt-20 p-5 sm:p-6 max-sm:rounded-none">
          <h2 className="mb-4 text-[18px] font-semibold">Diskussion</h2>
          <Comments projectId={project.id} seed={project.comments} />
        </section>
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-[72px] space-y-3">
          <OpenPollsCard />
          <EventsCard />
        </div>
      </aside>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="px-3 py-3 sm:px-4">
      <dt className="text-[12px] text-muted">{label}</dt>
      <dd className="mt-0.5 text-[14px] font-semibold sm:text-[15px]">{value}</dd>
    </div>
  );
}
