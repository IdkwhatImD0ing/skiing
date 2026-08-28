"use client";

import { useMemo, useState } from "react";
import { getLocation } from "@/data/locations";
import { liftChoices, GEAR, CAR, type GearKey, type CarKey } from "@/lib/choices";
import { money, stayTotalFor } from "@/lib/cost";
import { quote, SEATS_PER_CAR } from "@/lib/quote";
import { SKI_DAYS } from "@/lib/types";
import { useHeadcount, HEAD_RANGE } from "@/components/headcount";
import { Marker } from "@/components/ui";

/* ------------------------------------------------------------------
   Every option is a real <button> carrying aria-pressed, so selection
   is styled off the attribute with Tailwind's aria-pressed: variant —
   no state class to keep in sync. Stays we can't price or can't fit
   carry data-off.

   Selected chips get the lit top edge: the same sodium lamp the rest of
   the page stands under. Amber stays scarce — it is the human voice and
   the $60 benchmark, and now the one thing you picked. Glacier is
   reserved for numbers somebody actually measured.
   ------------------------------------------------------------------ */
const CHIP = [
  "relative grid content-start gap-1.5 rounded border p-[13px_14px] text-left",
  "border-hair bg-pane transition-colors duration-150 cursor-pointer",
  "hover:border-ridge hover:bg-snow/5",
  "aria-pressed:border-sodium/60 aria-pressed:bg-linear-to-b aria-pressed:from-dusk aria-pressed:to-pane",
  // The lit top edge.
  "aria-pressed:before:absolute aria-pressed:before:inset-x-[18%] aria-pressed:before:-top-px",
  "aria-pressed:before:h-px aria-pressed:before:content-['']",
  "aria-pressed:before:bg-linear-to-r aria-pressed:before:from-transparent",
  "aria-pressed:before:via-sodium aria-pressed:before:to-transparent",
  // Unpriced or won't sleep the group. Dimmed, not disabled — the dates
  // move and so can the booking, and picking it is how you learn why.
  "data-[off]:border-dashed data-[off]:bg-transparent data-[off]:opacity-60",
].join(" ");

/* The chips grid. auto-fill, not auto-fit: a fit would stretch three gear
   options across the whole row. min() keeps the track from forcing a
   sideways scroll at 390px. */
const CHIPS = "grid grid-cols-[repeat(auto-fill,minmax(min(232px,100%),1fr))] gap-2.5";

/* No flex on the heading: it holds bare text alongside its spans, and a
   flex container would make every word its own item. */
const STEP_H =
  "mb-4 font-display text-[clamp(1.15rem,2.6vw,1.4rem)] font-bold [font-stretch:108%] tracking-[-0.02em] leading-tight";

const STEP_N = [
  "mr-[0.6em] inline-flex h-[1.75em] w-[1.75em] items-center justify-center align-[-0.35em]",
  "rounded-[3px] border border-ridge bg-well",
  "font-data text-[0.62em] font-medium tracking-normal text-muted",
].join(" ");

const CHIP_NAME =
  "font-display text-[0.98rem] font-bold [font-stretch:106%] tracking-[-0.015em] leading-snug";
const CHIP_META = "font-data text-[10px] uppercase tracking-[0.09em] text-muted";
const CHIP_RATE =
  "mt-0.5 font-data tabular-nums text-[1.18rem] font-bold tracking-[-0.03em] leading-none text-glacier";
const CHIP_UNIT = "ml-1 text-[11.5px] font-normal tracking-normal text-muted";

/* Invert the unpriced state: shrink the mark, promote the sentence. A big
   figure where a price belongs reads as a price. The dashed ring is the
   same "we don't have this" mark used everywhere else on the site. */
const CHIP_RATE_OFF = [
  "mt-0.5 inline-flex items-center gap-[7px] text-[12px] font-normal leading-snug text-snow/78",
  "before:size-[11px] before:flex-none before:rounded-full",
  "before:border-[1.5px] before:border-dashed before:border-muted before:content-['']",
].join(" ");

const PILL = "ml-2 inline-block rounded-[2px] border px-1.5 py-px align-[0.2em] font-data text-[9.5px] font-medium uppercase tracking-[0.12em]";

const CHIP_NOTE = "text-xs leading-normal text-snow/66";

