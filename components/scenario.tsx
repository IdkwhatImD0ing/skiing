"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getLocation } from "@/data/locations";
import { RESORTS } from "@/data/resorts";
import {
  liftChoices,
  cheapestAccess,
  GEAR,
  CAR,
  type GearKey,
  type CarKey,
} from "@/lib/choices";
import { money, stayTotalFor } from "@/lib/cost";
import { quote } from "@/lib/quote";
import { SCENARIO } from "@/lib/types";
import { Marker } from "@/components/ui";
import { Receipt, NoReceipt, MobileTotal } from "@/components/receipt";
import {
  CHIP,
  CHIPS,
  CHIP_META,
  CHIP_NAME,
  CHIP_NOTE,
  CHIP_RATE,
  CHIP_RATE_OFF,
  CHIP_UNIT,
  LAYOUT,
  PILL,
  RAIL,
  STEP_H,
  STEP_N,
  STEP_SUB,
  STEPS,
} from "@/components/chips";

const { people, skiDays, age } = SCENARIO;

/**
 * The trip Bill is actually planning, with the variables he has already
 * settled held still: eight of us, four full days, five nights, and the
 * cheapest pass a 21-year-old can buy at whichever mountain you pick. The
 * explorer at /explore is where those come loose again.
 *
 * Every resort is listed whether or not we can price it. A mountain missing
 * from the board looks like it doesn't exist; a mountain on the board saying
 * "no price yet" is a job.
 */
