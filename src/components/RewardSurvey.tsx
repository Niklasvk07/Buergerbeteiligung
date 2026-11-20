"use client";

import { useState } from "react";
import { ArrowLeft, Check, PartyPopper, Ticket, X } from "lucide-react";
import { REWARD_SURVEY } from "@/lib/data";
import { useStore } from "@/lib/store";

type Answer = string | string[] | number;

/** Mehrstufige Belohnungs-Umfrage – jederzeit abbrechbar */
export function RewardSurvey({ onClose }: { onClose: () => void }) {
  const { finishReward } = useStore();
  const qs = REWARD_SURVEY.questions;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [confirmCancel, setConfirmCancel] = useState(false);
  const done = step >= qs.length;
  const q = qs[Math.min(step, qs.length - 1)];
  const a = answers[q.id];

  const set = (v: Answer) => setAnswers((s) => ({ ...s, [q.id]: v }));
  const valid =
    q.type === "text" ? true : q.type === "multi" ? Array.isArray(a) && a.length > 0 : a !== undefined;

  const next = () => {
    if (step === qs.length - 1) finishReward();
    setStep((s) => s + 1);
  };
  const cancel = () => (done || step === 0 ? onClose() : setConfirmCancel(true));

  return (
    <div className="animate-fade fixed inset-0 z-50 flex items-end justify-center bg-black/45 sm:items-center" onClick={cancel}>
      <div
        className="animate-rise relative flex max-h-[92dvh] w-full max-w-[520px] flex-col overflow-hidden rounded-t-3xl bg-white sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Kopf mit Fortschritt */}
        <div className="flex items-center gap-3 px-5 pt-5">
          {step > 0 && !done ? (
            <button onClick={() => setStep((s) => s - 1)} className="grid h-8 w-8 place-items-center rounded-full bg-black/5" aria-label="Zurück">
              <ArrowLeft size={17} />
            </button>
          ) : (
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#fdf0e1] text-warn">
              <Ticket size={16} />
            </span>
          )}
          <div className="flex-1">
            <p className="text-[13px] font-semibold">{REWARD_SURVEY.title}</p>
            <div className="mt-1.5 flex gap-1">
              {qs.map((_, i) => (
                <span key={i} className={`h-1 flex-1 rounded-full ${i < step || done ? "bg-brand" : i === step ? "bg-brand/40" : "bg-[#e6e4df]"}`} />
              ))}
            </div>
          </div>
          <button onClick={cancel} className="grid h-8 w-8 place-items-center rounded-full bg-black/5" aria-label="Abbrechen">
            <X size={17} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-5 pt-6">
          {done ? (
            <div className="py-6 text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[linear-gradient(135deg,#f6c14b,#e8932c)] text-white shadow-lg">
                <PartyPopper size={30} />
              </span>
              <h3 className="mt-4 text-[22px] font-semibold tracking-[-0.02em]">Danke! Du bist im Lostopf.</h3>
              <p className="mt-1 text-[15px] text-muted">
                Unter allen Teilnehmenden verlosen wir {REWARD_SURVEY.reward}. Die Gewinner werden am 1. Dezember benachrichtigt.
              </p>
              <button onClick={onClose} className="mt-6 h-11 rounded-full bg-ink px-8 text-[15px] font-semibold text-white">
                Fertig
              </button>
            </div>
          ) : (
            <div key={q.id} className="animate-fade">
              <p className="text-[12px] font-semibold text-muted">
                Frage {step + 1} von {qs.length}
              </p>
              <h3 className="mt-1 text-[20px] font-semibold leading-snug tracking-[-0.01em]">{q.q}</h3>

              <div className="mt-5">
                {q.type === "single" &&
                  q.options.map((o) => (
                    <Option key={o} label={o} on={a === o} onClick={() => set(o)} />
                  ))}
                {q.type === "multi" &&
                  q.options.map((o) => {
                    const list = (Array.isArray(a) ? a : []) as string[];
                    const on = list.includes(o);
                    return (
                      <Option
                        key={o}
                        label={o}
                        on={on}
                        multi
                        onClick={() => set(on ? list.filter((x) => x !== o) : [...list, o])}
                      />
                    );
                  })}
                {q.type === "scale" && (
                  <div>
                    <div className="grid grid-cols-10 gap-1.5">
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                        <button
                          key={n}
                          onClick={() => set(n)}
                          className={`aspect-square rounded-full border text-[14px] font-semibold transition-colors ${
                            a === n ? "border-brand bg-brand text-white" : "border-[#c7c7c7] text-muted hover:border-brand"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                    <div className="mt-2 flex justify-between text-[12px] text-faint">
                      <span>{q.low}</span>
                      <span>{q.high}</span>
                    </div>
                  </div>
                )}
                {q.type === "text" && (
                  <textarea
                    autoFocus
                    rows={4}
                    value={typeof a === "string" ? a : ""}
                    onChange={(e) => set(e.target.value)}
                    placeholder="Optional – schreib einfach drauf los …"
                    className="w-full resize-none rounded-2xl bg-[#f1f0ed] p-4 text-[15px] outline-none focus:bg-white focus:shadow-[0_0_0_2px_#0a66c2]"
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {!done && (
          <div className="border-t border-line p-4">
            <button
              disabled={!valid}
              onClick={next}
              className="h-12 w-full rounded-full bg-brand text-[15px] font-semibold text-white hover:bg-brand-dark disabled:opacity-30"
            >
              {step === qs.length - 1 ? "Absenden & teilnehmen" : "Weiter"}
            </button>
          </div>
        )}

        {confirmCancel && (
          <div className="animate-fade absolute inset-0 grid place-items-center bg-white/90 p-6 backdrop-blur-sm">
            <div className="text-center">
              <p className="text-[18px] font-semibold">Umfrage abbrechen?</p>
              <p className="mt-1 text-[14px] text-muted">Deine Antworten gehen verloren und du nimmst nicht an der Verlosung teil.</p>
              <div className="mt-5 flex justify-center gap-2">
                <button onClick={() => setConfirmCancel(false)} className="h-10 rounded-full bg-brand px-5 text-[14px] font-semibold text-white">
                  Weitermachen
                </button>
                <button onClick={onClose} className="h-10 rounded-full bg-black/5 px-5 text-[14px] font-semibold">
                  Abbrechen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Option({ label, on, onClick, multi }: { label: string; on: boolean; onClick: () => void; multi?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`mb-2 flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-[15px] font-medium transition-colors ${
        on ? "bg-brand-soft text-brand-dark shadow-[inset_0_0_0_2px_#0a66c2]" : "bg-[#f6f5f2] hover:bg-[#eceae5]"
      }`}
    >
      <span
        className={`grid h-5 w-5 shrink-0 place-items-center border-2 ${multi ? "rounded-md" : "rounded-full"} ${
          on ? "border-brand bg-brand text-white" : "border-[#bdbdbd]"
        }`}
      >
        {on && <Check size={12} strokeWidth={3} />}
      </span>
      {label}
    </button>
  );
}
