"use client";

import { useState } from "react";
import { Award, Check, Clock, Lock, Mail, MapPin, MessageCircle, Phone, Sparkles, SlidersHorizontal, Star, UserPlus, HelpCircle, Ticket, Shapes, Timer, Landmark, Database, Ear, Users, PiggyBank } from "lucide-react";
import { BUERGERBUERO, CATEGORIES, CITY_BADGES, DISTRICTS, KOMMUNEN } from "@/lib/data";
import { useStore } from "@/lib/store";
import { ContactSheet } from "@/components/ContactSheet";

export default function Profil() {
  const { votes, follows, comments, questions, profile, setProfile, ready, rewardDone, playground } = useStore();
  const [ask, setAsk] = useState(false);

  const nVotes = ready ? Object.keys(votes).length : 0;
  const nComments = ready ? Object.values(comments).reduce((n, l) => n + l.length, 0) : 0;
  const nFollows = ready ? follows.length : 0;

  const badges = [
    { icon: Star, title: "Erste Stimme", hint: "1 Umfrage", done: nVotes >= 1 },
    { icon: SlidersHorizontal, title: "Umfrage-Profi", hint: "3 Umfragen", done: nVotes >= 3 },
    { icon: MessageCircle, title: "Meinungsmacher", hint: "1 Kommentar", done: nComments >= 1 },
    { icon: UserPlus, title: "Dranbleiber", hint: "3 Projekten folgen", done: nFollows >= 3 },
    { icon: HelpCircle, title: "Neugierig", hint: "1 Frage gestellt", done: ready && questions >= 1 },
    { icon: Ticket, title: "Glückspilz", hint: "Belohnungs-Umfrage", done: ready && rewardDone },
    { icon: Shapes, title: "Stadtplaner", hint: "Spielplatz entworfen", done: ready && !!playground },
    { icon: Sparkles, title: "Lokalheld", hint: "alle Abzeichen", done: false },
  ];
  badges[7].done = badges.slice(0, 7).every((b) => b.done);
  const earned = badges.filter((b) => b.done).length;

  return (
    <div className="mx-auto max-w-[640px] space-y-3">
      {/* Kopf */}
      <section className="card overflow-hidden max-sm:rounded-none">
        <div className="h-20 bg-[linear-gradient(120deg,#0a66c2,#70a6e0)]" />
        <div className="px-5 pb-5">
          <span className="-mt-9 grid h-[72px] w-[72px] place-items-center rounded-full border-4 border-white bg-[#dbe6f2] text-[22px] font-semibold text-brand-dark">
            Du
          </span>
          <h1 className="mt-2 text-[22px] font-semibold tracking-[-0.02em]">Hallo!</h1>
          <p className="inline-flex items-center gap-1 text-[14px] text-muted">
            <MapPin size={14} /> {profile.district}, {profile.kommune}
          </p>
          <div className="mt-4 grid grid-cols-3 divide-x divide-line rounded-2xl bg-[#f6f5f2] py-3 text-center">
            <Num n={nVotes} label="Stimmen" />
            <Num n={nComments} label="Kommentare" />
            <Num n={nFollows} label="gefolgt" />
          </div>
        </div>
      </section>

      {/* Kommune */}
      <section className="card p-5 max-sm:rounded-none">
        <h2 className="text-[16px] font-semibold">Deine Kommune</h2>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {KOMMUNEN.map((k) => {
            const on = profile.kommune === k.name;
            return (
              <button
                key={k.name}
                disabled={!k.active}
                onClick={() => setProfile({ kommune: k.name })}
                className={`flex items-center justify-between rounded-2xl px-4 py-3 text-left text-[14px] font-semibold transition-colors ${
                  on
                    ? "bg-brand text-white"
                    : k.active
                      ? "bg-[#f1f0ed] hover:bg-[#e8e6e2]"
                      : "bg-[#f6f5f2] text-faint"
                }`}
              >
                {k.name}
                {on ? <Check size={16} /> : !k.active && <span className="text-[11px] font-medium">bald</span>}
              </button>
            );
          })}
        </div>

        <label className="mt-5 block text-[13px] font-semibold text-muted">Stadtteil</label>
        <select
          value={profile.district}
          onChange={(e) => setProfile({ district: e.target.value })}
          className="mt-1.5 h-11 w-full rounded-xl bg-[#f1f0ed] px-3 text-[15px] outline-none focus:shadow-[0_0_0_2px_#0a66c2]"
        >
          {DISTRICTS.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>

        <p className="mt-5 text-[13px] font-semibold text-muted">Themen, die dich interessieren</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const on = profile.topics.includes(c);
            return (
              <button
                key={c}
                onClick={() =>
                  setProfile({ topics: on ? profile.topics.filter((t) => t !== c) : [...profile.topics, c] })
                }
                className={`h-8 rounded-full px-3.5 text-[13px] font-semibold transition-colors ${
                  on ? "bg-ink text-white" : "bg-[#f1f0ed] text-muted hover:text-ink"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </section>

      {/* Abzeichen der Stadt */}
      <section className="card p-5 max-sm:rounded-none">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[16px] font-semibold">So macht&apos;s {profile.kommune}</h2>
          <span className="text-[13px] text-muted">
            {CITY_BADGES.filter((b) => b.progress >= 1).length} von {CITY_BADGES.length} erreicht
          </span>
        </div>
        <p className="text-[13px] text-muted">Abzeichen der Stadt für gute Bürgerbeteiligung</p>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {CITY_BADGES.map((b) => {
            const Icon = CITY_ICONS[b.id] ?? Landmark;
            const done = b.progress >= 1;
            return (
              <div key={b.id} className={`rounded-2xl p-3 ${done ? "bg-brand-soft" : "bg-[#f6f5f2]"}`}>
                <div className="flex items-center gap-2.5">
                  <Ring progress={b.progress} done={done}>
                    <Icon size={16} />
                  </Ring>
                  <div className="min-w-0 leading-tight">
                    <p className={`text-[13px] font-semibold leading-tight ${done ? "text-brand-dark" : ""}`}>{b.title}</p>
                    <p className={`text-[12px] font-semibold ${done ? "text-brand" : "text-muted"}`}>{b.value}</p>
                  </div>
                </div>
                <p className="mt-2 text-[11px] leading-snug text-muted">{b.hint}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Abzeichen */}
      <section className="card p-5 max-sm:rounded-none">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[16px] font-semibold">Abzeichen</h2>
          <span className="text-[13px] text-muted">
            {earned} von {badges.length}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-x-2 gap-y-4">
          {badges.map(({ icon: Icon, title, hint, done }) => (
            <div key={title} className="flex flex-col items-center text-center">
              <span
                className={`relative grid h-14 w-14 place-items-center rounded-full transition-colors ${
                  done ? "bg-[linear-gradient(135deg,#f6c14b,#e8932c)] text-white shadow-md" : "bg-[#f1f0ed] text-faint"
                }`}
              >
                <Icon size={24} />
                {!done && (
                  <span className="absolute -bottom-0.5 -right-0.5 grid h-5 w-5 place-items-center rounded-full bg-white text-faint shadow">
                    <Lock size={11} />
                  </span>
                )}
              </span>
              <p className={`mt-2 text-[13px] font-semibold leading-tight ${done ? "" : "text-muted"}`}>{title}</p>
              <p className="text-[11px] text-faint">{hint}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Kontakt */}
      <section className="card p-5 max-sm:rounded-none">
        <h2 className="text-[16px] font-semibold">Kontakt</h2>
        <p className="text-[13px] text-muted">{BUERGERBUERO.name}</p>
        <ul className="mt-3 divide-y divide-line text-[15px]">
          <Row icon={<Phone size={17} />} href={`tel:${BUERGERBUERO.phone.replace(/\s/g, "")}`}>
            {BUERGERBUERO.phone}
          </Row>
          <Row icon={<Mail size={17} />} href={`mailto:${BUERGERBUERO.mail}`}>
            {BUERGERBUERO.mail}
          </Row>
          <Row icon={<Clock size={17} />}>{BUERGERBUERO.hours}</Row>
        </ul>
        <button
          onClick={() => setAsk(true)}
          className="mt-4 h-11 w-full rounded-full bg-brand text-[15px] font-semibold text-white hover:bg-brand-dark"
        >
          Frage an die Stadt stellen
        </button>
      </section>

      <p className="flex items-center justify-center gap-1.5 py-2 text-[12px] text-faint">
        <Award size={13} /> mitreden · Prototyp
      </p>

      {ask && <ContactSheet onClose={() => setAsk(false)} />}
    </div>
  );
}

const CITY_ICONS: Record<string, React.ElementType> = {
  antwort: Timer,
  transparent: Landmark,
  opendata: Database,
  zuhoerer: Ear,
  buergernah: Users,
  budget: PiggyBank,
};

function Ring({ progress, done, children }: { progress: number; done: boolean; children: React.ReactNode }) {
  const r = 17;
  const c = 2 * Math.PI * r;
  return (
    <span className="relative grid h-10 w-10 shrink-0 place-items-center">
      <svg viewBox="0 0 40 40" className="absolute inset-0 -rotate-90">
        <circle cx="20" cy="20" r={r} fill="none" stroke={done ? "#cfe0f3" : "#e3e1dc"} strokeWidth="3" />
        <circle
          cx="20"
          cy="20"
          r={r}
          fill="none"
          stroke={done ? "#0a66c2" : "#9aa0a6"}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - Math.min(1, progress))}
        />
      </svg>
      <span className={done ? "text-brand" : "text-muted"}>{children}</span>
    </span>
  );
}

function Num({ n, label }: { n: number; label: string }) {
  return (
    <div>
      <p className="text-[19px] font-semibold">{n}</p>
      <p className="text-[12px] text-muted">{label}</p>
    </div>
  );
}

function Row({ icon, children, href }: { icon: React.ReactNode; children: React.ReactNode; href?: string }) {
  const inner = (
    <span className="flex items-center gap-3 py-3">
      <span className="text-muted">{icon}</span>
      {children}
    </span>
  );
  return <li>{href ? <a href={href} className="hover:text-brand">{inner}</a> : inner}</li>;
}