export function Scenario() {
  const choices = useMemo(() => liftChoices(), []);
  // Cheapest four-day access at 21, per mountain, worked out once.
  const board = useMemo(
    () =>
      RESORTS.map((resort) => ({
        resort,
        lift: cheapestAccess(resort.slug, age, choices),
      })),
    [choices]
  );

  // Open on the cheapest mountain that prices all the way through. Cheapest
  // *lift* would land on Boreal, which has no house quoted at eight — a friend
  // opening the link would meet a blank total, which is the one thing this
  // page exists not to do.
  const [resortSlug, setResortSlug] = useState(() => {
    const complete = board.filter(
      (r) =>
        r.lift &&
        getLocation(r.resort.locationSlug)?.stays.some((s) =>
          stayTotalFor(s, people)
        )
    );
    const pool = complete.length ? complete : board.filter((r) => r.lift);
    return (
      pool.reduce(
        (best, r) => (r.lift!.perDay! < best.lift!.perDay! ? r : best),
        pool[0]
      )?.resort.slug ?? RESORTS[0].slug
    );
  });

  const [gear, setGear] = useState<GearKey>("onsite");
  const [car, setCar] = useState<CarKey>("rent");

  const picked = board.find((r) => r.resort.slug === resortSlug) ?? board[0];
  const location = getLocation(picked.resort.locationSlug);
  const stays = location?.stays ?? [];

  // Reset the house whenever the mountain moves us somewhere else.
  const [stayIdRaw, setStayId] = useState<string>("");
  const stay =
    stays.find((s) => s.id === stayIdRaw) ??
    stays.find((s) => stayTotalFor(s, people)) ??
    stays[0];
  const stayId = stay?.id ?? "";

  const q = picked.lift ? quote(picked.lift, stay, gear, car, people) : null;

  return (
    <div className={LAYOUT}>
      <div className={STEPS}>
        <section aria-labelledby="s-resort">
          <h2 className={STEP_H} id="s-resort">
            <span className={STEP_N}>1</span> Which mountain
            <span className={STEP_SUB}>cheapest {skiDays}-day pass at {age}</span>
          </h2>
          <div className={CHIPS} role="group" aria-labelledby="s-resort">
            {board.map(({ resort, lift }) => (
              <button
                key={resort.slug}
                type="button"
                className={CHIP}
                aria-pressed={resort.slug === resortSlug}
                data-off={!lift || undefined}
                onClick={() => setResortSlug(resort.slug)}
              >
                <span className="flex items-start gap-2">
                  <Marker rating={lift?.rating ?? "unknown"} />
                  <span className="text-[10px] uppercase leading-relaxed tracking-[0.1em] text-muted">
                    {resort.toLift}
                  </span>
                </span>
                <span className={CHIP_NAME}>{resort.name}</span>
                {lift && lift.perDay !== null ? (
                  <>
                    <span className={CHIP_RATE}>
                      {money(lift.perDay, true)}
                      <span className={CHIP_UNIT}>/day</span>
                    </span>
                    {/* Which pass got you that number — the page picked it,
                        so it has to say what it picked. A last-season price is
                        real but stale, and wears its season so it can never be
                        read as this year's. */}
                    <span className={CHIP_NOTE}>
                      {lift.label}
                      {lift.tier && (
                        <span className={`${PILL} border-glacier/45 text-glacier`}>
                          {lift.tier}
                        </span>
                      )}
                      {lift.stale && (
                        <span className={`${PILL} border-sodium/45 bg-sodium/15 text-sodium`}>
                          {lift.season ?? "last season"} price
                        </span>
                      )}
                    </span>
                  </>
                ) : (
                  <span className={CHIP_RATE_OFF}>no 2026-27 price yet</span>
                )}
              </button>
            ))}
          </div>
        </section>

        <section aria-labelledby="s-stay">
          <h2 className={STEP_H} id="s-stay">
            <span className={STEP_N}>2</span> Where we sleep
            <span className={STEP_SUB}>
              {location?.name} · {people} of us
            </span>
          </h2>
          <div className={CHIPS} role="group" aria-labelledby="s-stay">
            {stays.map((s) => {
              const t = stayTotalFor(s, people);
              const fits = people <= (s.sleepsMax ?? s.sleeps);
              return (
                // The listing link can't live inside the button — an <a> nested
                // in a <button> is invalid, and the click would be swallowed by
                // the selection handler.
                <div key={s.id} className="relative grid">
                  <button
                    type="button"
                    className={`${CHIP} h-full`}
                    aria-pressed={s.id === stayId}
                    data-off={!t || !fits || undefined}
                    onClick={() => setStayId(s.id)}
                  >
                    <span className={`${CHIP_NAME} pr-16`}>{s.name}</span>
                    <span className={CHIP_META}>
                      sleeps {s.sleeps}
                      {s.sleepsMax ? `–${s.sleepsMax}` : ""} · {s.nights} nights
                    </span>
                    {t ? (
                      <span className={CHIP_RATE}>
                        {money(t.totalUsd / people, true)}
                        <span className={CHIP_UNIT}>/person</span>
                        {t.estimated && (
                          <span className={`${PILL} border-glacier/45 text-glacier`}>
                            est
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className={CHIP_RATE_OFF}>
                        {s.quotes.length
                          ? `quoted at ${s.quotes
                              .map((x) => x.guests)
                              .join(", ")}, not ${people}`
                          : "no quote"}
                      </span>
                    )}
                  </button>
                  {s.url ? (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${s.name} on Airbnb in a new tab`}
                      className="absolute right-[13px] top-[11px] z-10 rounded-[2px] border border-ridge bg-well/80 px-1.5 py-0.5 font-data text-[9.5px] uppercase tracking-[0.1em] text-muted transition-colors hover:border-sodium/60 hover:text-sodium"
                    >
                      listing&nbsp;↗
                    </a>
                  ) : (
                    <span
                      className="pointer-events-none absolute right-[13px] top-[11px] z-10 rounded-[2px] border border-dashed border-ridge px-1.5 py-0.5 font-data text-[9.5px] uppercase tracking-[0.1em] text-muted/70"
                      title="Bill hasn't sent the link for this one yet"
                    >
                      no link
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="s-gear">
          <h2 className={STEP_H} id="s-gear">
            <span className={STEP_N}>3</span> Gear
          </h2>
          <div className={CHIPS} role="group" aria-labelledby="s-gear">
            {(Object.keys(GEAR) as GearKey[]).map((k) => (
              <button
                key={k}
                type="button"
                className={CHIP}
                aria-pressed={k === gear}
                onClick={() => setGear(k)}
              >
                <span className={CHIP_NAME}>
                  {GEAR[k].label}
                  {GEAR[k].recommended && (
                    <span className={`${PILL} border-sodium/45 bg-sodium/15 text-sodium`}>
                      pick this
                    </span>
                  )}
                </span>
                <span className={CHIP_RATE}>
                  {GEAR[k].perDay === 0 ? "free" : `${money(GEAR[k].perDay)}`}
                  {GEAR[k].perDay > 0 && <span className={CHIP_UNIT}>/day</span>}
                </span>
                <span className={CHIP_NOTE}>{GEAR[k].note}</span>
              </button>
            ))}
          </div>
        </section>

        <section aria-labelledby="s-car">
          <h2 className={STEP_H} id="s-car">
            <span className={STEP_N}>4</span> Wheels
            <span className={STEP_SUB}>{people} of us, 4 to a car</span>
          </h2>
          <div className={CHIPS} role="group" aria-labelledby="s-car">
            {(Object.keys(CAR) as CarKey[]).map((k) => (
              <button
                key={k}
                type="button"
                className={CHIP}
                aria-pressed={k === car}
                onClick={() => setCar(k)}
              >
                <span className={CHIP_NAME}>{CAR[k].label}</span>
                <span className={CHIP_RATE}>
                  {CAR[k].perTrip === 0 ? "gas only" : `${money(CAR[k].perTrip)}`}
                  {CAR[k].perTrip > 0 && <span className={CHIP_UNIT}>/car</span>}
                </span>
                <span className={CHIP_NOTE}>{CAR[k].note}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <aside className={RAIL}>
        {q ? (
          <Receipt q={q} headcount={people} />
        ) : (
          <NoReceipt>
            {!picked.lift ? (
              <>
                No confirmed 2026-27 lift price for{" "}
                <strong className="font-semibold">{picked.resort.name}</strong>{" "}
                yet, so there is no honest total to show. Pick another mountain,
                or see the{" "}
                <Link href="/explore" className="underline underline-offset-2">
                  explorer
                </Link>{" "}
                for every pass we have priced.
              </>
            ) : (
              <>
                No house at {location?.name} is quoted for{" "}
                <strong className="font-semibold">{people} guests</strong>.
                {stays.some((s) => s.quotes.length) && (
                  <>
                    {" "}
                    The quotes we have are for{" "}
                    {[
                      ...new Set(
                        stays.flatMap((s) => s.quotes.map((x) => x.guests))
                      ),
                    ]
                      .sort((a, b) => a - b)
                      .join(", ")}
                    {" — and one quote is a point, not a curve, so nothing here "}
                    can be stretched to {people} without inventing the number.
                  </>
                )}{" "}
                One more Airbnb quote at {people} guests fills this in.
              </>
            )}
          </NoReceipt>
        )}
      </aside>

      {q && <MobileTotal q={q} />}
    </div>
  );
}
