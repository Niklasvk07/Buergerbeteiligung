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
  "Güdingen",
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
export type Credit = { author: string; license: string; source: string };

export type Project = {
  id: string;
  title: string;
  teaser: string;
  image: string;
  credit?: Credit;
  category: Category;
  district: string;
  stage: number;
  posted: string;
  planMio: number;
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
  tag: "Verkehr" | "Unwetter" | "Termin" | "Ergebnis";
  title: string;
  text: string;
  image?: string;
  district: string;
  posted: string;
  likes: number;
  projectId?: string;
  urgent?: boolean;
};

export type Article = {
  id: string;
  kicker: string;
  title: string;
  lead: string;
  body: string[];
  quote?: { text: string; by: string };
  image: string;
  credit?: Credit;
  caption: string;
  author: string;
  date: string;
  readMin: number;
  sourceNote: string;
};

export type Poll = {
  id: string;
  projectId: string;
  question: string;
  low: string;
  high: string;
  daysLeft: number;
  votes: number[]; // index 0 = Note 1 … index 9 = Note 10
  info: string[];
  outcome?: string;
};

export type CalEvent = {
  id: string;
  date: string; // ISO yyyy-mm-dd
  end?: string;
  time: string;
  title: string;
  place: string;
  type: "Markt" | "Termin" | "Kundgebung" | "Abstimmung" | "Workshop" | "Kultur";
  text: string;
};

