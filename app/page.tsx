import { Scenario } from "@/components/scenario";
import { SCENARIO, tripDatesLabel } from "@/lib/types";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <h1 className="display hero-h">
            {SCENARIO.people} people, {SCENARIO.skiDays} days at Boreal.
          </h1>
          <p className="hero-sub">
            {tripDatesLabel()} — drive up the first day, ski four, drive home
            the last. That is New Year week, when most passes in Tahoe are
            blacked out; Boreal&rsquo;s 4-pack has no blackout dates at all.
          </p>
          <p className="hero-sub">
            The mountain is settled: Boreal, on the cheapest{" "}
            {SCENARIO.skiDays}-day pass in Tahoe. Pick the house, the gear and
            the car, and the number on the right is what you pay.
          </p>
        </div>
      </section>
      <div className="wrap">
        <Scenario />
      </div>
    </>
  );
}
