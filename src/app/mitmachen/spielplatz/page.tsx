"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Eraser, RotateCcw, Send } from "lucide-react";
import { COMMUNITY_PICKS, PIECES, PLAYGROUND_BUDGET, type PieceId } from "@/lib/data";
import { useStore } from "@/lib/store";
import { PieceIcon } from "@/components/PieceIcon";

const COLS = 10;
const ROWS = 7;
type Tool = PieceId | "eraser";
type Grid = Record<string, PieceId>;

const costOf = (g: Grid) => Object.values(g).reduce((s, id) => s + PIECES.find((p) => p.id === id)!.cost, 0);
const fmt = (n: number) => n.toLocaleString("de-DE", { maximumFractionDigits: 1 });

export default function Spielplatz() {
  const { playground, savePlayground, ready } = useStore();
  const [grid, setGrid] = useState<Grid>({});
  const [tool, setTool] = useState<Tool>("schaukel");
  const [hover, setHover] = useState<string | null>(null);
  const [warn, setWarn] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // gespeicherten Entwurf laden
  useEffect(() => {
    if (ready && playground) {
      setGrid(playground as Grid);
      setSubmitted(true);
    }
  }, [ready, playground]);

  const spent = useMemo(() => costOf(grid), [grid]);
  const left = PLAYGROUND_BUDGET - spent;
  const count = Object.keys(grid).length;

  const flash = (msg: string) => {
    setWarn(msg);
    setTimeout(() => setWarn(null), 1800);
  };

  const clickCell = (key: string) => {
    if (submitted) return;
    const current = grid[key];
    if (tool === "eraser" || current === tool) {
      if (!current) return;
      const { [key]: _removed, ...rest } = grid;
      void _removed;
      setGrid(rest);
      return;
    }
    const piece = PIECES.find((p) => p.id === tool)!;
    const refund = current ? PIECES.find((p) => p.id === current)!.cost : 0;
    if (piece.cost - refund > left + 1e-9) {
      flash(`Budget reicht nicht – ${piece.name} kostet ${fmt(piece.cost)} Tsd €`);
      return;
    }
    setGrid({ ...grid, [key]: tool });
  };

  const submit = () => {
    savePlayground(grid);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const maxPick = Math.max(...Object.values(COMMUNITY_PICKS));
  const myPieces = new Set(Object.values(grid));

  return (
    <div className="mx-auto max-w-[1040px] space-y-3">
      <div className="flex items-center gap-3 px-4 sm:px-0">
        <Link href="/umfragen" className="grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm" aria-label="Zurück">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <p className="text-[13px] font-medium text-muted">Ideen-Labor · Bürgerpark Hafeninsel</p>
          <h1 className="text-[24px] font-semibold leading-tight tracking-[-0.02em]">Gestalte den neuen Spielplatz</h1>
        </div>
      </div>

      {submitted && (
        <div className="card animate-fade flex items-center gap-3 p-4 max-sm:rounded-none">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#e3f3ea] text-good">
            <Check size={20} />
          </span>
          <div className="flex-1">
            <p className="text-[15px] font-semibold">Danke! Dein Entwurf ist eingereicht.</p>
            <p className="text-[13px] text-muted">Die Ideen fließen in die Planung und werden bei der Ideen-Werkstatt am 28. November vorgestellt.</p>
          </div>
          <button onClick={() => setSubmitted(false)} className="h-9 shrink-0 rounded-full bg-black/5 px-4 text-[13px] font-semibold hover:bg-black/10">
            Bearbeiten
          </button>
        </div>
      )}

      <div className="grid gap-3 lg:grid-cols-[1fr_300px]">
        {/* Spielfläche */}
        <div className="card p-3 sm:p-4 max-sm:rounded-none">
          <div className="mb-3 flex items-center justify-between gap-3 px-1">
            <div className="flex-1">
              <div className="flex items-baseline justify-between text-[13px]">
                <span className="font-semibold">Budget</span>
                <span className={left < 5 ? "font-semibold text-bad" : "text-muted"}>
                  {fmt(spent)} / {PLAYGROUND_BUDGET} Tsd €
                </span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#ebe9e5]">
                <div
                  className={`h-full rounded-full transition-all ${left < 5 ? "bg-bad" : left < 20 ? "bg-warn" : "bg-good"}`}
                  style={{ width: `${Math.min(100, (spent / PLAYGROUND_BUDGET) * 100)}%` }}
                />
              </div>
            </div>
            <button
              onClick={() => !submitted && setGrid({})}
              disabled={submitted || count === 0}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-black/5 px-3 text-[13px] font-semibold disabled:opacity-40"
            >
              <RotateCcw size={14} /> Leeren
            </button>
          </div>

          <div
            className="relative grid select-none overflow-hidden rounded-2xl p-2"
            style={{
              gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
              background:
                "radial-gradient(circle at 20% 30%, #9fd38a 0, transparent 40%), radial-gradient(circle at 80% 70%, #8cc876 0, transparent 45%), #93cd7f",
              boxShadow: "inset 0 0 0 6px #d9c7a1, inset 0 0 0 7px #c4ae84",
            }}
            onMouseLeave={() => setHover(null)}
          >
            {Array.from({ length: ROWS * COLS }, (_, i) => {
              const key = `${i % COLS}-${Math.floor(i / COLS)}`;
              const piece = grid[key];
              const ghost = !submitted && !piece && hover === key && tool !== "eraser";
              const erasing = !submitted && hover === key && piece && tool === "eraser";
              return (
                <button
                  key={key}
                  onClick={() => clickCell(key)}
                  onMouseEnter={() => setHover(key)}
                  className={`relative grid aspect-square place-items-center rounded-lg transition-colors ${
                    submitted ? "cursor-default" : "hover:bg-white/25"
                  } ${!piece ? "outline outline-1 -outline-offset-1 outline-white/25" : ""}`}
                  aria-label={piece ? PIECES.find((p) => p.id === piece)!.name : "Freies Feld"}
                >
                  {piece && (
                    <span className={`animate-pop grid h-full w-full place-items-center ${erasing ? "opacity-40" : ""}`}>
                      <PieceIcon id={piece} size="82%" />
                    </span>
                  )}
                  {ghost && (
                    <span className="grid h-full w-full place-items-center opacity-45">
                      <PieceIcon id={tool as PieceId} size="82%" />
                    </span>
                  )}
                </button>
              );
            })}
            {warn && (
              <div className="animate-fade absolute inset-x-0 bottom-3 mx-auto w-fit rounded-full bg-ink/90 px-4 py-2 text-[13px] font-semibold text-white">
                {warn}
              </div>
            )}
          </div>
          <p className="mt-2 px-1 text-[12px] text-muted">
            Element wählen, dann aufs Feld tippen. Nochmal tippen oder Radierer zum Entfernen.
          </p>
        </div>

        {/* Werkzeugkasten – auf kleinen Bildschirmen über der Fläche */}
        <div className="order-first space-y-3 lg:order-none">
          {!submitted && (
          <div className="card p-3 max-sm:rounded-none">
            <p className="px-1 pb-2 text-[13px] font-semibold text-muted">Elemente</p>
            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6 lg:grid-cols-3">
              {PIECES.map((p) => (
                <ToolButton
                  key={p.id}
                  on={tool === p.id}
                  disabled={submitted}
                  onClick={() => setTool(p.id)}
                  label={p.name}
                  sub={`${fmt(p.cost)} Tsd €`}
                  icon={<PieceIcon id={p.id} size={34} />}
                />
              ))}
              <ToolButton
                on={tool === "eraser"}
                disabled={submitted}
                onClick={() => setTool("eraser")}
                label="Radierer"
                sub="entfernen"
                icon={<Eraser size={24} className="text-muted" />}
              />
            </div>
          </div>
          )}

          {submitted ? (
            <div className="card p-4 max-sm:rounded-none">
              <p className="text-[15px] font-semibold">Das wünschen sich andere</p>
              <p className="text-[12px] text-muted">Wie oft ein Element in Entwürfen vorkommt</p>
              <ul className="mt-3 space-y-2">
                {[...PIECES]
                  .sort((a, b) => COMMUNITY_PICKS[b.id] - COMMUNITY_PICKS[a.id])
                  .slice(0, 6)
                  .map((p) => (
                    <li key={p.id} className="flex items-center gap-2 text-[13px]">
                      <PieceIcon id={p.id} size={22} />
                      <span className="w-24 shrink-0">{p.name}</span>
                      <span className="h-2 flex-1 overflow-hidden rounded-full bg-[#ebe9e5]">
                        <span
                          className={`block h-full rounded-full ${myPieces.has(p.id) ? "bg-brand" : "bg-[#b9d3ef]"}`}
                          style={{ width: `${(COMMUNITY_PICKS[p.id] / maxPick) * 100}%` }}
                        />
                      </span>
                    </li>
                  ))}
              </ul>
              <p className="mt-3 text-[12px] text-muted">Blau = auch in deinem Entwurf</p>
            </div>
          ) : (
            <button
              onClick={submit}
              disabled={count < 3}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand text-[15px] font-semibold text-white hover:bg-brand-dark disabled:opacity-35"
            >
              <Send size={17} /> {count < 3 ? `Noch ${3 - count} Elemente platzieren` : "Entwurf einreichen"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ToolButton({
  on,
  disabled,
  onClick,
  label,
  sub,
  icon,
}: {
  on: boolean;
  disabled?: boolean;
  onClick: () => void;
  label: string;
  sub: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center rounded-xl px-1 py-2 text-center transition-all disabled:opacity-50 ${
        on ? "bg-brand-soft shadow-[inset_0_0_0_2px_#0a66c2]" : "bg-[#f6f5f2] hover:bg-[#eceae5]"
      }`}
    >
      <span className="grid h-9 place-items-center">{icon}</span>
      <span className="mt-1 text-[11px] font-semibold leading-tight">{label}</span>
      <span className="text-[10px] text-muted">{sub}</span>
    </button>
  );
}
