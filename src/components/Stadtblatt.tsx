import Link from "next/link";
import { articles } from "@/lib/data";
import { PhotoCredit } from "./ui";

/** Titelseite im Stil eines Ortsblatts */
export function Stadtblatt() {
  const [lead, ...rest] = articles;
  return (
    <div className="card overflow-hidden bg-[#fffdf8] max-sm:rounded-none">
      {/* Kopf */}
      <header className="border-b-[3px] border-double border-ink/80 px-5 pb-3 pt-5 text-center sm:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Landeshauptstadt · Ausgabe 47</p>
        <h2 className="mt-1 font-serif text-[38px] font-bold leading-none tracking-tight sm:text-[46px]">
          Saarbrücker Stadtblatt
        </h2>
        <div className="mt-3 flex justify-between border-t border-ink/20 pt-2 text-[12px] text-muted">
          <span>Freitag, 20. November 2026</span>
          <span>Bürger informieren · mitreden</span>
        </div>
      </header>

      {/* Aufmacher */}
      <Link href={`/stadtblatt/${lead.id}`} className="group block px-5 pt-5 sm:px-8">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-bad">{lead.kicker}</p>
        <h3 className="mt-1 font-serif text-[30px] font-bold leading-[1.08] tracking-tight group-hover:underline sm:text-[36px]">
          {lead.title}
        </h3>
        <figure className="mt-4">
          <div className="relative aspect-[16/9] overflow-hidden rounded-md bg-[#e6e4df]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lead.image} alt="" className="h-full w-full object-cover" />
            <PhotoCredit credit={lead.credit} className="absolute bottom-2 right-2" />
          </div>
          <figcaption className="mt-1.5 text-[12px] italic text-muted">{lead.caption}</figcaption>
        </figure>
        <div className="mt-4 gap-6 font-serif text-[16px] leading-relaxed text-ink/90 sm:columns-2">
          <p className="font-semibold">{lead.lead}</p>
          <p className="mt-3">{lead.body[0]}</p>
        </div>
        <p className="mt-3 text-[13px] font-semibold text-brand">Ganzen Artikel lesen →</p>
      </Link>

      {/* weitere Artikel */}
      <div className="mt-6 grid border-t border-ink/15 sm:grid-cols-3 sm:divide-x sm:divide-ink/15">
        {rest.map((a) => (
          <Link
            key={a.id}
            href={`/stadtblatt/${a.id}`}
            className="group block border-b border-ink/15 px-5 py-5 last:border-b-0 sm:border-b-0 sm:px-5"
          >
            <div className="aspect-[4/3] overflow-hidden rounded bg-[#e6e4df]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.image} alt="" loading="lazy" className="h-full w-full object-cover grayscale-[15%]" />
            </div>
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-bad">{a.kicker}</p>
            <h4 className="mt-0.5 font-serif text-[19px] font-bold leading-tight group-hover:underline">{a.title}</h4>
            <p className="mt-1.5 line-clamp-3 font-serif text-[14px] leading-snug text-ink/75">{a.lead}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
