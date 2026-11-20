"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarClock, MessageSquareText } from "lucide-react";
import { budgetStatus, formatMio, getPoll, getProject, perCapita, STAGES } from "@/lib/data";
import { RatingPoll } from "@/components/RatingPoll";
import { Comments } from "@/components/Comments";
import { FollowButton } from "@/components/ProjectPost";
import { ContactSheet } from "@/components/ContactSheet";
import { OpenPollsCard } from "@/components/Sidebars";
import { Chip, PhotoCredit, Progress } from "@/components/ui";
import { PollInfo } from "@/components/PollInfo";
import { BudgetLight } from "@/components/BudgetLight";
import { useCommentCount } from "@/lib/store";

const FUND_COLORS = ["#0a66c2", "#70a6e0", "#b9d3ef", "#dfe9f5"];

export function ProjectDetail({ id }: { id: string }) {
  const router = useRouter();
  const project = getProject(id)!;
  const poll = getPoll(project.pollId);
  const count = useCommentCount(project.id, project.comments);
  const [ask, setAsk] = useState(false);

  // Beim Wechsel zu einem anderen Projekt immer oben starten (außer bei Sprungmarken)
  useEffect(() => {
    if (!window.location.hash) window.scrollTo({ top: 0 });
  }, [id]);
  const total = project.funding.reduce((s, f) => s + f.mio, 0);
  // Prozente so runden, dass sie zusammen genau 100 ergeben
  const shares = project.funding.map((f) => Math.round((f.mio / total) * 100));
  shares[0] += 100 - shares.reduce((a, b) => a + b, 0);

  return (
    <div className="mx-auto grid max-w-[980px] gap-6 lg:grid-cols-[1fr_300px]">
      <div className="min-w-0 space-y-3">
        <article className="card overflow-hidden max-sm:rounded-none">
          <div className="relative aspect-[16/9] bg-[#e6e4df] sm:aspect-[2/1]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={project.image} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
              <button
                onClick={() => (history.length > 1 ? router.back() : router.push("/"))}
                className="grid h-9 w-9 place-items-center rounded-full bg-white/95 shadow-sm"
                aria-label="Zurück"
              >
                <ArrowLeft size={18} />
              </button>
              <Chip>{project.category}</Chip>
            </div>
            <PhotoCredit credit={project.credit} className="absolute bottom-2 right-2" />
          </div>

          <div className="p-5 sm:p-7">
            <p className="text-[13px] text-muted">{project.district}</p>
            <h1 className="mt-0.5 text-[26px] font-semibold leading-tight tracking-[-0.02em]">{project.title}</h1>
            <p className="mt-2 text-[16px] leading-snug text-muted">{project.teaser}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              <FollowButton id={project.id} />
              <button
                onClick={() => setAsk(true)}
                className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#f1f0ed] px-3 text-[13px] font-semibold text-ink hover:bg-[#e8e6e2]"
              >
                <MessageSquareText size={15} /> Frage an die Stadt
              </button>
            </div>

            <div className="mt-7">
              <Progress stage={project.stage} labels />
            </div>

            {project.nextDate && (
              <p className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-soft px-3 py-2 text-[14px] font-medium text-brand-dark">
                <CalendarClock size={16} /> {project.nextDate}
              </p>
            )}

            <ul className="mt-5 space-y-1.5">
              {project.facts.map((f) => (
                <li key={f} className="flex gap-2.5 text-[15px]">
                  <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-ink/50" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </article>

        {/* Haushaltszahlen */}
        <section className="card p-5 sm:p-7 max-sm:rounded-none">
          <h2 className="text-[17px] font-semibold">Was kostet das?</h2>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <Stat label={project.costNote ?? "Gesamt"} value={formatMio(project.costMio)} />
            <Stat label="pro Einwohner" value={perCapita(project.costMio)} highlight />
            <Stat label="Zeitraum" value={project.timeframe} />
          </div>

          <BudgetLight project={project} status={budgetStatus(project)} />

          <p className="mt-6 text-[13px] font-semibold text-muted">Woher kommt das Geld?</p>
          <div className="mt-2 flex h-3 overflow-hidden rounded-full">
            {project.funding.map((f, i) => (
              <span key={f.label} style={{ width: `${(f.mio / total) * 100}%`, background: FUND_COLORS[i] }} />
            ))}
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px]">
            {project.funding.map((f, i) => (
              <li key={f.label} className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: FUND_COLORS[i] }} />
                <span className="text-muted">{f.label}</span>
                <span className="font-semibold">{shares[i]} %</span>
              </li>
            ))}
          </ul>
        </section>

        {poll && (
          <section id="umfrage" className="card scroll-mt-20 p-5 sm:p-7 max-sm:rounded-none">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-brand">
              {poll.daysLeft > 0 ? `Umfrage · noch ${poll.daysLeft} Tage` : "Umfrage beendet"}
            </p>
            <h2 className="mb-4 mt-1 text-[18px] font-semibold leading-snug">{poll.question}</h2>
            <PollInfo items={poll.info} />
            <RatingPoll poll={poll} />
            {poll.outcome && (
              <div className="mt-5 rounded-xl bg-[#e3f3ea] p-4">
                <p className="text-[12px] font-semibold uppercase tracking-wide text-good">Was daraus wurde</p>
                <p className="mt-1 text-[14px] leading-snug">{poll.outcome}</p>
              </div>
            )}
          </section>
        )}

        <section className="card p-5 sm:p-7 max-sm:rounded-none">
          <h2 className="text-[17px] font-semibold">Verlauf</h2>
          <ol className="mt-4">
            {project.updates.map((u, i) => (
              <li key={i} className="relative flex gap-4 pb-5 last:pb-0">
                {i < project.updates.length - 1 && <span className="absolute left-[4px] top-4 h-full w-[2px] bg-line" />}
                <span className={`relative mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${i === 0 ? "bg-brand" : "bg-[#cfccc6]"}`} />
                <div className="leading-snug">
                  <p className="text-[12px] text-muted">
                    {u.date} · {STAGES[u.stage]}
                  </p>
                  <p className="text-[15px]">{u.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="kommentare" className="card scroll-mt-20 p-5 sm:p-7 max-sm:rounded-none">
          <h2 className="mb-4 text-[17px] font-semibold">
            Diskussion <span className="font-normal text-muted">· {count}</span>
          </h2>
          <Comments projectId={project.id} seed={project.comments} />
        </section>
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-[76px]">
          <OpenPollsCard />
        </div>
      </aside>

      {ask && <ContactSheet topic={project.title} onClose={() => setAsk(false)} />}
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl p-3 sm:p-4 ${highlight ? "bg-brand-soft" : "bg-[#f6f5f2]"}`}>
      <p className={`text-[12px] ${highlight ? "text-brand-dark" : "text-muted"}`}>{label}</p>
      <p className={`mt-0.5 text-[15px] font-semibold sm:text-[17px] ${highlight ? "text-brand-dark" : ""}`}>{value}</p>
    </div>
  );
}
