import Link from "next/link";
import { Scenario } from "@/components/scenario";
import { TRIPS } from "@/data/trips";
import { getResort } from "@/data/resorts";
import { SCENARIO, tripDatesLabel } from "@/lib/types";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <h1 className="display hero-h">
            {SCENARIO.people} people, {SCENARIO.skiDays} ski days.
          </h1>
          <p className="hero-sub">
            {tripDatesLabel()} — drive up the first day, ski four, drive home
            the last. That is New Year week, so every pass below is counted
            against the days it will actually scan on.
          </p>
          <p className="hero-sub">
            Pick the mountain. The pass is the cheapest {SCENARIO.skiDays}-day
            access a {SCENARIO.age}-year-old can buy there, the houses are the
            ones near it, and the number on the right is what you pay.
          </p>
          {/* The trips this board has already turned into plans. Each has its
              own page, with the mountain and the house decided. */}
          {TRIPS.length > 0 && (
            <nav aria-label="Trips we are taking" className="mt-8">
              <p className="m-0 mb-2.5 font-data text-[11px] uppercase tracking-[0.12em] text-muted">
                Trips we&rsquo;re taking
              </p>
              <ul className="m-0 grid list-none gap-2 p-0">
                {TRIPS.map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/trips/${t.slug}`}
                      className="inline-block rounded border border-ridge bg-pane px-3.5 py-2.5 text-[14.5px] text-snow transition-colors hover:border-sodium/60"
                    >
                      <strong className="font-display font-bold">{t.title}</strong>
                      <span className="ml-2 font-data text-[11.5px] text-muted">
                        {getResort(t.resort ?? "")?.name ?? "Tahoe"} ·{" "}
                        {t.people} of us · {tripDatesLabel(t)} →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </section>
      <div className="wrap">
        <Scenario />
      </div>
    </>
  );
}
