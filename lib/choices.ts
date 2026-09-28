import { LOCATIONS } from "@/data/locations";
import {
  RATING_GREEN_UNDER,
  RATING_BLUE_UNDER,
  SCENARIO,
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
  /**
   * True when this price is last season's, because the resort hasn't posted
   * this one yet. A real number with a stale date — usable, but it must never
   * render as though it were current.
   */
  stale: boolean;
  /** The season the price is for, when we know it. */
  season?: string;
  /** Inclusive age bounds on that band. Absent when the tier isn't about age. */
  minAge?: number;
  maxAge?: number;
  blackouts: string;
  option: LiftOption;
  rating: "green" | "blue" | "black" | "unknown";
};

/**
 * Which of our ski dates this product will actually scan on. Blackouts used to
 * be captions only, because the trip was date-shiftable. It isn't any more:
 * the trip is Dec 29 – Jan 3, the most restricted week of the season, and a
 * pass that is void on two of our four days delivers two days, whatever the
 * sticker says.
 */
export function usableDates(
  option: LiftOption,
  liftsOffDates = false,
  dates: readonly string[] = SCENARIO.skiDates
): string[] {
  return dates.filter((d) => {
    // Noon UTC so the weekday can't slide across midnight in any timezone.
    const weekday = new Date(`${d}T12:00:00Z`).getUTCDay();
    if (option.offWeekdays?.includes(weekday)) return false;
    if (liftsOffDates) return true;
    // ISO dates compare correctly as strings.
    return !option.offDates?.some((r) => d >= r.from && d <= r.to);
  });
}

/**
 * What one product costs to put us on snow for the whole trip. A pack that is
 * shorter than the trip has to be bought twice; a season pass costs the same
 * whatever we do; a day ticket multiplies.
 */
