import { SCENARIO, type Plan } from "@/lib/types";

/**
 * The trips Bill is actually taking, one page each at /trips/<slug>. Each is a
 * decision the home page's open board led to: a mountain, a headcount, a
 * house. Add the next one here and it gets a page and a line on the home page.
 */
export const TRIPS: Plan[] = [
  {
    slug: "boreal-new-year",
    title: "Boreal over New Year",
    // Bill: "We are going to boreal", and the group for this one is four.
    people: 4,
    skiDays: SCENARIO.skiDays,
    nights: 5,
    age: SCENARIO.age,
    checkIn: "2026-12-29",
    checkOut: "2027-01-03",
    skiDates: ["2026-12-30", "2026-12-31", "2027-01-01", "2027-01-02"],
    resort: "boreal",
    blurb:
      "That is New Year week, when most passes in Tahoe are blacked out; Boreal’s 4-pack has no blackout dates at all.",
    // The A-Frame is the house Bill is planning on. The four-person place is
    // the cheap one, and Castle Creek Chalet in Truckee sits between them —
    // Bill: "this should be the second option". Tiers order the cards, so
    // the A-Frame is the dearest of the three while still opening selected.
    stay: "soda-springs-a-frame",
    shortlist: {
      budget: "soda-springs-4p",
      normal: "truckee-castle-creek",
      expensive: "soda-springs-a-frame",
    },
    deadline: {
      lead: "Buy your Boreal iRide 4-Pack online before Oct 1.",
      detail:
        "It is $239 until then and goes up after; Boreal’s own FAQ already quotes $259. It is not sold at the window, so everyone buys their own.",
    },
  },
];

export const getTrip = (slug: string) => TRIPS.find((t) => t.slug === slug);
