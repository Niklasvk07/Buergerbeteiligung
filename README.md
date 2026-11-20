# mitreden

Bürgerbeteiligungs-App: Projekte der Kommune im Feed verfolgen, Fortschritt im Paketverfolgungs-Stil sehen, kommentieren und in Umfragen (Skala 1–10) abstimmen.

```bash
npm install
npm run dev
```

Aktuell mit Demo-Daten (fiktive Stadt Lindenfeld) in `src/lib/data.ts`; Stimmen, Kommentare und Likes werden lokal im Browser gespeichert.

## KI-Chat

Der Chat-Button „Frag mitreden“ ruft über `src/app/api/chat/route.ts` eine KI auf – Claude, wenn
`ANTHROPIC_API_KEY` gesetzt ist, sonst Google Gemini mit `GEMINI_API_KEY` (mit automatischem
Ausweichen auf andere Gemini-Modelle bei Überlastung). Datei `.env.local` im Projektordner:

```
GEMINI_API_KEY=...
# oder
ANTHROPIC_API_KEY=sk-ant-...
# optional: CLAUDE_MODEL=claude-haiku-5-5 / GEMINI_MODEL=...
```

Danach den Dev-Server neu starten. Der Schlüssel bleibt auf dem Server und landet nie im Browser.

## Bildnachweise

Fotos von Wikimedia Commons (CC BY / CC BY-SA, Urheber jeweils im Bild verlinkt) und Unsplash.