function tripCost(option: LiftOption, sticker: number, days: number): number {
  switch (option.coverage) {
    case "trip":
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
export function liftChoices(
  locations: SkiLocation[] = LOCATIONS,
  skiDates: readonly string[] = SCENARIO.skiDates
): LiftChoice[] {
  const out: LiftChoice[] = [];
  for (const loc of locations) {
    for (const option of loc.lift) {
      const variants =
        option.totalUsd === null
          ? []
          : [
              { suffix: "", tier: null, totalUsd: option.totalUsd, minAge: undefined as number | undefined, maxAge: undefined as number | undefined, liftsOffDates: false },
              ...(option.tiers ?? []).map((t) => ({
                suffix: ` · ${t.label}`,
                tier: t.label as string | null,
                totalUsd: t.totalUsd,
                minAge: t.minAge,
                maxAge: t.maxAge,
                liftsOffDates: t.liftsOffDates ?? false,
              })),
            ];
      for (const [i, v] of variants.entries()) {
        // A night pass sells evenings; a Friday ticket needs a Friday. Neither
        // can put us on snow for four full days, however cheap the sticker is.
        // And a pass blacked out over New Year can only sell the days it
        // isn't blacked out on.
        const covers = Math.min(
          SKI_DAYS,
          option.fullDaysPerTrip ?? SKI_DAYS,
          usableDates(option, v.liftsOffDates, skiDates).length
        );
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
          stale: option.status === "last-season",
          season: option.season,
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
              : perDay < RATING_GREEN_UNDER
                ? "green"
                : perDay < RATING_BLUE_UNDER
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

/**
 * Gear is priced for the days you actually hold it, which is not the same for
 * every option. Rent in San Jose and the skis ride up with us and come home
 * with us: Dec 29 to Jan 3 is six days, four on snow and two in the car, and
 * Bill wants those six paid for. Rent up there and you only hold them on the
 * four ski days. `days` says which count applies; `price` turns it into what
 * one person pays.
 */
export type GearOption = {
  label: string;
  /** "trip" bills every day of the trip, travel days included; "ski" only days on snow. */
  days: "trip" | "ski";
  /** What one person pays to hold this gear for `n` days. */
  price: (n: number) => number;
  note: string;
  recommended: boolean;
  why: string;
  /** Where to book it, and the rate card the price came from. */
  source?: string;
  url?: string;
};

export const GEAR = {
  /**
   * Sports Basement (Sunnyvale and Campbell) prices the Adult Basic package
   * on duration brackets, verbatim from the rate table: 1 day $50, "weekend
   * (2-4 days)" $85, "week (5-9 days)" $145, season $290. And the pickup and
   * return days are free — their words, which Bill sent: "your pickup and
   * return days are free! F-R-E-E... you can book a 4-day 'weekend' rental
   * picking up on a Friday and not have to return your gear until Wednesday."
   * So we hold it six days, Dec 29 to Jan 3, and pay for the four between:
   * the $85 bracket. research/south-bay-rentals.json.
   */
  sj: {
    label: "Rent in San Jose",
    days: "trip",
    price: (n) => {
      // Pickup and return days are free, so they come off before the bracket.
      const billed = Math.max(1, n - 2);
      return n <= 0 ? 0 : billed === 1 ? 50 : billed <= 4 ? 85 : billed <= 9 ? 145 : 290;
    },
    note: "Sports Basement: pickup and return days are free, so six days bills as the 2–4 day “weekend” rate. Fills the trunk, and you're stuck with whatever you picked.",
    // Bill's call: this is the default, over renting at the resort.
    recommended: true,
    why: "Pick it up before we leave and it rides up with us.",
    source: "sportsbasement.com — snow rental rates",
    url: "https://www.sportsbasement.com/pages/snow-rental-rates",
  },
  /**
   * The $59 this used to carry was attributed to Boreal and is unsupportable:
   * Boreal's rentals page renders the single word "RENTALS", its CMS payload
   * has an empty children array, and its store returns CATEGORY NOT FOUND.
   * The only rental price in Tahoe provably re-priced for 2026-27 is Tahoe
   * Dave's in Truckee — $201 for a 4-day package plus $48 for a helmet, which
   * a 2026-04-23 archive capture shows rising from $181 and $40. $62.25 a day
   * all-in. This replaces a guess; it does not confirm one.
   */
  onsite: {
    label: "Rent up there",
    days: "ski",
    price: (n) => 62.25 * n,
    note: "Tahoe Dave's in Truckee, only for the days on snow. Nothing rides in the car and you can swap if the snow changes. Helmet included.",
    recommended: false,
    why: "",
    source: "tahoedaves.com — rates",
    url: "https://tahoedaves.com/rates/",
  },
  own: {
    label: "I have my own",
    days: "ski",
    price: () => 0,
    note: "Nothing to rent — still takes the same space in the car.",
    recommended: false,
    why: "",
  },
} satisfies Record<string, GearOption>;

/**
 * What one person pays for gear on a trip of `tripDays` with `skiDays` on
 * snow, and how many days that pays for.
 */
export function gearCost(key: GearKey, skiDays: number, tripDays: number) {
  const g: GearOption = GEAR[key];
  const days = g.days === "trip" ? tripDays : skiDays;
  return { days, perPerson: g.price(days) };
}

export type GearKey = keyof typeof GEAR;

/** Bill's default: gear from San Jose. */
export const DEFAULT_GEAR: GearKey = "sj";

/**
 * Flat per car, per trip — not per day. Turo came in at $450 and Hertz was
 * close enough that $500 covers either.
 */
export const CAR = {
  own: {
    label: "We drive ourselves",
    perTrip: 0,
    note: "Nothing in the total — gas gets split at the pump.",
  },
  rent: {
    label: "Rent a car",
    perTrip: 500,
    note: "Turo or Hertz, about the same. Split per carload.",
  },
} as const;

export type CarKey = keyof typeof CAR;

/** Bill's default: we drive our own cars. */
export const DEFAULT_CAR: CarKey = "own";
