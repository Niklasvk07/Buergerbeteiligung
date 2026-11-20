"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUp, Sparkles, X } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Was passiert gerade in St. Johann?",
  "Welche Umfragen laufen noch?",
  "Was kostet die Kita pro Einwohner?",
  "Welche Termine gibt es nächste Woche?",
];

const OPEN_EVENT = "mitreden-open-chat";
export const openChat = (prompt?: string) =>
  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: prompt }));

/** Karte in der Seitenleiste */
export function ChatCard() {
  return (
    <div className="card overflow-hidden">
      <div className="bg-[linear-gradient(135deg,#0a66c2,#5b8def_60%,#8f7cf0)] p-5 text-white">
        <Sparkles size={20} />
        <h3 className="mt-2 text-[16px] font-semibold leading-tight">Frag mitreden</h3>
        <p className="mt-0.5 text-[13px] text-white/85">Zusammenfassungen und Antworten zu allen Projekten.</p>
      </div>
      <div className="space-y-1.5 p-3">
        {SUGGESTIONS.slice(0, 2).map((s) => (
          <button
            key={s}
            onClick={() => openChat(s)}
            className="block w-full rounded-xl bg-[#f6f5f2] px-3 py-2 text-left text-[13px] font-medium hover:bg-[#eceae5]"
          >
            {s}
          </button>
        ))}
        <button
          onClick={() => openChat()}
          className="mt-1 h-9 w-full rounded-full bg-ink text-[13px] font-semibold text-white hover:bg-black"
        >
          Chat öffnen
        </button>
      </div>
    </div>
  );
}

