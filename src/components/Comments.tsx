"use client";

import { useState } from "react";
import { ArrowBigUp, MessageCircle } from "lucide-react";
import type { Comment } from "@/lib/data";
import { useStore } from "@/lib/store";
import { CityAvatar, PersonAvatar, Verified } from "./ui";

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
      <form
        onSubmit={submit}
        className="flex items-center rounded-2xl bg-[#f1f0ed] pl-4 pr-1.5 transition-shadow focus-within:bg-white focus-within:shadow-[0_0_0_2px_#0a66c2]"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Was denkst du dazu?"
          className="h-12 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted"
        />
        <button
          disabled={!text.trim()}
          className="h-9 rounded-full bg-brand px-4 text-[14px] font-semibold text-white transition-opacity hover:bg-brand-dark disabled:opacity-30"
        >
          Posten
        </button>
      </form>

      <ul className="mt-5 space-y-5">
        {all.map((c) => (
          <Thread key={c.id} c={c} />
        ))}
        {all.length === 0 && (
          <li className="py-6 text-center text-[14px] text-muted">Noch ruhig hier. Schreib den ersten Kommentar.</li>
        )}
      </ul>
    </div>
  );
}

function Thread({ c, depth = 0 }: { c: Comment; depth?: number }) {
  const { likes, toggleLike } = useStore();
  const [open, setOpen] = useState(true);
  const up = likes.includes(c.id);
  const score = c.likes + (up ? 1 : 0);

  return (
    <li className="animate-fade">
      <div className="flex gap-3">
        <div className="flex flex-col items-center">
          {c.official ? <CityAvatar size={depth ? 28 : 32} /> : <PersonAvatar name={c.author} size={depth ? 28 : 32} />}
          {c.replies && open && (
            <button
              onClick={() => setOpen(false)}
              aria-label="Antworten einklappen"
              className="mt-1 w-4 flex-1 cursor-pointer"
            >
              <span className="mx-auto block h-full w-[2px] rounded bg-line hover:bg-brand" />
            </button>
          )}
        </div>
        <div className="min-w-0 flex-1 pb-1">
          <p className="text-[13px] leading-tight">
            <span className="font-semibold">{c.author}</span>
            {c.official && <> <Verified /></>}
            <span className="text-faint">
              {c.district ? ` · ${c.district}` : ""} · {c.time}
            </span>
          </p>
          <p className={`mt-1 text-[15px] leading-snug ${c.official ? "rounded-xl bg-brand-soft px-3 py-2" : ""}`}>
            {c.text}
          </p>
          <div className="mt-1.5 flex items-center gap-1 text-[13px] font-semibold text-muted">
            <button
              onClick={() => toggleLike(c.id)}
              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 hover:bg-black/5 ${up ? "text-brand" : ""}`}
            >
              <ArrowBigUp size={18} fill={up ? "currentColor" : "none"} />
              {score}
            </button>
            <button className="inline-flex items-center gap-1 rounded-full px-2 py-1 hover:bg-black/5">
              <MessageCircle size={15} /> Antworten
            </button>
          </div>

          {c.replies &&
            (open ? (
              <ul className="mt-3 space-y-4">
                {c.replies.map((r) => (
                  <Thread key={r.id} c={r} depth={depth + 1} />
                ))}
              </ul>
            ) : (
              <button onClick={() => setOpen(true)} className="mt-1 text-[13px] font-semibold text-brand">
                {c.replies.length} {c.replies.length === 1 ? "Antwort" : "Antworten"} anzeigen
              </button>
            ))}
        </div>
      </div>
    </li>
  );
}