const unsplash = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=75`;
const commons = (file: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=1400`;
const cc = (author: string, license: string, file: string): Credit => ({
  author,
  license,
  source: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replace(/ /g, "_"))}`,
});

const F_MAINZER = "20210129 Mainzer Straße 22 Saarbrücken.jpg";
const F_PARK = "Ruhegarten (Rondell) im Bürgerpark-Hafeninsel 2016.jpg";
const F_MARKT = "Saarbrücken, restaurants on the St. Johanner Markt.jpg";
const F_XMAS = "Christkindlmarkt2016Saarbrücken2.jpg";
const F_RATHAUS = "20191205 Rathaus Saarbrücken 01.jpg";

export const projects: Project[] = [
  {
    id: "radweg-mainzer-strasse",
    title: "Geschützter Radweg Mainzer Straße",
    teaser: "1,4 km baulich getrennter Radweg zwischen Hauptbahnhof und Landwehrplatz.",
    image: commons(F_MAINZER),
    credit: cc("Flocci Nivis", "CC BY 4.0", F_MAINZER),
    category: "Verkehr",
    district: "St. Johann",
    stage: 1,
    posted: "vor 2 Std.",
    planMio: 1.2,
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
          {
            id: "c1r2",
            author: "Markus W.",
            district: "St. Johann",
            text: "Variante B klingt gut, aber bitte mit Abstellbügeln vor den Läden.",
            time: "25 Min.",
            likes: 7,
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
        replies: [
          {
            id: "c2r",
            author: "Stadt Saarbrücken",
            text: "Geplant sind feste Ladezonen in den Seitenstraßen. Details stellen wir am 4. Dezember vor.",
            time: "30 Min.",
            likes: 9,
            official: true,
          },
        ],
      },
      {
        id: "c2b",
        author: "Aylin D.",
        district: "Malstatt",
        text: "Ich pendle jeden Tag mit dem Rad zur Uni – eine durchgehende Verbindung wäre ein Traum.",
        time: "20 Min.",
        likes: 11,
      },
    ],
  },
  {
    id: "kita-burbach",
    title: "Neue Kita in Burbach",
    teaser: "80 Betreuungsplätze in Holzbauweise, 30 davon für unter Dreijährige.",
    image: unsplash("photo-1770096679916-2cd9c720d400"),
    category: "Bildung",
    district: "Burbach",
    stage: 3,
    posted: "vor 1 Tag",
    planMio: 4.53,
    costMio: 4.8,
    timeframe: "2025 – Sommer 2027",
    nextDate: "Anmeldung ab März 2027",
    funding: [
      { label: "Land", mio: 2.0 },
      { label: "Stadt", mio: 1.8 },
      { label: "Bund", mio: 1.0 },
    ],
    facts: ["Rohbau fertig, Innenausbau läuft.", "Mehrkosten durch gestiegene Materialpreise."],
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
      {
        id: "c3b",
        author: "Sabine L.",
        district: "Burbach",
        text: "Toll, dass mit Holz gebaut wird. Gibt es auch einen Garten mit Hochbeeten?",
        time: "2 Std.",
        likes: 8,
      },
    ],
  },
  {
    id: "freibad-dudweiler",
    title: "Sanierung Freibad Dudweiler",
    teaser: "Neue Technik, ein Kinderbecken und Abendschwimmen bis 21 Uhr.",
    image: unsplash("photo-1791521157092-b69b07a479d8"),
    category: "Freizeit",
    district: "Dudweiler",
    stage: 2,
    posted: "vor 3 Tagen",
    planMio: 2.6,
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
        replies: [
          {
            id: "c4r",
            author: "Stadt Saarbrücken",
            text: "Genau dafür ist es gedacht – Dienstag und Donnerstag bis 21 Uhr.",
            time: "2 Tage",
            likes: 19,
            official: true,
          },
        ],
      },
      {
        id: "c4b",
        author: "Georg H.",
        district: "Dudweiler",
        text: "Warum ist es teurer geworden als geplant?",
        time: "1 Tag",
        likes: 14,
        replies: [
          {
            id: "c4br",
            author: "Stadt Saarbrücken",
            text: "Das Gutachten hat Schäden an den Leitungen gefunden. Ein Teil davon wird durch EU-Mittel gedeckt.",
            time: "20 Std.",
            likes: 10,
            official: true,
          },
        ],
      },
    ],
  },
  {
    id: "buergerpark-hafeninsel",
    title: "Erweiterung Bürgerpark Hafeninsel",
    teaser: "Mehr Grün, ein neuer Spielplatz und Wege am Saarufer. Was wünschst du dir?",
    image: commons(F_PARK),
    credit: cc("Andreas heiske", "CC BY-SA 4.0", F_PARK),
    category: "Umwelt",
    district: "Malstatt",
    stage: 0,
    posted: "vor 5 Tagen",
    planMio: 2.5,
    costMio: 2.5,
    costNote: "Schätzung",
    timeframe: "ab 2028",
    nextDate: "Ideen-Werkstatt am 28. Nov.",
    funding: [
      { label: "Bund (beantragt)", mio: 2.0 },
      { label: "Stadt", mio: 0.5 },
    ],
    facts: ["Rund 3,5 Hektar zusätzliche Fläche.", "Den neuen Spielplatz könnt ihr selbst mitgestalten."],
    updates: [{ date: "11. Nov.", stage: 0, text: "Förderantrag beim Bund eingereicht." }],
    likes: 276,
    pollId: "p-park",
    comments: [
      {
        id: "c6",
        author: "Nina F.",
        district: "Malstatt",
        text: "Bitte mehr Schatten! Im Sommer ist es dort kaum auszuhalten.",
        time: "4 Tage",
        likes: 25,
      },
      {
        id: "c7",
        author: "Jonas P.",
        district: "St. Johann",
        text: "Ein Calisthenics-Bereich wäre super.",
        time: "3 Tage",
        likes: 13,
      },
    ],
  },
  {
    id: "led-licht",
    title: "LED-Straßenbeleuchtung",
    teaser: "Alle 9.800 Laternen umgerüstet – 62 % weniger Strom.",
    image: unsplash("photo-1566276423184-a8c13d2a88a1"),
    category: "Umwelt",
    district: "ganze Stadt",
    stage: 4,
    posted: "vor 1 Woche",
    planMio: 2.1,
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
    image: commons(F_MARKT),
    credit: cc("Dguendel", "CC BY 3.0", F_MARKT),
    category: "Stadtbild",
    district: "St. Johann",
    stage: 1,
    posted: "vor 2 Wochen",
    planMio: 2.6,
    costMio: 2.75,
    timeframe: "2028",
    nextDate: "Entwürfe ab Frühjahr 2027",
    funding: [
      { label: "Land", mio: 1.4 },
      { label: "Stadt", mio: 1.35 },
    ],
    facts: ["Drei Entwürfe im Wettbewerb.", "Gastronomie bleibt während der Bauzeit geöffnet."],
    updates: [{ date: "30. Okt.", stage: 1, text: "Wettbewerb ausgeschrieben." }],
    likes: 143,
    comments: [
      {
        id: "c8",
        author: "Claudia B.",
        district: "St. Johann",
        text: "Bitte den Brunnen erhalten, der gehört einfach dazu.",
        time: "1 Woche",
        likes: 31,
        replies: [
          {
            id: "c8r",
            author: "Stadt Saarbrücken",
            text: "Der Brunnen steht unter Denkmalschutz und bleibt in allen drei Entwürfen.",
            time: "6 Tage",
            likes: 22,
            official: true,
          },
        ],
      },
    ],
  },
];

export const news: News[] = [
  {
    id: "n-a6",
    tag: "Verkehr",
    title: "A6 in beide Richtungen gesperrt",
    text: "Wegen Bauarbeiten ist die A6 bei Saarbrücken in beiden Fahrtrichtungen voll gesperrt. Umleitungen sind ausgeschildert – plant mehr Zeit ein.",
    image: unsplash("photo-1762247019055-f0170f1c7245"),
    district: "ganze Stadt",
    posted: "vor 1 Std.",
    likes: 64,
    urgent: true,
  },
  {
    id: "n-b51",
    tag: "Verkehr",
    title: "Güdingen: Auffahrt B51 nur als Einbahnstraße",
    text: "Bis einschließlich 22. November ist die Auffahrt zur B51 in Güdingen nur in eine Richtung befahrbar. Die Gegenrichtung wird über Brebach umgeleitet.",
    district: "Güdingen",
    posted: "vor 3 Std.",
    likes: 29,
  },
  {
    id: "n-starkregen",
    tag: "Unwetter",
    title: "Starkregen: Kanalisation an mehreren Stellen übergelaufen",
    text: "Nach den heftigen Regenfällen sind in einigen Stadtteilen Gullys übergelaufen und Keller vollgelaufen. Die Feuerwehr war im Dauereinsatz. Tipp: Rückstauklappen jetzt prüfen lassen.",
    image: unsplash("photo-1774686251372-33e8fae4faef"),
    district: "Brebach-Fechingen",
    posted: "vor 6 Std.",
    likes: 51,
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
    text: "Donnerstag, 26. November, 17 Uhr im Rathaus St. Johann. Ohne Anmeldung.",
    image: unsplash("photo-1503428593586-e225b39bddfe"),
    district: "St. Johann",
    posted: "vor 4 Tagen",
    likes: 21,
  },
];

/** Stadtblatt – Berichte im Stil eines Ortsblatts. Basierend auf Meldungen aus der Woche, frei formuliert. */
export const articles: Article[] = [
  {
    id: "christkindl-markt",
    kicker: "Advent in der Innenstadt",
    title: "Lichter, Glühwein und ein kleiner Tippfehler",
    lead: "Seit Montag funkelt die Innenstadt wieder: Der Saarbrücker Christkindl-Markt hat eröffnet und lädt bis zum 23. Dezember zum Bummeln ein.",
    body: [
      "Rund zwei Wochen vor dem ersten Advent wurde am Montagabend der Christkindl-Markt eröffnet. Bis zum 23. Dezember haben die Buden täglich von 11 bis 21 Uhr geöffnet – rund um den St. Johanner Markt und durch die Innenstadt.",
      "Für viele ist der erste Glühwein des Jahres Pflicht. Die gute Nachricht: Die Tasse bleibt in diesem Jahr unter fünf Euro. Wer genau hinschaut, entdeckt auf der Sammeltasse 2026 übrigens einen kleinen Schreibfehler – manche halten sie deshalb schon jetzt für ein Sammlerstück.",
      "Auch überregional wird die Weihnachtszeit im Saarland wahrgenommen: Ein Reiseportal hat einen Weihnachtsmarkt aus der Region in seine Liste der schönsten Märkte Deutschlands aufgenommen.",
      "Wichtig für Marktgänger: Der Wochen- und Bauernmarkt zieht während des Christkindl-Markts vom St. Johanner Markt in die Obertorstraße um.",
    ],
    quote: { text: "Für mich beginnt Weihnachten erst mit dem ersten Glühwein am St. Johanner Markt.", by: "Besucherin am Eröffnungsabend" },
    image: commons(F_XMAS),
    credit: cc("RaveDog; Julian Freyer", "CC BY 4.0", F_XMAS),
    caption: "Buden mit Lichterglanz: Der Christkindl-Markt in der Saarbrücker Innenstadt.",
    author: "Redaktion mitreden",
    date: "20. November 2026",
    readMin: 2,
    sourceNote: "Nach Meldungen der Landeshauptstadt und regionaler Medien.",
  },
  {
    id: "open-data",
    kicker: "Digitales Rathaus",
    title: "Saarbrücken öffnet seine Daten",
    lead: "Mit einem neuen Online-Portal stellt die Landeshauptstadt Daten der Stadtverwaltung frei zur Verfügung – für Bürger, Firmen und Forschung.",
    body: [
      "Unter opendata.saarbruecken.de sind ab sofort städtische Datensätze frei zugänglich. Wer wissen will, wie sich die eigene Stadt entwickelt, kann die Zahlen dort selbst ansehen und weiterverwenden.",
      "Offene Daten sind eine wichtige Grundlage für mehr Beteiligung: Wer Zahlen und Fakten kennt, kann besser mitreden. Auch Apps und Projekte aus der Zivilgesellschaft können darauf aufbauen.",
    ],
    image: commons(F_RATHAUS),
    credit: cc("Flocci Nivis", "CC BY 4.0", F_RATHAUS),
    caption: "Das Rathaus St. Johann – Sitz der Stadtverwaltung.",
    author: "Redaktion mitreden",
    date: "19. November 2026",
    readMin: 1,
    sourceNote: "Nach einer Mitteilung der Landeshauptstadt Saarbrücken.",
  },
  {
    id: "thermografie",
    kicker: "Klima & Energie",
    title: "Wärmebilder zeigen, wo das Haus Energie verliert",
    lead: "Mit einer neuen Thermografie-Initiative fördert die Stadt Wärmebildaufnahmen von privaten Gebäuden.",
    body: [
      "Wärmebilder machen sichtbar, wo ein Haus Wärme verliert – etwa an Fenstern, Dächern oder schlecht gedämmten Wänden. Die Landeshauptstadt fördert solche Aufnahmen jetzt im Rahmen einer neuen Initiative.",
      "Gerade im Winter sind die Unterschiede besonders gut zu erkennen. Wer mitmachen möchte, findet die Bedingungen auf der Website der Stadt.",
    ],
    image: unsplash("photo-1495709165577-351d14380bdd"),
    caption: "Gerade in kalten Nächten lassen sich Wärmeverluste gut erkennen.",
    author: "Redaktion mitreden",
    date: "17. November 2026",
    readMin: 1,
    sourceNote: "Nach einer Mitteilung der Landeshauptstadt Saarbrücken.",
  },
  {
    id: "katastrophenschutz",
    kicker: "Sicherheit",
    title: "Großübung „Flächenlage“: Wenn alle zusammen helfen",
    lead: "Am vergangenen Samstag haben Feuerwehr, Hilfsorganisationen und Verwaltung im Regionalverband den Ernstfall geprobt.",
    body: [
      "Bei der groß angelegten Katastrophenschutzübung „Flächenlage“ am 14. November übten viele Einsatzkräfte gemeinsam, wie sie bei einem großflächigen Schadensereignis zusammenarbeiten.",
      "Dass solche Übungen wichtig sind, haben die Starkregen-Einsätze der letzten Tage gezeigt: Wenn viele Stadtteile gleichzeitig betroffen sind, zählt jede eingespielte Abstimmung.",
    ],
    image: unsplash("photo-1593436878048-92622a77d315"),
    caption: "Einsatzkräfte trainieren regelmäßig für den Ernstfall.",
    author: "Redaktion mitreden",
    date: "16. November 2026",
    readMin: 1,
    sourceNote: "Nach einer Mitteilung der Landeshauptstadt Saarbrücken.",
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
    info: [
      "Radweg auf beiden Seiten, durch einen Bordstein von der Fahrbahn getrennt.",
      "Ca. 40 Parkplätze entfallen, dafür kommen Ladezonen in die Seitenstraßen.",
      "Kosten: 1,2 Mio €, davon 60 % vom Land gefördert.",
    ],
  },
  {
    id: "p-park",
    projectId: "buergerpark-hafeninsel",
    question: "Wie gerne würdest du die Erweiterung des Bürgerparks mitgestalten?",
    low: "gar nicht",
    high: "unbedingt",
    daysLeft: 12,
    votes: [4, 3, 5, 9, 14, 21, 30, 44, 38, 52],
    info: [
      "Rund 3,5 Hektar neue Fläche am Saarufer.",
      "Geplant: Spielplatz, Liegewiese, schattige Wege.",
      "Den Spielplatz kannst du im Bereich Mitmachen selbst entwerfen.",
    ],
  },
  {
    id: "p-freibad",
    projectId: "freibad-dudweiler",
    question: "Wie zufrieden bist du mit den geplanten Öffnungszeiten?",
    low: "unzufrieden",
    high: "sehr zufrieden",
    daysLeft: 2,
    votes: [7, 4, 6, 12, 25, 33, 61, 70, 44, 39],
    info: [
      "Mo, Mi, Fr: 9 – 19 Uhr",
      "Di, Do: 9 – 21 Uhr (Abendschwimmen)",
      "Sa, So und Feiertage: 8 – 20 Uhr",
      "Frühschwimmen für Vereine: Di und Do ab 7 Uhr",
    ],
  },
  {
    id: "p-led",
    projectId: "led-licht",
    question: "Wie bewertest du die neue Straßenbeleuchtung?",
    low: "schlecht",
    high: "sehr gut",
    daysLeft: 0,
    votes: [12, 8, 10, 14, 30, 41, 88, 120, 96, 71],
    info: ["9.800 Laternen auf LED umgerüstet.", "Nachts zwischen 23 und 5 Uhr gedimmt."],
    outcome: "Am Ostring wird die Nachtabsenkung zurückgenommen – das war der häufigste Kritikpunkt.",
  },
];

export const events: CalEvent[] = [
  {
    id: "e-xmas",
    date: "2026-11-16",
    end: "2026-12-23",
    time: "täglich 11 – 21 Uhr",
    title: "Christkindl-Markt",
    place: "Innenstadt / St. Johanner Markt",
    type: "Markt",
    text: "Buden, Glühwein und Lichterglanz in der Innenstadt.",
  },
  {
    id: "e-luisa",
    date: "2026-11-24",
    time: "17 – 19 Uhr",
    title: "Schulung „Luisa ist hier!“",
    place: "Frauennotruf Saarland",
    type: "Workshop",
    text: "Kostenlose Schulung für Gastronomie und Interessierte zum Hilfsangebot „Luisa ist hier!“.",
  },
  {
    id: "e-sprechstunde",
    date: "2026-11-26",
    time: "17 Uhr",
    title: "Bürgersprechstunde",
    place: "Rathaus St. Johann",
    type: "Termin",
    text: "Fragen, Anregungen, Kritik – ohne Anmeldung.",
  },
  {
    id: "e-werkstatt",
    date: "2026-11-28",
    time: "10 – 14 Uhr",
    title: "Ideen-Werkstatt Bürgerpark",
    place: "Bürgerpark Hafeninsel, Pavillon",
    type: "Workshop",
    text: "Gemeinsam Ideen für die Erweiterung des Bürgerparks sammeln.",
  },
  {
    id: "e-advent",
    date: "2026-11-29",
    time: "16 Uhr",
    title: "Adventssingen zum 1. Advent",
    place: "Ludwigskirche",
    type: "Kultur",
    text: "Offenes Singen für alle Generationen.",
  },
  {
    id: "e-kundgebung",
    date: "2026-12-03",
    time: "18 Uhr",
    title: "Kundgebung „Sichere Radwege“",
    place: "Landwehrplatz",
    type: "Kundgebung",
    text: "Angemeldete Kundgebung einer Bürgerinitiative für den Radweg Mainzer Straße.",
  },
  {
    id: "e-versammlung",
    date: "2026-12-04",
    time: "19 Uhr",
    title: "Bürgerversammlung Radweg",
    place: "Rathaus, Festsaal",
    type: "Termin",
    text: "Vorstellung der Varianten A und B mit Fragerunde.",
  },
  {
    id: "e-stadtrat",
    date: "2026-12-11",
    time: "15 Uhr",
    title: "Stadtratssitzung",
    place: "Rathaus, live im Stream",
    type: "Abstimmung",
    text: "Unter anderem Entscheidung zur Sanierung des Freibads Dudweiler.",
  },
];

export const BUERGERBUERO = {
  name: "Bürgeramt Saarbrücken",
  phone: "0681 000 000",
  mail: "buergeramt@mitreden.de",
  hours: "Mo–Fr 8–16 Uhr, Do bis 18 Uhr",
};

/** Wie gut macht die Stadt Beteiligung? */
export const CITY_BADGES = [
  { id: "antwort", title: "Schnelle Antworten", value: "Ø 1,8 Tage", progress: 1, hint: "Fragen im Schnitt in unter 2 Tagen beantwortet" },
  { id: "transparent", title: "Offener Haushalt", value: "6 / 6 Projekte", progress: 1, hint: "Alle Projekte mit Kosten und Finanzierung" },
  { id: "opendata", title: "Open Data", value: "Portal online", progress: 1, hint: "Städtische Daten frei zugänglich" },
  { id: "zuhoerer", title: "Gutes Zuhören", value: "87 %", progress: 0.87, hint: "Anteil beantworteter Fragen" },
  { id: "buergernah", title: "Bürgernah", value: "11 / 12", progress: 11 / 12, hint: "Bürgerversammlungen in diesem Jahr" },
  { id: "budget", title: "Budget im Griff", value: "3 / 6", progress: 0.5, hint: "Projekte im oder unter Plan" },
];

export const REWARD_SURVEY = {
  id: "s-kultur",
  title: "Kultur in Saarbrücken",
  reward: "2 Tickets fürs Staatstheater",
  minutes: 3,
  questions: [
    { id: "q1", type: "single", q: "Wie oft gehst du in Saarbrücken zu Kulturveranstaltungen?", options: ["Mehrmals im Monat", "Etwa einmal im Monat", "Ein paar Mal im Jahr", "Selten oder nie"] },
    { id: "q2", type: "multi", q: "Was besuchst du am liebsten?", options: ["Theater", "Konzerte", "Museen", "Kino", "Stadtfeste", "Lesungen"] },
    { id: "q3", type: "scale", q: "Wie zufrieden bist du mit dem Kulturangebot in deinem Stadtteil?", low: "gar nicht", high: "sehr" },
    { id: "q4", type: "single", q: "Was hält dich am ehesten davon ab, öfter hinzugehen?", options: ["Preise", "Anfahrt / Parken", "Uhrzeiten", "Ich erfahre zu spät davon", "Nichts davon"] },
    { id: "q5", type: "text", q: "Was fehlt dir in Saarbrücken kulturell?" },
  ],
} as const;

/** Spielplatz-Baukasten */
export type PieceId = "schaukel" | "rutsche" | "sandkasten" | "kletter" | "wippe" | "karussell" | "baum" | "bank" | "eimer" | "brunnen";
export const PIECES: { id: PieceId; name: string; cost: number; color: string }[] = [
  { id: "schaukel", name: "Schaukel", cost: 9, color: "#ef8354" },
  { id: "rutsche", name: "Rutsche", cost: 12, color: "#4f9de8" },
  { id: "sandkasten", name: "Sandkasten", cost: 5, color: "#e9c46a" },
  { id: "kletter", name: "Klettergerüst", cost: 18, color: "#8d6cd8" },
  { id: "wippe", name: "Wippe", cost: 4, color: "#e76f8a" },
  { id: "karussell", name: "Karussell", cost: 10, color: "#2a9d8f" },
  { id: "baum", name: "Baum", cost: 2, color: "#3f8f4f" },
  { id: "bank", name: "Bank", cost: 1.5, color: "#9c6b45" },
  { id: "eimer", name: "Mülleimer", cost: 0.5, color: "#6b7280" },
  { id: "brunnen", name: "Trinkbrunnen", cost: 3, color: "#38bdf8" },
];
export const PLAYGROUND_BUDGET = 80; // Tsd €
export const COMMUNITY_PICKS: Record<PieceId, number> = {
  schaukel: 412, rutsche: 388, sandkasten: 301, kletter: 356, wippe: 154,
  karussell: 197, baum: 445, bank: 372, eimer: 210, brunnen: 268,
};

/** Feed „Alle“ */
export type FeedItem =
  | { kind: "project"; item: Project }
  | { kind: "news"; item: News }
  | { kind: "article"; item: Article };
export const feed: FeedItem[] = [
  { kind: "news", item: news[0] },
  { kind: "project", item: projects[0] },
  { kind: "article", item: articles[0] },
  { kind: "news", item: news[1] },
  { kind: "project", item: projects[1] },
  { kind: "news", item: news[2] },
  { kind: "project", item: projects[2] },
  { kind: "project", item: projects[3] },
  { kind: "news", item: news[3] },
  { kind: "project", item: projects[4] },
  { kind: "news", item: news[4] },
  { kind: "project", item: projects[5] },
];

export const getProject = (id: string) => projects.find((p) => p.id === id);
export const getPoll = (id?: string) => polls.find((p) => p.id === id);
export const getArticle = (id: string) => articles.find((a) => a.id === id);

export const formatMio = (mio: number) =>
  mio >= 1
    ? `${mio.toLocaleString("de-DE", { maximumFractionDigits: 2 })} Mio €`
    : `${Math.round(mio * 1000).toLocaleString("de-DE")} Tsd €`;

export const perCapita = (mio: number) =>
  `${((mio * 1_000_000) / KOMMUNE.einwohner).toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`;

/** Budget-Ampel: Prognose vs. Plan */
export function budgetStatus(p: Project) {
  const diff = (p.costMio - p.planMio) / p.planMio;
  const level = diff <= 0.02 ? "gruen" : diff <= 0.1 ? "gelb" : "rot";
  return { diff, level } as const;
}
