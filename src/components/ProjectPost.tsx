"use client";

import Link from "next/link";
import { MessageSquare, Plus, Check, Send, ThumbsUp, SlidersHorizontal, ChevronRight } from "lucide-react";
import type { Project } from "@/lib/data";
import { getPoll } from "@/lib/data";
import { useStore } from "@/lib/store";
import { Cover, OfficeAvatar, StageTracker, Verified, formatCount } from "./ui";

export function FollowButton({ id }: { id: string }) {
  const { follows, toggleFollow } = useStore();
  const on = follows.includes(id);
  return (
    <button
      onClick={() => toggleFollow(id)}
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[14px] font-semibold transition-colors ${
        on ? "text-muted hover:bg-black/5" : "text-brand hover:bg-brand-soft"
      }`}
    >
      {on ? <Check size={16} /> : <Plus size={16} />}
      {on ? "Folgst du" : "Folgen"}
    </button>
  );
}

export function ProjectPost({ project }: { project: Project }) {
  const { likes, toggleLike, comments, votes } = useStore();
  const liked = likes.includes(project.id);
  const likeCount = project.likes + (liked ? 1 : 0);
  const commentCount =
    project.comments.reduce((n, c) => n + 1 + (c.replies?.length ?? 0), 0) +
    (comments[project.id]?.length ?? 0);
  const poll = getPoll(project.pollId);
  const pollOpen = poll && poll.daysLeft > 0 && votes[poll.id] == null;
  const href = `/projekte/${project.id}`;

  return (
    <article className="card overflow-hidden max-sm:rounded-none">
      <header className="flex items-start gap-2 px-4 pt-3">
        <OfficeAvatar />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="text-[14px] font-semibold">
            {project.office} <Verified />
          </p>
          <p className="text-[12px] text-muted">Stadt Lindenfeld · {project.district}</p>
          <p className="text-[12px] text-muted">{project.posted}</p>
        </div>
        <FollowButton id={project.id} />
      </header>

      <Link href={href} className="block px-4 pb-3 pt-2">
        <h2 className="text-[16px] font-semibold leading-snug">{project.title}</h2>
        <p className="mt-0.5 text-[14px] text-ink/80">{project.teaser}</p>
      </Link>

      <Link href={href} className="block">
        <Cover project={project} className="h-[220px]" />
      </Link>

      <div className="px-4 pb-1 pt-4">
        <StageTracker stage={project.stage} />
      </div>

      {pollOpen && poll && (
        <Link
          href={href + "#umfrage"}
          className="mx-4 mt-3 flex items-center gap-3 rounded-lg bg-brand-soft px-3 py-2.5 text-[14px] transition-colors hover:bg-[#dbe9f8]"
        >
          <SlidersHorizontal size={18} className="text-brand" />
          <span className="flex-1 font-semibold text-brand-dark">Umfrage läuft · noch {poll.daysLeft} Tage</span>
          <ChevronRight size={18} className="text-brand" />
        </Link>
      )}

      <div className="mx-4 mt-3 flex items-center justify-between border-b border-line pb-2 text-[12px] text-muted">
        <span className="inline-flex items-center gap-1">
          <span className="grid h-4 w-4 place-items-center rounded-full bg-brand">
            <ThumbsUp size={9} className="text-white" fill="white" />
          </span>
          {formatCount(likeCount)}
        </span>
        <Link href={href + "#kommentare"} className="hover:text-brand hover:underline">
          {commentCount} Kommentare
        </Link>
      </div>

      <div className="flex px-2 py-1">
        <Action
          icon={<ThumbsUp size={20} fill={liked ? "currentColor" : "none"} />}
          label="Gefällt mir"
          active={liked}
          onClick={() => toggleLike(project.id)}
        />
        <Action icon={<MessageSquare size={20} />} label="Kommentieren" href={href + "#kommentare"} />
        <Action icon={<Send size={20} />} label="Teilen" />
      </div>
    </article>
  );
}

function Action({
  icon,
  label,
  active,
  onClick,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  href?: string;
}) {
  const cls = `flex flex-1 items-center justify-center gap-1.5 rounded-md py-3 text-[14px] font-semibold transition-colors hover:bg-black/5 ${
    active ? "text-brand" : "text-muted"
  }`;
  if (href)
    return (
      <Link href={href} className={cls}>
        {icon}
        <span className="max-sm:hidden">{label}</span>
      </Link>
    );
  return (
    <button onClick={onClick} className={cls}>
      {icon}
      <span className="max-sm:hidden">{label}</span>
    </button>
  );
}
