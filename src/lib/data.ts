export const STAGES = ["Idee", "Planung", "Beschluss", "Bau", "Fertig"] as const;

export const KOMMUNE = { name: "Saarbrücken", einwohner: 180_000 };

export const KOMMUNEN = [
  { name: "Saarbrücken", active: true },
  { name: "Völklingen", active: false },
  { name: "Saarlouis", active: false },
  { name: "Homburg", active: false },
];

export const DISTRICTS = [
  "St. Johann",
  "Alt-Saarbrücken",
  "Malstatt",
  "Burbach",
  "Dudweiler",
  "St. Arnual",
  "Eschberg",
  "Brebach-Fechingen",
];

export type Category = "Verkehr" | "Bildung" | "Umwelt" | "Freizeit" | "Stadtbild";
export const CATEGORIES: Category[] = ["Verkehr", "Bildung", "Umwelt", "Freizeit", "Stadtbild"];

export type Comment = {
  id: string;
  author: string;
  district?: string;
  text: string;
  time: string;
  likes: number;
  official?: boolean;
  replies?: Comment[];
};

export type Update = { date: string; stage: number; text: string };
export type Funding = { label: string; mio: number };

export type Project = {
  id: string;
  title: string;
  teaser: string;
  image: string;
  category: Category;
  district: string;
  stage: number;
  posted: string;
  costMio: number;
  costNote?: string;
  timeframe: string;
  nextDate?: string;
  funding: Funding[];
  facts: string[];
  updates: Update[];
  likes: number;
  comments: Comment[];
  pollId?: string;
};

export type News = {
  id: string;
  tag: "Baustelle" | "Termin" | "Ergebnis";
  title: string;
  text: string;
  image?: string;
  district: string;
  posted: string;
  likes: number;
  projectId?: string;
};

