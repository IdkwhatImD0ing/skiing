/**
 * The share card both opengraph-image routes draw: night ground, a sodium
 * rule, a headline, and the number. ImageResponse supports only a flexbox
 * subset of CSS and inline styles, so this deliberately shares no classes
 * with the page. Colors are the tokens from globals.css.
 */
const NIGHT = "#080C17";
const RIDGE = "#24304F";
const SNOW = "#E8F0FA";
const MUTED = "#8FA0BD";
const SODIUM = "#FF9A3C";
const GLACIER = "#74D8EC";

export const OG_SIZE = { width: 1200, height: 630 };

export function OgCard({
  eyebrow,
  headline,
  sub,
  figure,
  figureLabel,
}: {
  eyebrow: string;
  headline: string;
  sub: string;
  figure?: string;
  figureLabel?: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        background: `linear-gradient(180deg, #131C33 0%, ${NIGHT} 70%)`,
        color: SNOW,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 56, height: 3, background: SODIUM }} />
        <div
          style={{
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: SODIUM,
          }}
        >
          {eyebrow}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            fontSize: 92,
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: -3,
          }}
        >
          {headline}
        </div>
        <div style={{ fontSize: 34, color: MUTED }}>{sub}</div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          borderTop: `2px solid ${RIDGE}`,
          paddingTop: 28,
        }}
      >
        {figure ? (
          <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
            <div style={{ fontSize: 76, fontWeight: 800, color: GLACIER }}>
              {figure}
            </div>
            <div style={{ fontSize: 30, color: MUTED }}>{figureLabel}</div>
          </div>
        ) : (
          <div style={{ fontSize: 30, color: MUTED }}>{figureLabel}</div>
        )}
        <div style={{ fontSize: 30, fontWeight: 700 }}>Night laps</div>
      </div>
    </div>
  );
}
