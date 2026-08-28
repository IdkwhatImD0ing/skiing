import type { Metadata, Viewport } from "next";
import { Archivo, Public_Sans, Chivo_Mono } from "next/font/google";
import "./globals.css";
import { HeadcountProvider } from "@/components/headcount";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://tahoe-night-laps.local"),
  title: "Night laps at Donner Summit — what it costs you",
  description:
    "San Jose to Boreal after work, lights until 9. Set the headcount and the page tells you your share, not the group's.",
  openGraph: {
    title: "Night laps at Donner Summit",
    description:
      "Set the headcount, see your share. Yardstick: $60/day on lift.",
    type: "website",
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
