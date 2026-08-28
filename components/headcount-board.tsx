"use client";

import { useId, useMemo } from "react";
import { getLocation } from "@/data/locations";
import { money, stayOptions } from "@/lib/cost";
import { HEAD_RANGE, useHeadcount } from "@/components/headcount";
import { Tag } from "@/components/ui";

type Point = {
  n: number;
  perPerson: number | null;
  total: number | null;
  estimated: boolean;
  stayName: string | null;
  nights: number | null;
  /** Comfortable capacity of the best stay — beds, not air mattresses. */
  sleeps: number | null;
  /** Over comfortable capacity: someone is on an air mattress. */
  squeeze: boolean;
  /** Nothing at this location sleeps this many. */
  noRoom: boolean;
};

function buildCurve(locationSlug: string): Point[] {
  const location = getLocation(locationSlug);
  if (!location) return [];
  return HEAD_RANGE.map((n) => {
    const options = stayOptions(location, n);
    const best = options.find((o) => o.fits && o.perPerson !== null) ?? null;
    return {
      n,
      perPerson: best?.perPerson ?? null,
      total: best?.totalUsd ?? null,
      estimated: best?.estimated ?? false,
      stayName: best?.stay.name ?? null,
      nights: best?.stay.nights ?? null,
      sleeps: best?.stay.sleeps ?? null,
      squeeze: best?.squeeze ?? false,
      noRoom: !options.some((o) => o.fits),
    };
  });
}

/** Vertical position inside the plot lane, as a percentage from the top. */
function plotter(points: Point[]) {
  const values = points
    .map((p) => p.perPerson)
    .filter((v): v is number => v !== null);
  if (!values.length) return null;
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  return (v: number) => {
    const t = hi === lo ? 0.5 : (v - lo) / (hi - lo);
    return 10 + (1 - t) * 76;
  };
}

