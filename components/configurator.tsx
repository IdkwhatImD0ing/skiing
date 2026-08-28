"use client";

import { useMemo, useState } from "react";
import { getLocation } from "@/data/locations";
import { liftChoices, GEAR, CAR, type GearKey, type CarKey } from "@/lib/choices";
import { money, stayTotalFor } from "@/lib/cost";
import { quote } from "@/lib/quote";
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

export function Configurator() {
  const { headcount, setHeadcount } = useHeadcount();
  const choices = useMemo(() => liftChoices(), []);
  const [liftId, setLiftId] = useState(choices[0]?.id ?? "");
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
    <div className="flex flex-col gap-[clamp(2.25rem,4.5vw,3.25rem)] pb-[clamp(3rem,6vw,5rem)]">
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
      </section>

      <section aria-labelledby="s-lift">
        <h2 className={STEP_H} id="s-lift">
          <span className={STEP_N}>2</span> Where we ski
        </h2>
        <div className={CHIPS} role="group" aria-labelledby="s-lift">
          {choices.map((c) => (
            <button
              key={c.id}
              type="button"
              className={CHIP}
              aria-pressed={c.id === lift.id}
              onClick={() => setLiftId(c.id)}
            >
              <span className="flex items-start gap-2">
                <Marker rating={c.rating} />
                <span className="text-[10px] uppercase leading-relaxed tracking-[0.1em] text-muted">
                  {c.resort}
                </span>
              </span>
              <span className={CHIP_NAME}>{c.label}</span>
              <span className={CHIP_RATE}>
                {money(c.perDay, true)}
                <span className={CHIP_UNIT}>/day</span>
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
              <button
                key={s.id}
                type="button"
                className={CHIP}
                aria-pressed={s.id === stayId}
                data-off={!t || !fits || undefined}
                onClick={() => setStayId(s.id)}
              >
                <span className={CHIP_NAME}>{s.name}</span>
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
              <span className="text-xs leading-normal text-snow/66">{GEAR[k].note}</span>
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
              <span className="text-xs leading-normal text-snow/66">{CAR[k].note}</span>
            </button>
          ))}
        </div>
      </section>

      {/* The payoff. The reason anyone opened the link. */}
      {q ? (
        <section
          className="relative rounded border border-ridge bg-linear-to-b from-dusk to-pane p-[clamp(20px,3vw,30px)] before:absolute before:inset-x-[14%] before:-top-px before:h-px before:bg-linear-to-r before:from-transparent before:via-sodium before:to-transparent before:opacity-75 before:content-['']"
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
                {money(q.perPersonPerDay)}
              </span>
              <span className="text-[11.5px] text-muted">per person, per day</span>
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
    </div>
  );
}
