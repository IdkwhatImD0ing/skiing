import type { Metadata } from "next";
import { LOCATIONS, getLocation } from "@/data/locations";
import { getResort } from "@/data/resorts";
import {
  cheapestAccess,
  liftChoices,
  DEFAULT_CAR,
  DEFAULT_GEAR,
} from "@/lib/choices";
import { quote } from "@/lib/quote";
import { stayTotalFor } from "@/lib/cost";
import type { Plan } from "@/lib/types";

export const SITE_NAME = "Night laps";

/**
 * Where link previews point. This used to be a made-up
 * https://tahoe-night-laps.local, and an explicit metadataBase beats Vercel's
 * own, so every og:image URL on the deployed site pointed at a host that
 * doesn't exist. Vercel sets the production domain at build time; local
 * builds fall back to localhost.
 */
export const SITE_URL = new URL(
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : `http://localhost:${process.env.PORT ?? 3000}`
);

/**
 * The Open Graph fields every page shares. A page that sets `openGraph`
 * replaces the parent's object wholesale rather than merging it, so each page
 * spreads this in; otherwise the site name and type quietly vanish.
 */
export const OG_BASE = {
  siteName: SITE_NAME,
  type: "website",
  locale: "en_US",
} satisfies NonNullable<Metadata["openGraph"]>;

/**
 * What one person pays on a plan with every choice at its default: the
 * cheapest pass covering the trip, the house the plan names, and Bill's gear
 * and car defaults. The share card leads with it. null when a price is
 * missing — a card never shows a number the page wouldn't.
 */
export function planQuote(plan: Plan) {
  const resort = plan.resort ? getResort(plan.resort) : undefined;
  if (!resort) return null;
  const lift = cheapestAccess(
    resort.slug,
    plan.age,
    liftChoices(LOCATIONS, plan.skiDates)
  );
  const stays = getLocation(resort.locationSlug)?.stays ?? [];
  // The plan's own house when it names one; otherwise the cheapest house on
  // its shortlist that is quoted at our headcount — and the card says "from".
  const named = stays.find((s) => s.id === plan.stay);
  const cheapest = (plan.shortlist ?? [])
    .map((id) => stays.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => !!s && !!stayTotalFor(s, plan.people))
    .sort(
      (a, b) =>
        stayTotalFor(a, plan.people)!.totalUsd - stayTotalFor(b, plan.people)!.totalUsd
    )[0];
  const stay = named ?? cheapest;
  if (!lift || !stay) return null;
  const q = quote(lift, stay, DEFAULT_GEAR, DEFAULT_CAR, plan.people, plan.skiDays);
  return q && { ...q, lift, resort, fromCheapest: !named };
}
