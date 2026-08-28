"use client";

import { useMemo, useState } from "react";
import { getLocation } from "@/data/locations";
import { liftChoices, GEAR, CAR, type GearKey, type CarKey } from "@/lib/choices";
import { money, stayTotalFor } from "@/lib/cost";
import { quote } from "@/lib/quote";
import { useHeadcount, HEAD_RANGE } from "@/components/headcount";
import { Marker } from "@/components/ui";

export function Configurator() {
  const { headcount, setHeadcount } = useHeadcount();
  const choices = useMemo(() => liftChoices(), []);
  const [liftId, setLiftId] = useState(choices[0]?.id ?? "");
  const [gear, setGear] = useState<GearKey>("sj");
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
    <div className="conf">
      <section className="step" aria-labelledby="s-who">
        <h2 className="step-h" id="s-who">
          <span className="step-n">1</span> How many of us
        </h2>
        <div className="chips chips-tight" role="group" aria-labelledby="s-who">
          {HEAD_RANGE.map((n) => (
            <button
              key={n}
              type="button"
              className="chip chip-n"
              aria-pressed={n === headcount}
              onClick={() => setHeadcount(n)}
            >
              <span className="num">{n}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="step" aria-labelledby="s-lift">
        <h2 className="step-h" id="s-lift">
          <span className="step-n">2</span> Where we ski
        </h2>
        <div className="chips" role="group" aria-labelledby="s-lift">
          {choices.map((c) => (
            <button
              key={c.id}
              type="button"
              className="chip chip-lift"
              aria-pressed={c.id === lift.id}
              onClick={() => setLiftId(c.id)}
            >
              <span className="chip-top">
                <Marker rating={c.rating} />
                <span className="chip-resort">{c.resort}</span>
              </span>
              <span className="chip-name">{c.label}</span>
              <span className="chip-rate num">
                {money(c.perDay, true)}<span className="chip-unit">/day</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="step" aria-labelledby="s-stay">
        <h2 className="step-h" id="s-stay">
          <span className="step-n">3</span> Where we sleep
          <span className="step-sub">{location?.name}</span>
        </h2>
        <div className="chips" role="group" aria-labelledby="s-stay">
          {stays.map((s) => {
            const t = stayTotalFor(s, headcount);
            const fits = headcount <= (s.sleepsMax ?? s.sleeps);
            return (
              <button
                key={s.id}
                type="button"
                className="chip chip-stay"
                aria-pressed={s.id === stayId}
                data-off={!t || !fits || undefined}
                onClick={() => setStayId(s.id)}
              >
                <span className="chip-name">{s.name}</span>
                <span className="chip-meta num">
                  sleeps {s.sleeps}
                  {s.sleepsMax ? `–${s.sleepsMax}` : ""} · {s.nights} nights
                </span>
                {t ? (
                  <span className="chip-rate num">
                    {money(t.totalUsd / headcount, true)}
                    <span className="chip-unit">/person</span>
                    {t.estimated && <span className="chip-est">est</span>}
                  </span>
                ) : (
                  <span className="chip-rate chip-rate-off num">
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

      <section className="step" aria-labelledby="s-gear">
        <h2 className="step-h" id="s-gear">
          <span className="step-n">4</span> Gear
        </h2>
        <div className="chips" role="group" aria-labelledby="s-gear">
          {(Object.keys(GEAR) as GearKey[]).map((k) => (
            <button
              key={k}
              type="button"
              className="chip chip-opt"
              aria-pressed={k === gear}
              onClick={() => setGear(k)}
            >
              <span className="chip-name">{GEAR[k].label}</span>
              <span className="chip-rate num">
                {GEAR[k].perDay === 0 ? "free" : `${money(GEAR[k].perDay)}`}
                {GEAR[k].perDay > 0 && <span className="chip-unit">/day</span>}
              </span>
              <span className="chip-note">{GEAR[k].note}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="step" aria-labelledby="s-car">
        <h2 className="step-h" id="s-car">
          <span className="step-n">5</span> Wheels
        </h2>
        <div className="chips" role="group" aria-labelledby="s-car">
          {(Object.keys(CAR) as CarKey[]).map((k) => (
            <button
              key={k}
              type="button"
              className="chip chip-opt"
              aria-pressed={k === car}
              onClick={() => setCar(k)}
            >
              <span className="chip-name">{CAR[k].label}</span>
              <span className="chip-rate num">
                {CAR[k].perDay === 0 ? "gas only" : `${money(CAR[k].perDay)}`}
                {CAR[k].perDay > 0 && <span className="chip-unit">/car/day</span>}
              </span>
              <span className="chip-note">{CAR[k].note}</span>
            </button>
          ))}
        </div>
      </section>

      {q ? (
        <section className="total" aria-live="polite" aria-labelledby="s-total">
          <h2 className="sr-only" id="s-total">
            What it costs
          </h2>

          <table className="total-table">
            <tbody>
              {q.lines.map((l) => (
                <tr key={l.label}>
                  <th scope="row">{l.label}</th>
                  <td className="total-detail">{l.detail}</td>
                  <td className="col-num num">{money(l.perPerson, true)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="total-out">
            <p className="total-cell">
              <span className="total-num num">{money(q.perPerson)}</span>
              <span className="total-label">per person</span>
            </p>
            <p className="total-cell">
              <span className="total-num num">{money(q.perPersonPerDay)}</span>
              <span className="total-label">per person, per day</span>
            </p>
            <p className="total-cell total-cell-quiet">
              <span className="total-num num">{money(q.total)}</span>
              <span className="total-label">whole group, {headcount} of us</span>
            </p>
          </div>

          <p className="total-notes num">
            {q.nights} nights · {q.skiDays} days on snow · {q.cars} car
            {q.cars > 1 ? "s" : ""}
            {q.spareSeats > 0 && ` · ${q.spareSeats} spare seat${q.spareSeats > 1 ? "s" : ""}`}
            {q.squeeze && ` · ${headcount - q.stay.sleeps} on air mattresses`}
            {q.estimated && " · lodging interpolated, not quoted"}
          </p>
        </section>
      ) : (
        <section className="total total-empty">
          <p className="total-num num">—</p>
          <p className="total-label">
            No lodging quote for {headcount} at {location?.name}. Pick another place,
            or change the headcount.
          </p>
        </section>
      )}
    </div>
  );
}
