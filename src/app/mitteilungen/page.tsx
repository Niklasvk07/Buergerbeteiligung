import Link from "next/link";
import { projects, polls, STAGES } from "@/lib/data";
import { OfficeAvatar } from "@/components/ui";

export default function Mitteilungen() {
  const items = [
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
    })),
  ];

  return (
    <div className="mx-auto max-w-[680px]">
      <div className="card overflow-hidden max-sm:rounded-none">
        <h1 className="border-b border-line px-4 py-3 text-[18px] font-semibold">Mitteilungen</h1>
        <ul>
          {items.map((i) => (
            <li key={i.key}>
              <Link
                href={i.href}
                className={`flex gap-3 border-b border-line px-4 py-3 last:border-0 hover:bg-black/[0.03] ${
                  i.unread ? "bg-brand-soft/60" : ""
                }`}
              >
                <OfficeAvatar size={44} />
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
