"use client";

import Link from "next/link";
import { TRIPS } from "@/data/trips";
import { costFor, money } from "@/lib/cost";
import { useHeadcount } from "@/components/headcount";
import { Marker, Num } from "@/components/ui";

export function TripList() {
  const { headcount } = useHeadcount();

  const priced = TRIPS.map((t) => costFor(t, headcount)).filter(
    (c): c is NonNullable<typeof c> => c !== null
  );
  priced.sort((a, b) => {
    if (a.totalPerPerson === null) return 1;
    if (b.totalPerPerson === null) return -1;
    return a.totalPerPerson - b.totalPerPerson;
  });

  return (
    <section className="trips" aria-labelledby="trips-h">
      <h2 className="display trips-h" id="trips-h">
        Four ways to go
      </h2>
      <p className="trips-sub">
        Priced for <Num>{headcount}</Num> of us. Dates move; these numbers are the
        point.
      </p>

      <ul className="trip-grid">
        {priced.map((c) => (
          <li key={c.trip.slug}>
            <Link href={`/trips/${c.trip.slug}`} className="trip panel">
              <div className="trip-head">
                <Marker rating={c.rating} />
                <h3 className="trip-name">{c.trip.title}</h3>
              </div>
              <p className="trip-where num">
                {c.location.name} · {c.location.route} · {c.location.driveFromSanJose}
              </p>
              <p className="trip-pitch">{c.trip.pitch}</p>

              <div className="trip-foot">
                {c.totalPerPerson !== null ? (
                  <p className="trip-price">
                    <span className="num trip-price-num">
                      {money(c.totalPerPerson)}
                    </span>
                    <span className="trip-price-label">each, all in</span>
                  </p>
                ) : (
                  <p className="trip-price trip-price-off">
                    <span className="num trip-price-num">—</span>
                    <span className="trip-price-label">
                      {c.noRoom
                        ? `nothing here sleeps ${headcount}`
                        : "still pricing this one"}
                    </span>
                  </p>
                )}
                <p className="trip-days num">
                  {c.trip.dates.skiDays} days on snow · {c.trip.dates.label}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