/** Schwebender Button + Chat-Fenster (global im Layout) */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [noKey, setNoKey] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content: q }];
    setMsgs([...next, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (res.status === 503) {
        setNoKey(true);
        setMsgs(next);
        return;
      }
      if (!res.ok || !res.body) throw new Error();
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setMsgs([...next, { role: "assistant", content: acc }]);
      }
    } catch {
      setMsgs([...next, { role: "assistant", content: "Der Chat ist gerade nicht erreichbar. Läuft der Server noch? Versuch es gleich noch einmal." }]);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    const h = (e: Event) => {
      setOpen(true);
      const p = (e as CustomEvent<string | undefined>).detail;
      if (p) setTimeout(() => send(p), 50);
    };
    window.addEventListener(OPEN_EVENT, h);
    return () => window.removeEventListener(OPEN_EVENT, h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msgs, busy]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [msgs]);

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="animate-fade fixed bottom-20 right-4 z-40 flex h-14 items-center gap-2 rounded-full bg-ink pl-4 pr-5 text-[14px] font-semibold text-white shadow-[0_8px_30px_rgba(0,0,0,0.25)] transition-transform hover:scale-[1.03] md:bottom-6 md:right-6"
          aria-label="KI-Chat öffnen"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[linear-gradient(135deg,#0a66c2,#8f7cf0)]">
            <Sparkles size={16} />
          </span>
          Frag mitreden
        </button>
      )}

      {open && (
        <div className="animate-rise fixed inset-x-0 bottom-0 z-50 flex h-[85dvh] flex-col overflow-hidden rounded-t-3xl bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.18)] md:inset-x-auto md:bottom-6 md:right-6 md:h-[620px] md:w-[400px] md:rounded-3xl">
          <div className="flex items-center gap-3 border-b border-line px-4 py-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[linear-gradient(135deg,#0a66c2,#8f7cf0)] text-white">
              <Sparkles size={17} />
            </span>
            <div className="flex-1 leading-tight">
              <p className="text-[15px] font-semibold">Frag mitreden</p>
              <p className="text-[12px] text-muted">KI-Assistent · Antworten ohne Gewähr</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="grid h-8 w-8 place-items-center rounded-full bg-black/5 hover:bg-black/10"
              aria-label="Chat schließen"
            >
              <X size={17} />
            </button>
          </div>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {msgs.length === 0 && !noKey && (
              <div className="pt-4">
                <p className="text-[22px] font-semibold leading-tight tracking-[-0.02em]">Hallo! Was möchtest du über Saarbrücken wissen?</p>
                <div className="mt-5 space-y-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="block w-full rounded-2xl bg-[#f6f5f2] px-4 py-3 text-left text-[14px] font-medium hover:bg-[#eceae5]"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {msgs.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <p className="max-w-[85%] rounded-2xl rounded-br-md bg-brand px-3.5 py-2 text-[15px] text-white">{m.content}</p>
                </div>
              ) : (
                <div key={i} className="max-w-[92%] text-[15px] leading-relaxed">
                  {m.content ? <Rich text={m.content} onNavigate={() => setOpen(false)} /> : <Typing />}
                </div>
              ),
            )}
            {noKey && (
              <div className="rounded-2xl bg-[#fdf0e1] p-4 text-[14px] leading-snug">
                <p className="font-semibold">Noch kein KI-Schlüssel hinterlegt</p>
                <p className="mt-1 text-ink/80">
                  Lege im Projektordner eine Datei <code className="rounded bg-white/70 px-1">.env.local</code> mit{" "}
                  <code className="rounded bg-white/70 px-1">GEMINI_API_KEY=…</code> oder{" "}
                  <code className="rounded bg-white/70 px-1">ANTHROPIC_API_KEY=…</code> an und starte den Server neu.
                </p>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-line p-3 pb-[max(12px,env(safe-area-inset-bottom))]"
          >
            <div className="flex items-center rounded-full bg-[#f1f0ed] pl-4 pr-1.5 focus-within:bg-white focus-within:shadow-[0_0_0_2px_#0a66c2]">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Frag etwas …"
                className="h-11 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted"
              />
              <button
                disabled={!input.trim() || busy}
                className="grid h-8 w-8 place-items-center rounded-full bg-brand text-white disabled:opacity-30"
                aria-label="Senden"
              >
                <ArrowUp size={17} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

function Typing() {
  return (
    <span className="inline-flex gap-1 py-2">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-faint" style={{ animationDelay: `${i * 120}ms` }} />
      ))}
    </span>
  );
}

/** Minimaler Markdown-Renderer: Absätze, Listen, **fett**, [Links](/pfad) */
function Rich({ text, onNavigate }: { text: string; onNavigate: () => void }) {
  const blocks = text.split(/\n{2,}/);
  const inline = (s: string, key: string) => {
    const parts = s.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
    return parts.map((p, i) => {
      const bold = p.match(/^\*\*([^*]+)\*\*$/);
      if (bold) return <strong key={key + i}>{bold[1]}</strong>;
      const link = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        const internal = link[2].startsWith("/");
        return internal ? (
          <Link key={key + i} href={link[2]} onClick={onNavigate} className="font-semibold text-brand underline-offset-2 hover:underline">
            {link[1]}
          </Link>
        ) : (
          <a key={key + i} href={link[2]} target="_blank" rel="noreferrer" className="font-semibold text-brand hover:underline">
            {link[1]}
          </a>
        );
      }
      return <span key={key + i}>{p}</span>;
    });
  };
  return (
    <div className="space-y-2">
      {blocks.map((b, bi) => {
        const lines = b.split("\n").filter(Boolean);
        if (lines.length && lines.every((l) => /^\s*([-*•]|\d+\.)\s+/.test(l))) {
          return (
            <ul key={bi} className="space-y-1">
              {lines.map((l, li) => (
                <li key={li} className="flex gap-2">
                  <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  <span>{inline(l.replace(/^\s*([-*•]|\d+\.)\s+/, ""), `${bi}-${li}-`)}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={bi}>
            {lines.map((l, li) => (
              <span key={li}>
                {inline(l, `${bi}-${li}-`)}
                {li < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
