import type { Metadata, Viewport } from "next";
import { Archivo, Public_Sans, Chivo_Mono } from "next/font/google";
import "./globals.css";
import { HeadcountProvider } from "@/components/headcount";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SCENARIO, tripDatesLabel } from "@/lib/types";
import { OG_BASE, SITE_NAME, SITE_URL } from "@/lib/site";

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
 * Written against what the page actually does now, with numbers from SCENARIO
 * so the description cannot drift from the page. This is the home page's
 * card; the explorer and each trip page set their own, and the title template
 * keeps the site name on all of them. The share image is
 * app/opengraph-image.tsx.
 */
const HOME_TITLE = `${SITE_NAME} — ${SCENARIO.people} people, ${SCENARIO.skiDays} ski days in Tahoe`;
const HOME_DESCRIPTION =
  `San Jose to Tahoe over New Year, ${tripDatesLabel()}. Every mountain priced for ` +
  `${SCENARIO.skiDays} full days at ${SCENARIO.age}, the houses near each, and one number at ` +
  `the end: what you pay, not what the group pays.`;

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  applicationName: SITE_NAME,
  title: { default: HOME_TITLE, template: `%s · ${SITE_NAME}` },
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    ...OG_BASE,
    title: HOME_TITLE,
    description:
      "Every Tahoe mountain priced for New Year, one number at the end: your share. Every price links to the page it came from.",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
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
