"use client";

import { useMemo, useState } from "react";
import { getLocation } from "@/data/locations";
import { liftChoices, GEAR, CAR, type GearKey, type CarKey } from "@/lib/choices";
import { money, stayTotalFor } from "@/lib/cost";
import { quote, SEATS_PER_CAR } from "@/lib/quote";
import { SKI_DAYS } from "@/lib/types";
import { useHeadcount, HEAD_RANGE } from "@/components/headcount";
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

/* Restrictions are a caption, never a gate: the trip is date-shiftable, so a
   blackout is information, not a disqualifier. The exception is a purchase
   deadline — that is the one thing on this page you can actually miss, so it
   gets the amber. */

const isDeadline = (s: string) => /buy before|buy by/i.test(s);

export function Configurator() {
  const { headcount, setHeadcount } = useHeadcount();
  const choices = useMemo(() => liftChoices(), []);
  // Open on the cheapest pass that covers the whole trip at the adult price.
  // choices[0] is a child tier, and a page that greets a group of adults with
  // a child fare is lying to them before they touch anything.
  const [liftId, setLiftId] = useState(
    (choices.find((c) => c.coversTrip && c.tier === null) ?? choices[0])?.id ?? ""
  );
  const [gear, setGear] = useState<GearKey>("onsite");
  const [car, setCar] = useState<CarKey>("rent");

  const lift = choices.find((c) => c.id === liftId) ?? choices[0];
  const location = getLocation(lift.locationSlug);
  const stays = location?.stays ?? [];

  // Reset the stay whenever the pass moves us somewhere else.
  const [stayIdRaw, setStayId] = useState<string>("");
  const stay =
    stays.find((s) => s.id === stayIdRaw) ??
    stays.find((s) => stayTotalFor(s, headcount)) ??
    stays[0];
  const stayId = stay?.id ?? "";

  const q = quote(lift, stay, gear, car, headcount);

  return (
    <div className={LAYOUT}>
      <div className={STEPS}>
      <section aria-labelledby="s-who">
        <h2 className={STEP_H} id="s-who">
          <span className={STEP_N}>1</span> How many of us
        </h2>
        {/* A bank of switches in a well, rather than cards — this is one
            number, not eleven options. */}
        <div
          className="flex flex-wrap gap-1 rounded border border-hair bg-well p-1"
          role="group"
          aria-labelledby="s-who"
        >
          {HEAD_RANGE.map((n) => (
            <button
              key={n}
              type="button"
              className={[
                "flex-auto min-w-11 cursor-pointer rounded-[2px] border border-transparent px-1.5 py-2.5",
                "text-center font-data tabular-nums text-sm font-semibold text-snow/72",
                "transition-colors duration-150 hover:bg-snow/8 hover:text-snow",
                "aria-pressed:border-sodium aria-pressed:bg-sodium aria-pressed:font-bold aria-pressed:text-night",
                // The selected numeral is already amber, so its focus ring turns snow.
                "aria-pressed:focus-visible:outline-snow",
              ].join(" ")}
              aria-pressed={n === headcount}
              onClick={() => setHeadcount(n)}
            >
              {n}
            </button>
          ))}
        </div>
        {/* The sawtooth, stated rather than plotted. A whole car lands on the
            person who makes it necessary, so cost per head jumps at 5 and 9
            and 4 and 8 are the sweet spots. This is the largest single lever
            on the page — bigger than the lift ticket. */}
        <p className="mt-3 text-xs leading-normal text-muted">
          Cars seat {SEATS_PER_CAR}.{" "}
          <span className="font-data tabular-nums text-snow/85">
            {HEAD_RANGE.filter((n) => n % SEATS_PER_CAR === 0).join(" and ")}
          </span>{" "}
          fill them exactly — everyone else is paying for empty seats.
        </p>
      </section>

      <section aria-labelledby="s-lift">
        <h2 className={STEP_H} id="s-lift">
          <span className={STEP_N}>2</span> Where we ski
          {/* The trip is a fixed shape, so the pass has to meet it. */}
          <span className={STEP_SUB}>{SKI_DAYS} full days</span>
        </h2>
        <div className={CHIPS} role="group" aria-labelledby="s-lift">
          {choices.map((c) => (
            <button
              key={c.id}
              type="button"
              className={CHIP}
              aria-pressed={c.id === lift.id}
              data-off={!c.coversTrip || undefined}
              onClick={() => setLiftId(c.id)}
            >
              <span className="flex items-start gap-2">
                <Marker rating={c.rating} />
                <span className="text-[10px] uppercase leading-relaxed tracking-[0.1em] text-muted">
                  {c.resort}
                </span>
              </span>
              <span className={CHIP_NAME}>{c.label}</span>
              {/* A rate per day is only comparable when the days are there.
                  Anything short of the whole trip leads with what it can't do. */}
              {c.coversTrip && c.perDay !== null ? (
                <span className={CHIP_RATE}>
                  {money(c.perDay, true)}
                  <span className={CHIP_UNIT}>/day</span>
                </span>
              ) : (
                <span className={CHIP_RATE_OFF}>
                  {c.covers === 0
                    ? `no full days — ${money(c.totalUsd)} buys evenings`
                    : `covers ${c.covers} of ${SKI_DAYS} days`}
                </span>
              )}
              <span
                className={
                  isDeadline(c.blackouts)
                    ? "text-xs font-medium leading-normal text-sodium"
                    : CHIP_NOTE
                }
              >
                {c.blackouts}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section aria-labelledby="s-stay">
        <h2 className={STEP_H} id="s-stay">
          <span className={STEP_N}>3</span> Where we sleep
          {/* Not a choice — the pass already decided it. */}
          <span className={STEP_SUB}>{location?.name}</span>
        </h2>
        <div className={CHIPS} role="group" aria-labelledby="s-stay">
          {stays.map((s) => {
            const t = stayTotalFor(s, headcount);
            const fits = headcount <= (s.sleepsMax ?? s.sleeps);
            return (
              // The listing link can't live inside the button — an <a> nested
              // in a <button> is invalid, and the click would be swallowed by
              // the selection handler. So the card is a wrapper: button fills
              // it for the whole-card click target, link sits above it.
              <div key={s.id} className="relative grid">
              <button
                type="button"
                className={`${CHIP} h-full`}
                aria-pressed={s.id === stayId}
                data-off={!t || !fits || undefined}
                onClick={() => setStayId(s.id)}
              >
                {/* Room for the link in the top-right corner. */}
                <span className={`${CHIP_NAME} pr-16`}>{s.name}</span>
                <span className={CHIP_META}>
                  sleeps {s.sleeps}
                  {s.sleepsMax ? `–${s.sleepsMax}` : ""} · {s.nights} nights
                </span>
                {t ? (
                  <span className={CHIP_RATE}>
                    {money(t.totalUsd / headcount, true)}
                    <span className={CHIP_UNIT}>/person</span>
                    {/* Solid ring = interpolated. Full-strength glacier with
                        no ring = a real quote. */}
                    {t.estimated && (
                      <span className={`${PILL} border-glacier/45 text-glacier`}>est</span>
                    )}
                  </span>
                ) : (
                  <span className={CHIP_RATE_OFF}>
                    {s.quotes.length
                      ? `quoted at ${s.quotes.map((x) => x.guests).join(", ")}`
                      : "no quote"}
                  </span>
                )}
              </button>
              {/* Every house is its own listing. Bill sends this link to
                  friends, so the listing has to be one click away — and where
                  we don't have the URL yet, say so rather than leave a card
                  that looks linkable and isn't. */}
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
          <span className={STEP_N}>4</span> Gear
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
        {/* Bill talking. Amber rule, same voice as a provenance note. */}
        <p className="mt-[18px] max-w-[64ch] border-l-2 border-sodium/60 pl-[13px] text-[13.5px] leading-relaxed text-snow/82">
          <strong className="font-semibold text-sodium">Rent at the resort.</strong>{" "}
          {GEAR.onsite.why} San Jose is $
          {(GEAR.onsite.perDay - GEAR.sj.perDay) * 4} cheaper over four days, and
          it isn&rsquo;t worth the boot bags in your lap for four hours.
        </p>
      </section>

      <section aria-labelledby="s-car">
        <h2 className={STEP_H} id="s-car">
          <span className={STEP_N}>5</span> Wheels
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

      {/* The payoff, and the reason anyone opened the link — so it stays on
          screen while you change your mind about everything else.
          The receipt runs taller than a laptop viewport, so the rail scrolls
          inside itself rather than pushing its own bottom off the screen.
          py-px gives the lit top edge (at -1px) somewhere to live that the
          scroll container won't clip. */}
      <aside className={RAIL}>
        {q ? (
          <Receipt q={q} headcount={headcount} />
        ) : (
          <NoReceipt>
            No lodging quote for {headcount} at {location?.name}. Pick another
            place, or change the headcount.
          </NoReceipt>
        )}
      </aside>

      {q && <MobileTotal q={q} />}
    </div>
  );
}
