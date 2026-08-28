import Link from "next/link";
import { notFound } from "next/navigation";
import { TRIPS, getTrip } from "@/data/trips";
import { getLocation } from "@/data/locations";
import { HeadcountBoard } from "@/components/headcount-board";
import { TripDetail } from "@/components/trip-detail";

export function generateStaticParams() {
  return TRIPS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trip = getTrip(slug);
  if (!trip) return {};
  return { title: `${trip.title} — what it costs you`, description: trip.pitch };
}

export default async function TripPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trip = getTrip(slug);
  if (!trip) notFound();
  const location = getLocation(trip.locationSlug);
  if (!location) notFound();

  return (
    <main>
      <div className="wrap">
        <p className="crumb">
          <Link href="/">← all trips</Link>
        </p>

        <header className="trip-hero">
          <p className="eyebrow">
            {location.name} · {location.route} · {location.driveFromSanJose} from San
            Jose
          </p>
          <h1 className="display trip-hero-h">{trip.title}</h1>
          <p className="trip-hero-sub">{trip.pitch}</p>
        </header>
      </div>

      <div className="wrap stack">
        <HeadcountBoard
          locationSlug={trip.locationSlug}
          where={location.name}
          variant="hero"
        />
        <TripDetail trip={trip} />
      </div>
    </main>
  );
}
