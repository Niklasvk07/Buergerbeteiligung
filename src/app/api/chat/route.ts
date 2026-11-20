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
      kommentare: p.comments.map((c) => ({
        von: c.official ? `${c.author} (offizielle Antwort)` : c.author,
        text: c.text,
        antworten: (c.replies ?? []).map((r) => `${r.official ? `${r.author} (offizielle Antwort)` : r.author}: ${r.text}`),
      })),
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
- Offizielle Antworten der Stadt in den Kommentaren sind verlässliche Informationen – nutze sie.
- Nur auf Basis der Daten unten. Wenn etwas dort nicht steht, sag das ehrlich und verweise auf die Funktion „Frage an die Stadt“ oder das Bürgeramt.
- Neutral: Du gibst keine politische Empfehlung, wie jemand abstimmen soll. Du kannst Argumente aus den Daten und Kommentaren neutral zusammenfassen.
- Verlinke passende Seiten der App als Markdown-Link, z. B. [Radweg Mainzer Straße](/projekte/radweg-mainzer-strasse).
- Nutze **fett** sparsam für Zahlen oder Termine. Keine Überschriften, keine Tabellen.
- Bei Begrüßungen oder Smalltalk („moin“, „hallo“, „wer bist du?“): kurz und herzlich zurückgrüßen, in einem Satz sagen, wobei du hilfst, und 2–3 konkrete Themen aus den Daten anbieten (z. B. eine laufende Umfrage, eine aktuelle Meldung, einen Termin).
- Wenn jemand nach „aktuell“ oder „neu“ fragt, nenne zuerst dringende Meldungen (z. B. Sperrungen), dann laufende Umfragen.
- Wenn jemand Kritik äußert, nimm sie ernst, fasse den Stand sachlich zusammen und verweise auf „Frage an die Stadt“ oder die Diskussion beim Projekt.

Beispiele für den Ton (nicht wörtlich übernehmen, sondern passend zur Frage variieren):
Nutzer: moin!
Du: Moin! Ich bin der mitreden-Assistent und helfe dir bei Projekten, Umfragen und Terminen in Saarbrücken. Gerade läuft zum Beispiel die Umfrage zum [Freibad Dudweiler](/projekte/freibad-dudweiler) – nur noch **2 Tage**. Und Achtung: Die **A6 ist in beide Richtungen gesperrt**. Worüber möchtest du mehr wissen?

Nutzer: Was kostet der Radweg?
Du: Der [Radweg Mainzer Straße](/projekte/radweg-mainzer-strasse) kostet **1,2 Mio €** – das sind etwa **6,67 € pro Einwohner**. 60 % davon zahlt das Land. Am **4. Dezember** gibt es dazu eine Bürgerversammlung.

Daten der App (JSON):
${JSON.stringify(buildContext())}`;

type Msg = { role: "user" | "assistant"; content: string };

const encoder = new TextEncoder();
const ERROR_TEXT = "\n\nEntschuldigung, gerade gibt es ein technisches Problem. Bitte versuch es gleich noch einmal.";

/** Claude (Anthropic) – wird genutzt, wenn ANTHROPIC_API_KEY gesetzt ist */
function claudeStream(messages: Msg[]) {
  const client = new Anthropic();
  const stream = client.beta.messages.stream({
    model: MODEL,
    max_tokens: 4096,
    system: SYSTEM,
    messages,
    output_config: { effort: "low" },
    ...(SUPPORTS_FALLBACK ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const } : {}),
  });
  return new ReadableStream({
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
        controller.enqueue(encoder.encode(ERROR_TEXT));
      }
      controller.close();
    },
  });
}

/** Google Gemini (REST, Server-Sent Events) – wird genutzt, wenn nur GEMINI_API_KEY gesetzt ist.
 *  Ist ein Modell überlastet (503/429) oder nicht verfügbar (404), wird automatisch das nächste probiert. */
const GEMINI_MODELS = [
  ...(process.env.GEMINI_MODEL ? [process.env.GEMINI_MODEL] : []),
  "gemini-flash-latest",
  "gemini-flash-lite-latest",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
];

async function openGemini(messages: Msg[]) {
  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: SYSTEM }] },
    contents: messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    generationConfig: { maxOutputTokens: 2048, temperature: 0.4 },
  });
  for (const model of [...new Set(GEMINI_MODELS)]) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY! },
          body,
          signal: AbortSignal.timeout(15_000),
        },
      );
      if (res.ok && res.body) return res;
      const detail = await res.text();
      console.error(`Gemini ${model}: ${res.status}`, detail.slice(0, 300));
      if (![404, 429, 500, 503].includes(res.status)) return null; // z. B. ungültiger Schlüssel
    } catch (err) {
      console.error(`Gemini ${model}: Zeitüberschreitung/Netzwerk`, err);
    }
  }
  return null;
}

function geminiStream(messages: Msg[]) {
  return new ReadableStream({
    async start(controller) {
      try {
        const res = await openGemini(messages);
        if (!res?.body) {
          controller.enqueue(encoder.encode("Die KI ist gerade stark ausgelastet. Bitte versuch es in einem Moment noch einmal."));
          controller.close();
          return;
        }
        const reader = res.body.getReader();
        const dec = new TextDecoder();
        let buf = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            try {
              const json = JSON.parse(line.slice(5));
              const parts = json.candidates?.[0]?.content?.parts ?? [];
              for (const part of parts) {
                if (typeof part.text === "string" && !part.thought) controller.enqueue(encoder.encode(part.text));
              }
            } catch {
              // unvollständige Zeile – ignorieren
            }
          }
        }
      } catch (err) {
        console.error("Gemini-Chat Fehler:", err);
        controller.enqueue(encoder.encode(ERROR_TEXT));
      }
      controller.close();
    },
  });
}

export async function POST(req: Request) {
  const provider = process.env.ANTHROPIC_API_KEY ? "claude" : process.env.GEMINI_API_KEY ? "gemini" : null;
  if (!provider) {
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

  const body = provider === "claude" ? claudeStream(messages) : geminiStream(messages);
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
