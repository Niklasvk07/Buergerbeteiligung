# mitreden

Bürgerbeteiligungs-App: Projekte der Kommune im Feed verfolgen, Fortschritt im Paketverfolgungs-Stil sehen, kommentieren und in Umfragen (Skala 1–10) abstimmen.

```bash
npm install
npm run dev
```

Aktuell mit Demo-Daten (fiktive Stadt Lindenfeld) in `src/lib/data.ts`; Stimmen, Kommentare und Likes werden lokal im Browser gespeichert.

## KI-Chat (Claude)

Der Chat-Button „Frag mitreden“ ruft über `src/app/api/chat/route.ts` die Claude-API auf.
Lege dafür im Projektordner eine Datei `.env.local` an:

```
ANTHROPIC_API_KEY=sk-ant-...
# optional, Standard ist claude-opus-5-5
# CLAUDE_MODEL=claude-haiku-5-5
```

Danach den Dev-Server neu starten. Der Schlüssel bleibt auf dem Server und landet nie im Browser.

## Bildnachweise

Fotos von Wikimedia Commons (CC BY / CC BY-SA, Urheber jeweils im Bild verlinkt) und Unsplash.