export function HeadcountBoard({
  locationSlug,
  variant = "hero",
  where,
}: {
  locationSlug: string;
  variant?: "hero" | "rail";
  /** Place name used in the copy, e.g. "Donner Summit". */
  where: string;
}) {
  const { headcount, setHeadcount } = useHeadcount();
  const name = useId();
  const points = useMemo(() => buildCurve(locationSlug), [locationSlug]);

  const here = points.find((p) => p.n === headcount) ?? null;
  const next = points.find((p) => p.n === headcount + 1) ?? null;
  const prev = points.find((p) => p.n === headcount - 1) ?? null;
  const y = plotter(points);

  const strip = (
    <fieldset className="strip" aria-describedby={`${name}-share`}>
      <legend className="sr-only">How many of us are going</legend>
      {points.map((p) => (
        <label
          key={p.n}
          className="cell"
          data-on={p.n === headcount || undefined}
          data-noroom={p.noRoom || undefined}
          data-squeeze={p.squeeze || undefined}
        >
          <input
            className="cell-input"
            type="radio"
            name={name}
            value={p.n}
            checked={p.n === headcount}
            onChange={() => setHeadcount(p.n)}
          />
          <span className="cell-num num">{p.n}</span>
        </label>
      ))}
    </fieldset>
  );

  if (variant === "rail") {
    return (
      <div className="rail">
        <div className="wrap rail-inner">
          <p className="rail-label">
            <span className="eyebrow">How many of us</span>
          </p>
          {strip}
          <p className="rail-share" id={`${name}-share`}>
            {here?.perPerson != null ? (
              <>
                <span className="num rail-share-num">{money(here.perPerson, true)}</span>
                <span className="rail-share-label">each, on the house</span>
              </>
            ) : here?.noRoom ? (
              <span className="rail-share-label">Nothing here sleeps {headcount}</span>
            ) : (
              <span className="rail-share-label">House price not confirmed</span>
            )}
          </p>
        </div>
      </div>
    );
  }

  // Delta: the counterintuitive bit. Adding a head usually costs everyone more.
  let delta: React.ReactNode = null;
  if (next && next.noRoom) {
    delta = (
      <p className="delta delta-stop">
        <span className="delta-arrow" aria-hidden>
          ×
        </span>
        Nothing at {where} sleeps {next.n}. A {next.n}th person means two bookings.
      </p>
    );
  } else if (here?.perPerson != null && next?.perPerson != null) {
    const d = next.perPerson - here.perPerson;
    delta =
      d > 0 ? (
        <p className="delta delta-up">
          <span className="delta-arrow" aria-hidden>
            ↑
          </span>
          A {next.n}th person costs everyone{" "}
          <span className="num">{money(d, true)}</span> more. This house prices per
          guest, so a bigger group is not a cheaper one.
        </p>
      ) : (
        <p className="delta delta-down">
          <span className="delta-arrow" aria-hidden>
            ↓
          </span>
          A {next.n}th person saves everyone{" "}
          <span className="num">{money(Math.abs(d), true)}</span>.
        </p>
      );
  } else if (here?.noRoom && prev?.perPerson != null) {
    delta = (
      <p className="delta delta-stop">
        <span className="delta-arrow" aria-hidden>
          ×
        </span>
        Nothing at {where} sleeps {headcount}. At {prev.n} it is{" "}
        <span className="num">{money(prev.perPerson, true)}</span> each.
      </p>
    );
  }

  const segments: Point[][] = [];
  for (const p of points) {
    if (p.perPerson === null) {
      if (segments.length && segments[segments.length - 1].length) segments.push([]);
      continue;
    }
    if (!segments.length) segments.push([]);
    segments[segments.length - 1].push(p);
  }

  return (
    <section className="board" aria-labelledby={`${name}-h`}>
      <div className="board-top">
        <h2 className="eyebrow" id={`${name}-h`}>
          How many of us
        </h2>
        <p className="board-hint">
          Set it once. Every number on the site divides by it.
        </p>
      </div>

      <div className="board-readout" id={`${name}-share`} aria-live="polite">
        {here?.perPerson != null ? (
          <>
            <p className="readout-num num">{money(here.perPerson, true)}</p>
            <p className="readout-label">
              your share of the house, {headcount} of us
            </p>
            <p className="readout-line num">
              {here.stayName} · {money(here.total ?? 0)} ÷ {headcount} · {here.nights}{" "}
              nights
              {here.estimated && (
                <>
                  {" "}
                  <Tag tone="soft" title="Interpolated between two real quotes, not a quote itself.">
                    est
                  </Tag>
                </>
              )}
            </p>
            {here.squeeze && here.sleeps !== null && (
              <p className="readout-squeeze">
                Sleeps <span className="num">{here.sleeps}</span> in beds
                {headcount - here.sleeps === 1
                  ? " — one of us takes an air mattress."
                  : ` — ${headcount - here.sleeps} of us take air mattresses.`}
              </p>
            )}
          </>
        ) : here?.noRoom ? (
          <>
            <p className="readout-num readout-num-off num">no room</p>
            <p className="readout-label">
              nothing at {where} sleeps {headcount}
            </p>
          </>
        ) : (
          <>
            <p className="readout-num readout-num-off num">—</p>
            <p className="readout-label">no lodging quote for {where} yet</p>
          </>
        )}
        {delta}
      </div>

      <div className="plot" aria-hidden>
        {y && (
          <svg
            className="plot-line"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            focusable="false"
          >
            {segments
              .filter((s) => s.length > 1)
              .map((seg, i) => (
                <polyline
                  key={i}
                  vectorEffect="non-scaling-stroke"
                  points={seg
                    .map((p) => {
                      const idx = points.indexOf(p);
                      const x = ((idx + 0.5) / points.length) * 100;
                      return `${x},${y(p.perPerson!)}`;
                    })
                    .join(" ")}
                />
              ))}
          </svg>
        )}
        <ul className="plot-cols">
          {points.map((p) => (
            <li key={p.n} className="plot-col">
              {p.perPerson != null && y ? (
                <span
                  className="plot-dot"
                  data-on={p.n === headcount || undefined}
                  data-est={p.estimated || undefined}
                  style={{ top: `${y(p.perPerson)}%` }}
                />
              ) : (
                <span className="plot-gap" data-noroom={p.noRoom || undefined} />
              )}
            </li>
          ))}
        </ul>
      </div>

      {strip}

      <p className="plot-key num">
        <span className="key-item">
          <span className="plot-dot plot-dot-static" /> quoted
        </span>
        <span className="key-item">
          <span className="plot-dot plot-dot-static" data-est /> interpolated
        </span>
        <span className="key-item">
          <span className="plot-gap plot-gap-static" /> no quote yet
        </span>
        <span className="key-item">
          <span className="plot-gap plot-gap-static" data-noroom /> won&rsquo;t fit
        </span>
        <span className="key-axis">cost per person, rising →</span>
      </p>
    </section>
  );
}
