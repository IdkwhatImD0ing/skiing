"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BENCHMARK_PER_DAY } from "@/lib/types";

const NAV = [
  { href: "/", label: "The trip" },
  { href: "/explore", label: "Explore" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-head">
      <div className="wrap site-head-inner">
        <Link href="/" className="site-mark">
          <span className="site-mark-name">Night laps</span>
          <span className="site-mark-route num">San Jose → Donner Summit</span>
        </Link>

        {/* aria-current, not a class, so the current page is announced and not
            merely coloured. */}
        <nav className="flex items-center gap-1" aria-label="Pages">
          {NAV.map((item) => {
            const on = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={on ? "page" : undefined}
                className={`rounded-[2px] px-2.5 py-1.5 font-data text-[10.5px] uppercase tracking-[0.12em] transition-colors ${
                  on
                    ? "bg-snow/10 text-snow"
                    : "text-muted hover:bg-snow/5 hover:text-snow"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <p className="site-bar num">
          <span className="site-bar-label">the bar</span>
          <span className="site-bar-num">${BENCHMARK_PER_DAY}</span>
          <span className="site-bar-unit">/day on lift</span>
        </p>
      </div>
    </header>
  );
}
