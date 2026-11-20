import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { articles, getArticle } from "@/lib/data";
import { PhotoCredit } from "@/components/ui";

export function generateStaticParams() {
  return articles.map((a) => ({ id: a.id }));
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const a = getArticle(id);
  if (!a) notFound();
  const more = articles.filter((x) => x.id !== a.id).slice(0, 2);

  return (
    <article className="card mx-auto max-w-[720px] overflow-hidden bg-[#fffdf8] max-sm:rounded-none">
      <div className="flex items-center justify-between border-b border-ink/15 px-5 py-3 sm:px-10">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-muted hover:text-ink">
          <ArrowLeft size={16} /> Zurück
        </Link>
        <span className="font-serif text-[17px] font-bold">Saarbrücker Stadtblatt</span>
      </div>

      <div className="px-5 pt-7 sm:px-10">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-bad">{a.kicker}</p>
        <h1 className="mt-1 font-serif text-[34px] font-bold leading-[1.08] tracking-tight sm:text-[42px]">{a.title}</h1>
        <p className="mt-4 font-serif text-[19px] leading-snug text-ink/85">{a.lead}</p>
        <p className="mt-4 text-[13px] text-muted">
          {a.author} · {a.date} · {a.readMin} Min. Lesezeit
        </p>
      </div>

      <figure className="mt-6">
        <div className="relative aspect-[16/9] bg-[#e6e4df]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={a.image} alt="" className="h-full w-full object-cover" />
          <PhotoCredit credit={a.credit} className="absolute bottom-2 right-2" />
        </div>
        <figcaption className="px-5 pt-2 text-[13px] italic text-muted sm:px-10">{a.caption}</figcaption>
      </figure>

      <div className="space-y-5 px-5 py-7 font-serif text-[18px] leading-[1.7] text-ink/90 sm:px-10">
        {a.body.map((p, i) => (
          <p key={i} className={i === 0 ? "first-letter:float-left first-letter:mr-2 first-letter:text-[56px] first-letter:font-bold first-letter:leading-[0.9]" : ""}>
            {p}
          </p>
        ))}
        {a.quote && (
          <blockquote className="border-l-4 border-bad py-1 pl-5">
            <p className="text-[22px] italic leading-snug">„{a.quote.text}“</p>
            <footer className="mt-2 font-sans text-[13px] not-italic text-muted">— {a.quote.by}</footer>
          </blockquote>
        )}
        <p className="font-sans text-[12px] text-faint">{a.sourceNote}</p>
      </div>

      <div className="border-t border-ink/15 px-5 py-6 sm:px-10">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-muted">Mehr aus dem Stadtblatt</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {more.map((m) => (
            <Link key={m.id} href={`/stadtblatt/${m.id}`} className="group flex gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.image} alt="" className="h-16 w-20 shrink-0 rounded object-cover" />
              <span className="font-serif text-[16px] font-bold leading-snug group-hover:underline">{m.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
