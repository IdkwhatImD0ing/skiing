/** Provenance. Every price on this site carries where it came from. */
export type Provenance = {
  /**
   * verified: confirmed against a real source for the season we're pricing.
   * estimate: a working number someone gave us, good enough to plan with.
   * last-season: a real price from a real page, but the previous season's —
   *   the resort hasn't published this one yet. Bill would rather see last
   *   year's number than nothing, and it is not an invented price: it is a
   *   true price with a stale date. It must never be shown as if it were
   *   current, so it always carries its season on the face of it.
   * researching: nobody has confirmed it, price is null.
   */
  status: "verified" | "estimate" | "last-season" | "researching";
  source?: string;
  asOf?: string;
  /** Which season the price is for, e.g. "2026-27". */
  season?: string;
  note?: string;
};

/**
 * A real quote pulled for a specific guest count, on a specific day.
 *
 * The date is not bookkeeping. Airbnb reprices continuously, so two quotes
 * taken weeks apart differ for reasons that have nothing to do with guest
 * count — the Soda Springs house read $3,254 at 7 guests in August and $2,959
 * at 8 guests today. Drawing a line through those two points would "prove"
 * that adding a guest saves $295, which is a pricing change wearing a guest
 * curve as a disguise. It is the same mistake the earlier per-guest claim made
 * and had to retract. So a curve may only be built from points measured on the
 * same day; see `stayTotalFor`.
 */
export type StayQuote = { guests: number; totalUsd: number; asOf?: string };

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

/**
 * A price variant. Most are age bands, but not all — "Add peak dates" costs
 * *more* than the base, so a tier is not automatically a discount. Only tiers
 * that carry an age range are age bands; the rest are upgrades, and asking
 * "what does a 21-year-old pay" must not silently hand back a child fare.
 */
export type PriceTier = {
  label: string;
  totalUsd: number;
  /** Inclusive age bounds. Omit both when the variant is not about age. */
  minAge?: number;
  maxAge?: number;
};

export type LiftOption = Provenance & {
  id: string;
  name: string;
  /** Display label. May name several mountains: "Heavenly / Kirkwood / Northstar". */
  resort: string;
  /**
   * Which resorts this actually gets you onto. The display string can't be
   * split reliably — "Palisades Tahoe" and "Palisades" are the same mountain —
   * so access is explicit.
   */
  resortSlugs: string[];
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
 * A photograph we have the right to publish. Only freely-licensed images go
 * here (Wikimedia Commons, CC, public domain) — the credit is not decoration,
 * it is the licence term, so it renders wherever the image does.
 */
export type ResortImage = {
  /** Local path under /public. Downloaded, not hot-linked, so it can't rot. */
  src: string;
  alt: string;
  /** Photographer, exactly as the licence requires them to be credited. */
  author: string;
  license: string;
  /** The file's page, where the licence can be checked. */
  sourceUrl: string;
};

/** A mountain, and the houses near enough to sleep in while skiing it. */
export type Resort = {
  slug: string;
  name: string;
  /** Whose houses serve this mountain. */
  locationSlug: string;
  /** Roughly, from the houses at that location. */
  toLift: string;
  image?: ResortImage;
};

/**
 * The scenario the home page prices. Bill's actual trip: eight of us, four
 * full days, five nights, everybody old enough to drink and young enough for
 * the under-23 fares. The explorer at /explore is where these come loose.
 */
export const SCENARIO = {
  people: 8,
  skiDays: SKI_DAYS,
  nights: 5,
  age: 21,
} as const;

/**
 * Flat per car, per trip. Turo quoted $450; Hertz is close enough that $500
 * covers either. It is a carload-sized cost, so it jumps every time we need
 * one more car.
 */
export const CAR_RENTAL_PER_TRIP = 500;
