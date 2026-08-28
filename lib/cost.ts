import type { SkiLocation, Stay } from "@/lib/types";

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

export const money = (n: number, cents = false) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  });
