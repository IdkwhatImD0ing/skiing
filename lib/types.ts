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
  days: number;
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
 * Per car, per day. ~$500 for a 5-day trip. Skippable if someone drives their
 * own, but it is a carload-sized cost, so it jumps every time we need one more.
 */
export const CAR_RENTAL_PER_DAY = 100;
