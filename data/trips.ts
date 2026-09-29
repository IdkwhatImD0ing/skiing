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
    group: "boreal-new-year",
    variant: "4 days · Dec 29 – Jan 3",
    // Bill: "We are going to boreal", and the group for this one is four.
    people: 5,
    skiDays: SCENARIO.skiDays,
    nights: 5,
    age: SCENARIO.age,
    checkIn: "2026-12-29",
    checkOut: "2027-01-03",
    skiDates: ["2026-12-30", "2026-12-31", "2027-01-01", "2027-01-02"],
    resort: "boreal",
    blurb:
      "That is New Year week, when most passes in Tahoe are blacked out; Boreal’s 4-pack has no blackout dates at all.",
    // Five of us now, so only houses quoted at five: the hostel and the
    // hotel. No house is marked as the plan yet, so the page opens on the
    // cheapest. The four-person houses (Castle Creek, the Donner Lake
    // studio, the Soda Springs place) sleep four at most and dropped off.
    shortlist: ["boreal-hostel-5", "boreal-hotel-5"],
    deadline: {
      lead: "Buy your Boreal iRide 4-Pack online before Oct 1.",
      detail:
        "It is $239 until then and goes up after; Boreal’s own FAQ already quotes $259. It is not sold at the window, so everyone buys their own.",
    },
  },
  {
    // The same trip a day shorter: check in Dec 30, ski Dec 31 – Jan 2.
    slug: "boreal-new-year-3-days",
    title: "Boreal over New Year, 3 days",
    group: "boreal-new-year",
    variant: "3 days · Dec 30 – Jan 3",
    people: 5,
    skiDays: 3,
    nights: 4,
    age: SCENARIO.age,
    checkIn: "2026-12-30",
    checkOut: "2027-01-03",
    skiDates: ["2026-12-31", "2027-01-01", "2027-01-02"],
    resort: "boreal",
    blurb:
      "One day shorter. Boreal’s 4-pack still covers it, with a visit left over: its day tickets are dynamically priced, holiday peak over New Year, and published for no date, so three of them are unlikely to come in under $239.",
    // Only Castle Creek is quoted for these four nights, and only at four
    // guests — so at five this version has no total until a house is quoted
    // for five from Dec 30. The page says exactly that.
    stay: "truckee-castle-creek-4n",
    shortlist: ["truckee-castle-creek-4n"],
    deadline: {
      lead: "Buy your Boreal iRide 4-Pack online before Oct 1.",
      detail:
        "It is $239 until then and goes up after; Boreal’s own FAQ already quotes $259. It is not sold at the window, so everyone buys their own.",
    },
  },
];

export const getTrip = (slug: string) => TRIPS.find((t) => t.slug === slug);

/** Every version of a trip, in the order they are listed above. */
export const tripGroup = (plan: Plan) =>
  plan.group ? TRIPS.filter((t) => t.group === plan.group) : [plan];

/** One plan per trip: the first version of each group, for the header and the home page. */
export const TRIP_HEADS = TRIPS.filter(
  (t, i) => !t.group || TRIPS.findIndex((u) => u.group === t.group) === i
);
