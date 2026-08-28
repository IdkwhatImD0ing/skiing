"use client";

import type { Trip } from "@/lib/types";
import { costFor, money } from "@/lib/cost";
import { useHeadcount } from "@/components/headcount";
import { Marker, Num, Provenance, Tag } from "@/components/ui";

export function TripDetail({ trip }: { trip: Trip }) {
  const { headcount } = useHeadcount();
  const c = costFor(trip, headcount);
  if (!c) return null;

  return (
    <>
      <section className="sheet panel" aria-labelledby="cost-h">
        <h2 className="eyebrow" id="cost-h">
          Your share, {headcount} of us
        </h2>
        <div className="scroller">
          <table className="sheet-table">
          <caption className="sr-only">Per-person cost breakdown</caption>
          <tbody>
            {c.lines.map((l) => (
              <tr key={l.label}>
                <th scope="row">{l.label}</th>
                <td className="sheet-detail num">{l.detail}</td>
                <td className="col-num num sheet-amt">
                  {l.perPerson === null ? "—" : money(l.perPerson, true)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">Each</th>
              <td className="sheet-detail num">
                {c.trip.dates.skiDays} days on snow
              </td>
              <td className="col-num num sheet-total">
                {c.totalPerPerson === null ? "—" : money(c.totalPerPerson)}
              </td>
            </tr>
          </tfoot>
          </table>
        </div>
        {c.totalPerPerson === null && (
          <p className="sheet-note">
            One line isn&rsquo;t priced yet, so there&rsquo;s no total. It stays blank
            until it&rsquo;s real.
          </p>
        )}
      </section>

      <section aria-labelledby="stays-h">
        <h2 className="display sec-h" id="stays-h">
          Where we sleep
        </h2>
        <p className="sec-sub">
          Every place at {c.location.name}, priced for <Num>{headcount}</Num>.
          Listings charge per guest, so the split moves with the group.
        </p>
        <ul className="stay-list">
          {c.options.map((o) => (
            <li
              key={o.stay.id}
              className="stay panel"
              data-off={!o.fits || undefined}
              data-best={o.stay.id === c.best?.stay.id || undefined}
            >
              <div className="stay-top">
                <h3 className="stay-name">
                  {o.stay.url ? (
                    <a href={o.stay.url} target="_blank" rel="noopener noreferrer">
                      {o.stay.name}
                    </a>
                  ) : (
                    o.stay.name
                  )}
                </h3>
                <p className="stay-tags">
                  {o.stay.id === c.best?.stay.id && <Tag tone="good">best at {headcount}</Tag>}
                  {!o.fits && <Tag tone="warn">sleeps {o.stay.sleeps}</Tag>}
                  {o.estimated && (
                    <Tag tone="soft" title="Interpolated between two real quotes.">
                      estimated
                    </Tag>
                  )}
                </p>
              </div>

              <p className="stay-meta num">
                sleeps {o.stay.sleeps} · {o.stay.nights} nights · {o.stay.toLift}
              </p>

              {o.perPerson !== null ? (
                <p className="stay-price">
                  <span className="num stay-price-num">{money(o.perPerson, true)}</span>
                  <span className="stay-price-label">each</span>
                  <span className="num stay-price-sub">
                    {money(o.perPersonPerNight ?? 0, true)}/night · {money(o.totalUsd ?? 0)} total
                  </span>
                </p>
              ) : (
                <p className="stay-price stay-price-off">
                  <span className="num stay-price-num">—</span>
                  <span className="stay-price-label">
                    {o.stay.quotes.length
                      ? `only quoted at ${o.stay.quotes.map((q) => q.guests).join(", ")}`
                      : "no quote yet"}
                  </span>
                </p>
              )}

              {o.stay.perks.length > 0 && (
                <p className="stay-perks">{o.stay.perks.join(" · ")}</p>
              )}
              <Provenance of={o.stay} compact />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="lift-h">
        <h2 className="display sec-h" id="lift-h">
          Getting on the lift
        </h2>
        <ul className="opt-list">
          {c.location.lift.map((o) => {
            const perDay = o.totalUsd === null ? null : o.totalUsd / o.days;
            const rating =
              perDay === null
                ? ("unknown" as const)
                : perDay < 55
                  ? ("green" as const)
                  : perDay <= 65
                    ? ("blue" as const)
                    : ("black" as const);
            return (
              <li key={o.id} className="opt panel">
                <div className="opt-top">
                  <Marker rating={rating} />
                  <h3 className="opt-name">{o.name}</h3>
                  <span className="opt-resort num">{o.resort}</span>
                </div>
                <p className="opt-price">
                  {perDay === null ? (
                    <span className="num opt-off">still checking</span>
                  ) : (
                    <>
                      <span className="num opt-perday">{money(perDay, true)}</span>
                      <span className="opt-unit">/day</span>
                      <span className="num opt-total">
                        {money(o.totalUsd!)} for {o.days}
                      </span>
                    </>
                  )}
                </p>
                {o.tiers?.map((t) => (
                  <p key={t.label} className="opt-tier num">
                    {t.label}: {money(t.totalUsd)} ·{" "}
                    {money(t.totalUsd / o.days, true)}/day
                  </p>
                ))}
                <p className="opt-note">{o.blackouts}</p>
                {o.transferable === false && (
                  <p className="opt-note opt-note-warn">
                    Non-transferable — nobody can hand a day to a friend who bails.
                  </p>
                )}
                <Provenance of={o} compact />
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="rent-h">
        <h2 className="display sec-h" id="rent-h">
          Gear
        </h2>
        <ul className="opt-list">
          {c.location.rentals.map((r) => (
            <li key={r.id} className="opt panel">
              <div className="opt-top">
                <h3 className="opt-name">{r.shop}</h3>
                <span className="opt-resort num">
                  {r.where === "san-jose"
                    ? "pick up at home"
                    : r.where === "on-site"
                      ? "on the mountain"
                      : "in town"}
                </span>
              </div>
              <p className="opt-price">
                {r.perDayUsd === null ? (
                  <span className="num opt-off">still checking</span>
                ) : (
                  <>
                    <span className="num opt-perday">{money(r.perDayUsd, true)}</span>
                    <span className="opt-unit">/day</span>
                  </>
                )}
              </p>
              {r.catch && <p className="opt-note">{r.catch}</p>}
              <Provenance of={r} compact />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
