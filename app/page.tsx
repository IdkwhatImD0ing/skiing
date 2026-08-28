import Link from "next/link";
import { HeadcountBoard } from "@/components/headcount-board";
import { LiftLadder } from "@/components/lift-ladder";
import { TripList } from "@/components/trip-list";
import { LOCATIONS } from "@/data/locations";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="wrap">
          <p className="eyebrow">San Jose → Tahoe · 2026-27</p>
          <h1 className="display hero-h">
            Pick a trip.
            <br />
            See what it costs <em>you</em>.
          </h1>
          <p className="hero-sub">
            Four ways to get on snow this season. Set how many of us are going and
            every number below becomes your share, not the group&rsquo;s. Dates are
            movable — price is the argument.
          </p>
        </div>
      </section>

      <div className="wrap stack">
        <HeadcountBoard locationSlug="donner-summit" where="Donner Summit" />
        <LiftLadder />
        <TripList />

        <section className="places" aria-labelledby="places-h">
          <h2 className="display sec-h" id="places-h">
            Three places we&rsquo;d go
          </h2>
          <ul className="place-list">
            {LOCATIONS.map((l) => (
              <li key={l.slug} className="place panel">
                <h3 className="place-name">{l.name}</h3>
                <p className="place-meta num">
                  {l.route} · {l.driveFromSanJose} · {l.stays.length} place
                  {l.stays.length === 1 ? "" : "s"} to stay
                </p>
                <p className="place-blurb">{l.blurb}</p>
                <p className="place-resorts num">{l.resorts.join(" · ")}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="close">
          <p className="close-line">
            Everything here is either a real quote or marked as still being
            checked. If a number is blank, it&rsquo;s because we don&rsquo;t have it
            yet — not because it&rsquo;s small.
          </p>
          <Link href="/trips/soda-springs-house" className="close-cta">
            Start with the Soda Springs house →
          </Link>
        </section>
      </div>
    </main>
  );
}
