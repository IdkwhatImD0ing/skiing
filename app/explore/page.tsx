import type { Metadata } from "next";
import Link from "next/link";
import { Configurator } from "@/components/configurator";

export const metadata: Metadata = {
  title: "Explore every option — Night laps at Donner Summit",
  description:
    "Every pass, house, and headcount we have a price for. The home page prices the trip we're actually taking; this is the rest of the board.",
};

export default function Explore() {
  return (
    <main>
      <section className="hero">
        <div className="wrap">
          <p className="eyebrow">Explorer · every priced option</p>
          <h1 className="display hero-h">Change anything.</h1>
          <p className="hero-sub">
            The home page holds the trip still — eight of us, four days, five
            nights. Here nothing is held: set the headcount, pick any pass at
            any tier, and see what it does to your share.
          </p>
          <p className="mt-6 text-[13px] text-muted">
            <Link href="/" className="underline underline-offset-2 hover:text-sodium">
              Back to the trip
            </Link>
          </p>
        </div>
      </section>
      <div className="wrap">
        <Configurator />
      </div>
    </main>
  );
}
