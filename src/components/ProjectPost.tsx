"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Heart, MessageCircle, Plus, Check, SlidersHorizontal, CalendarDays, HardHat, BarChart3, CloudRain, Newspaper } from "lucide-react";
import type { Article, Comment, News, Project } from "@/lib/data";
import { getPoll } from "@/lib/data";
import { useCommentCount, useStore } from "@/lib/store";
import { Chip, CityAvatar, PersonAvatar, PhotoCredit, Progress, Verified } from "./ui";

export function FollowButton({ id }: { id: string }) {
  const { follows, toggleFollow } = useStore();
  const on = follows.includes(id);
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleFollow(id);
      }}
      className={`inline-flex h-8 items-center gap-1 rounded-full px-3 text-[13px] font-semibold transition-colors ${
        on ? "bg-black/5 text-muted" : "bg-brand text-white hover:bg-brand-dark"
      }`}
    >
      {on ? <Check size={15} /> : <Plus size={15} />}
      {on ? "Folgst du" : "Folgen"}
    </button>
  );
}

export function Pill({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label?: React.ReactNode;
  active?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold transition-colors ${
        active ? "bg-[#fde8e7] text-bad" : "bg-[#f1f0ed] text-muted hover:bg-[#e8e6e2] hover:text-ink"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function LikePill({ id, base }: { id: string; base: number }) {
  const { likes, toggleLike } = useStore();
  const on = likes.includes(id);
  return (
    <Pill
      icon={<Heart size={15} fill={on ? "currentColor" : "none"} />}
      label={base + (on ? 1 : 0)}
      active={on}
      onClick={() => toggleLike(id)}
    />
  );
}

function topComment(seed: Comment[], extra: Comment[] = []): Comment | undefined {
  return [...extra, ...seed].sort((a, b) => b.likes - a.likes)[0];
}

/** Reddit-artige Vorschau: der beliebteste Kommentar, angedeutet mit Thread-Linie */
function CommentPreview({ project, count }: { project: Project; count: number }) {
  const { comments } = useStore();
  const c = topComment(project.comments, comments[project.id]);
  if (!c) {
    return <p className="text-[13px] text-muted">Noch keine Kommentare – sei die erste Stimme.</p>;
  }
  return (
    <div>
      <div className="flex gap-2.5">
        {c.official ? <CityAvatar size={26} /> : <PersonAvatar name={c.author} size={26} />}
        <div className="min-w-0 flex-1 border-l-2 border-line pl-2.5">
          <p className="text-[13px] leading-snug">
            <span className="font-semibold">{c.author}</span>
            {c.official && <> <Verified /></>}
            <span className="text-faint"> · {c.time}</span>
          </p>
          <p className="line-clamp-2 text-[14px] leading-snug text-ink/85">{c.text}</p>
        </div>
      </div>
      {count > 1 && (
        <p className="mt-2 pl-[36px] text-[13px] font-semibold text-brand">
          {count - 1} weitere {count - 1 === 1 ? "Antwort" : "Antworten"} ansehen
        </p>
      )}
    </div>
  );
}

export function ProjectPost({ project }: { project: Project }) {
  const router = useRouter();
  const { votes } = useStore();
  const count = useCommentCount(project.id, project.comments);
  const poll = getPoll(project.pollId);
  const pollOpen = poll && poll.daysLeft > 0 && votes[poll.id] == null;
  const href = `/projekte/${project.id}`;

  return (
    <article
      onClick={() => router.push(href)}
      className="card group cursor-pointer overflow-hidden transition-shadow hover:shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.06)] max-sm:rounded-none"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-[#e6e4df]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <div className="absolute left-3 top-3 flex gap-1.5">
          <Chip>{project.category}</Chip>
        </div>
        <PhotoCredit credit={project.credit} className="absolute bottom-2 right-2" />
        {pollOpen && poll && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 text-[12px] font-semibold text-white shadow">
            <SlidersHorizontal size={13} /> Umfrage · noch {poll.daysLeft} Tage
          </span>
        )}
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[12px] text-muted">
              {project.district} · {project.posted}
            </p>
            <h2 className="mt-0.5 text-[17px] font-semibold leading-snug tracking-[-0.01em]">{project.title}</h2>
            <p className="mt-1 text-[14px] leading-snug text-muted">{project.teaser}</p>
          </div>
        </div>

        <div className="mt-4">
          <Progress stage={project.stage} />
        </div>

        <div className="mt-4 border-t border-line pt-4">
          <CommentPreview project={project} count={count} />
        </div>

        <div className="mt-4 flex items-center gap-2">
          <LikePill id={project.id} base={project.likes} />
          <Link href={href + "#kommentare"} onClick={(e) => e.stopPropagation()}>
            <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#f1f0ed] px-3 text-[13px] font-semibold text-muted hover:bg-[#e8e6e2] hover:text-ink">
              <MessageCircle size={15} /> {count}
            </span>
          </Link>
          <Pill icon={<ArrowUpRight size={15} />} label="Teilen" />
          <span className="ml-auto">
            <FollowButton id={project.id} />
          </span>
        </div>
      </div>
    </article>
  );
}

const TAGS = {
  Verkehr: { icon: HardHat, cls: "bg-[#fdf0e1] text-warn" },
  Unwetter: { icon: CloudRain, cls: "bg-[#e6eefc] text-[#3159b8]" },
  Termin: { icon: CalendarDays, cls: "bg-brand-soft text-brand" },
  Ergebnis: { icon: BarChart3, cls: "bg-[#e3f3ea] text-good" },
} as const;

export function NewsPost({ news }: { news: News }) {
  const router = useRouter();
  const { icon: Icon, cls } = TAGS[news.tag];
  const clickable = !!news.projectId;
  return (
    <article
      onClick={clickable ? () => router.push(`/projekte/${news.projectId}`) : undefined}
      className={`card overflow-hidden max-sm:rounded-none ${clickable ? "cursor-pointer" : ""} ${
        news.urgent ? "shadow-[inset_4px_0_0_#d93025,0_0_0_1px_rgba(0,0,0,0.04)]" : ""
      }`}
    >
      <div className="flex gap-4 p-4 sm:p-5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[12px] text-muted">
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold ${cls}`}>
              <Icon size={12} /> {news.tag}
            </span>
            {news.district} · {news.posted}
          </div>
          <h3 className="mt-2 text-[16px] font-semibold leading-snug">{news.title}</h3>
          <p className="mt-0.5 text-[14px] leading-snug text-muted">{news.text}</p>
          <div className="mt-3">
            <LikePill id={news.id} base={news.likes} />
          </div>
        </div>
        {news.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={news.image} alt="" loading="lazy" className="h-24 w-24 shrink-0 rounded-xl object-cover sm:h-28 sm:w-28" />
        )}
      </div>
    </article>
  );
}

/** Stadtblatt-Teaser für den gemischten Feed */
export function ArticleTeaser({ article }: { article: Article }) {
  return (
    <Link href={`/stadtblatt/${article.id}`} className="card group block overflow-hidden max-sm:rounded-none">
      <div className="flex items-center gap-2 border-b border-line px-4 py-2.5 sm:px-5">
        <Newspaper size={15} className="text-ink" />
        <span className="font-serif text-[15px] font-bold tracking-tight">Stadtblatt</span>
        <span className="text-[12px] text-muted">· {article.date}</span>
      </div>
      <div className="relative aspect-[2/1] overflow-hidden bg-[#e6e4df]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
      <div className="p-4 sm:p-5">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-bad">{article.kicker}</p>
        <h2 className="mt-1 font-serif text-[22px] font-bold leading-tight">{article.title}</h2>
        <p className="mt-1.5 line-clamp-2 font-serif text-[15px] leading-snug text-ink/75">{article.lead}</p>
        <p className="mt-3 text-[13px] font-semibold text-brand">Weiterlesen · {article.readMin} Min.</p>
      </div>
    </Link>
  );
}
