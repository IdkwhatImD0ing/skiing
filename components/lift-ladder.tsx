import type { CSSProperties } from "react";
import { LOCATIONS } from "@/data/locations";
import { liftLadder, money } from "@/lib/cost";
import { BENCHMARK_PER_DAY } from "@/lib/types";
import { Marker } from "@/components/ui";

/**
 * The spine of the site. Trips are date-shiftable, so blackouts are a
 * caption and price per day is the only ranking axis.
 */
export function LiftLadder() {
  const rows = liftLadder(LOCATIONS);
  const researching = LOCATIONS.flatMap((l) =>
    l.lift.filter((o) => o.totalUsd === null).map((o) => ({ o, loc: l.name }))
  );

  return (
    <section className="ladder" aria-labelledby="ladder-h">
      <div className="ladder-top">
        <h2 className="display ladder-h" id="ladder-h">
          What a day on snow costs
        </h2>
        <p className="ladder-sub">
          Every pack we&rsquo;ve priced, cheapest day first. The bar is{" "}
          <span className="num">${BENCHMARK_PER_DAY}</span> — Boreal&rsquo;s 4-pack.
        </p>
      </div>

      <div className="scroller">
        <table className="ladder-table">
        <caption className="sr-only">
          Lift products ranked by cost per day against a $60 per day benchmark
        </caption>
        <thead>
          <tr>
            <th scope="col">Pack</th>
            <th scope="col" className="col-bar">
              <span className="col-bar-label">
                vs $60<span className="col-bar-unit">/day</span>
              </span>
            </th>
            <th scope="col" className="col-num">Per day</th>
            <th scope="col" className="col-num">Total</th>
            <th scope="col" className="col-note">Dates</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label + r.totalUsd} data-rating={r.rating}>
              <th scope="row">
                <span className="ladder-name">
                  <Marker rating={r.rating} />
                  <span>{r.label}</span>
                </span>
                <span className="ladder-where">{r.option.resort}</span>
              </th>
              {/* Distance from the $60 bar, drawn. r.perDay comes from
                  lib/cost.ts — CSS does the scaling, not this file. */}
              <td className="col-bar">
                <span
                  className="bar"
                  style={{ "--pd": r.perDay } as CSSProperties}
                  aria-hidden
                />
              </td>
              <td className="col-num">
                <span className="num ladder-perday">{money(r.perDay, true)}</span>
              </td>
              <td className="col-num num ladder-total">{money(r.totalUsd)}</td>
              <td className="col-note">{r.option.blackouts}</td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>

      {researching.length > 0 && (
        <p className="ladder-pending">
          <span className="marker marker-unknown" aria-hidden /> Still checking:{" "}
          {researching.map(({ o, loc }, i) => (
            <span key={o.id}>
              {i > 0 && ", "}
              {o.name} <span className="ladder-pending-where">({loc})</span>
            </span>
          ))}
        </p>
      )}
    </section>
  );
}
