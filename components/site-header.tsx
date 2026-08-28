import Link from "next/link";
import { BENCHMARK_PER_DAY } from "@/lib/types";

export function SiteHeader() {
  return (
    <header className="site-head">
      <div className="wrap site-head-inner">
        <Link href="/" className="site-mark">
          <span className="site-mark-name">Night laps</span>
          <span className="site-mark-route num">San Jose → Donner Summit</span>
        </Link>

        <p className="site-bar num">
          <span className="site-bar-label">the bar</span>
          <span className="site-bar-num">${BENCHMARK_PER_DAY}</span>
          <span className="site-bar-unit">/day on lift</span>
        </p>
      </div>
    </header>
  );
}
