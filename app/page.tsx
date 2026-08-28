import { Scenario } from "@/components/scenario";
import { SCENARIO } from "@/lib/types";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <h1 className="display hero-h">
            {SCENARIO.people} people, {SCENARIO.skiDays} ski days.
          </h1>
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
