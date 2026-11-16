export const STAGES = ["Idee", "Planung", "Beschluss", "Bau", "Fertig"] as const;

export type Category = "Verkehr" | "Bildung" | "Umwelt" | "Freizeit" | "Stadtbild";

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

export type Project = {
  id: string;
  title: string;
  teaser: string;
  category: Category;
  district: string;
  stage: number;
  posted: string;
  office: string;
  cost: string;
  timeframe: string;
  budget: "gruen" | "gelb" | "rot";
  facts: string[];
  updates: Update[];
  likes: number;
  comments: Comment[];
  pollId?: string;
  map: { x: number; y: number };
  hue: [string, string];
};

export type Poll = {
  id: string;
  projectId: string;
  question: string;
  low: string;
  high: string;
  daysLeft: number;
  votes: number[]; // index 0 = Note 1 … index 9 = Note 10
};

export const CATEGORY_COLORS: Record<Category, string> = {
  Verkehr: "#0a66c2",
  Bildung: "#7a3ee8",
  Umwelt: "#057642",
  Freizeit: "#e06d10",
  Stadtbild: "#b24020",
};

export const projects: Project[] = [
  {
    id: "radweg-hauptstrasse",
    title: "Geschützter Radweg Hauptstraße",
    teaser: "1,4 km baulich getrennter Radweg zwischen Bahnhof und Rathaus.",
    category: "Verkehr",
    district: "Altstadt",
    stage: 1,
    posted: "2 Std.",
    office: "Amt für Mobilität",
    cost: "1,2 Mio €",
    timeframe: "2027 – 2028",
    budget: "gruen",
    facts: [
      "Parkplätze entfallen auf einer Seite (ca. 40).",
      "Zu 60 % durch Landesmittel gefördert.",
      "Bauzeit abschnittsweise, Straße bleibt befahrbar.",
    ],
    updates: [
      { date: "12. Nov.", stage: 1, text: "Erste Entwurfsvarianten liegen vor." },
      { date: "03. Sep.", stage: 0, text: "Antrag aus der Bürgerversammlung aufgenommen." },
    ],
    likes: 214,
    pollId: "p-radweg",
    map: { x: 46, y: 44 },
    hue: ["#0a66c2", "#4fa3e3"],
    comments: [
      {
        id: "c1",
        author: "Jana K.",
        district: "Altstadt",
        text: "Endlich! Morgens mit Kindern ist die Hauptstraße aktuell echt gefährlich.",
        time: "1 Std.",
        likes: 32,
        replies: [
          {
            id: "c1r",
            author: "Amt für Mobilität",
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
        district: "Nordviertel",
        text: "Wohin sollen die Lieferwagen der Geschäfte ausweichen?",
        time: "50 Min.",
        likes: 18,
      },
    ],
  },
  {
    id: "kita-sonnenhof",
    title: "Neubau Kita Sonnenhof",
    teaser: "80 neue Betreuungsplätze in Holzbauweise.",
    category: "Bildung",
    district: "Südstadt",
    stage: 3,
    posted: "1 Tag",
    office: "Amt für Bildung",
    cost: "4,8 Mio €",
    timeframe: "2025 – Sommer 2027",
    budget: "gelb",
    facts: [
      "Rohbau fertig, Innenausbau läuft.",
      "Kosten 6 % über Plan (Materialpreise).",
      "Anmeldung startet im Frühjahr 2027.",
    ],
    updates: [
      { date: "10. Nov.", stage: 3, text: "Richtfest gefeiert, Dach ist dicht." },
      { date: "02. Apr.", stage: 3, text: "Baubeginn." },
      { date: "14. Dez.", stage: 2, text: "Stadtrat hat einstimmig zugestimmt." },
    ],
    likes: 389,
    map: { x: 62, y: 74 },
    hue: ["#7a3ee8", "#b18cf5"],
    comments: [
      {
        id: "c3",
        author: "Mehmet A.",
        district: "Südstadt",
        text: "Wird es auch Plätze für unter Dreijährige geben?",
        time: "5 Std.",
        likes: 21,
        replies: [
          {
            id: "c3r",
            author: "Amt für Bildung",
            text: "Ja, 30 der 80 Plätze sind für U3 vorgesehen.",
            time: "3 Std.",
            likes: 15,
            official: true,
          },
        ],
      },
    ],
  },
  {
    id: "freibad",
    title: "Sanierung Freibad am Mühlbach",
    teaser: "Neue Technik, Kinderbecken und längere Öffnungszeiten.",
    category: "Freizeit",
    district: "Mühlbach",
    stage: 2,
    posted: "3 Tage",
    office: "Amt für Sport",
    cost: "3,1 Mio €",
    timeframe: "Herbst 2027",
    budget: "gruen",
    facts: [
      "Saison 2027 bleibt das Bad geöffnet.",
      "Abendschwimmen bis 21 Uhr geplant.",
      "Solarthermie heizt künftig die Becken.",
    ],
    updates: [
      { date: "08. Nov.", stage: 2, text: "Vorlage geht im Dezember in den Stadtrat." },
      { date: "20. Jun.", stage: 1, text: "Gutachten zur Technik abgeschlossen." },
    ],
    likes: 502,
    pollId: "p-freibad",
    map: { x: 22, y: 58 },
    hue: ["#e06d10", "#f6b04a"],
    comments: [
      {
        id: "c4",
        author: "Lisa M.",
        district: "Mühlbach",
        text: "Abendschwimmen wäre super für Berufstätige.",
        time: "2 Tage",
        likes: 47,
      },
    ],
  },
  {
    id: "buergerpark",
    title: "Bürgerpark auf der Brache",
    teaser: "Aus dem alten Güterbahnhof soll ein Park werden. Was wünschst du dir?",
    category: "Umwelt",
    district: "Nordviertel",
    stage: 0,
    posted: "5 Tage",
    office: "Amt für Stadtgrün",
    cost: "noch offen",
    timeframe: "ab 2028",
    budget: "gelb",
    facts: [
      "Fläche: 3,5 Hektar.",
      "Ideen-Werkstatt am 28. November.",
      "Förderantrag beim Bund in Vorbereitung.",
    ],
    updates: [{ date: "11. Nov.", stage: 0, text: "Fläche wurde von der Bahn gekauft." }],
    likes: 276,
    pollId: "p-park",
    map: { x: 58, y: 18 },
    hue: ["#057642", "#5fbf7f"],
    comments: [],
  },
  {
    id: "led-licht",
    title: "LED-Straßenbeleuchtung",
    teaser: "Alle 2.300 Laternen umgerüstet – 62 % weniger Strom.",
    category: "Umwelt",
    district: "Gesamte Stadt",
    stage: 4,
    posted: "1 Woche",
    office: "Stadtwerke",
    cost: "1,9 Mio €",
    timeframe: "abgeschlossen",
    budget: "gruen",
    facts: [
      "Spart rund 410.000 € Stromkosten pro Jahr.",
      "Nachts automatisch gedimmt.",
      "Unter Budget abgeschlossen.",
    ],
    updates: [
      { date: "04. Nov.", stage: 4, text: "Letzte Laterne umgerüstet." },
      { date: "15. Feb.", stage: 3, text: "Umrüstung gestartet." },
    ],
    likes: 618,
    pollId: "p-led",
    map: { x: 80, y: 40 },
    hue: ["#00563b", "#3a9a6e"],
    comments: [
      {
        id: "c5",
        author: "Peter S.",
        district: "Ostend",
        text: "Am Ostring ist es seitdem deutlich zu dunkel.",
        time: "6 Tage",
        likes: 9,
        replies: [
          {
            id: "c5r",
            author: "Stadtwerke",
            text: "Danke für den Hinweis, wir prüfen die Dimmung dort.",
            time: "5 Tage",
            likes: 6,
            official: true,
          },
        ],
      },
    ],
  },
  {
    id: "marktplatz",
    title: "Neugestaltung Marktplatz",
    teaser: "Mehr Bäume, Wasserspiel und Platz für den Wochenmarkt.",
    category: "Stadtbild",
    district: "Altstadt",
    stage: 1,
    posted: "2 Wochen",
    office: "Stadtplanung",
    cost: "2,6 Mio €",
    timeframe: "2028",
    budget: "gelb",
    facts: [
      "Drei Entwürfe im Wettbewerb.",
      "Wochenmarkt bleibt während der Bauzeit.",
      "Entscheidung im Frühjahr 2027.",
    ],
    updates: [{ date: "30. Okt.", stage: 1, text: "Wettbewerb ausgeschrieben." }],
    likes: 143,
    map: { x: 40, y: 34 },
    hue: ["#b24020", "#e58a5f"],
    comments: [],
  },
];

export const polls: Poll[] = [
  {
    id: "p-radweg",
    projectId: "radweg-hauptstrasse",
    question: "Wie wichtig ist dir ein geschützter Radweg auf der Hauptstraße?",
    low: "unwichtig",
    high: "sehr wichtig",
    daysLeft: 5,
    votes: [18, 6, 9, 11, 22, 19, 41, 63, 58, 97],
  },
  {
    id: "p-park",
    projectId: "buergerpark",
    question: "Wie gerne würdest du den Bürgerpark mitgestalten?",
    low: "gar nicht",
    high: "unbedingt",
    daysLeft: 12,
    votes: [4, 3, 5, 9, 14, 21, 30, 44, 38, 52],
  },
  {
    id: "p-freibad",
    projectId: "freibad",
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
  },
];

export const events = [
  { date: "28", month: "Nov", title: "Ideen-Werkstatt Bürgerpark", place: "Alte Halle, Nordviertel" },
  { date: "04", month: "Dez", title: "Bürgerversammlung Radweg", place: "Rathaus, Saal 1" },
  { date: "11", month: "Dez", title: "Stadtratssitzung", place: "Rathaus, live im Stream" },
];

export const getProject = (id: string) => projects.find((p) => p.id === id);
export const getPoll = (id?: string) => polls.find((p) => p.id === id);
