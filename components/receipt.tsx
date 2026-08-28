import { money } from "@/lib/cost";
import type { Quote } from "@/lib/quote";

/* The payoff, and the reason anyone opened the link. Shared by the scenario
   page and the explorer so the number is presented identically on both. */

export function Receipt({
  q,
  headcount,
}: {
  q: Quote;
  headcount: number;
}) {
  return (
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
              {/* Takes the slack so the label and the amount stay tight to
                  their own edges. */}
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
          {/* Divided by nights, not ski days — the page says "4 full days" a
              few lines up, so "per day" would read as the wrong denominator. */}
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

      {/* A pass that doesn't reach four days leaves a hole in the trip, and the
          total above is not the price of the trip Bill asked for. Say so where
          the number is, not in a caption underneath it. */}
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
        {q.spareSeats > 0 &&
          ` · ${q.spareSeats} spare seat${q.spareSeats > 1 ? "s" : ""}`}
        {q.squeeze && ` · ${headcount - q.stay.sleeps} on air mattresses`}
        {q.estimated && " · lodging interpolated, not quoted"}
      </p>
    </section>
  );
}

/**
 * No total, because a line is missing. Dashed like every other absent price,
 * and the sentence outweighs the dash — a big em-dash where a total belongs
 * reads as a value.
 */
export function NoReceipt({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5 rounded border border-dashed border-ridge p-[clamp(20px,3vw,26px)]">
      <p className="m-0 font-data tabular-nums text-[1.15rem] text-muted">—</p>
      <div className="m-0 max-w-[56ch] flex-[1_1_22ch] text-sm leading-relaxed text-snow/84">
        {children}
      </div>
    </section>
  );
}

/**
 * On a phone there is no right-hand side, so the number follows you up from
 * the bottom instead. Duplicates the rail, so it is hidden from screen readers
 * rather than announced twice.
 */
export function MobileTotal({ q }: { q: Quote }) {
  return (
    <div
      aria-hidden
      className="sticky bottom-0 z-40 -mx-6 flex items-baseline justify-between gap-3 border-t border-ridge bg-night/92 px-6 py-2.5 backdrop-blur lg:hidden"
    >
      <span className="font-data tabular-nums text-[1.35rem] font-bold leading-none tracking-[-0.03em] text-glacier">
        {money(q.perPerson)}
      </span>
      <span className="text-[11px] text-muted">per person, all in</span>
    </div>
  );
}
