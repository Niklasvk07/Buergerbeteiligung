"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Clock, Shapes, Ticket } from "lucide-react";
import { getProject, polls, REWARD_SURVEY, type Poll } from "@/lib/data";
import { RatingPoll } from "@/components/RatingPoll";
import { PollInfo } from "@/components/PollInfo";
import { RewardSurvey } from "@/components/RewardSurvey";
import { useStore } from "@/lib/store";

export default function Umfragen() {
  const { rewardDone, playground, ready } = useStore();
  const [survey, setSurvey] = useState(false);
  const open = polls.filter((p) => p.daysLeft > 0).sort((a, b) => a.daysLeft - b.daysLeft);
  const closed = polls.filter((p) => p.daysLeft <= 0);

  return (
    <div className="mx-auto max-w-[680px] space-y-3">
      <h1 className="px-4 text-[28px] font-semibold tracking-[-0.02em] sm:px-0">Umfragen</h1>

      {/* Spezial-Formate */}
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          onClick={() => !(ready && rewardDone) && setSurvey(true)}
          className="card group relative overflow-hidden p-5 text-left max-sm:rounded-none"
        >
          <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-[radial-gradient(circle,#ffd98a,transparent_70%)] opacity-70" />
          <span className="relative inline-flex items-center gap-1.5 rounded-full bg-[#fdf0e1] px-2.5 py-1 text-[12px] font-semibold text-warn">
            <Ticket size={13} /> Mit Belohnung
          </span>
          <h2 className="relative mt-3 text-[18px] font-semibold leading-tight">Umfrage: {REWARD_SURVEY.title}</h2>
          <p className="relative mt-1 text-[14px] text-muted">
            Zu gewinnen: <span className="font-semibold text-ink">{REWARD_SURVEY.reward}</span>
          </p>
          <div className="relative mt-4 flex items-center justify-between text-[13px]">
            <span className="inline-flex items-center gap-1 text-muted">
              <Clock size={14} /> {REWARD_SURVEY.minutes} Min · {REWARD_SURVEY.questions.length} Fragen
            </span>
            {ready && rewardDone ? (
              <span className="inline-flex items-center gap-1 font-semibold text-good">
                <Check size={15} /> Teilgenommen
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-semibold text-brand group-hover:gap-2">
                Starten <ArrowRight size={15} className="transition-all" />
              </span>
            )}
          </div>
        </button>

        <Link href="/mitmachen/spielplatz" className="card group relative overflow-hidden p-5 max-sm:rounded-none">
          <div className="absolute -right-4 -top-4 grid grid-cols-3 gap-1 opacity-60">
            {["#ef8354", "#4f9de8", "#e9c46a", "#8d6cd8", "#3f8f4f", "#2a9d8f"].map((c) => (
              <span key={c} className="h-6 w-6 rounded-md" style={{ background: c }} />
            ))}
          </div>
          <span className="relative inline-flex items-center gap-1.5 rounded-full bg-[#e3f3ea] px-2.5 py-1 text-[12px] font-semibold text-good">
            <Shapes size={13} /> Ideen-Labor
          </span>
          <h2 className="relative mt-3 text-[18px] font-semibold leading-tight">Gestalte den neuen Spielplatz</h2>
          <p className="relative mt-1 text-[14px] text-muted">Für die Erweiterung am Bürgerpark Hafeninsel.</p>
          <div className="relative mt-4 flex items-center justify-between text-[13px]">
            <span className="text-muted">Spielerisch · ca. 5 Min</span>
            {ready && playground ? (
              <span className="inline-flex items-center gap-1 font-semibold text-good">
                <Check size={15} /> Entwurf eingereicht
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-semibold text-brand group-hover:gap-2">
                Loslegen <ArrowRight size={15} className="transition-all" />
              </span>
            )}
          </div>
        </Link>
      </div>

      <h2 className="px-4 pt-3 text-[17px] font-semibold sm:px-0">Kurz abstimmen</h2>
      {open.map((p) => (
        <PollCard key={p.id} poll={p} />
      ))}
      {closed.length > 0 && (
        <>
          <h2 className="px-4 pt-3 text-[17px] font-semibold text-muted sm:px-0">Beendet</h2>
          {closed.map((p) => (
            <PollCard key={p.id} poll={p} />
          ))}
        </>
      )}

      {survey && <RewardSurvey onClose={() => setSurvey(false)} />}
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
        <PollInfo items={poll.info} />
        <RatingPoll poll={poll} />
        {poll.outcome && (
          <div className="mt-4 rounded-xl bg-[#e3f3ea] p-4">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-good">Was daraus wurde</p>
            <p className="mt-1 text-[14px] leading-snug">{poll.outcome}</p>
          </div>
        )}
      </div>
    </article>
  );
}
