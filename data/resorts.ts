import type { Resort } from "@/lib/types";

/**
 * Every mountain named in `data/locations.ts`, and which cluster of houses
 * serves it. This is geography, not pricing — a resort appears here whether or
 * not we have a lift price for it yet, and the ones we can't price say so on
 * the page rather than going quietly missing.
 *
 * `locationSlug` is where you'd sleep, which is not always where the pass is
 * filed: an Epic Day Pass is one product listed once per location, but the
 * Northstar you ski is the same mountain either way.
 */
export const RESORTS: Resort[] = [
  // --- Donner Summit, straight off I-80 -------------------------------
  {
    slug: "boreal",
    name: "Boreal",
    locationSlug: "donner-summit",
    toLift: "~5 min from the Soda Springs houses",
  },
  {
    slug: "soda-springs",
    name: "Soda Springs",
    locationSlug: "donner-summit",
    toLift: "walk from the Soda Springs houses",
  },
  {
    slug: "donner-ski-ranch",
    name: "Donner Ski Ranch",
    locationSlug: "donner-summit",
    toLift: "~10 min over the summit",
  },
  {
    slug: "sugar-bowl",
    name: "Sugar Bowl",
    locationSlug: "donner-summit",
    toLift: "~10 min from the Soda Springs houses",
  },

  // --- North and west shore -------------------------------------------
  {
    slug: "palisades",
    name: "Palisades Tahoe",
    locationSlug: "north-shore",
    toLift: "at the foot of the mountain",
  },
  {
    slug: "northstar",
    name: "Northstar",
    locationSlug: "north-shore",
    toLift: "~25 min from Olympic Valley",
  },
  {
    slug: "tahoe-donner",
    name: "Tahoe Donner",
    locationSlug: "north-shore",
    toLift: "~20 min, Truckee side",
  },
  {
    slug: "mt-rose",
    name: "Mt Rose",
    locationSlug: "north-shore",
    toLift: "~50 min around the lake",
  },

  // --- South shore ------------------------------------------------------
  {
    slug: "heavenly",
    name: "Heavenly",
    locationSlug: "south-lake",
    toLift: "~10 min from the South Lake house",
  },
  {
    slug: "kirkwood",
    name: "Kirkwood",
    locationSlug: "south-lake",
    toLift: "~45 min south over Carson Pass",
  },
  {
    slug: "sierra-at-tahoe",
    name: "Sierra-at-Tahoe",
    locationSlug: "south-lake",
    toLift: "~20 min west on the 50",
  },
];

export const getResort = (slug: string) => RESORTS.find((r) => r.slug === slug);
