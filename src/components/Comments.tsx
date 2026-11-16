"use client";

import { useState } from "react";
import type { Comment } from "@/lib/data";
import { useStore } from "@/lib/store";
import { OfficeAvatar, PersonAvatar, Verified } from "./ui";

export function Comments({ projectId, seed }: { projectId: string; seed: Comment[] }) {
  const { comments, addComment } = useStore();
  const [text, setText] = useState("");
  const all = [...(comments[projectId] ?? []), ...seed];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    addComment(projectId, text.trim());
    setText("");
  };

  return (
    <div>
      <form onSubmit={submit} className="flex items-start gap-2">
        <PersonAvatar name="Du" size={40} />
        <div className="flex flex-1 items-center rounded-full border border-[#8c8c8c] pl-4 pr-1 focus-within:border-ink focus-within:shadow-[0_0_0_1px_#191919]">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Kommentar hinzufügen …"
            className="h-10 flex-1 bg-transparent text-[14px] outline-none placeholder:text-muted"
          />
          {text.trim() && (
            <button className="animate-fade rounded-full bg-brand px-3 py-1 text-[14px] font-semibold text-white hover:bg-brand-dark">
              Posten
            </button>
          )}
        </div>
      </form>

      <ul className="mt-4 space-y-4">
        {all.map((c) => (
          <CommentItem key={c.id} c={c} />
        ))}
        {all.length === 0 && <li className="py-4 text-center text-[14px] text-muted">Schreib den ersten Kommentar.</li>}
      </ul>
    </div>
  );
}

function CommentItem({ c, reply = false }: { c: Comment; reply?: boolean }) {
  const { likes, toggleLike } = useStore();
  const liked = likes.includes(c.id);
  return (
    <li className="animate-fade">
      <div className="flex gap-2">
        {c.official ? <OfficeAvatar size={reply ? 32 : 40} /> : <PersonAvatar name={c.author} size={reply ? 32 : 40} />}
        <div className="min-w-0 flex-1">
          <div className={`rounded-lg rounded-tl-none px-3 py-2 ${c.official ? "bg-brand-soft" : "bg-[#f2f2f2]"}`}>
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-[14px] font-semibold">
                {c.author} {c.official && <Verified />}
              </p>
              <span className="shrink-0 text-[12px] text-muted">{c.time}</span>
            </div>
            {c.district && <p className="text-[12px] text-muted">{c.district}</p>}
            <p className="mt-1 text-[14px] leading-snug">{c.text}</p>
          </div>
          <div className="mt-1 flex gap-3 pl-2 text-[12px] font-semibold text-muted">
            <button onClick={() => toggleLike(c.id)} className={liked ? "text-brand" : "hover:text-ink"}>
              Gefällt mir{c.likes + (liked ? 1 : 0) > 0 && ` · ${c.likes + (liked ? 1 : 0)}`}
            </button>
            <span className="text-line">|</span>
            <button className="hover:text-ink">Antworten</button>
          </div>
          {c.replies && (
            <ul className="mt-3 space-y-3">
              {c.replies.map((r) => (
                <CommentItem key={r.id} c={r} reply />
              ))}
            </ul>
          )}
        </div>
      </div>
    </li>
  );
}
