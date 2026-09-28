import { ImageResponse } from "next/og";
import { OgCard, OG_SIZE } from "@/components/og-card";
import { TRIPS, getTrip } from "@/data/trips";
import { getResort } from "@/data/resorts";
import { money } from "@/lib/cost";
import { planQuote } from "@/lib/site";
import { tripDatesLabel } from "@/lib/types";

export const alt = "The trip, and what one person pays for it";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return TRIPS.map((t) => ({ slug: t.slug! }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const trip = getTrip((await params).slug);
  const where = getResort(trip?.resort ?? "")?.name;
  const q = trip ? planQuote(trip) : null;
  return new ImageResponse(
    trip ? (
      <OgCard
        eyebrow={`${trip.title} · ${tripDatesLabel(trip)}`}
        headline={`${trip.people} people, ${trip.skiDays} days${where ? ` at ${where}` : ""}.`}
        sub={
          q
            ? `${q.lift.option.name} · ${q.stay.name}`
            : "Pick the house and see what you pay."
        }
        figure={q ? money(q.perPerson) : undefined}
        figureLabel={q ? "per person" : "No full price yet."}
      />
    ) : (
      <OgCard eyebrow="Night laps" headline="Trip not found." sub="" />
    ),
    size
  );
}
