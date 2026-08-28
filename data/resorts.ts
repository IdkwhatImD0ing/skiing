import type { Resort } from "@/lib/types";

/**
 * Every mountain named in `data/locations.ts`, and which cluster of houses
 * serves it. This is geography, not pricing — a resort appears here whether or
 * not we have a lift price for it yet, and the ones we can't price say so on
 * the page rather than going quietly missing.
 *
 * `locationSlug` is where you'd sleep, which is not always where the pass is
 * filed: an Epic Day Pass is one product listed once per location, but the
 * Northstar you ski is the same mountain either way.
 */
export const RESORTS: Resort[] = [
  // --- Donner Summit, straight off I-80 -------------------------------
  {
    slug: "boreal",
    name: "Boreal",
    locationSlug: "donner-summit",
    toLift: "~5 min from the Soda Springs houses",
    image: {
      src: "/resorts/boreal.jpg",
      alt: "Boreal's base-area slopes with two chairlifts running up the hill, a terrain-park fence line and skiers, on an overcast March day.",
      author: "Noah_Loverbear",
      license: "CC BY-SA 3.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Boreal_Mountain_Resort_-_panoramio_(3).jpg",
    },
  },
  {
    slug: "soda-springs",
    name: "Soda Springs",
    locationSlug: "donner-summit",
    toLift: "walk from the Soda Springs houses",
    // Wikimedia has nothing for Soda Springs — no category, no file. This is a
    // Donner Summit Historical Society archive aerial under the Public Domain
    // Mark, which is an assertion of no known copyright rather than a licence
    // grant, so it needs no credit. It is a historical frame, not a current one.
    image: {
      src: "/resorts/soda-springs.jpg",
      alt: "Aerial photograph of a snow-covered Soda Springs ski resort and the surrounding Donner Summit terrain.",
      author: "Donner Summit Historical Society",
      license: "Public Domain Mark 1.0",
      sourceUrl: "https://www.flickr.com/photos/donnersummithistoricalsociety/54653571628",
    },
  },
  {
    slug: "donner-ski-ranch",
    name: "Donner Ski Ranch",
    locationSlug: "donner-summit",
    toLift: "~10 min over the summit",
    image: {
      src: "/resorts/donner-ski-ranch.jpg",
      alt: "Wide winter view across Donner Ski Ranch's runs and the snowy Donner Pass ridgeline, shot from the top of Mount Judah Express at neighbouring Sugar Bowl.",
      author: "Charliewitkey",
      license: "CC BY-SA 3.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Donner_Ski_Ranch.jpg",
    },
  },
  {
    slug: "sugar-bowl",
    name: "Sugar Bowl",
    locationSlug: "donner-summit",
    toLift: "~10 min from the Soda Springs houses",
    image: {
      src: "/resorts/sugar-bowl.jpg",
      alt: "Groomed snow at a Sugar Bowl summit lift station under deep blue sky, looking out over miles of white Sierra ridges toward Donner Pass.",
      author: "Fastily",
      license: "CC BY-SA 3.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Sugar_Bowl_Ski_Resort_8_2012-12-20.jpg",
    },
  },

  // --- North and west shore -------------------------------------------
  {
    slug: "palisades",
    name: "Palisades Tahoe",
    locationSlug: "north-shore",
    toLift: "at the foot of the mountain",
    image: {
      src: "/resorts/palisades.jpg",
      alt: "Sweeping summit panorama over the whole Palisades Tahoe bowl in mid-winter, lift lines and runs threading the basin with Washeshu Peak on the right.",
      author: "John M",
      license: "CC BY-SA 2.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Palisades_Tahoe_ski_area.jpg",
    },
  },
  {
    slug: "northstar",
    name: "Northstar",
    locationSlug: "north-shore",
    toLift: "~25 min from Olympic Valley",
    image: {
      src: "/resorts/northstar.jpg",
      alt: "Freshly groomed run on Northstar's East Ridge lined with snow-loaded pines, opening onto the north shore of Lake Tahoe under a blue sky.",
      author: "Leijurv",
      license: "CC BY-SA 4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Northstar_California_East_Ridge_2019.jpg",
    },
  },
  {
    slug: "tahoe-donner",
    name: "Tahoe Donner",
    locationSlug: "north-shore",
    toLift: "~20 min, Truckee side",
    image: {
      src: "/resorts/tahoe-donner.jpg",
      alt: "Tahoe Donner's downhill slope on a bluebird day, chairlift and lift shack in silhouette against fresh snow with the sun flaring over the ridge.",
      author: "ElijahBizcor (credited on Commons as tahoesignatureproperties.com)",
      license: "CC BY-SA 4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Skiing_in_Tahoe.jpg",
    },
  },
  {
    slug: "mt-rose",
    name: "Mt Rose",
    locationSlug: "north-shore",
    toLift: "~50 min around the lake",
    image: {
      src: "/resorts/mt-rose.jpg",
      alt: "The Mt Rose front side in full sun - cut runs fanning down a forested peak, a chairlift crossing the frame, and the base lodge with its 'MT ROSE SKI TAHOE' sign at right.",
      author: "Patrick Nouhailler's…",
      license: "CC BY-SA 3.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Mount_Rose_Ski_Tahoe_-_panoramio.jpg",
    },
  },

  // --- South shore ------------------------------------------------------
  {
    slug: "heavenly",
    name: "Heavenly",
    locationSlug: "south-lake",
    toLift: "~10 min from the South Lake house",
    image: {
      src: "/resorts/heavenly.jpg",
      alt: "Looking out from Heavenly's upper slopes across the full width of a deep-blue Lake Tahoe, snow-covered peaks ringing the far shore.",
      author: "USDA Forest Service, Pacific Southwest Region - photo by Paul Wade",
      license: "Public domain (work of the U.S. federal government, PD-USGov-USDA-FS)",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:HeavenlySkiResortLakeTahoe-LakeTahoeBasinMU-PRW-03_(52707087461).jpg",
    },
  },
  {
    slug: "kirkwood",
    name: "Kirkwood",
    locationSlug: "south-lake",
    toLift: "~45 min south over Carson Pass",
    image: {
      src: "/resorts/kirkwood.jpg",
      alt: "Skiers spread across a sunlit Kirkwood run with the resort's signature jagged volcanic cliff band rising behind.",
      author: "Roman Fuchs",
      license: "CC BY-SA 3.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Kirkwood_Mountain_Resort.jpg",
    },
  },
  {
    slug: "sierra-at-tahoe",
    name: "Sierra-at-Tahoe",
    locationSlug: "south-lake",
    toLift: "~20 min west on the 50",
    image: {
      src: "/resorts/sierra-at-tahoe.jpg",
      alt: "Sierra-at-Tahoe's base area on a clear March day - the 'SIERRA at Tahoe Mountain Resort' entrance sign and the Aspen building in the foreground, with the ski hill rising behind.",
      author: "LittleT889",
      license: "CC BY 4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Sierra-at-Tahoe_2.jpg",
    },
  },
];

export const getResort = (slug: string) => RESORTS.find((r) => r.slug === slug);
