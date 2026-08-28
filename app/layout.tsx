import type { Metadata, Viewport } from "next";
import { Archivo, Public_Sans, Chivo_Mono } from "next/font/google";
import "./globals.css";
import { HeadcountProvider } from "@/components/headcount";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SCENARIO } from "@/lib/types";

/* Archivo carries a width axis — set wide for the signage voice. */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

/* Chivo Mono is Archivo's sibling out of Omnibus-Type: same grotesque
   skeleton, tabular figures. Every dollar figure on this site is set in it. */
const chivoMono = Chivo_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

/**
 * Written against what the page actually does now. The old copy described a
 * different site: it sold "night laps to Boreal, lights until 9" when the trip
 * is four full days across eleven mountains, invited you to "set the
 * headcount" when the headcount is fixed at eight, and quoted a $60/day
 * yardstick that the trail markers no longer use. Numbers come from SCENARIO
 * so the description cannot drift from the page again.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://tahoe-night-laps.local"),
  title: `Night laps — ${SCENARIO.people} people, ${SCENARIO.skiDays} ski days in Tahoe`,
  description:
    `San Jose to Tahoe over New Year. Eleven mountains priced for ${SCENARIO.skiDays} full days at ` +
    `${SCENARIO.age}, three houses at each, and one number at the end: what you pay, not what the group pays.`,
  openGraph: {
    title: `Night laps — ${SCENARIO.people} people, ${SCENARIO.skiDays} ski days in Tahoe`,
    description:
      "Eleven mountains, three houses each, one number: your share. Every price links to the page it came from.",
    type: "website",
  },
  // summary, not summary_large_image: there is no OG image to show, and the
  // large card just renders blank space where one should be.
  twitter: { card: "summary" },
};

export const viewport: Viewport = {
  themeColor: "#080c17",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${publicSans.variable} ${chivoMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <HeadcountProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </HeadcountProvider>
      </body>
    </html>
  );
}
