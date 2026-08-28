import { getLocation } from "@/data/locations";
import { stayTotalFor } from "@/lib/cost";
import { CAR, GEAR, type CarKey, type GearKey, type LiftChoice } from "@/lib/choices";
import type { Stay } from "@/lib/types";

export type QuoteLine = {
  label: string;
  /** Whole-group cost. */
  total: number;
  perPerson: number;
  detail: string;
};

export type Quote = {
  lines: QuoteLine[];
  total: number;
  perPerson: number;
  perPersonPerDay: number;
  nights: number;
  skiDays: number;
  cars: number;
  spareSeats: number;
  stay: Stay;
  estimated: boolean;
  squeeze: boolean;
};

const SEATS_PER_CAR = 4;
const FOOD_PER_DAY = 30;
const GAS_PER_CAR = 90;

export function quote(
  lift: LiftChoice,
  stayId: string,
  gear: GearKey,
  car: CarKey,
  headcount: number
): Quote | null {
  const location = getLocation(lift.locationSlug);
  const stay = location?.stays.find((s) => s.id === stayId);
  if (!location || !stay) return null;

  const lodging = stayTotalFor(stay, headcount);
  if (!lodging) return null;

  const nights = stay.nights;
  const skiDays = lift.days;
  const cars = Math.ceil(headcount / SEATS_PER_CAR);

  const lines: QuoteLine[] = [
    {
      label: "Lodging",
      total: lodging.totalUsd,
      perPerson: lodging.totalUsd / headcount,
      detail: `${stay.name} · ${nights} nights`,
    },
    {
      label: "Lift",
      total: lift.totalUsd * headcount,
      perPerson: lift.totalUsd,
      detail: `${lift.label} · ${skiDays} days`,
    },
    {
      label: "Gear",
      total: GEAR[gear].perDay * skiDays * headcount,
      perPerson: GEAR[gear].perDay * skiDays,
      detail: GEAR[gear].label,
    },
    {
      label: "Car",
      total: cars * CAR[car].perDay * nights + cars * GAS_PER_CAR,
      perPerson: (cars * CAR[car].perDay * nights + cars * GAS_PER_CAR) / headcount,
      detail:
        car === "rent"
          ? `${cars} rented · ${nights} days · plus gas`
          : `${cars} car${cars > 1 ? "s" : ""} · gas only`,
    },
    {
      label: "Food",
      total: FOOD_PER_DAY * nights * headcount,
      perPerson: FOOD_PER_DAY * nights,
      detail: `${nights} nights · $${FOOD_PER_DAY}/day`,
    },
  ];

  const total = lines.reduce((s, l) => s + l.total, 0);

  return {
    lines,
    total,
    perPerson: total / headcount,
    perPersonPerDay: total / headcount / nights,
    nights,
    skiDays,
    cars,
    spareSeats: cars * SEATS_PER_CAR - headcount,
    stay,
    estimated: lodging.estimated,
    squeeze: headcount > stay.sleeps,
  };
}