/* Restrictions are a caption, never a gate: the trip is date-shiftable, so a
   blackout is information, not a disqualifier, and nothing here is dimmed or
   de-ranked for having one. The exception is a purchase deadline — that is the
   one thing on this page you can actually miss, so it gets the amber. */
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
  const stayId = stays.some((s) => s.id === stayIdRaw)
    ? stayIdRaw
    : (stays.find((s) => stayTotalFor(s, headcount)) ?? stays[0])?.id ?? "";

  const q = quote(lift, stayId, gear, car, headcount);

  return (
    /* Two columns once there's room: the choices scroll, the receipt doesn't.
       `items-start` matters — a stretched grid item fills the row and then has
       no room left to move, so the rail would never actually stick. */
    <div className="grid items-start gap-x-12 gap-y-10 pb-[clamp(3rem,6vw,5rem)] lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="flex flex-col gap-[clamp(2.25rem,4.5vw,3.25rem)]">
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
          <span className="ml-[0.65em] font-data text-[0.6em] font-normal uppercase tracking-[0.12em] text-muted">
            {SKI_DAYS} full days
          </span>
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
          <span className="ml-[0.65em] font-data text-[0.6em] font-normal uppercase tracking-[0.12em] text-muted">
            {location?.name}
          </span>
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
      <aside className="lg:sticky lg:top-20 lg:max-h-[calc(100dvh-100px)] lg:overflow-y-auto lg:py-px">
      {q ? (
        <section
          className="relative rounded border border-ridge bg-linear-to-b from-dusk to-pane p-[clamp(20px,3vw,26px)] before:absolute before:inset-x-[14%] before:-top-px before:h-px before:bg-linear-to-r before:from-transparent before:via-sodium before:to-transparent before:opacity-75 before:content-['']"
          aria-live="polite"
          aria-labelledby="s-total"
        >
          <h2 className="sr-only" id="s-total">
            What it costs
          </h2>

          <table className="w-full border-collapse text-[13.5px]">
            <tbody>
              {q.lines.map((l) => (
                <tr key={l.label} className="border-b border-hair last:border-b-0">
                  <th
                    scope="row"
                    className="py-2.5 pr-3.5 text-left align-baseline font-semibold whitespace-nowrap max-[560px]:whitespace-normal max-[560px]:pr-2.5"
                  >
                    {l.label}
                  </th>
                  {/* Takes the slack so the label and the amount stay tight
                      to their own edges. */}
                  <td className="w-[99%] py-2.5 align-baseline text-[11.5px] leading-snug text-muted max-[560px]:text-[10.5px] max-[560px]:[overflow-wrap:anywhere]">
                    {l.detail}
                  </td>
                  <td className="py-2.5 pl-3.5 text-right align-baseline font-data tabular-nums whitespace-nowrap text-snow/92 max-[560px]:pl-2.5">
                    {money(l.perPerson, true)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-[22px] flex flex-wrap items-end gap-x-10 gap-y-[18px] border-t border-ridge pt-[22px]">
            {/* Your share, not the group's. It gets the size. */}
            <p className="m-0 grid gap-1.5">
              <span className="font-data tabular-nums text-[clamp(2.6rem,7.5vw,3.4rem)] font-bold leading-none tracking-[-0.04em] text-glacier">
                {money(q.perPerson)}
              </span>
              <span className="text-[11.5px] text-muted">per person</span>
            </p>
            <p className="m-0 grid gap-1.5">
              <span className="font-data tabular-nums text-[1.7rem] font-bold leading-none tracking-[-0.04em] text-glacier">
                {money(q.perPersonPerNight)}
              </span>
              {/* Divided by nights, not ski days — and now that the page says
                  "4 full days" a few lines up, "per day" would read as the
                  wrong denominator. */}
              <span className="text-[11.5px] text-muted">per person, per night</span>
            </p>
            <p className="m-0 grid gap-1.5">
              <span className="font-data tabular-nums text-[1.35rem] font-bold leading-none tracking-[-0.04em] text-snow/74">
                {money(q.total)}
              </span>
              <span className="text-[11.5px] text-muted">
                whole group, {headcount} of us
              </span>
            </p>
          </div>

          {/* A pass that doesn't reach four days leaves a hole in the trip, and
              the total above is not the price of the trip Bill asked for. Say so
              where the number is, not in a caption underneath it. */}
          {q.liftShortfall > 0 && (
            <p className="mt-4 border-l-2 border-sodium/60 pl-[13px] text-[13.5px] leading-relaxed text-snow/82">
              <strong className="font-semibold text-sodium">
                This pass only covers {q.liftCovers} of {q.skiDays} days.
              </strong>{" "}
              The total above buys {q.liftCovers === 0 ? "no" : q.liftCovers} full
              day{q.liftCovers === 1 ? "" : "s"} on snow — you would still need a
              ticket for the other {q.liftShortfall}.
            </p>
          )}

          <p className="mt-5 font-data text-[11px] uppercase leading-relaxed tracking-[0.06em] text-muted">
            {q.nights} nights · {q.skiDays} day{q.skiDays > 1 ? "s" : ""} on snow ·{" "}
            {q.cars} car{q.cars > 1 ? "s" : ""}
            {q.spareSeats > 0 && ` · ${q.spareSeats} spare seat${q.spareSeats > 1 ? "s" : ""}`}
            {q.squeeze && ` · ${headcount - q.stay.sleeps} on air mattresses`}
            {q.estimated && " · lodging interpolated, not quoted"}
          </p>
        </section>
      ) : (
        /* No quote at this headcount. Dashed like every other absent price,
           and the sentence outweighs the dash. */
        <section className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5 rounded border border-dashed border-ridge p-[clamp(20px,3vw,30px)]">
          <p className="m-0 font-data tabular-nums text-[1.15rem] text-muted">—</p>
          <p className="m-0 max-w-[56ch] flex-[1_1_22ch] text-sm leading-relaxed text-snow/84">
            No lodging quote for {headcount} at {location?.name}. Pick another place,
            or change the headcount.
          </p>
        </section>
      )}
      </aside>

      {/* On a phone there is no right-hand side, so the number follows you up
          from the bottom instead. Duplicates the rail above, so it is hidden
          from screen readers rather than announced twice. */}
      {q && (
        <div
          aria-hidden
          className="sticky bottom-0 z-40 -mx-6 flex items-baseline justify-between gap-3 border-t border-ridge bg-night/92 px-6 py-2.5 backdrop-blur lg:hidden"
        >
          <span className="font-data tabular-nums text-[1.35rem] font-bold leading-none tracking-[-0.03em] text-glacier">
            {money(q.perPerson)}
          </span>
          <span className="text-[11px] text-muted">per person, all in</span>
        </div>
      )}
    </div>
  );
}
