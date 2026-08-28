import { BENCHMARK_PER_DAY, type SkiLocation, type Stay, type Trip } from "@/lib/types";
import { getLocation } from "@/data/locations";

/**
 * What this stay actually costs for N guests.
 * Listings often price per guest, so dividing one headline total by headcount
 * understates the real number as the group grows.
 */
export function stayTotalFor(
  stay: Stay,
  guests: number
): { totalUsd: number; estimated: boolean } | null {
  const q = [...stay.quotes].sort((a, b) => a.guests - b.guests);
  if (!q.length) return null;

  const exact = q.find((x) => x.guests === guests);
  if (exact) return { totalUsd: exact.totalUsd, estimated: false };

  // Between two quotes — interpolate.
  for (let i = 0; i < q.length - 1; i++) {
    const lo = q[i];
    const hi = q[i + 1];
    if (guests > lo.guests && guests < hi.guests) {
      const slope = (hi.totalUsd - lo.totalUsd) / (hi.guests - lo.guests);
      return {
        totalUsd: lo.totalUsd + slope * (guests - lo.guests),
        estimated: true,
      };
    }
  }

  // Outside the quoted range — extrapolate from the two nearest points.
  if (q.length >= 2) {
    const [lo, hi] =
      guests < q[0].guests ? [q[0], q[1]] : [q[q.length - 2], q[q.length - 1]];
    const slope = (hi.totalUsd - lo.totalUsd) / (hi.guests - lo.guests);
    return { totalUsd: hi.totalUsd + slope * (guests - hi.guests), estimated: true };
  }

  // A single quote is only good for its own guest count.
  return null;
}

export type StayOption = {
  stay: Stay;
  totalUsd: number | null;
  perPerson: number | null;
  perPersonPerNight: number | null;
  estimated: boolean;
  /** Bookable at all — within the absolute ceiling. */
  fits: boolean;
  /** Over comfortable capacity: someone is on an air mattress. */
  squeeze: boolean;
};

/** Every stay at a location, priced for this headcount, cheapest first. */
export function stayOptions(
  location: SkiLocation,
  headcount: number
): StayOption[] {
  return location.stays
    .map((stay) => {
      const q = stayTotalFor(stay, headcount);
      const perPerson = q ? q.totalUsd / headcount : null;
      return {
        stay,
        totalUsd: q?.totalUsd ?? null,
        perPerson,
        perPersonPerNight: perPerson === null ? null : perPerson / stay.nights,
        estimated: q?.estimated ?? false,
        fits: headcount <= (stay.sleepsMax ?? stay.sleeps),
        squeeze: headcount > stay.sleeps,
      };
    })
    .sort((a, b) => {
      if (a.fits !== b.fits) return a.fits ? -1 : 1;
      if (a.perPerson === null) return 1;
      if (b.perPerson === null) return -1;
      return a.perPerson - b.perPerson;
    });
}

export type CostLine = { label: string; perPerson: number | null; detail: string };

export type TripCost = {
  trip: Trip;
  location: SkiLocation;
  options: StayOption[];
  best: StayOption | null;
  lines: CostLine[];
  totalPerPerson: number | null;
  liftPerDay: number | null;
  /** Cheapest gear per day, and where from. Null if nothing priced. */
  rental: { perDay: number; where: string } | null;
  /** What renting on the mountain instead would add, per person. */
  rentalPenalty: number | null;
  rating: "green" | "blue" | "black" | "unknown";
  /** No stay at this location sleeps the whole group. */
  noRoom: boolean;
};

