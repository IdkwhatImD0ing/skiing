import Link from "next/link";
import { Scenario } from "@/components/scenario";
import { SCENARIO } from "@/lib/types";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="wrap">
          <p className="eyebrow">San Jose → Tahoe · 2026-27</p>
          <h1 className="display hero-h">
            {SCENARIO.people} of us, {SCENARIO.skiDays} days on snow.
          </h1>
          <p className="hero-sub">
            Pick the mountain. The pass is the cheapest {SCENARIO.skiDays}-day
            access a {SCENARIO.age}-year-old can buy there, the houses are the
            ones near it, and the number on the right is what you pay.
          </p>
          <p className="mt-6 text-[13px] text-muted">
            Want to change the assumptions —{" "}
            <span className="font-data tabular-nums text-snow/85">
              {SCENARIO.people} people, {SCENARIO.nights} nights,{" "}
              {SCENARIO.skiDays} days, age {SCENARIO.age}
            </span>{" "}
            —{" "}
            <Link href="/explore" className="underline underline-offset-2 hover:text-sodium">
              open the explorer
            </Link>
            .
          </p>
        </div>
      </section>
      <div className="wrap">
        <Scenario />
      </div>
    </main>
  );
}
