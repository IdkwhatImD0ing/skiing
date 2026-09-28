import { ImageResponse } from "next/og";
import { OgCard, OG_SIZE } from "@/components/og-card";
import { RESORTS } from "@/data/resorts";
import { SCENARIO, tripDatesLabel } from "@/lib/types";

export const alt = `Night laps — ${SCENARIO.people} people, ${SCENARIO.skiDays} ski days in Tahoe over New Year`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow={`Tahoe · ${tripDatesLabel()}`}
        headline={`${SCENARIO.people} people, ${SCENARIO.skiDays} ski days.`}
        sub={`${RESORTS.length} mountains priced for New Year, the houses near each.`}
        figureLabel="One number at the end: what you pay."
      />
    ),
    size
  );
}
