import { LOCATIONS } from "@/data/locations";
import { BENCHMARK_PER_DAY, type SkiLocation, type LiftOption } from "@/lib/types";

export type LiftChoice = {
  id: string;
  /** What to call it on the chip. */
  label: string;
  resort: string;
  locationSlug: string;
  locationName: string;
  days: number;
  totalUsd: number;
  perDay: number;
  blackouts: string;
  option: LiftOption;
  rating: "green" | "blue" | "black";
};

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
              { suffix: "", totalUsd: option.totalUsd },
              ...(option.tiers ?? []).map((t) => ({
                suffix: ` · ${t.label}`,
                totalUsd: t.totalUsd,
              })),
            ];
      for (const [i, v] of variants.entries()) {
        const perDay = v.totalUsd / option.days;
        out.push({
          id: `${loc.slug}:${option.id}:${i}`,
          label: option.name + v.suffix,
          resort: option.resort,
          locationSlug: loc.slug,
          locationName: loc.name,
          days: option.days,
          totalUsd: v.totalUsd,
          perDay,
          blackouts: option.blackouts,
          option,
          rating:
            perDay < BENCHMARK_PER_DAY - 5
              ? "green"
              : perDay <= BENCHMARK_PER_DAY + 5
                ? "blue"
                : "black",
        });
      }
    }
  }
  return out.sort((a, b) => a.perDay - b.perDay);
}

export const GEAR = {
  onsite: {
    label: "Rent at the resort",
    perDay: 40,
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
