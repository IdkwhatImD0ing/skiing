import { Scenario } from "@/components/scenario";
import { SCENARIO, tripDatesLabel } from "@/lib/types";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <h1 className="display hero-h">
            {SCENARIO.people} people, {SCENARIO.skiDays} ski days.
          </h1>
          <p className="hero-sub">
            {tripDatesLabel()} — drive up the first day, ski four, drive home
            the last. That is New Year week, so every pass below is counted
            against the days it will actually scan on.
          </p>
          <p className="hero-sub">
            Pick the mountain. The pass is the cheapest {SCENARIO.skiDays}-day
            access a {SCENARIO.age}-year-old can buy there, the houses are the
            ones near it, and the number on the right is what you pay.
          </p>
        </div>
      </section>
      <div className="wrap">
        <Scenario />
      </div>
    </>
  );
}
