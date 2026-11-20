import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { news, projects, polls, STAGES } from "@/lib/data";
import { CityAvatar } from "@/components/ui";
import { EventCalendar } from "@/components/EventCalendar";

export default function Mitteilungen() {
  const items = [
    ...news
      .filter((n) => n.urgent)
      .map((n) => ({
        key: n.id,
        href: "/",
        text: (
          <>
            <b>{n.title}.</b> {n.text}
          </>
        ),
        time: n.posted,
        unread: true,
        urgent: true,
      })),
    ...polls
      .filter((p) => p.daysLeft > 0)
      .map((p) => {
        const pr = projects.find((x) => x.id === p.projectId)!;
        return {
          key: p.id,
          href: `/projekte/${pr.id}#umfrage`,
          text: (
            <>
              Neue Umfrage zu <b>{pr.title}</b>: Stimm bis in {p.daysLeft} Tagen ab.
            </>
          ),
          time: pr.posted,
          unread: true,
          urgent: false,
        };
      }),
    ...projects.map((pr) => ({
      key: pr.id,
      href: `/projekte/${pr.id}`,
      text: (
        <>
          <b>{pr.title}</b> ist jetzt in Phase „{STAGES[pr.stage]}“. {pr.updates[0].text}
        </>
      ),
      time: pr.posted,
      unread: false,
      urgent: false,
    })),
  ];

  return (
    <div className="mx-auto grid max-w-[1040px] gap-3 lg:grid-cols-[1fr_380px] lg:gap-6">
      <div className="lg:order-2">
        <div className="lg:sticky lg:top-[76px]">
          <EventCalendar />
        </div>
      </div>

      <div className="card overflow-hidden lg:order-1 max-sm:rounded-none">
        <h1 className="border-b border-line px-5 py-4 text-[20px] font-semibold tracking-[-0.01em]">Mitteilungen</h1>
        <ul>
          {items.map((i) => (
            <li key={i.key}>
              <Link
                href={i.href}
                className={`flex gap-3 border-b border-line px-5 py-3.5 last:border-0 hover:bg-black/[0.03] ${
                  i.unread ? "bg-brand-soft/50" : ""
                }`}
              >
                {i.urgent ? (
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#fde8e7] text-bad">
                    <AlertTriangle size={18} />
                  </span>
                ) : (
                  <CityAvatar size={40} />
                )}
                <p className="flex-1 text-[14px] leading-snug">{i.text}</p>
                <span className="shrink-0 text-[12px] text-muted">{i.time}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
