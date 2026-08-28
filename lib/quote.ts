import { getLocation } from "@/data/locations";
import { stayTotalFor } from "@/lib/cost";
import { CAR, GEAR, type CarKey, type GearKey, type LiftChoice } from "@/lib/choices";
import { SKI_DAYS, type Stay } from "@/lib/types";

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
  /** Divided by nights, not ski days: the trip's nightly burn rate. */
  perPersonPerNight: number;
  nights: number;
  skiDays: number;
  cars: number;
  spareSeats: number;
  stay: Stay;
  estimated: boolean;
  squeeze: boolean;
  /** Full days the chosen pass actually delivers. Short of skiDays is a hole. */
  liftCovers: number;
  liftShortfall: number;
};

/**
 * Cars are the reason cost per head is a sawtooth rather than a curve: the
 * whole cost of a car lands on the person who makes it necessary. Exported
 * because the configurator marks the full carloads.
 */
export const SEATS_PER_CAR = 4;
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
  // The trip is four full days on snow. The pass has to meet that, not define
  // it — gear is rented for the days we ski, whatever the ticket happens to be.
  const skiDays = SKI_DAYS;
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
      total: lift.tripTotal * headcount,
      perPerson: lift.tripTotal,
      detail: lift.coversTrip
        ? `${lift.label} · covers all ${skiDays} days`
        : `${lift.label} · covers ${lift.covers} of ${skiDays} days`,
    },
    {
      label: "Gear",
      total: GEAR[gear].perDay * skiDays * headcount,
      perPerson: GEAR[gear].perDay * skiDays,
      detail: GEAR[gear].label,
    },
    {
      label: "Car",
      total: cars * (CAR[car].perTrip + GAS_PER_CAR),
      perPerson: (cars * (CAR[car].perTrip + GAS_PER_CAR)) / headcount,
      detail:
        car === "rent"
          ? `${cars} rented at $${CAR.rent.perTrip} · plus gas`
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
    perPersonPerNight: total / headcount / nights,
    nights,
    skiDays,
    cars,
    spareSeats: cars * SEATS_PER_CAR - headcount,
    stay,
    estimated: lodging.estimated,
    squeeze: headcount > stay.sleeps,
    liftCovers: lift.covers,
    liftShortfall: Math.max(0, skiDays - lift.covers),
  };
}
