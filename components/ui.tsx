import type { Provenance } from "@/lib/types";

/* ---------------------------------------------------------------
   Trail markers, repurposed. Difficulty encodes lift cost against
   Bill's $60/day yardstick — green under it, blue at it, black over
   it, dashed circle while a price is still being checked.
   --------------------------------------------------------------- */
export type Rating = "green" | "blue" | "black" | "unknown";

export const RATING_TEXT: Record<Rating, string> = {
  green: "Under $60/day on lift",
  blue: "At the $60/day benchmark",
  black: "Over $60/day on lift",
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
export function Provenance({ of, compact = false }: { of: Provenance; compact?: boolean }) {
  const bits = [of.source, of.asOf ? `as of ${of.asOf}` : null].filter(Boolean);
  return (
    <p className={compact ? "prov prov-compact" : "prov"}>
      <span className={of.status === "verified" ? "prov-dot prov-dot-on" : "prov-dot"} aria-hidden />
      <span className="num prov-status">
        {of.status === "verified" ? "verified" : "researching"}
      </span>
      {bits.length > 0 && <span className="prov-meta num">{bits.join(" · ")}</span>}
      {of.note && <span className="prov-note">{of.note}</span>}
    </p>
  );
}
