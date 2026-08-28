/** Provenance. Every price on this site carries where it came from. */
export type Provenance = {
  /**
   * verified: confirmed against a real source.
   * estimate: a working number someone gave us, good enough to plan with.
   * researching: agents are still on it, price is null.
   */
  status: "verified" | "estimate" | "researching";
  source?: string;
  asOf?: string;
  note?: string;
};

/** A real quote pulled for a specific guest count. */
export type StayQuote = { guests: number; totalUsd: number };

export type Stay = Provenance & {
  id: string;
  name: string;
  kind: "house" | "motel" | "hotel" | "hostel";
  /** How many people sleep here comfortably — not the listing's optimistic max. */
  sleeps: number;
  /** Absolute ceiling, air mattresses and couches included. Omit if same as sleeps. */
  sleepsMax?: number;
  nights: number;
  /**
   * Quoted totals by guest count. Many listings price per guest, so a single
   * total that you divide is wrong — adding people can raise everyone's share.
   */
  quotes: StayQuote[];
  url?: string;
  toLift: string;
  perks: string[];
};

/** Age-banded pricing. Most pass products have tiers and this group spans 23. */
export type PriceTier = { label: string; totalUsd: number };

export type LiftOption = Provenance & {
  id: string;
  name: string;
  resort: string;
  /** Visits included. Only meaningful when `coverage` is "pack". */
  days: number;
  /**
   * How `totalUsd` relates to days on snow. Without this, `days` was doing
   * two jobs — a real product attribute on a 4-pack, and a guessed visit
   * count on a season pass — and the per-day figures were not comparable.
   *
   *   "pack"      buys `days` visits; buy another pack to cover a longer trip
   *   "unlimited" buys the season, so one price covers the whole trip
   *   "day"       buys one day; multiply by the trip
   */
  coverage: "pack" | "unlimited" | "day";
  /**
   * Full days on snow this can actually deliver inside ONE trip. Omit when it
   * can cover the whole trip. 0 means it is not a full-day product at all —
   * a night pass sells evenings, and no number of them is a full day.
   */
  fullDaysPerTrip?: number;
  /** Adult / default price for the whole product. null while researching. */
  totalUsd: number | null;
  /** Cheaper age bands, if the product has them. */
  tiers?: PriceTier[];
  blackouts: string;
  transferable: boolean | null;
};

export type Rental = Provenance & {
  id: string;
  where: "on-site" | "san-jose" | "town";
  shop: string;
  perDayUsd: number | null;
  catch?: string;
};

export type SkiLocation = {
  slug: string;
  name: string;
  blurb: string;
  route: string;
  driveFromSanJose: string;
  resorts: string[];
  stays: Stay[];
  lift: LiftOption[];
  rentals: Rental[];
};

export type Trip = {
  slug: string;
  title: string;
  pitch: string;
  locationSlug: string;
  liftOptionId: string;
  dates: { label: string; nights: number; skiDays: number };
  /** Holiday weeks blow up lift pricing and void most multi-packs. */
  holiday: boolean;
  gasPerCarUsd: number;
  seatsPerCar: number;
  foodPerDayUsd: number;
};

/** The yardstick: $60/day on lift, from the Boreal 4-pack at ~$240. */
export const BENCHMARK_PER_DAY = 60;

/**
 * The trip: four full days on snow. Bill asked for it directly, so it is a
 * property of the trip and not of whichever pass happens to be selected.
 *
 * It used to be `lift.days`, which meant the pass silently redefined the trip
 * — picking a $35 Friday ticket produced a one-day trip, and the two season
 * passes were quoted per-day against an assumed five visits they would never
 * get. Every lift product is now priced for covering these four days.
 */
export const SKI_DAYS = 4;

/**
 * Flat per car, per trip. Turo quoted $450; Hertz is close enough that $500
 * covers either. It is a carload-sized cost, so it jumps every time we need
 * one more car.
 */
export const CAR_RENTAL_PER_TRIP = 500;
