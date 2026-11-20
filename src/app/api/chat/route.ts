import Anthropic from "@anthropic-ai/sdk";
import {
  articles,
  BUERGERBUERO,
  events,
  formatMio,
  KOMMUNE,
  news,
  perCapita,
  polls,
  projects,
  STAGES,
} from "@/lib/data";

export const runtime = "nodejs";

const MODEL = process.env.CLAUDE_MODEL ?? "claude-opus-5-5";
// Server-seitiger Fallback bei Ablehnungen gibt es nur für Opus/Sonnet/Fable.
const SUPPORTS_FALLBACK = /claude-(opus|sonnet|fable)/.test(MODEL);

function buildContext() {
  const avg = (v: number[]) => {
    const n = v.reduce((a, b) => a + b, 0);
    return (v.reduce((s, c, i) => s + c * (i + 1), 0) / n).toFixed(1);
  };
  return {
    kommune: KOMMUNE,
    projekte: projects.map((p) => ({
      link: `/projekte/${p.id}`,
      titel: p.title,
      kurz: p.teaser,
      stadtteil: p.district,
      thema: p.category,
      phase: `${STAGES[p.stage]} (Schritt ${p.stage + 1} von 5)`,
      kosten: formatMio(p.costMio),
      geplant: formatMio(p.planMio),
      proEinwohner: perCapita(p.costMio),
      zeitraum: p.timeframe,
      naechsterTermin: p.nextDate,
      finanzierung: p.funding.map((f) => `${f.label}: ${formatMio(f.mio)}`),
      fakten: p.facts,
      verlauf: p.updates.map((u) => `${u.date}: ${u.text}`),
      kommentare: p.comments.map((c) => `${c.author}: ${c.text}`),
    })),
    umfragen: polls.map((p) => ({
      projekt: projects.find((x) => x.id === p.projectId)?.title,
      frage: p.question,
      status: p.daysLeft > 0 ? `läuft noch ${p.daysLeft} Tage` : "beendet",
      durchschnitt: `${avg(p.votes)} von 10`,
      stimmen: p.votes.reduce((a, b) => a + b, 0),
      details: p.info,
      ergebnis: p.outcome,
    })),
    meldungen: news.map((n) => ({ art: n.tag, titel: n.title, text: n.text, ort: n.district, wann: n.posted })),
    stadtblatt: articles.map((a) => ({ link: `/stadtblatt/${a.id}`, titel: a.title, text: [a.lead, ...a.body].join(" ") })),
    termine: events.map((e) => ({ datum: e.end ? `${e.date} bis ${e.end}` : e.date, zeit: e.time, titel: e.title, ort: e.place, art: e.type })),
    kontakt: BUERGERBUERO,
    seiten: {
      umfragen: "/umfragen",
      spielplatzBaukasten: "/mitmachen/spielplatz",
      mitteilungenUndKalender: "/mitteilungen",
      profil: "/profil",
    },
  };
}

const SYSTEM = `Du bist der Assistent der Bürgerbeteiligungs-App „mitreden“ für ${KOMMUNE.name}. Heute ist Freitag, der 20. November 2026.

Du hilfst Bürgerinnen und Bürgern, Projekte, Umfragen, Meldungen und Termine ihrer Stadt zu verstehen.

So antwortest du:
- Auf Deutsch, freundlich, in einfacher Sprache und kurz: meist 2–5 Sätze oder eine knappe Liste.
- Nur auf Basis der Daten unten. Wenn etwas dort nicht steht, sag das ehrlich und verweise auf die Funktion „Frage an die Stadt“ oder das Bürgeramt.
- Neutral: Du gibst keine politische Empfehlung, wie jemand abstimmen soll. Du kannst Argumente aus den Daten und Kommentaren neutral zusammenfassen.
- Verlinke passende Seiten der App als Markdown-Link, z. B. [Radweg Mainzer Straße](/projekte/radweg-mainzer-strasse).
- Nutze **fett** sparsam für Zahlen oder Termine. Keine Überschriften, keine Tabellen.

Daten der App (JSON):
${JSON.stringify(buildContext())}`;

type Msg = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response("NO_KEY", { status: 503 });
  }

  let messages: Msg[] = [];
  try {
    const body = await req.json();
    messages = (Array.isArray(body.messages) ? body.messages : [])
      .filter(
        (m: Msg) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim(),
      )
      .slice(-16)
      .map((m: Msg) => ({ role: m.role, content: m.content.slice(0, 2000) }));
  } catch {
    return new Response("Ungültige Anfrage", { status: 400 });
  }
  if (!messages.length || messages[0].role !== "user") {
    return new Response("Ungültige Anfrage", { status: 400 });
  }

  const client = new Anthropic();
  const stream = client.beta.messages.stream({
    model: MODEL,
    max_tokens: 4096,
    system: SYSTEM,
    messages,
    output_config: { effort: "low" },
    ...(SUPPORTS_FALLBACK ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const } : {}),
  });

  const encoder = new TextEncoder();
  const body = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") {
          controller.enqueue(encoder.encode("\n\nDazu kann ich leider nichts sagen."));
        }
      } catch (err) {
        console.error("Claude-Chat Fehler:", err);
        controller.enqueue(encoder.encode("\n\nEntschuldigung, gerade gibt es ein technisches Problem. Bitte versuch es gleich noch einmal."));
      }
      controller.close();
    },
  });

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
