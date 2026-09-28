import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Scenario } from "@/components/scenario";
import { TRIPS, getTrip } from "@/data/trips";
import { getResort } from "@/data/resorts";
import { tripDatesLabel } from "@/lib/types";
import { money } from "@/lib/cost";
import { OG_BASE, SITE_NAME, planQuote } from "@/lib/site";

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
  const q = planQuote(trip);
  // Leads with the number, because that is what a friend opening the link
  // wants to know. Without a full price it says so rather than guessing.
  const description =
    `${trip.people} of us at ${where}, ${tripDatesLabel(trip)}, ${trip.skiDays} full days. ` +
    (q
      ? `${money(q.perPerson)} each: ${q.lift.option.name}, ${q.stay.name} and gear.`
      : "Pick the house and see what you pay.");
  const url = `/trips/${trip.slug}`;
  return {
    title: trip.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      ...OG_BASE,
      title: `${trip.title} · ${SITE_NAME}`,
      description,
      url,
    },
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
