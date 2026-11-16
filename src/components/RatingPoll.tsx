"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type { Poll } from "@/lib/data";
import { useStore } from "@/lib/store";

export function pollStats(poll: Poll, mine?: number) {
  const votes = [...poll.votes];
  if (mine != null) votes[mine - 1] += 1;
  const total = votes.reduce((a, b) => a + b, 0);
  const avg = votes.reduce((sum, n, i) => sum + n * (i + 1), 0) / total;
  return { votes, total, avg };
}

export function RatingPoll({
  poll,
  compact = false,
  onVoted,
}: {
  poll: Poll;
  compact?: boolean;
  onVoted?: () => void;
}) {
  const { votes, vote } = useStore();
  const mine = votes[poll.id];
  const closed = poll.daysLeft <= 0;
  const [editing, setEditing] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const showResult = closed || (mine != null && !editing);

  if (showResult) {
    const { votes: v, total, avg } = pollStats(poll, mine);
    const max = Math.max(...v);
    return (
      <div className="animate-fade">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-[34px] font-semibold leading-none tracking-tight">
              {avg.toFixed(1).replace(".", ",")}
            </span>
            <span className="ml-1 text-sm text-muted">/ 10</span>
          </div>
          <span className="text-[13px] text-muted">{total} Stimmen</span>
        </div>
        <div className="mt-3 flex h-16 items-end gap-1">
          {v.map((n, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div
                className={`w-full rounded-t-[3px] transition-all ${
                  mine === i + 1 ? "bg-brand" : "bg-[#d6e4f2]"
                }`}
                style={{ height: `${Math.max(4, (n / max) * 56)}px` }}
              />
            </div>
          ))}
        </div>
        <div className="mt-1 flex gap-1 text-center text-[11px] text-faint">
          {v.map((_, i) => (
            <span key={i} className={`flex-1 ${mine === i + 1 ? "font-semibold text-brand" : ""}`}>
              {i + 1}
            </span>
          ))}
        </div>
        {!closed && (
          <div className="mt-3 flex items-center justify-between text-[13px]">
            <span className="inline-flex items-center gap-1.5 text-good">
              <Check size={15} /> Deine Bewertung: {mine}
            </span>
            <button onClick={() => setEditing(true)} className="font-semibold text-muted hover:text-ink">
              Ändern
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className={`grid grid-cols-10 ${compact ? "gap-1" : "gap-1.5"}`}>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
          const lit = hover != null && n <= hover;
          return (
            <button
              key={n}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(null)}
              onClick={() => {
                vote(poll.id, n);
                setEditing(false);
                onVoted?.();
              }}
              className={`aspect-square rounded-full border text-[14px] font-semibold transition-all ${
                lit
                  ? "border-brand bg-brand text-white"
                  : mine === n
                    ? "border-brand text-brand"
                    : "border-[#c7c7c7] text-muted hover:border-brand"
              }`}
              aria-label={`Bewertung ${n}`}
            >
              {n}
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-[12px] text-faint">
        <span>{poll.low}</span>
        <span>{poll.high}</span>
      </div>
    </div>
  );
}
