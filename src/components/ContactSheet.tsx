"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { useStore } from "@/lib/store";

/** Frage an die Stadt – als Bottom-Sheet bzw. Dialog */
export function ContactSheet({ topic, onClose }: { topic?: string; onClose: () => void }) {
  const { sendQuestion } = useStore();
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="animate-fade fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <div
        className="animate-rise w-full max-w-[480px] rounded-t-3xl bg-white p-6 sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-[19px] font-semibold">Frage an die Stadt</h3>
            {topic && <p className="text-[13px] text-muted">zu „{topic}“</p>}
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-black/5" aria-label="Schließen">
            <X size={17} />
          </button>
        </div>

        {sent ? (
          <div className="py-8 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#e3f3ea] text-good">
              <Check size={24} />
            </span>
            <p className="mt-3 text-[16px] font-semibold">Danke, ist angekommen!</p>
            <p className="text-[14px] text-muted">Du bekommst innerhalb von 5 Werktagen eine Antwort.</p>
            <button
              onClick={onClose}
              className="mt-5 h-10 rounded-full bg-ink px-6 text-[14px] font-semibold text-white"
            >
              Fertig
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!text.trim()) return;
              sendQuestion();
              setSent(true);
            }}
          >
            <textarea
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Deine Frage …"
              rows={4}
              className="mt-4 w-full resize-none rounded-2xl bg-[#f1f0ed] p-4 text-[15px] outline-none focus:bg-white focus:shadow-[0_0_0_2px_#0a66c2]"
            />
            <button
              disabled={!text.trim()}
              className="mt-3 h-11 w-full rounded-full bg-brand text-[15px] font-semibold text-white hover:bg-brand-dark disabled:opacity-30"
            >
              Absenden
            </button>
            <p className="mt-2 text-center text-[12px] text-faint">Demo – es wird nichts verschickt.</p>
          </form>
        )}
      </div>
    </div>
  );
}
