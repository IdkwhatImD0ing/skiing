import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Scenario } from "@/components/scenario";
import { TRIPS, getTrip } from "@/data/trips";
import { getResort } from "@/data/resorts";
import { tripDatesLabel } from "@/lib/types";

/** Every trip is known at build time; anything else is a 404, not a guess. */
export const dynamicParams = false;

export function generateStaticParams() {
  return TRIPS.map((t) => ({ slug: t.slug! }));
}

export async function generateMetadata(
  props: PageProps<"/trips/[slug]">
): Promise<Metadata> {
  const trip = getTrip((await props.params).slug);
  if (!trip) return {};
  const where = getResort(trip.resort ?? "")?.name ?? "Tahoe";
  return {
    title: `${trip.title} — Night laps`,
    description: `${trip.people} of us at ${where}, ${tripDatesLabel(trip)}. ${trip.skiDays} full days, and one number: what you pay.`,
  };
}

export default async function TripPage(props: PageProps<"/trips/[slug]">) {
  const trip = getTrip((await props.params).slug);
  if (!trip) notFound();
  const resort = getResort(trip.resort ?? "");

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <p className="eyebrow">{trip.title}</p>
          <h1 className="display hero-h">
            {trip.people} people, {trip.skiDays} days
            {resort ? ` at ${resort.name}` : ""}.
          </h1>
          <p className="hero-sub">
            {tripDatesLabel(trip)} — drive up the first day, ski{" "}
            {trip.skiDays} days, drive home the last. {trip.blurb}
          </p>
          <p className="hero-sub">
            {resort
              ? `The mountain is settled. Pick the house, the gear and the car, and the number on the right is what you pay.`
              : `Pick the mountain, the house, the gear and the car, and the number on the right is what you pay.`}
          </p>
          <p className="mt-6 text-[13px] text-muted">
            <Link href="/" className="underline underline-offset-2 hover:text-sodium">
              All mountains, and the other trips
            </Link>
          </p>
        </div>
      </section>
      <div className="wrap">
        <Scenario plan={trip} />
      </div>
    </>
  );
}
