"use client";

import { GEAR, gearCost, type GearKey } from "@/lib/choices";
import { money } from "@/lib/cost";
import {
  CHIP,
  CHIP_NAME,
  CHIP_NOTE,
  CHIP_PROOF,
  CHIP_RATE,
  CHIP_UNIT,
  CHIPS,
  PILL,
} from "@/components/chips";

/**
 * The gear step, shared by the trip pages and the explorer. Each chip shows
 * what one person pays for the days they would hold that gear: six from San
 * Jose, four up there. A per-day rate misleads for a bracket-priced rental,
 * so the whole-trip figure leads.
 */
export function GearChips({
  gear,
  onPick,
  skiDays,
  tripDays,
  labelledBy,
}: {
  gear: GearKey;
  onPick: (k: GearKey) => void;
  skiDays: number;
  tripDays: number;
  labelledBy: string;
}) {
  return (
    <div className={CHIPS} role="group" aria-labelledby={labelledBy}>
      {(Object.keys(GEAR) as GearKey[]).map((k) => {
        const g = GEAR[k];
        const { days, perPerson } = gearCost(k, skiDays, tripDays);
        return (
          // Wrapped so the rates link can sit beside the button: an <a>
          // inside a <button> is invalid, and the click would be swallowed.
          <div key={k} className="relative grid">
            <button
              type="button"
              className={`${CHIP} h-full`}
              aria-pressed={k === gear}
              onClick={() => onPick(k)}
            >
              <span className={`${CHIP_NAME} pr-16`}>
                {g.label}
                {g.recommended && (
                  <span className={`${PILL} border-sodium/45 bg-sodium/15 text-sodium`}>
                    pick this
                  </span>
                )}
              </span>
              <span className={CHIP_RATE}>
                {perPerson === 0 ? (
                  "free"
                ) : (
                  <>
                    {/* cents only when there are cents */}
                    {money(perPerson, perPerson % 1 !== 0)}
                    <span className={CHIP_UNIT}>/{days} days</span>
                  </>
                )}
              </span>
              <span className={CHIP_NOTE}>{g.note}</span>
            </button>
            {"url" in g && (
              <a
                href={g.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${g.source} — rental rates, opens in a new tab`}
                title={g.source}
                className={`${CHIP_PROOF} right-[13px] top-[11px]`}
              >
                rates&nbsp;↗
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