export type Poll = {
  id: string;
  projectId: string;
  question: string;
  low: string;
  high: string;
  daysLeft: number;
  votes: number[]; // index 0 = Note 1 … index 9 = Note 10
  outcome?: string;
};

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=75`;

export const projects: Project[] = [
  {
    id: "radweg-mainzer-strasse",
    title: "Geschützter Radweg Mainzer Straße",
    teaser: "1,4 km baulich getrennter Radweg zwischen Hauptbahnhof und Landwehrplatz.",
    image: img("photo-1760296404401-a2a1d4d252ee"),
    category: "Verkehr",
    district: "St. Johann",
    stage: 1,
    posted: "vor 2 Std.",
    costMio: 1.2,
    timeframe: "2027 – 2028",
    nextDate: "Bürgerversammlung am 4. Dez.",
    funding: [
      { label: "Land", mio: 0.72 },
      { label: "Stadt", mio: 0.48 },
    ],
    facts: [
      "Auf einer Seite entfallen ca. 40 Parkplätze.",
      "Bauzeit abschnittsweise, die Straße bleibt befahrbar.",
    ],
    updates: [
      { date: "12. Nov.", stage: 1, text: "Zwei Entwurfsvarianten liegen vor." },
      { date: "03. Sep.", stage: 0, text: "Antrag aus der Bürgerversammlung aufgenommen." },
    ],
    likes: 214,
    pollId: "p-radweg",
    comments: [
      {
        id: "c1",
        author: "Jana K.",
        district: "St. Johann",
        text: "Endlich! Morgens mit Kindern ist die Mainzer Straße aktuell echt gefährlich.",
        time: "1 Std.",
        likes: 32,
        replies: [
          {
            id: "c1r",
            author: "Stadt Saarbrücken",
            text: "Danke! Die Schulwege sind in Variante B extra berücksichtigt.",
            time: "40 Min.",
            likes: 12,
            official: true,
          },
        ],
      },
      {
        id: "c2",
        author: "Thomas R.",
        district: "Alt-Saarbrücken",
        text: "Wohin sollen die Lieferwagen der Geschäfte ausweichen?",
        time: "50 Min.",
        likes: 18,
      },
    ],
  },
  {
    id: "kita-burbach",
    title: "Neue Kita in Burbach",
    teaser: "80 Betreuungsplätze in Holzbauweise, 30 davon für unter Dreijährige.",
    image: img("photo-1770096679916-2cd9c720d400"),
    category: "Bildung",
    district: "Burbach",
    stage: 3,
    posted: "vor 1 Tag",
    costMio: 4.8,
    timeframe: "2025 – Sommer 2027",
    nextDate: "Anmeldung ab März 2027",
    funding: [
      { label: "Land", mio: 2.0 },
      { label: "Stadt", mio: 1.8 },
      { label: "Bund", mio: 1.0 },
    ],
    facts: ["Rohbau fertig, Innenausbau läuft.", "Kosten 6 % über Plan wegen gestiegener Materialpreise."],
    updates: [
      { date: "10. Nov.", stage: 3, text: "Richtfest gefeiert, das Dach ist dicht." },
      { date: "02. Apr.", stage: 3, text: "Baubeginn." },
      { date: "14. Dez.", stage: 2, text: "Stadtrat hat einstimmig zugestimmt." },
    ],
    likes: 389,
    comments: [
      {
        id: "c3",
        author: "Mehmet A.",
        district: "Burbach",
        text: "Gibt es auch längere Öffnungszeiten für Schichtarbeiter?",
        time: "5 Std.",
        likes: 21,
        replies: [
          {
            id: "c3r",
            author: "Stadt Saarbrücken",
            text: "Geplant ist 6:30 bis 18 Uhr. Wir prüfen gerade eine Spätgruppe.",
            time: "3 Std.",
            likes: 15,
            official: true,
          },
        ],
      },
    ],
  },
  {
    id: "freibad-dudweiler",
    title: "Sanierung Freibad Dudweiler",
    teaser: "Neue Technik, ein Kinderbecken und Abendschwimmen bis 21 Uhr.",
    image: img("photo-1791521157092-b69b07a479d8"),
    category: "Freizeit",
    district: "Dudweiler",
    stage: 2,
    posted: "vor 3 Tagen",
    costMio: 3.1,
    timeframe: "Herbst 2027",
    nextDate: "Stadtrat entscheidet am 11. Dez.",
    funding: [
      { label: "Stadt", mio: 1.6 },
      { label: "Land", mio: 0.9 },
      { label: "EU", mio: 0.6 },
    ],
    facts: ["Die Saison 2027 bleibt das Bad geöffnet.", "Solarthermie heizt künftig die Becken."],
    updates: [
      { date: "08. Nov.", stage: 2, text: "Vorlage geht im Dezember in den Stadtrat." },
      { date: "20. Jun.", stage: 1, text: "Gutachten zur Technik abgeschlossen." },
    ],
    likes: 502,
    pollId: "p-freibad",
    comments: [
      {
        id: "c4",
        author: "Lisa M.",
        district: "Dudweiler",
        text: "Abendschwimmen wäre super für alle, die tagsüber arbeiten.",
        time: "2 Tage",
        likes: 47,
      },
    ],
  },
  {
    id: "buergerpark-malstatt",
    title: "Bürgerpark auf der Brache",
    teaser: "Aus dem alten Güterbahnhof in Malstatt soll ein Park werden. Was wünschst du dir?",
    image: img("photo-1736600119767-1a0217d12273"),
    category: "Umwelt",
    district: "Malstatt",
    stage: 0,
    posted: "vor 5 Tagen",
    costMio: 2.5,
    costNote: "Schätzung",
    timeframe: "ab 2028",
    nextDate: "Ideen-Werkstatt am 28. Nov.",
    funding: [
      { label: "Bund (beantragt)", mio: 2.0 },
      { label: "Stadt", mio: 0.5 },
    ],
    facts: ["Fläche: 3,5 Hektar.", "Die Stadt hat die Fläche von der Bahn gekauft."],
    updates: [{ date: "11. Nov.", stage: 0, text: "Kauf der Fläche abgeschlossen." }],
    likes: 276,
    pollId: "p-park",
    comments: [],
  },
  {
    id: "led-licht",
    title: "LED-Straßenbeleuchtung",
    teaser: "Alle 9.800 Laternen umgerüstet – 62 % weniger Strom.",
    image: img("photo-1566276423184-a8c13d2a88a1"),
    category: "Umwelt",
    district: "ganze Stadt",
    stage: 4,
    posted: "vor 1 Woche",
    costMio: 1.9,
    timeframe: "abgeschlossen",
    funding: [
      { label: "Stadt", mio: 1.1 },
      { label: "Bund", mio: 0.8 },
    ],
    facts: ["Spart rund 410.000 € Stromkosten pro Jahr.", "Nachts automatisch gedimmt."],
    updates: [
      { date: "04. Nov.", stage: 4, text: "Letzte Laterne umgerüstet." },
      { date: "15. Feb.", stage: 3, text: "Umrüstung gestartet." },
    ],
    likes: 618,
    pollId: "p-led",
    comments: [
      {
        id: "c5",
        author: "Peter S.",
        district: "Eschberg",
        text: "Am Ostring ist es seitdem deutlich zu dunkel.",
        time: "6 Tage",
        likes: 9,
        replies: [
          {
            id: "c5r",
            author: "Stadt Saarbrücken",
            text: "Danke für den Hinweis, die Dimmung dort wird angepasst.",
            time: "5 Tage",
            likes: 6,
            official: true,
          },
        ],
      },
    ],
  },
  {
    id: "st-johanner-markt",
    title: "Neugestaltung St. Johanner Markt",
    teaser: "Mehr Bäume, Schatten und Sitzplätze für heiße Sommer.",
    image: img("photo-1706650734164-91a863a73ecc"),
    category: "Stadtbild",
    district: "St. Johann",
    stage: 1,
    posted: "vor 2 Wochen",
    costMio: 2.6,
    timeframe: "2028",
    nextDate: "Entwürfe ab Frühjahr 2027",
    funding: [
      { label: "Land", mio: 1.4 },
      { label: "Stadt", mio: 1.2 },
    ],
    facts: ["Drei Entwürfe im Wettbewerb.", "Gastronomie bleibt während der Bauzeit geöffnet."],
    updates: [{ date: "30. Okt.", stage: 1, text: "Wettbewerb ausgeschrieben." }],
    likes: 143,
    comments: [],
  },
];

export const news: News[] = [
  {
    id: "n-sperrung",
    tag: "Baustelle",
    title: "Sperrung Mainzer Straße am Samstag",
    text: "Leitungsarbeiten von 7 bis 18 Uhr. Busse fahren eine Umleitung.",
    image: img("photo-1762247019055-f0170f1c7245"),
    district: "St. Johann",
    posted: "vor 4 Std.",
    likes: 37,
  },
  {
    id: "n-led-ergebnis",
    tag: "Ergebnis",
    title: "LED-Licht: 7,2 von 10 Punkten",
    text: "Danke für 490 Stimmen! Eure Hinweise zum Ostring setzen wir jetzt um.",
    district: "ganze Stadt",
    posted: "vor 2 Tagen",
    likes: 88,
    projectId: "led-licht",
  },
  {
    id: "n-sprechstunde",
    tag: "Termin",
    title: "Bürgersprechstunde im Rathaus",
    text: "Donnerstag, 17 Uhr, Rathaus St. Johann. Ohne Anmeldung.",
    image: img("photo-1503428593586-e225b39bddfe"),
    district: "St. Johann",
    posted: "vor 4 Tagen",
    likes: 21,
  },
];

export const polls: Poll[] = [
  {
    id: "p-radweg",
    projectId: "radweg-mainzer-strasse",
    question: "Wie wichtig ist dir ein geschützter Radweg auf der Mainzer Straße?",
    low: "unwichtig",
    high: "sehr wichtig",
    daysLeft: 5,
    votes: [18, 6, 9, 11, 22, 19, 41, 63, 58, 97],
  },
  {
    id: "p-park",
    projectId: "buergerpark-malstatt",
    question: "Wie gerne würdest du den Bürgerpark mitgestalten?",
    low: "gar nicht",
    high: "unbedingt",
    daysLeft: 12,
    votes: [4, 3, 5, 9, 14, 21, 30, 44, 38, 52],
  },
  {
    id: "p-freibad",
    projectId: "freibad-dudweiler",
    question: "Wie zufrieden bist du mit den geplanten Öffnungszeiten?",
    low: "unzufrieden",
    high: "sehr zufrieden",
    daysLeft: 2,
    votes: [7, 4, 6, 12, 25, 33, 61, 70, 44, 39],
  },
  {
    id: "p-led",
    projectId: "led-licht",
    question: "Wie bewertest du die neue Straßenbeleuchtung?",
    low: "schlecht",
    high: "sehr gut",
    daysLeft: 0,
    votes: [12, 8, 10, 14, 30, 41, 88, 120, 96, 71],
    outcome: "Am Ostring wird die Nachtabsenkung zurückgenommen – das war der häufigste Kritikpunkt.",
  },
];

export const BUERGERBUERO = {
  name: "Bürgeramt Saarbrücken",
  phone: "0681 000 000",
  mail: "buergeramt@mitreden-demo.de",
  hours: "Mo–Fr 8–16 Uhr, Do bis 18 Uhr",
};

/** Feed: Projekte und Meldungen gemischt, wie im Gemeindeblatt */
export type FeedItem = { kind: "project"; item: Project } | { kind: "news"; item: News };
export const feed: FeedItem[] = [
  { kind: "project", item: projects[0] },
  { kind: "news", item: news[0] },
  { kind: "project", item: projects[1] },
  { kind: "project", item: projects[2] },
  { kind: "news", item: news[1] },
  { kind: "project", item: projects[3] },
  { kind: "news", item: news[2] },
  { kind: "project", item: projects[4] },
  { kind: "project", item: projects[5] },
];

export const getProject = (id: string) => projects.find((p) => p.id === id);
export const getPoll = (id?: string) => polls.find((p) => p.id === id);

export const formatMio = (mio: number) =>
  mio >= 1
    ? `${mio.toLocaleString("de-DE", { maximumFractionDigits: 1 })} Mio €`
    : `${Math.round(mio * 1000).toLocaleString("de-DE")} Tsd €`;

export const perCapita = (mio: number) =>
  `${((mio * 1_000_000) / KOMMUNE.einwohner).toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`;
