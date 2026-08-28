import { RESORTS } from "@/data/resorts";

/**
 * Photo credits live down here rather than under the board. Nine of the
 * mountain photos are CC BY-SA or CC BY, where naming the author and the
 * licence is the licence term, not a courtesy — so they cannot simply be
 * dropped. A credits block elsewhere on the page, linking each file, is the
 * normal way to satisfy that without putting a paragraph of small print in
 * the middle of the thing people came to read.
 *
 * Heavenly (US federal public domain) and Soda Springs (Public Domain Mark)
 * need no attribution at all; they are listed because naming a source costs
 * nothing and saves the next person the search.
 */
const CREDITED = RESORTS.filter((r) => r.image);

export function SiteFooter() {
  return (
    <footer className="site-foot">
      <div className="wrap site-foot-inner">
        <p className="site-foot-rule">
          Every price here is either quoted from a real listing or marked as still
          being checked. Nothing is estimated into existence.
        </p>
        <p className="site-foot-meta num">
          Bill · San Jose · prices in USD, before tax where the listing excludes it
        </p>
        {CREDITED.length > 0 && (
          <p className="mt-2 max-w-[80ch] text-[10px] leading-relaxed text-muted/70">
            Mountain photos:{" "}
            {CREDITED.map((r, i) => (
              <span key={r.slug}>
                <a
                  href={r.image!.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-sodium"
                >
                  {r.name}
                </a>{" "}
                &copy; {r.image!.author}, {r.image!.license}
                {i < CREDITED.length - 1 ? " · " : "."}
              </span>
            ))}
          </p>
        )}
      </div>
    </footer>
  );
}
