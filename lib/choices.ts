import { LOCATIONS } from "@/data/locations";
import {
  BENCHMARK_PER_DAY,
  SKI_DAYS,
  type SkiLocation,
  type LiftOption,
} from "@/lib/types";

export type LiftChoice = {
  id: string;
  /** What to call it on the chip. */
  label: string;
  resort: string;
  locationSlug: string;
  locationName: string;
  days: number;
  /** Sticker price of the product itself. */
  totalUsd: number;
  /** What it costs to cover this trip's ski days — buy two packs if needed. */
  tripTotal: number;
  /** Full days on snow it actually delivers here, capped at SKI_DAYS. */
  covers: number;
  /** True when it delivers every day of the trip: the only real candidates. */
  coversTrip: boolean;
  /** Per full day delivered. null when it delivers none. */
  perDay: number | null;
  /** The age band, or null for the product's default (adult) price. */
  tier: string | null;
  /** Inclusive age bounds on that band. Absent when the tier isn't about age. */
  minAge?: number;
  maxAge?: number;
  blackouts: string;
  option: LiftOption;
  rating: "green" | "blue" | "black" | "unknown";
};

/**
 * What one product costs to put us on snow for the whole trip. A pack that is
 * shorter than the trip has to be bought twice; a season pass costs the same
 * whatever we do; a day ticket multiplies.
 */
function tripCost(option: LiftOption, sticker: number, days: number): number {
  switch (option.coverage) {
    case "unlimited":
      return sticker;
    case "day":
      return sticker * days;
    case "pack":
      return sticker * Math.ceil(days / option.days);
  }
}

/**
 * Every priced lift product, one entry per age/peak tier. Not deduped —
 * picking a pass also picks where we sleep, so the same product at two
 * locations is genuinely two different trips.
 */
export function liftChoices(locations: SkiLocation[] = LOCATIONS): LiftChoice[] {
  const out: LiftChoice[] = [];
  for (const loc of locations) {
    for (const option of loc.lift) {
      const variants =
        option.totalUsd === null
          ? []
          : [
              { suffix: "", tier: null, totalUsd: option.totalUsd, minAge: undefined as number | undefined, maxAge: undefined as number | undefined },
              ...(option.tiers ?? []).map((t) => ({
                suffix: ` · ${t.label}`,
                tier: t.label as string | null,
                totalUsd: t.totalUsd,
                minAge: t.minAge,
                maxAge: t.maxAge,
              })),
            ];
      for (const [i, v] of variants.entries()) {
        // A night pass sells evenings; a Friday ticket needs a Friday. Neither
        // can put us on snow for four full days, however cheap the sticker is.
        const covers = Math.min(SKI_DAYS, option.fullDaysPerTrip ?? SKI_DAYS);
        const tripTotal = tripCost(option, v.totalUsd, covers);
        const perDay = covers > 0 ? tripTotal / covers : null;
        out.push({
          id: `${loc.slug}:${option.id}:${i}`,
          label: option.name + v.suffix,
          resort: option.resort,
          locationSlug: loc.slug,
          locationName: loc.name,
          days: option.days,
          totalUsd: v.totalUsd,
          tier: v.tier,
          minAge: v.minAge,
          maxAge: v.maxAge,
          tripTotal,
          covers,
          coversTrip: covers >= SKI_DAYS,
          perDay,
          blackouts: option.blackouts,
          option,
          rating:
            perDay === null
              ? "unknown"
              : perDay < BENCHMARK_PER_DAY - 5
                ? "green"
                : perDay <= BENCHMARK_PER_DAY + 5
                  ? "blue"
                  : "black",
        });
      }
    }
  }
  // Anything that cannot cover the trip sorts last however cheap it looks —
  // a rate per day is not comparable when the days aren't there.
  return out.sort((a, b) => {
    if (a.coversTrip !== b.coversTrip) return a.coversTrip ? -1 : 1;
    if (a.perDay === null) return 1;
    if (b.perDay === null) return -1;
    return a.perDay - b.perDay;
  });
}

/**
 * Can somebody this age buy this price? The default (adult) price is always
 * available — nobody is too old for it. A band with bounds has to contain the
 * age, which is what keeps a 21-year-old off the child fare. A tier with no
 * bounds isn't an age band at all (a peak-date upgrade), and it stays
 * available because it is a thing you can genuinely buy, just a dearer one.
 */
export function eligibleAt(choice: LiftChoice, age: number): boolean {
  if (choice.minAge !== undefined && age < choice.minAge) return false;
  if (choice.maxAge !== undefined && age > choice.maxAge) return false;
  return true;
}

/**
 * The cheapest way onto one mountain, for somebody this age, that actually
 * covers the whole trip. null when we have no price for it yet — never a
 * guess, and never a product that can't deliver the days.
 */
export function cheapestAccess(
  resortSlug: string,
  age: number,
  all: LiftChoice[] = liftChoices()
): LiftChoice | null {
  const usable = all.filter(
    (c) =>
      c.option.resortSlugs.includes(resortSlug) &&
      c.coversTrip &&
      eligibleAt(c, age)
  );
  if (!usable.length) return null;
  // The same product is filed once per location, so ties are real. Break them
  // on id to stay deterministic between renders.
  return usable.reduce((best, c) =>
    c.tripTotal < best.tripTotal || (c.tripTotal === best.tripTotal && c.id < best.id)
      ? c
      : best
  );
}

export const GEAR = {
  onsite: {
    label: "Rent at the resort",
    perDay: 59,
    note: "Costs more, but nothing rides in the car and you can swap if the snow changes.",
    recommended: true,
    why: "Skis and boards eat the luggage space we don't have with a full carload.",
  },
  sj: {
    label: "Rent in San Jose",
    perDay: 20,
    note: "Half the price, but it fills the trunk and you're stuck with whatever you picked.",
    recommended: false,
    why: "",
  },
  own: {
    label: "I have my own",
    perDay: 0,
    note: "Nothing to rent — still takes the same space in the car.",
    recommended: false,
    why: "",
  },
} as const;

export type GearKey = keyof typeof GEAR;

/**
 * Flat per car, per trip — not per day. Turo came in at $450 and Hertz was
 * close enough that $500 covers either.
 */
export const CAR = {
  own: { label: "We drive ourselves", perTrip: 0, note: "Gas only." },
  rent: {
    label: "Rent a car",
    perTrip: 500,
    note: "Turo or Hertz, about the same. Split per carload.",
  },
} as const;

export type CarKey = keyof typeof CAR;