export function costFor(trip: Trip, headcount: number): TripCost | null {
  const location = getLocation(trip.locationSlug);
  if (!location) return null;

  const lift = location.lift.find((l) => l.id === trip.liftOptionId);
  if (!lift) return null;

  const options = stayOptions(location, headcount);
  const best = options.find((o) => o.fits && o.perPerson !== null) ?? null;
  const noRoom = !options.some((o) => o.fits);

  const cars = Math.ceil(headcount / trip.seatsPerCar);
  const liftPerDay = lift.totalUsd === null ? null : lift.totalUsd / lift.days;
  const liftTotal = liftPerDay === null ? null : liftPerDay * trip.dates.skiDays;

  const rentals = location.rentals.filter((r) => r.perDayUsd !== null);
  const cheapest = rentals.length
    ? rentals.reduce((a, b) => (a.perDayUsd! <= b.perDayUsd! ? a : b))
    : null;
  const dearest = rentals.length
    ? rentals.reduce((a, b) => (a.perDayUsd! >= b.perDayUsd! ? a : b))
    : null;
  const rental = cheapest
    ? { perDay: cheapest.perDayUsd!, where: cheapest.shop }
    : null;
  const rentalPenalty =
    cheapest && dearest && dearest !== cheapest
      ? (dearest.perDayUsd! - cheapest.perDayUsd!) * trip.dates.skiDays
      : null;

  const lines: CostLine[] = [
    {
      label: "Lodging",
      perPerson: best?.perPerson ?? null,
      detail: best
        ? `${best.stay.name} · $${Math.round(best.totalUsd!).toLocaleString()} ÷ ${headcount}`
        : "researching",
    },
    {
      label: "Lift",
      perPerson: liftTotal,
      detail:
        liftPerDay === null
          ? "researching"
          : `${trip.dates.skiDays} days × $${Math.round(liftPerDay)}`,
    },
    {
      label: "Gas",
      perPerson: (cars * trip.gasPerCarUsd) / headcount,
      detail: `${cars} car${cars > 1 ? "s" : ""} × $${trip.gasPerCarUsd} ÷ ${headcount}`,
    },
    {
      label: "Gear",
      perPerson: rental ? rental.perDay * trip.dates.skiDays : null,
      detail: rental
        ? `${trip.dates.skiDays} days × $${rental.perDay} · ${rental.where}`
        : "researching",
    },
    {
      label: "Food",
      perPerson: trip.foodPerDayUsd * trip.dates.nights,
      detail: `${trip.dates.nights} nights × $${trip.foodPerDayUsd}`,
    },
  ];

  const totalPerPerson = lines.some((l) => l.perPerson === null)
    ? null
    : lines.reduce((sum, l) => sum + (l.perPerson ?? 0), 0);

  let rating: TripCost["rating"] = "unknown";
  if (liftPerDay !== null) {
    if (liftPerDay < BENCHMARK_PER_DAY - 5) rating = "green";
    else if (liftPerDay <= BENCHMARK_PER_DAY + 5) rating = "blue";
    else rating = "black";
  }

  return {
    trip,
    location,
    options,
    best,
    lines,
    totalPerPerson,
    liftPerDay,
    rating,
    noRoom,
    rental,
    rentalPenalty,
  };
}

export const money = (n: number, cents = false) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  });

export type LadderRow = {
  option: import("@/lib/types").LiftOption;
  locationName: string;
  locationSlug: string;
  label: string;
  totalUsd: number;
  perDay: number;
  rating: "green" | "blue" | "black";
};

/**
 * Every priced lift product, flattened and ranked by cost per day.
 * Price is the axis this site sorts on — trips are date-shiftable, so
 * blackouts are a caption, not a filter.
 */
export function liftLadder(locations: SkiLocation[]): LadderRow[] {
  const rows: LadderRow[] = [];
  for (const loc of locations) {
    for (const option of loc.lift) {
      const variants: { label: string; totalUsd: number }[] = [];
      if (option.totalUsd !== null)
        variants.push({ label: option.name, totalUsd: option.totalUsd });
      for (const t of option.tiers ?? [])
        variants.push({ label: `${option.name} — ${t.label}`, totalUsd: t.totalUsd });

      for (const v of variants) {
        const perDay = v.totalUsd / option.days;
        rows.push({
          option,
          locationName: loc.name,
          locationSlug: loc.slug,
          label: v.label,
          totalUsd: v.totalUsd,
          perDay,
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
  // Dedupe products that appear at more than one location (Epic covers several).
  const seen = new Set<string>();
  return rows
    .filter((r) => {
      const key = `${r.label}|${r.totalUsd}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => a.perDay - b.perDay);
}
