"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TRIP_HEADS, tripGroup } from "@/data/trips";
import { getResort } from "@/data/resorts";

/**
 * One link per trip we're taking, in the header so every page reaches them.
 * A client component only for usePathname: the trip you're on is marked with
 * aria-current, and styled off that attribute rather than a class.
 */
export function TripNav() {
  const path = usePathname();
  if (!TRIP_HEADS.length) return null;
  return (
    <nav aria-label="Trips we're taking" className="mr-auto">
      <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
        {/* One link per trip; its shorter or longer versions are a switch
            on the trip page, not more header buttons. */}
        {TRIP_HEADS.map((t) => {
          const href = `/trips/${t.slug}`;
          const here = tripGroup(t).some((v) => path === `/trips/${v.slug}`);
          return (
            <li key={t.slug}>
              <Link
                href={href}
                aria-current={here ? "page" : undefined}
                title={t.title}
                className="inline-block rounded-[3px] border border-ridge px-2.5 py-1 font-data text-[11px] uppercase tracking-[0.1em] text-snow/80 no-underline transition-colors hover:border-sodium/60 hover:text-snow aria-[current=page]:border-sodium/60 aria-[current=page]:text-sodium"
              >
                {getResort(t.resort ?? "")?.name ?? t.title}
                <span className="sr-only"> — {t.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
