import type { Provenance } from "@/lib/types";
import { RATING_GREEN_UNDER, RATING_BLUE_UNDER } from "@/lib/types";

/* ---------------------------------------------------------------
   Trail markers, repurposed. Difficulty encodes lift cost against
   Bill's $60/day yardstick — green under it, blue at it, black over
   it, dashed circle while a price is still being checked.
   --------------------------------------------------------------- */
export type Rating = "green" | "blue" | "black" | "unknown";

export const RATING_TEXT: Record<Rating, string> = {
  green: `Under $${RATING_GREEN_UNDER}/day on lift`,
  blue: `$${RATING_GREEN_UNDER} to $${RATING_BLUE_UNDER}/day on lift`,
  black: `$${RATING_BLUE_UNDER}/day or more on lift`,
  unknown: "Lift price not confirmed yet",
};

export function Marker({ rating }: { rating: Rating }) {
  return (
    <span className={`marker marker-${rating}`} role="img" aria-label={RATING_TEXT[rating]} />
  );
}

/* Dollar figures, drive times, elevations — all monospace, always. */
export function Num({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={`num ${className}`}>{children}</span>;
}

/** A price we do not have. Never a placeholder number. */
export function Researching({ what = "price" }: { what?: string }) {
  return (
    <span className="researching">
      <span className="marker marker-unknown" aria-hidden />
      <span className="num">checking {what}</span>
    </span>
  );
}

export function Tag({
  children,
  tone = "plain",
  title,
}: {
  children: React.ReactNode;
  tone?: "plain" | "warn" | "soft" | "good";
  title?: string;
}) {
  const cls =
    tone === "warn"
      ? "tag tag-warn"
      : tone === "soft"
        ? "tag tag-soft"
        : tone === "good"
          ? "tag tag-good"
          : "tag";
  return (
    <span className={cls} title={title}>
      {children}
    </span>
  );
}

/** Where a number came from, or that it hasn't landed yet. */
const PROV_STATUS: Record<Provenance["status"], string> = {
  verified: "verified",
  estimate: "estimate",
  // A real price from a real page, just last season's. It used to fall through
  // to "researching", which said we had no number when we had one.
  "last-season": "last season",
  researching: "researching",
};

export function Provenance({ of, compact = false }: { of: Provenance; compact?: boolean }) {
  return (
    <p className={compact ? "prov prov-compact" : "prov"}>
      <span
        className={`prov-dot${of.status === "verified" ? " prov-dot-on" : ""}${of.status === "estimate" ? " prov-dot-est" : ""}`}
        aria-hidden
      />
      <span className="num prov-status">{PROV_STATUS[of.status]}</span>
      {of.source && (
        <span className="prov-meta num">
          {/* The source is the proof, so where we have the page it is a link
              you can go and check, not a name you have to take our word for. */}
          {of.sourceUrl ? (
            <a href={of.sourceUrl} target="_blank" rel="noopener noreferrer" className="prov-link">
              {of.source}&nbsp;↗
            </a>
          ) : (
            of.source
          )}
        </span>
      )}
      {of.asOf && <span className="prov-meta num">as of {of.asOf}</span>}
      {of.note && <span className="prov-note">{of.note}</span>}
    </p>
  );
}
