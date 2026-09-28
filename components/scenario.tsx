"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LOCATIONS, getLocation } from "@/data/locations";
import { RESORTS } from "@/data/resorts";
import {
  liftChoices,
  cheapestAccess,
  eligibleAt,
  GEAR,
  CAR,
  type GearKey,
  type CarKey,
} from "@/lib/choices";
import { money, stayTotalFor } from "@/lib/cost";
import { quote } from "@/lib/quote";
import {
  SCENARIO,
  listingUrl,
  tripDatesLabel,
  type Plan,
  type Stay,
  type StayTier,
} from "@/lib/types";
import { Marker } from "@/components/ui";
import { Receipt, NoReceipt, MobileTotal } from "@/components/receipt";
import {
  CHIP,
  CHIP_PROOF,
  CHIPS,
  CHIP_META,
  CHIP_NAME,
  CHIP_NOTE,
  CHIP_RATE,
  CHIP_SUB,
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

/* Green under the bar, blue at it, diamond over, dashed ring for no price. */
const RATING_RANK = { green: 0, blue: 1, black: 2, unknown: 3 } as const;

const TIER_ORDER = { budget: 0, normal: 1, expensive: 2 } as const;
const TIER_LABEL = { budget: "budget", normal: "the pick", expensive: "splurge" } as const;

/**
 * One trip, with the variables already settled held still: headcount, days,
 * nights, dates, and the cheapest pass a 21-year-old can buy at whichever
 * mountain you pick. On the home page the mountain is open; on a trip page it
 * is decided, and the rest of the board folds away under it. The explorer at
 * /explore is where everything comes loose again.
 *
 * Every resort is listed whether or not we can price it. A mountain missing
 * from the board looks like it doesn't exist; a mountain on the board saying
 * "no price yet" is a job.
 */
export function Scenario({ plan = SCENARIO }: { plan?: Plan }) {
  const { people, skiDays, age } = plan;
  const choices = useMemo(
    () => liftChoices(LOCATIONS, plan.skiDates),
    [plan.skiDates]
  );
  // Cheapest four-day access at 21, per mountain, worked out once, then sorted
  // down the trail markers: green under the $60 bar, blue at it, diamond over,
  // and the mountains we can't price yet last. The board used to run
  // geographically — Donner Summit, then north shore, then south — which put
  // the two dearest mountains in Tahoe at eye level and buried the $59 one.
  // Sorting by marker makes the first row the answer to "what's cheap".
  const board = useMemo(
    () =>
      RESORTS.map((resort) => ({
        resort,
        lift: cheapestAccess(resort.slug, age, choices),
        // Priced, but nothing we've priced reaches all four of our days. That
        // is a different sentence from "no price yet": Mt Rose's pass is void
        // over New Year, and saying we haven't found a price would send
        // someone looking for a number that exists.
        blocked: choices.some(
          (c) => c.option.resortSlugs.includes(resort.slug) && eligibleAt(c, age)
        ),
      })).sort((a, b) => {
        const ra = RATING_RANK[a.lift?.rating ?? "unknown"];
        const rb = RATING_RANK[b.lift?.rating ?? "unknown"];
        if (ra !== rb) return ra - rb;
        // Inside a band the cheaper mountain leads. Unpriced ones have no
        // rate to compare, so they fall back to name and at least hold still.
        const pa = a.lift?.perDay ?? null;
        const pb = b.lift?.perDay ?? null;
        if (pa !== null && pb !== null && pa !== pb) return pa - pb;
        return a.resort.name.localeCompare(b.resort.name);
      }),
    [choices, age]
  );

  // A decided mountain opens there, with the rest of the board folded away
  // below it: still pickable, because "what would Palisades have cost" is a
  // fair question, but no longer the question the page leads with.
  //
  // An open one opens on the cheapest mountain that prices all the way
  // through. Cheapest *lift* can land on a mountain with no house quoted at
  // our headcount — a friend opening the link would meet a blank total, which
  // is the one thing this page exists not to do.
  const [resortSlug, setResortSlug] = useState(() => {
    if (plan.resort) return plan.resort;
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
  const chosen = plan.resort
    ? board.find((r) => r.resort.slug === plan.resort)
    : undefined;
  const others = chosen ? board.filter((r) => r !== chosen) : board;

  const [gear, setGear] = useState<GearKey>("onsite");
  const [car, setCar] = useState<CarKey>("rent");

  const picked = board.find((r) => r.resort.slug === resortSlug) ?? board[0];
  const location = getLocation(picked.resort.locationSlug);
  // Three houses per location, cheapest first: one you'd take to save money,
  // one you'd actually book, one you'd take if the group splurged. Anything
  // untiered stays in the data and off this page — a half-researched motel
  // with no quote is a job, not a choice. A trip with its own shortlist uses
  // that instead, as long as we are still at the location it was drawn from.
  const stays = useMemo((): { stay: Stay; tier?: StayTier }[] => {
    const all = location?.stays ?? [];
    const short = Object.entries(plan.shortlist ?? {})
      .map(([tier, id]) => ({
        stay: all.find((s) => s.id === id),
        tier: tier as StayTier,
      }))
      .filter((x): x is { stay: Stay; tier: StayTier } => !!x.stay);
    if (short.length)
      return short.sort((a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier]);
    const tiered = all.filter((s) => s.tier);
    return tiered.length
      ? tiered
          .sort((a, b) => TIER_ORDER[a.tier!] - TIER_ORDER[b.tier!])
          .map((s) => ({ stay: s, tier: s.tier }))
      : all.map((s) => ({ stay: s }));
  }, [location, plan.shortlist]);

  // Reset the house whenever the mountain moves us somewhere else.
  const [stayIdRaw, setStayId] = useState<string>("");
  const stay = (
    stays.find(({ stay: s }) => s.id === stayIdRaw) ??
    stays.find(({ stay: s }) => s.id === plan.stay) ??
    stays.find(({ stay: s }) => stayTotalFor(s, people)) ??
    stays[0]
  )?.stay;
  const stayId = stay?.id ?? "";

  const q = picked.lift ? quote(picked.lift, stay, gear, car, people) : null;

  // One card, used for Boreal on top and for every mountain in the fold.
  function mountainChip({ resort, lift, blocked }: (typeof board)[number]) {
    return (
      // Wrapped for the same reason the houses below are: the proof
      // link is an <a>, and an <a> inside a <button> is invalid markup
      // whose click the chip would swallow.
      <div key={resort.slug} className="relative grid">
        <button
          type="button"
          className={`${CHIP} h-full`}
          aria-pressed={resort.slug === resortSlug}
          data-off={!lift || undefined}
          onClick={() => setResortSlug(resort.slug)}
        >
          {/* Bleeds to the chip's edges. object-cover because the source
              photos run 16:9 to 3.2:1 and the slot is fixed. Unpriced
              mountains keep the photo but lose the saturation, so the
              board still reads at a glance. */}
          {/* Every chip gets the band whether or not we have a photo,
              so one missing image doesn't knock a whole row out of
              alignment. An empty band is quiet on purpose: a missing
              photo, unlike a missing price, changes no decision. */}
          <span className="relative -mx-[14px] -mt-[13px] mb-1 block h-[104px] overflow-hidden rounded-t-[3px] bg-well">
            {resort.image && (
              <>
                <Image
                  src={resort.image.src}
                  alt={resort.image.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 300px"
                  className={`object-cover ${lift ? "" : "grayscale"}`}
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-linear-to-t from-night/85 via-night/10 to-transparent"
                />
              </>
            )}
          </span>
          {/* The marker used to head its own row above a drive time.
              The drive time is on the location, one step down, and
              saying it twice cost a line per chip — so the marker moved
              onto the name and the row went away. */}
          <span className="flex items-center gap-2">
            <Marker rating={lift?.rating ?? "unknown"} />
            <span className={CHIP_NAME}>{resort.name}</span>
          </span>
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
            <span className={CHIP_RATE_OFF}>
              {blocked
                ? "blacked out on our dates"
                : "no 2026-27 price yet"}
            </span>
          )}
        </button>
        {/* Proof of the rate above it. Sits low on the photo, where the
            gradient is dark enough to read against, and only appears
            when there is a priced product to point at — a mountain with
            no price has nothing to show you. */}
        {lift?.option.sourceUrl && (
          <a
            href={lift.option.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${lift.option.source ?? "Source"} — the page this price came from, opens in a new tab`}
            title={lift.option.source}
            className={`${CHIP_PROOF} right-[13px] top-[74px]`}
          >
            price&nbsp;↗
          </a>
        )}
      </div>
    );
  }

  return (
    <div className={LAYOUT}>
      <div className={STEPS}>
        <section aria-labelledby="s-resort">
          <h2 className={STEP_H} id="s-resort">
            <span className={STEP_N}>1</span>{" "}
            {chosen ? "The mountain" : "Which mountain"}
            <span className={STEP_SUB}>
              {chosen ? "decided · " : "cheapest "}
              {skiDays}-day pass at {age}
            </span>
          </h2>
          {chosen ? (
            <>
              <div className={CHIPS} role="group" aria-labelledby="s-resort">
                {mountainChip(chosen)}
              </div>
              {/* The one date on this trip that can cost money by being
                  missed. Amber, because it is Bill talking to you, not a
                  measurement. */}
              {plan.deadline && (
                <p className="mt-3 border-l-2 border-sodium/60 pl-[13px] text-[13.5px] leading-relaxed text-snow/82">
                  <strong className="font-semibold text-sodium">
                    {plan.deadline.lead}
                  </strong>{" "}
                  {plan.deadline.detail}
                </p>
              )}
              <details className="group mt-5">
                <summary className="cursor-pointer font-data text-[11px] uppercase tracking-[0.1em] text-muted hover:text-snow">
                  The other {others.length} mountains we priced
                </summary>
                <div className={`${CHIPS} mt-3`} role="group" aria-label="Other mountains">
                  {others.map(mountainChip)}
                </div>
              </details>
            </>
          ) : (
            <div className={CHIPS} role="group" aria-labelledby="s-resort">
              {others.map(mountainChip)}
            </div>
          )}
        </section>

        <section aria-labelledby="s-stay">
          <h2 className={STEP_H} id="s-stay">
            <span className={STEP_N}>2</span> Where we sleep
            <span className={STEP_SUB}>
              {location?.name} · {people} of us
            </span>
          </h2>
          <div className={CHIPS} role="group" aria-labelledby="s-stay">
            {stays.map(({ stay: s, tier }) => {
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
                      {tier && (
                        <span className="text-sodium">{TIER_LABEL[tier]} · </span>
                      )}
                      sleeps {s.sleeps}
                      {s.sleepsMax ? `–${s.sleepsMax}` : ""} · {s.nights} nights
                    </span>
                    {t ? (
                      <>
                      {/* The nightly per-head rate leads: it is the figure that compares
                          across houses with different night counts, and the one people
                          actually carry in their head. The trip total per person stays
                          underneath, because that is what you hand over. */}
                      <span className={CHIP_RATE}>
                        {money(t.totalUsd / people / s.nights, true)}
                        <span className={CHIP_UNIT}>/person/night</span>
                        {t.estimated && (
                          <span className={`${PILL} border-glacier/45 text-glacier`}>
                            est
                          </span>
                        )}
                      </span>
                      <span className={CHIP_SUB}>
                        {money(t.totalUsd / people, true)} /person for {s.nights} nights
                      </span>
                      </>
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
                      href={listingUrl(s.url, plan)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${s.name} on Airbnb in a new tab`}
                      className={`${CHIP_PROOF} right-[13px] top-[11px]`}
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
                  {GEAR[k].perDay === 0
                    ? "free"
                    : /* cents only when there are cents: these are $62.25 and
                         $21.25, and rounding them to $62 and $21 quietly
                         misstates a number the page just went and verified. */
                      money(GEAR[k].perDay, GEAR[k].perDay % 1 !== 0)}
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
            {!picked.lift && picked.blocked ? (
              <>
                Every pass we have priced for{" "}
                <strong className="font-semibold">{picked.resort.name}</strong>{" "}
                is blacked out on some of our days ({tripDatesLabel(plan)}), so
                none of them buys the four days this trip is. Pick another
                mountain, or see the{" "}
                <Link href="/explore" className="underline underline-offset-2">
                  explorer
                </Link>{" "}
                for how many days each one does cover.
              </>
            ) : !picked.lift ? (
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
                {stays.some(({ stay: s }) => s.quotes.length) && (
                  <>
                    {" "}
                    The quotes we have are for{" "}
                    {[
                      ...new Set(
                        stays.flatMap(({ stay: s }) => s.quotes.map((x) => x.guests))
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
