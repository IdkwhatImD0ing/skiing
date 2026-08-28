import type { Trip } from "@/lib/types";

export const TRIPS: Trip[] = [
  {
    slug: "new-years-soda-springs",
    title: "New Year's at Soda Springs",
    pitch:
      "Five nights, whole house, walk to Soda Springs and five minutes to Boreal. The lodging is locked — the lift is the open question, because nothing cheap works this week.",
    locationSlug: "donner-summit",

    liftOptionId: "boreal-window-holiday",
    dates: { label: "Dec 29 – Jan 3", nights: 5, skiDays: 4 },
    holiday: true,
    gasPerCarUsd: 90,
    seatsPerCar: 4,
    foodPerDayUsd: 30,
  },
  {
    slug: "boreal-4pack-weekend",
    title: "Boreal on the 4-pack",
    pitch:
      "The default trip. Two nights in Truckee, four days of lift spread across the season at the benchmark rate. Cheapest way to get everyone on snow.",
    locationSlug: "donner-summit",

    liftOptionId: "boreal-4pack",
    dates: { label: "Pick any non-holiday weekend", nights: 2, skiDays: 2 },
    holiday: false,
    gasPerCarUsd: 90,
    seatsPerCar: 4,
    foodPerDayUsd: 30,
  },
  {
    slug: "palisades-upgrade",
    title: "Palisades, if we're spending",
    pitch:
      "The upgrade trip. Real terrain for whoever's past the beginner runs, and a town worth being in after the lifts stop.",
    locationSlug: "north-shore",

    liftOptionId: "ikon-session",
    dates: { label: "3 nights, midweek", nights: 3, skiDays: 3 },
    holiday: false,
    gasPerCarUsd: 95,
    seatsPerCar: 4,
    foodPerDayUsd: 35,
  },
  {
    slug: "south-lake-sierra",
    title: "South Lake on the cheap",
    pitch:
      "Longest drive, but Sierra-at-Tahoe usually has the most aggressive multi-pack in Tahoe, and South Lake has an actual town attached.",
    locationSlug: "south-lake",

    liftOptionId: "sierra-pack",
    dates: { label: "3 nights", nights: 3, skiDays: 3 },
    holiday: false,
    gasPerCarUsd: 100,
    seatsPerCar: 4,
    foodPerDayUsd: 30,
  },
];

export const getTrip = (slug: string) => TRIPS.find((t) => t.slug === slug);
