import { Configurator } from "@/components/configurator";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="wrap">
          <p className="eyebrow">San Jose → Tahoe · 2026-27</p>
          <h1 className="display hero-h">Build the trip.</h1>
          <p className="hero-sub">
            Pick a mountain, a house, and how we get there. The number at the
            bottom is what you pay.
          </p>
        </div>
      </section>
      <div className="wrap">
        <Configurator />
      </div>
    </main>
  );
}
