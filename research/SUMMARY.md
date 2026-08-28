# Consolidated research summary — 2026-27 Tahoe trip

Compiled 2026-08-27 from six research passes and six skeptic audits.
Trip shape assumed throughout: 6 people, 4 ski days, 5 nights, driving from San Jose,
dates flexible. Benchmark $60/lift-day.

**Reading rule for this document.** Section 1 contains only numbers that a skeptic
re-fetched and confirmed. Everything with any doubt attached lives in sections 2-6 and is
labelled. Never move a number up a section without re-fetching it.

---

## 1. Landable now

### 1A. Confirmed, explicitly 2026-27, primary source

These carry a 26/27 season label (or a machine-readable season attribute) on the operator's
own page and survived an independent second fetch.

| # | Price | Product | Source | Where it goes |
|---|---|---|---|---|
| 1 | **$184** | Epic Day Pass 4-Day, 32-Resort, restricted — **child 5-12** | https://www.epicpass.com/pass-results/passes.aspx | `data/locations.ts` → all three Epic entries (`donner-summit:epic-holiday-northstar`, `north-shore:epic-day-northstar`, `south-lake:epic-day`) → add to `tiers`: `{ label: "Child 5–12", totalUsd: 184, minAge: 5, maxAge: 12 }` |
| 2 | **$365** | Palisades Tahoe **4-Day Midweek Ticket Pack**, adult 18-69 | https://shop.palisadestahoe.com/l/winter-lift-tickets/multi-pack-lift-tickets/p/ticketpacks | `data/locations.ts` → `north-shore.lift` → **new** option `palisades-4pack-midweek`, `days: 4`, `coverage: "pack"`, `totalUsd: 365`, blackouts `"Midweek / non-holiday only."` — $91.25/day, beats the site's existing $440 entry by $75 and Ikon Session by $164 |
| 3 | **$396 / $308 / $396** | Palisades 4-Day **Unrestricted** age tiers: 13-17 $396, 5-12 $308, 70-79 $396 | same as #2 | `north-shore.lift[palisades-4pack].tiers` — currently empty |
| 4 | **$329 / $256 / $329** | Palisades 4-Day **Midweek** age tiers: 13-17 $329, 5-12 $256, 70-79 $329 | same as #2 | `tiers` on the new option from #2 |
| 5 | **$339** | Palisades **2-Day Unrestricted** pack, adult | same as #2 | Optional `north-shore.lift` entry, `days: 2`, `coverage: "pack"`. Warning: `tripCost` will buy two → $678 for 4 days = $169.50/day. Only worth listing if the configurator shows short packs |
| 6 | **$512 adult / $360 child 5-12** | Northstar **and** Heavenly, 4-day advance-purchase lift ticket (4-weeks-out rate, sampled at the season's cheapest date, Fri 20 Nov 2026) | https://www.northstarcalifornia.com/plan-your-trip/lift-access/tickets.aspx | `north-shore.lift` and `south-lake.lift` — **only if captioned**. This is a *floor* from opening-week dynamic pricing, and the days must be used **within a 6-day window from the start date**, unlike the Epic Day Pass. A January date is materially higher |
| 7 | **$255** | Northstar/Heavenly 1-day advance ticket at peak — the resort's own comparison box, set against "EPIC 1-DAY PASS (RESTRICTED) $109" | same as #6 | Caption material for the Epic entries: this is what the pass is being compared against |
| 8 | **$659 / $529 / $269** | Sierra-at-Tahoe **Unlimited** season pass: adult 23-64 / young adult 13-22 & college / senior 65-79 & child 5-12. Zero blackouts | https://sierraattahoe.com/season-passes/ | `south-lake.lift` → new `coverage: "unlimited"` option |
| 9 | **$539 / $489** | Sierra-at-Tahoe **Play** pass, adult / YA. Blackouts Dec 26-30 2026, Jan 16-17 2027, Feb 13-14 2027 | same as #8 | `south-lake.lift` |
| 10 | **$409** | Sierra-at-Tahoe **Weekday** pass — adult *and* young adult, same price | same as #8 | `south-lake.lift`. $102.25/day at 4 days: the cheapest **confirmed 26/27** South Shore route onto a real mountain |
| 11 | **$89 peak / $79 non-peak** | Sierra-at-Tahoe **Buddy Ticket**, sold to a passholder's guests. Unlimited = unlimited buddies; Play = 12; Weekday = 10 | https://sierraattahoe.com/season-pass-benefits/ | Not a `LiftOption` shape — needs a note. **The group play:** one $659 Unlimited + five buddies × 4 days × $79 = **$2,239 for six = $93.29 per person per day**, no cap, only one pass bought |
| 12 | **$588 / $495 / $519 / $282** | Diamond Peak 26/27 **Preseason** pass (5/1–10/31): adult 24-64 / youth 13-23 / senior 65-69 / child 7-12. Unrestricted, no blackouts | https://www.diamondpeak.com/tickets-passes-rentals/season-passes/ | Not currently a location on the site. $147/day at 4 days — add only if Incline Village comes into scope |
| 13 | **$733 / $618 / $618 / $341** | Diamond Peak **Prewinter** (11/1–12/19) — the same passes after the 10/31 cliff | same as #12 | Caption for the deadline in §4 |
| 14 | **$1,075 / $875 / $675 / $375** | Mt. Rose 26/27 Premier (no void dates) / Classic / Off-Peak / **Select** (one midweek day per week), adult | https://skirose.com/season-passes/ | `north-shore` lists "Mt Rose" in `resorts` but has no lift entry. All are ≥$168.75/day at 4 days — add for completeness, not as candidates. **Select $375 cannot cover a 4-day trip** (1 day/week max); if added, set `fullDaysPerTrip: 1` |
| 15 | **$1,299 / $899 / $799** | Homewood 26/27 Unlimited / Value / Weekly 2-Day, adult. Resort returning after sitting out 25/26 | https://skihomewood.com/season-pass/ | Reference only — $324.75/day, the most expensive per day in the whole study |
| 16 | **$729 / $629** | Cali Pass / Base Pass, adult 23-69 — identical at Dodge Ridge and Bear Valley. Cali carries Powder Alliance (3 free days at Sierra-at-Tahoe); Base does **not** | https://dodgeridge.com/winter-tickets-passes/ · https://www.bearvalley.com/season-passes | Reference. Dodge Ridge is ~2h45m from San Jose — a **day-trip** shape, not this trip |
| 17 | **$249** (from), **$100 deposit** | **College Cali Pass**, ages 18-25, verification required — the cheapest confirmed 26/27 back door into 3 free Sierra-at-Tahoe days | https://thecalipass.com/buynow | Note only — eligibility-gated |
| 18 | **$1,449 / $1,019 / $319 (from)** | Ikon Pass / Ikon Base Pass / Ikon Session Pass, adult 23+ | https://www.ikonpass.com/en/compare-passes | Confirms the site's Ikon framing. See §2.7 for the citation problem on the 4-day cell |
| 19 | **$800** per pass | Ikon **Squad Pack** — Base Pass for riders 23-28 when one buyer takes five. $219 saving each ($1,019 − $219 = $800, reconciles exactly) | https://www.ikonpass.com/en/squad-pack | Note only. Needs **exactly** five people (group is six) and works out to $200/day at 4 days |
| 20 | **$899 / $589 / $389** | Ikon **Military** base pricing: Ikon / Base / **Session 4-Day**. Active, retired 20+yr, reserve, spouses, dependents | https://www.ikonpass.com/en/military | If anyone qualifies: $97.25/day onto Palisades, $140 under the public price. Purchase is in person at a participating installation; the page still says "Locations: Coming soon!" |
| 21 | **$220** | **Epic Military Pass** (Active or Retired, and dependents) — `IsHolidayPeakAccessRestricted: false`, empty restricted-dates array, 42 resorts including Heavenly, Northstar and Kirkwood | https://www.epicpass.com/pass-results/passes.aspx | **$55/day at 4 days — the only thing in this entire study that beats the $60 benchmark on a big mountain.** Veteran $633; veteran-dependent child 5-17 $338 |
| 22 | **$201** + **$48** helmet = **$249** | Tahoe Dave's Truckee, adult **4-day Basic** ski **or** snowboard package plus helmet. **The only rental price in Tahoe provably re-priced for 26/27** — the 2026-04-23 Wayback capture shows $181 and $40; the live page shows $201 and $48 | https://tahoedaves.com/rates/ | `data/locations.ts` → `north-shore.rentals[onsite-north].perDayUsd: 40 → 50.25` gear-only, or **62.25** all-in with helmet; change `shop` to `"Tahoe Dave's, Truckee"` and `status: "estimate" → "verified"`. See §2.1 — this replaces a guess, it does not confirm one |
| 23 | **$30/car/day** | **Palisades Tahoe parking**, Sat/Sun/select holidays, 5 Dec 2026 – 11 Apr 2027. **$0** midweek non-holiday, **$0** after 1pm, **$0** via free reservations released Tuesdays 12pm & 7pm, plus a **$20 resort credit** for 4+ carpools | https://www.palisadestahoe.com/mountain-information/parking-and-road-conditions/parking-program | No field exists. See §3 |
| 24 | **$25/car/day** | **Sierra-at-Tahoe parking** — brand new for 26/27. Required weekends/holidays 19 Dec 2026 – 4 Apr 2027 until 12pm. **FREE for cars with 4 or more people inside.** Non-refundable after 8am day-of | https://sierraattahoe.com/parking/ | No field exists. See §3 |
| 25 | **14%** | Town of **Truckee** lodging tax (12% TOT + 2% TTBID), **rate effective 1 July 2026**, so it governs the whole 26-27 season. Taxable base includes cleaning, pet and booking fees | https://www.townoftruckee.gov/375/Transient-Occupancy-Tax | No field exists. See §3 |
| 26 | **$15/day, $40/season**, $94.50 min fine | California **SNO-Park** permit, per vehicle, valid 1 Nov – 30 May at any of 18 sites including Donner Summit (Castle Peak exit, beside Boreal) | https://ohv.parks.ca.gov/?page_id=30735 · https://ohv.parks.ca.gov/snoparks | Only bites on a sledding/snowshoe day. 26/27 permits on sale ~Oct 2026 |
| 27 | **$5.5840/gal** San Jose metro; $5.6379 CA statewide | AAA, page dated 27 Aug 2026. Cross-checked against EIA weekly CA regular at **$5.450** (w/e 24 Aug 2026) | https://gasprices.aaa.com/?state=CA · https://www.eia.gov/dnav/pet/hist/LeafHandler.ashx?f=W&n=PET&s=EMM_EPMR_PTE_SCA_DPG | Input to `lib/quote.ts` `GAS_PER_CAR`. See §2.3. Plan against a **$5.45–$5.64 band**, not a point, and note this is an August price, not a December one |

### 1B. Confirmed live and re-fetched, but the page carries NO season year

Real, current, posted prices, each verified in a browser. **Do not caption any of these as
"2026-27."** They are the best available, but the operator has not stamped a season on them.

| Price | Product | Source | Where it goes |
|---|---|---|---|
| **$85** flat for the 2-4 day bracket = **$21.25/ski-day** | Sports Basement **Adult Basic** ski/board package. Two South Bay stores (Sunnyvale 1177 Kern Ave, Campbell 1875 S Bascom Ave), online reservation, **pickup and return days free** | https://www.sportsbasement.com/pages/snow-rental-rates | `lib/choices.ts` → `GEAR.sj.perDay: 20 → 21` gear-only, or **26** with helmet ($20/trip). The site is in 26/27 mode ("PREORDER YOUR 2026/27 SNOW GEAR!" on the homepage) but the rate table itself is unlabelled |
| **$110** Sport · **$170** Premium · **$230** Demo · **$200** "The Works" (gear + apparel) · **$85** Kids Sport · **$65** Kids Basic; helmet **$20**, **performance boot upgrade $15** — all for the whole 2-4 day bracket | Sports Basement full tier ladder | same | The $15 boot upgrade is the highest-leverage money in this dimension — boots are where rental misery lives. Six adults on Basic + helmet = **$630 = $26.25 pp/ski-day**; on Sport + helmet = **$780 = $32.50** |
| **$80** for 2-4 days = **$20.00/ski-day** | The Ski Renter of Mountain View, Adult Basic. Appointment only. "We do not count the Pickup day or Return day by 2pm as rental days" | https://theskirenter.com/adult-ski-price-2 | The cheapest genuine South Bay shop, and almost certainly the origin of the site's $20 placeholder |
| **$70** for 2-4 days = **$17.50/ski-day** | California Ski Company, Berkeley, Adults Standard — **the cheapest 4-day rate found anywhere**. But it is Berkeley, and the return cutoff is **1:00pm**, the tightest of any shop: miss it and you fall into the 5-9 day bracket at $155 | https://www.californiaskicompany.com/ski-rental/ | Not South Bay. Include only as the floor of the market |
| **$25** one-time | Sports Basement **Basementeer** membership (also 10% off retail for life). Sierra-at-Tahoe hosts a dedicated page offering "up to 40% off lift tickets", limit 4 tickets per code — but that is **2025/26 wording**; the 26/27 level is unpublished | https://www.sportsbasement.com/products/basementeer-membership-1.json (product JSON — the HTML page renders as nav chrome only) | Note only. Put no lift-discount number on the site |
| **$0** helmet | Soda Springs and Sugar Bowl both **include** a helmet in the rental package; Soda Springs sells one a la carte at **$10** | https://www.skisodasprings.com/plan-your-trip/lessons-rentals/rentals/ | Caption material — this is what makes resort rentals less bad than they look. See §3 |

---

## 2. Corrections to what the site already believes

### 2.1 `lib/choices.ts` → `GEAR.onsite.perDay = 59` — **REFUTED (unsupportable)**

The site says "$59/day for a ski or snowboard package" and attributes it, via
`data/locations.ts → donner-summit.rentals[onsite-donner]`, to the **Boreal rental shop**
with `status: "verified"`. It is not verifiable, for any season, from any primary source:

- `rideboreal.com/day-access/rentals/` renders a single heading — its `<main>` innerText is
  literally the seven characters `RENTALS`.
- The underlying Gatsby/Drupal page-data payload shows the "Rentals" node containing one
  `paragraph__ui_section` with an **empty children array**: the content is unpublished, not
  merely JS-hidden.
- `book.rideboreal.com/s/rentals` returns **"CATEGORY NOT FOUND"**; the store is in summer
  mode (Woodward Bunker, skatepark, MTB rentals).
- The latest Wayback capture of the rental store is 2025-04-28 and, being a Vue SPA,
  contains no prices anyway.

The only $59 that exists is **Soda Springs'** ("SKI PACKAGE $59" / "SNOWBOARD PACKAGE $59",
helmet included) — a *different resort*, on a page carrying **no season label**, which ships
an active site alert reading "We are closed for the 2025/2026 Season!". The earlier $40
figure the note mentions is equally unsupportable.

**Action:** null it, or replace with the one confirmed 26/27 number — Tahoe Dave's Truckee
at $201/4 days + $48 helmet = **$62.25/ski-day all-in** — and relabel the row from "Boreal
rental shop" to a Truckee shop with free evening-before pickup. Note the correction costs
the group money on paper: 6 × $249 = **$1,494** against the site's implied 6 × $236 = $1,416.

The `north-shore` and `south-lake` on-site rows at **$40/day** (`status: "estimate"`,
"Bill's working number") have no support either. The cheapest published on-mountain rate in
the study is Soda Springs at $59 (unlabelled season); the priciest is Sugar Bowl at $75,
**proven** byte-identical to its 2026-02-13 archived 25/26 card and explicitly not yet
bookable.

### 2.2 `lib/choices.ts` → `GEAR.sj.perDay = 20` — **CONFIRMED as a floor, REFUTED as a median, and the wrong shape**

$20.00/day is real and exact: The Ski Renter of Mountain View, $80 for the 2-4 day bracket.
But:

- **It is the floor.** Restricted to currently-posted South Bay cards, the range is $80–$85
  total = **$20.00–$21.25/ski-day**. Sports Basement — the realistic default, two South Bay
  stores, online reservation — is $85 = $21.25.
- **$20 buys the entry-level "Basic" tier.** Sport is $110 ($27.50/day). Blended across a
  mixed group of six, **$22–$25/day** is honest; with helmets ($20 each) Basic is
  **$26.25 pp/day**.
- **No South Bay shop charges per day at all.** Every one charges a flat bracket for the
  whole period and gives pickup and return days free. A per-day model overprices short
  trips, underprices upgrades, and mis-states the marginal cost of an extra ski day — at
  Sports Basement, days 2-4 cost ~$11.67 each.
- **REI is the exception and is much worse:** it bills *per night* with both travel nights
  chargeable. Five nights is $106 member / **$159 non-member**, i.e. $26.50 / $39.75 per
  ski day.

**Action:** `GEAR.sj.perDay: 20 → 21` (or 26 with helmet), and rewrite `GEAR.sj.note`. The
current "Half the price, but it fills the trunk" is right on the trunk and wrong on the
half: against the only confirmed 26/27 resort-area number ($62.25/day at Tahoe Dave's),
South Bay Basic + helmet at $26.25/day is **42%**, not 50%.

### 2.3 `lib/quote.ts` → `GAS_PER_CAR = 90` — **REFUTED (too low for anything but a small car)**

Derived, not quoted, but every input is confirmed. San Jose→Truckee is ~218 mi each way
(secondary mapping sources), so ~436 mi round trip plus ~80-120 mi in-area driving (Truckee
to Donner Summit is 15-25 mi each way) ≈ **520-560 mi**. At the confirmed $5.5840/gal:

| Vehicle | Gallons | Cost | vs $90 |
|---|---|---|---|
| 45-mpg hybrid | 11.9 | $67 | −$23 |
| 30-mpg sedan | 17.9 | **$100** | +$10 |
| 22-mpg midsize SUV | 24.4 | **$137** | +$47 |
| 18-mpg full-size AWD SUV (what 6 people + skis actually need) | 29.8 | **$167** | **+$77** |

It would take a ~20% distance error to rescue $90 for an SUV, and no source suggests one.

**Action:** make the constant mpg-dependent, or raise it to ~$140 and caption it as derived.
The gas price itself is an **August** figure; a December price is unknown. There is no
confirmable Truckee-specific price — GasBuddy 403s and AAA does not break out Nevada or
Placer county. The safe advice is: fill up before the climb.

### 2.4 `lib/quote.ts` → `SEATS_PER_CAR = 4` — **the most consequential modelling error in the file**

Not directly researched, but three confirmed findings converge on it:

1. At 6 people this forces `cars = 2`, doubling both `GAS_PER_CAR` and `CAR.rent.perTrip`.
2. **Both confirmed 26/27 parking fees vanish at 4+ occupants per car.** Sierra-at-Tahoe:
   "FREE for cars with 4 or more people inside." Palisades gives 4+ carpools a $20 resort
   credit. Sugar Bowl lets 4+ park free in the paid area. Northstar's Village View lot is
   free for 4+. Kirkwood's 25/26 terms made carpool reservations free. Splitting 6 into two
   cars of 3+3 **forfeits every one of these exemptions.**
3. A party of six with six sets of gear needs a large SUV regardless — and a large SUV seats
   7-8, not 4.

**Action:** seat count should be a property of the chosen vehicle, not a global constant.
Six people in one Suburban-class vehicle is one gas bill (~$167) and $0 parking; six in two
midsize SUVs is ~$274 of gas plus up to $240 of Palisades weekend parking.

### 2.5 `lib/choices.ts` → `CAR.rent.perTrip = 500` — **partly confirmed, partly refuted**

KAYAK's own San Jose market statistics (aggregator data, not a quote for the group's dates):
SUV average **$73/day** — note the earlier research misquoted this as $91; $91 is the per-day
figure embedded in the $638 weekly average. **January is the cheapest month at ~$61/day.**
Class floors: standard/compact SUV from $40/day, **Chevrolet Suburban $126/day**, oversize
SUV class $132/day.

- A 5-day **standard SUV** in January: $305 base, plus SJC's $10 customer facility charge,
  9.38% San Jose sales tax, an energy recovery surcharge and a concession recovery fee —
  realistically 25-35% on top → **~$400-450**. **$500 holds.**
- A **Suburban-class** vehicle for 6 with skis: $630 base → **~$800+ all-in.** **$500 fails.**

**Action:** split the assumption by vehicle size. Note also that the comment in `choices.ts`
("Turo came in at $450 and Hertz was close enough") is unverifiable — Turo and Enterprise
both return HTTP 403 to fetching.

### 2.6 `lib/quote.ts` → `FOOD_PER_DAY = 30` — **STILL UNKNOWN**

No research pass touched food. It is the only assumption in `quote.ts` with zero evidence
either way. Note the line multiplies by `nights` (5), not `skiDays` (4), so it bills
$150/person — a modelling choice worth stating on the page.

### 2.7 Lift prices already on the site

| Site value | Verdict |
|---|---|
| `epic-*` **$359** / peak **$422** (all three locations) | **CONFIRMED** for 26/27 in Epic's own product feed (`AD Epic 4 Day Limited RST (A)` = $359, `AD Epic 4 Day Limited (A)` = $422). The +$63 peak delta is exact. The 32-resort tier's access list **does** include Heavenly (1430), Northstar (1431) and Kirkwood (1432) — verified in the product record, not inferred |
| `ikon-session` **$529** adult / **$419** under-23 | **Prices CONFIRMED. Citation is not.** `ikonpass.com/en/shop-passes/ikon-session-pass` publishes only "From $319.00 USD (Age 23+)"; the full 2/3/4-day × age grid is unreachable there without signing in. The grid was confirmed on Big Bear Mountain Resort's own Ikon page (Alterra-owned operator page, not an aggregator) and matched every cell. **Record that URL before shipping.** Child 5-12 is **$309**. Also worth a note: the Session Pass carries **no** Friends & Family tickets at all, so making one person a Session "host" for the group buys nothing |
| `palisades-4pack` **$440** unrestricted | **CONFIRMED** 26/27. The note's claim that it beats Ikon Session by $89 for 23+ is arithmetically correct. Add: the **4-Day Midweek at $365 beats it by another $75** (§1A #2), and the packs ship stacking vouchers — 4 midweek 25%-off vouchers plus 2 **transferable** Friends & Family 25%-off vouchers |
| `boreal-4pack` **$239** / child **$179** | **CONFIRMED on the live 26/27 page — but Boreal contradicts itself.** The price table shows $239 adult / $179 child marked "PRICE BEFORE 10/1". The **FAQ block lower on the same page** reads verbatim: "Adult iRide pass (ages 13+) is $259 — that's only $65 per visit (4-days). Kids iRide Pass (ages 12 & under) is $199 — that's only $50 per visit (4-days). All taxes and fees are included in our pricing upon checkout." A marketing block on the same page also says "That's just $65 per day." So Boreal advertises **$59.75/day and $65/day for the same product**, and the FAQ's tax-inclusive claim contradicts the table's note that 7.25% tax is added at checkout. Most likely $239 is the pre-10/1 rate and $259 the standard rate, but Boreal never says so. **The site's entire benchmark rests on this number.** https://www.rideboreal.com/day-access/tickets/iride/ |
| `soda-unlimited` **$279** | **Corroborated.** Soda Springs' rentals page carries promo tiles showing $279 Unlimited and $579 Family, and the sibling tickets-passes CMS payload carries genuine 26/27 markers ("lift tickets… will expire after the 2026/27 winter season closing date") |
| `sierra-pack` `totalUsd: null`, `status: "researching"` | **RESOLVED — the product no longer exists.** Sierra's own deals page: "While still valid for use through the close of the season, 3-PAK products are no longer available to purchase for the 2025/26 season." Its lift-ticket page: "2025/26 lift ticket products are no longer available for purchase. Stay tuned for more information on 2026/27 season lift ticket products." Change `status` to reflect discontinuation, not pending research. The "$91 3-PAK" still on aggregators is a stale price for a product you cannot buy |
| `boreal-window-holiday` `totalUsd: null` | Still null — no 26/27 Boreal window rate found |
| `boreal-night-pass` $219, "3pm–8pm only" | Not re-checked this pass. **Internal inconsistency worth fixing anyway:** the `donner-summit` blurb says "night skiing until 9" while this option says 3pm-8pm |

### 2.8 Site-level: the lodging dates are the worst possible dates

Every lodging quote in `data/locations.ts` is for **Dec 29 – Jan 3**. That window is
simultaneously:

- inside **Ikon Session's** blackouts (Dec 26-30 2026) — 2 of 4 ski days unusable;
- inside **Epic's** restricted range, forcing the **$422** peak version (+$63/head = **+$378**
  for six);
- a **Diamond Peak** peak period (Dec 19 2026 – Jan 3 2027);
- **Mt. Rose Classic and Off-Peak** void dates (Dec 26-30 / Dec 18 – Jan 2);
- a **Sierra-at-Tahoe** Play/Weekday blackout (Dec 26-30 2026);
- **Homewood Value** peak (Dec 26 – Jan 1);
- and near the peak-price month for Truckee lodging (momondo: February $757/night vs April
  $252/night — a **3x** seasonal spread).

The brief says dates are flexible and the group cares about price. **Moving the trip off this
window is worth more than every lift optimisation in this document combined.**

---

## 3. Costs the site ignores entirely

None of these has a line in `quote()`. Figures are per-trip for **6 people, 4 ski days,
5 nights**.

| Cost | Confirmed number | Effect on a 6-person trip | Avoidable? |
|---|---|---|---|
| **Parking — Palisades** | $30/car/day, Sat/Sun/holidays, 5 Dec 26 – 11 Apr 27 (**26/27 confirmed**) | 2 cars × 4 weekend days = **$240** | **Yes → $0.** Free after 1pm; free midweek non-holiday; free reservations drop Tuesdays 12pm/7pm; 4+ carpool also earns a $20 resort credit |
| **Parking — Sierra-at-Tahoe** | $25/car/day, weekends/holidays 19 Dec 26 – 4 Apr 27 until 12pm (**26/27 confirmed, brand new**) | 2 cars × 4 days = **$200** | **Yes → $0** with 4+ people per car, or arrive after 12pm |
| **Parking — Sugar Bowl** | $35/day reserved Upper Lot (**no season label**; the same page still advertises a shuttle "daily through April 20th, 2026", so it is half-updated) | up to $280 | General lots are free first-come; 4+ passengers park free in the paid area |
| **Parking — Kirkwood** | $20/reservation — **2025/26 page for a season already over**. No 26/27 terms published | — | Free for carpool holders and after 11:30am under the 25/26 terms |
| **Parking — Northstar / Heavenly / Boreal / Soda Springs / Donner Ski Ranch** | **No confirmable number.** See §5 | — | — |
| **Helmets** | Not included by any shop; included free at Soda Springs and Sugar Bowl | Tahoe Dave's $48/person = **$288**; Donner Ski Ranch $16/day = $64/person = **$384**; Sports Basement $20/person = **$120** | Rent where it is bundled |
| **Sales tax on lift products** | Boreal's own table notes **7.25%** added at checkout — while its FAQ claims "All taxes and fees are included in our pricing upon checkout." Contradiction unresolved | 6 × $239 = $1,434 → **+$104** | No |
| **Lodging tax — Truckee** | **14%** from 1 July 2026 (12% TOT + 2% TTBID), applied to nightly rent **plus cleaning, pet and booking fees** | On a $2,900 subtotal: **+$406** | **Geography arbitrage:** Soda Springs, Norden and Donner Summit are unincorporated Nevada County, reported at **10%** (county page 403s — medium confidence). Staying on the Summit saves ~4 points *and* sits closer to the cheap lifts |
| **Snow chains** | **No verifiable price** — every retailer blocks fetching (Walmart CAPTCHA, AutoZone 403, O'Reilly 403, TireChain.com renders no prices). Les Schwab publishes none by policy | — | **Net $0 is achievable.** Les Schwab, verbatim: "if your quick-fit chains, tire socks, or other traction devices remain unused at the end of the season, bring them back to any Les Schwab for a full refund in the spring." Buy in the Bay Area, return in spring |
| **Chain legality** (not a cost — a trip-killer) | Caltrans, verbatim: "Four-wheel/all-wheel drive vehicles **must carry** traction devices in chain control areas." R-2 exempts AWD only with **snow-tread tires on all four wheels** — an AWD rental on all-seasons can legally be turned around. R-3 has no exceptions. "Chain installers are NOT allowed to sell or rent chains" | — | Buy below the snow line, before the climb |
| **Rental-car chain prohibition** | Enterprise's FAQ (403s to fetch — unconfirmed at source) says chains may not be fitted to rental vehicles unless required by state law. Read against confirmed Caltrans rules, a 2WD rental under an active R-1 has **no lawful way through** | trip-ending | Confirm with the branch before booking |
| **Roadside chain installer fee** | **Unverified.** Reports of $30→$40 plus removal; the NBC source 403s and the Caltrans installer page 404s. No evidence Caltrans caps it | — | Fit your own free in the chain-up areas (Truckee Scales Exit 186, Nyack Exit 174) |
| **Under-25 driver surcharge** | **No verifiable number** — Turo's fee page 403s, Enterprise's 403s. Confirmed only in shape: Turo states under-25 drivers pay a young-driver fee that "cannot be removed or refunded." The bigger risk is the **vehicle-class ceiling** — 21-24 renters are reportedly limited to SUVs seating 5, which a party of six cannot use | $150-$250 per under-25 driver over 5 nights, per secondary sources only | Put someone 25+ on the contract |
| **SNO-Park permit** | $15/day or $40/season per vehicle; $94.50 minimum fine | $15-$30 on a sledding day | Only if you park at a SNO-Park |
| **Ski racks / guaranteed AWD** | **No published price anywhere.** Structural fact: the majors sell SUVs by *class*, not drivetrain — AWD is generally **not bookable as a guarantee** | — | Turo lists individual vehicles, so drivetrain and racks are visible per-car; hosts price extras individually |

**Net:** on the site's current Dec 29 – Jan 3 dates with two cars, the ignored costs run
roughly **$650-$1,000** for the group (parking $240-$440 + helmets $120-$288 + lift tax $104
+ the lodging-tax delta) — of which **$440 of parking disappears entirely** if all six ride
in one vehicle.

---

## 4. Deadlines — soonest first

Today is **2026-08-27**.

| Date | Days out | What happens | Source |
|---|---|---|---|
| **Sep 4-7, 2026** | 8 | **Bear Valley:** buy an eligible 26/27 season pass, get a free non-holiday day pass. **Dodge Ridge:** "Labor Day Season Pass Special 9/4-9/7" with a free buddy ticket (terms not yet posted) | bearvalley.com/season-passes · dodgeridge.com |
| **Sep 7, 2026, 23:59 MT** | **11** | **All Epic prices rise.** Machine-confirmed: `CountdownEnd 2026-09-07T23:59:00` America/Denver; sitewide banner "PASS PRICES GO UP SEPT 7 \| BUY NOW"; Day Pass page "LOWEST PRICE OF THE FALL ENDS SEPTEMBER 7". **Vail does not publish the post-increase price.** This governs the $359 the site quotes at all three locations | epicpass.com |
| **Sep 8, 2026** | 12 | **Palisades Tahoe** limited-time pricing ends — the 4-Day Midweek $365, 4-Day Unrestricted $440 and the $729 Midweek Pass are all tagged "LIMITED-TIME PRICE ENDS SEPT. 8" | palisadestahoe.com |
| **Oct 1, 2026** | 35 | **Boreal iRide 4-Pack $239 → higher** (the table says "PRICE BEFORE 10/1"; the FAQ's $259 is the likely after-price). **Soda Springs Unlimited $279 → higher.** *The site knows this and buries it in a `blackouts` string that renders nowhere prominent* | rideboreal.com · skisodasprings.com |
| **Oct 31, 2026** | 65 | **Diamond Peak preseason ends — $588 → $733 overnight (+$145).** Also: Dodge Ridge and Bear Valley preseason windows close; Cali Pass College final payment due | diamondpeak.com · dodgeridge.com · bearvalley.com |
| **~Oct 2026** | ~35-65 | CA **SNO-Park** 26/27 permits go on sale. Also the historical window for **Costco** to load new-season Sierra vouchers | ohv.parks.ca.gov |
| **Nov 1, 2026** | 66 | SNO-Park season opens. **Plates for Powder** historically opens Nov 1 (buy a Tahoe plate → free lift ticket at one of ~12 resorts). 26/27 round **not yet announced** | tahoefund.org/tahoeplates |
| **Nov 15, 2026** | 80 | Sierra-at-Tahoe season-pass deferral deadline | sierraattahoe.com |
| **~Nov 2026** | ~90 | **Diamond Peak Flex Passes** "typically go on sale in November" — the only surviving 2/3-day pack among the outlying independents | diamondpeak.com |
| **Nov 20, 2026** | 85 | Heavenly and Northstar open. This is the cheapest date on the dynamic-pricing calendar ($131 advance 1-day) | northstarcalifornia.com |
| **Nov 27, 2026** | 92 | Sugar Bowl opening day. 26/27 tickets, lessons and rentals "become available for booking this fall" — nothing is purchasable before then | sugarbowl.com |
| **Dec 5, 2026** | 100 | Palisades paid-parking program begins (runs to 11 Apr 2027) | palisadestahoe.com |
| **Dec 6, 2026, 09:00** | 101 | **HARD STOP: every Epic product goes off sale.** The global settings object carries `OffSaleDate 2026-12-06T09:00:00`. After this, Epic is unavailable at any price for the rest of the season | epicpass.com |
| **Dec 19, 2026** | 114 | Diamond Peak prewinter window closes. Sierra-at-Tahoe parking reservations begin (to 4 Apr 2027) | diamondpeak.com · sierraattahoe.com |

**Blackout calendar, for date-shifting** (captions, never disqualifiers):

- Ikon Session — Dec 26-30 2026, Jan 16-17 2027, Feb 13-14 2027
- Sierra Play / Weekday — Dec 26-30 2026, Jan 16-17 2027, Feb 13-14 2027
- Diamond Peak peak — Dec 19 2026 – Jan 3 2027, Jan 16-18 2027, Feb 13-21 2027
- Mt. Rose Classic void — Nov 27-28, Dec 26-30, Jan 16-17, Feb 13-15
- Homewood Value peak — Dec 26 – Jan 1, Jan 16-17, Feb 13-15

**Ikon posts no dated price deadline** but has escalated twice since its March launch:
Session $299→$319, Squad Pack $750→$800, Ikon Pass $1,349→$1,449.

---

## 5. Still unknown — and the one question that resolves each

| Unknown | The single question | How to get it |
|---|---|---|
| **Boreal 26/27 rental price** (the site's $59 — §2.1) | "What does an adult 4-day ski or snowboard package cost at Boreal for 26/27, and is a helmet included?" | Winter SKUs load at `book.rideboreal.com/s/rentals` in Oct/Nov 2026. Or call Boreal. **This is the largest unsupported number currently on the site** |
| **Boreal iRide: $239 or $259?** | "Is $239 the pre-10/1 price and $259 the price from 10/1, or is one of them wrong?" | Call Boreal, or re-fetch the iRide page on 2 Oct 2026 |
| **Boreal / Soda Springs / Donner Ski Ranch parking** | "Is parking free at Boreal on weekends and holidays for guests who do not own a Subaru?" | Boreal's own directions page carries no parking-cost language at all — neither a fee nor a statement that it is free. Doubt is active: Subaru's Boreal partnership page says "To ensure free parking during weekends and holidays, park in our VIP parking for Subaru owners!", phrasing that only makes sense if free weekend parking is not universal |
| **Northstar 26/27 parking** | "What does the Preferred lot cost per day for 26/27?" | Resort parking pages return a server error; the reservation portal is JS-only; secondary sources conflict ($20/$40 vs $25/$50). Confirmed only: Village View free for 4+, Castle Peak free daily with free shuttle, Mon-Fri free |
| **Heavenly / Kirkwood 26/27 parking** | "Are 26/27 parking reservations required, and at what price?" | Both `parkheavenly.com` and `parkkirkwood.com` still show 2025/26 terms for a finished season |
| **Sugar Bowl 26/27 packs** | "What are the totals for the Anytime 3-Pack, Select 3-Pack and Midweek Magic, and when do they go on sale?" | Sugar Bowl's own 1 Jul 2026 article states $199/day, $99/day and $89/day, but nothing is purchasable and `shop.sugarbowl.com` carries only season passes. The 26/27 **day-ticket** table *is* posted ($89 adult Sun-Fri online, $114 Sat/holiday, $189/$249 window) but was not skeptic-verified |
| **Sugar Bowl 26/27 rentals** | "Has the $75 / $55 / $90 rate card been re-priced for 26/27?" | Proven byte-identical to the 2026-02-13 archived 25/26 card. Re-check when booking opens |
| **Sierra-at-Tahoe 26/27 day tickets and rentals** | "What is the 26/27 window/online day rate, and the 26/27 rental combo price?" | Sierra says "Stay tuned." Its rental grid ($68 adult combo) still quotes a 3-PAK rate for a discontinued product — strong evidence the whole grid is 25/26 |
| **Diamond Peak 26/27 Flex Pass** | "What do the 2-Day and 3-Day Flex Passes cost for 26/27?" | November 2026. For scale, 25/26 was $289 and $399 |
| **Clair Tappaan Lodge nightly rate** | "What does 5 nights for 6 people cost, and are meals included?" | **Call 530-426-3632.** Sierra Club lodge at 19940 Donner Pass Rd, Norden — *walking distance to Sugar Bowl, minutes from Boreal and Donner Ski Ranch*. Its site has no rates page and "Book Now" is `javascript:void(0)`. Secondary sources describe two incompatible products ($60/adult with all meals vs ~$122-142/night with meals extra at ~$57/person), so neither is reportable. **Lodging is the biggest line in the quote — this is the highest-value single phone call in this document** |
| **Rainbow Lodge, Soda Springs** | "What is the winter nightly rate for a room?" | **Call (530) 718-3009.** Reopened, 15 rooms sleeping up to 40, restaurant and bar, just off I-80. Unincorporated Nevada County → 10% TOT, not Truckee's 14%. The only dollar figures online are *wedding-package* numbers and must not be read as room rates |
| **Do the Airbnb quotes in `locations.ts` include tax?** | "Is $3,254 / $2,900 / $3,067 an all-in total or a pre-tax subtotal?" | Determines whether §3's 14% Truckee line is already paid or is a +$400 surprise |
| **Truckee / Summit rates on non-holiday dates** | "What do these same listings cost the second week of January?" | Every quote is Dec 29 – Jan 3, the year's peak. Momondo puts Truckee's monthly spread at $757 (Feb) vs $252 (Apr) |
| **Food per person per day** | Nobody researched it | — |
| **Chain purchase price** | "What does a set of cables or chains cost for an SUV?" | Every retailer blocks fetching; Les Schwab publishes none by policy. Walk into a store |
| **Under-25 surcharge, and the vehicle-class ceiling** | "Can a 21-24 year old rent a 7-seat SUV in San Jose, and at what daily surcharge?" | Turo and Enterprise both 403. Ask a branch |
| **Ikon Session 3-day/4-day cells on ikonpass.com** | "Is there a public URL showing $429 and $529 without signing in?" | The grid was confirmed on Big Bear Mountain Resort's Ikon page. **Record that exact URL before shipping the $529/$419 the site already uses** |
| **Ikon college / nurse / military SheerID amounts** | "What does a Session Pass cost after college verification?" | Revealed only inside checkout after verification. Warning on Ikon's own page: "Multiple verification attempts will result in your account being locked" |
| **USAGOLD $50-off code** | "Is it still live at checkout?" | U.S. Ski & Snowboard announced it 12 Mar 2026 "for a limited time" with no stated expiry; the linked sweepstakes ended 4/16/2026. Try it at checkout, do not budget it. Do **not** use the "$249 Session Pass" figure circulating in secondary coverage — it was computed off the superseded $299 launch price and is stale by $70 |
| **Costco 26/27 Sierra voucher** | "Is there a 26/27 Sierra-at-Tahoe multi-pack at Costco?" | Sierra's own Costco page shows only 25/26 2-PAKs extended to 18 Dec 2026, with no price. Costco's own pages timed out. Re-check Sept/Oct 2026 |
| **Plates for Powder 26/27** | "Is the free-lift-ticket-with-a-Tahoe-plate round repeating for 26/27?" | Tahoe Fund's page has not rolled over from the Nov 1 2025 – Apr 1 2026 round. If it repeats on the same calendar it opens ~Nov 1 2026, inside this trip's planning window. Historic participants include Boreal, Sugar Bowl, Heavenly, Northstar and Palisades |
| **Basementeer 26/27 lift discount** | "What is the 26/27 discount level and which resorts honour it?" | Sierra's Basementeer page still says "up to 40% off" and "ANY DAY during the 2025/26 Season". The $25 membership fee itself is confirmed |
| **AAA / employer perk portals** | "What does *your* employer's portal quote for Palisades, Heavenly and Northstar?" | All login-gated with no public price list. AAA's own page names no resorts, prices or seasons. The widely repeated "AAA members save up to 28% at Palisades" traces only to an Auto Club Group blog — not AAA Northern California, so it may not even apply to a San Jose member. This is an action item, not a price |

---

## 6. Dead ends — do not research these again

**Businesses that no longer exist**

- **Any Mountain** — chain defunct. San Jose (1600 Saratoga Ave) and Redwood City (928
  Whipple Ave) both CLOSED; the last store (Corte Madera) closed at the end of April 2021.
  anymountain.net fails at the TLS handshake. Remove from any shop list.
- **Porters Sports** — closed its final Truckee location after 54 years; Tahoe City and
  Incline Village also closed. portersports.com is now a HugeDomains parking page offering
  the domain at $4,795. *Tahoe Sports Hub is a separate business, not a rebrand.*

**Wrong geography — not Bay Area, not Tahoe**

- **Willi's Ski & Board** — three stores, all in Western Pennsylvania (Pittsburgh South Hills,
  North Hills, Seven Springs). "South Hills" and "North Hills" read like Bay Area names but
  are not.
- **Sun & Ski Sports** — exactly one California store, in **Mammoth Lakes**, on the wrong side
  of the Sierra. Houston-headquartered; sites its stores near resorts, not feeder cities.
- **"Sierra Sport"** — no such shop exists on Donner Summit or in Truckee. The name-adjacent
  businesses (Sierra-at-Tahoe's "Sierra Mountain Sports", Sierra Ski & Cycle Works) are all
  South Shore, ~1h45m away.
- **Tahoe Mountain Sports** (Truckee) — real, but rents only backcountry, touring and nordic
  gear. No alpine packages.
- **Play It Again Sports (San Jose)** — buy/sell/trade model, not rental. Corporate publishes
  no rental rate card of any kind.

**Discount channels that are dead or empty**

- **Liftopia** — seven of eight Tahoe resorts show "Out of Stock" / "No Deals Available"; the
  one exception (Homewood) 404s on its resort page. No functioning route onto a Tahoe lift.
- **SnowBomb / SF-San Jose Ski & Board Festival** — dormant. Its Sierra-at-Tahoe page still
  advertises a *2014/2015* Platinum Pass with snowfall data last updated March 2015.
  sfskifest.com returns 403. Every findable SnowBomb price traces to Groupon or event
  write-ups from 2012-2018.
- **Sierra-at-Tahoe 3-PAK** — discontinued by Sierra itself.
- **Grocery-counter tickets (Safeway, Raley's)** — could not be substantiated in any recent
  season. The only trace is a 2006 Colorado forum thread about Breckenridge. No Tahoe resort
  names a grocery chain as an outlet. The Bay Area channel that replaced it is Sports
  Basement's Basementeer card.
- **Indy Pass 2026-27** — every alpine product SOLD OUT with no price shown (Base, Indy+, both
  Add-Ons). Only the **Indy XC** Nordic pass ($99 adult / $49 kids) and a not-yet-on-sale
  "Learn to Turn Pass" ($189) remain. Nothing lift-served is buyable.
- **Ski California Gold Pass** — $4,250, and "2026-27 Gold Passes are SOLD OUT!" Waitlist for
  2027-28 only.
- **Mountain Collective** — $699 for 2 days at each destination, but the **only California
  resort on the entire 27-destination roster is Sugar Bowl**. Palisades, Mammoth, Heavenly,
  Northstar, Kirkwood and Sierra are all absent. $699 buys exactly 2 Tahoe days at $349.50
  each. Ruled out.
- **Epic Day Pass 22-Resort tier** — a **trap**, not a deal. $218 for 4 days is $54.50/day and
  undercuts the Boreal benchmark, but its resort list is 22 Midwest, Northeast and
  Mid-Atlantic hills (Afton Alps, Mt Brighton, Wilmot, the Ohio areas, Attitash, Wildcat,
  Seven Springs and the rest). **Nothing west of Missouri.** If this price lands on a Tahoe
  page it will mislead a real buyer.
- **Ikon Base Plus Pass** — does not exist for 26/27. The shop flow offers exactly three
  products and the comparison table has exactly three columns. Discontinued from 25/26 and
  not restored, leaving a $490 gap above the 4-Day Session.
- **Epic college / student pass** — does not exist. The IsCollege flag is true on exactly one
  product across all 27 Epic categories, and that is the Park City *Youth* Pass, a kids'
  product misfiled under the flag. The new "ages 13-30 save 20%" banding does **not** extend
  to the Epic Day Pass, which uses a flat "Adult (13+)" tier.
- **Bank-card partner offers** — every concrete example has expired: Amex $100-back at Vail
  Resorts through 30 Apr 2026; Amex $75-back at Alterra to 28 Mar 2026, explicitly
  **excluding** the Ikon Pass; Chase Sapphire perks at Big Bear and Snowshoe, neither in
  Tahoe. Nothing published for 26/27. Check the Offers tab before booking; budget nothing.
- **Diamond Peak "$60 Days"** — a **one-off 60th-anniversary promo** on specific 25/26 dates
  (Jan 14 and 29, Feb 9, Mar 17 and 27, Apr 19). Still cited as current precisely because it
  matches the benchmark exactly. No 26/27 equivalent, and no reason for an anniversary promo
  to repeat. Diamond Peak also killed its Birthday/UnBirthday free tickets and its 2-Day
  Consecutive ticket.
- **Alterra "Kids Ski Free Week"** — ran 6-12 Dec 2025 only; no 26/27 equivalent announced.
  There is **no California equivalent** of Colorado's fifth-grade ski passport.
- **Sam's Club** — a real channel with dedicated Palisades and Mammoth pages, but Palisades
  currently reads "See You Next Winter 2026/2027!" with nothing on sale.
  serviceshub.samsclub.com returns 403 to fetching.
- **Group rates at 6 people** — nobody offers one. Palisades requires a **minimum of 20** lift
  tickets with 5 days notice, quote-only. Sugar Bowl is the most accessible at **10+ midweek
  / 20+ weekends** (groupsales@sugarbowl.com) — reachable only if the party grows to 10-11.
  Vail publishes no group threshold anywhere in the 26/27 catalogue. Ikon's only group
  mechanic is the Squad Pack, which requires **exactly five**. **Do not build a group-size
  discount into the configurator.**
- **Tahoe Donner Downhill** — publishes no rental price for any season, its store contains no
  rental SKUs, purchases require a member account, and guest lift tickets require an
  accompanying member. Effectively unavailable to a 6-person non-member group; arguably
  should not be priced on the site at all. It does publish the cluster's only same-rate
  multi-day opt-out policy — return by 9AM on a day you decide not to ski and you are not
  charged for it — but with no price attached, it cannot be costed.

**Structural dead ends**

- **No resort on the South Shore or among the outlying independents sells a purchasable 26/27
  3-5 visit pack.** Sierra killed its 3-PAK; Diamond Peak's Flex is the only survivor and is
  unrepriced; Mt. Rose, Homewood and Bear Valley sell none at all. Boreal's $239 iRide 4-Pack
  is unbeaten by anything in that dimension.
- **No night skiing exists anywhere on the South Shore.** Sierra's own FAQ: "Sierra-at-Tahoe
  does not offer night skiing." Boreal's night pass has no competitor there.
- **Ski and snowboard pricing is identical** at every operator that publishes a price — Soda
  Springs $59/$59, Sugar Bowl "ski or snowboard $75", Donner Ski Ranch $55, Donner Ski Shop
  $40, Tahoe Dave's (both tables numerically identical through all four tiers), Tahoe Sports
  Hub $49. The single cluster-wide exception is BlueZone's performance tier ($55.99 board vs
  $59.99 ski). **The group gear budget collapses to one per-person number regardless of who
  rides what.** Package *contents* still differ: Donner Ski Ranch rents ski gear only as an
  inseparable unit but rents boards and boots separately.
- **Donner Summit has essentially no motel inventory.** Summit lodging is the Hotel at Sugar
  Bowl and its village rentals, Clair Tappaan, Rainbow Lodge, and private vacation rentals in
  Serene Lakes / Soda Springs. Nearest motel-grade inventory is 10-15 mi downhill in Truckee.
  A group optimising for the cheap Summit lifts will sleep in Truckee and drive up daily —
  exactly the 15-25 mi each way the fuel estimate in section 2.3 accounts for.

---

## Appendix A — reservation constraints for a party of six

Where you can *reserve* six matching sets of gear matters more than a $10 price gap.

- **Must reserve online, in advance:** Boreal ("ALL PURCHASES MUST BE MADE ONLINE, PRIOR TO
  ARRIVAL / There are no on-site purchases"); Soda Springs ("ADVANCE PURCHASE & SELECT A
  PICK-UP TIME REQUIRED", "inventory is limited during each pick-up time slot", peak waits
  "could exceed 1-2 hours").
- **Cannot reserve at all:** Donner Ski Ranch ("NO RESERVATIONS", first-come first-served);
  Donner Ski Shop ("First come First Serve, no reservations needed. Saturdays are busy").
- **Walk-ins fine:** Sugar Bowl, Tahoe Dave's ("We also allow walk-ins anytime"), Tahoe Sports
  Hub, BlueZone.
- **The scheduling win:** Tahoe Dave's free evening-before pickup — "Stop in after 3pm the
  evening before and rent for no extra cost" — removes the 1-2 hour resort rental queue from
  day one.
- **Return-day cutoffs differ sharply** and decide whether a 4-ski-day trip bills as a 4-day
  rental: Outback allows return until store close; Sports Basement publishes no clock; Ski
  Renter requires 2pm; California Ski Company requires **before 1:00pm**. For a group driving
  home from Tahoe, that Berkeley 1pm deadline is the difference between the $70 weekend
  bracket and the $155 week bracket.

## Appendix B — free shuttles, which zero out the parking fees

Palisades' Park and Ride is free, from the TTUSD lot at 11611 Donner Pass Rd, Truckee and
180 W Lake Blvd, Tahoe City, shuttling 6:30-7:45am with returns until 5:45pm — but the page
is explicitly labelled "2025-26 season" (27 Dec 2025 – 12 Apr 2026, weekends only) and 26/27
dates are not out. Also free: TART Connect on-demand across Truckee and North Tahoe (4WD vans
with ski racks, 6:30am-10pm), the Sugar Bowl / Donner Summit shuttle, and Northstar's Castle
Peak lot with a continuous shuttle. So the $30 Palisades and $25 Sierra fees are avoidable at
$0 two ways: park in Truckee and ride, or put all six in one vehicle for the carpool
exemptions.

## Appendix C — source files behind this summary

- E:/Github/skiing/research/south-bay-rentals.json
- E:/Github/skiing/research/onsite-rentals.json
- E:/Github/skiing/research/epic-ikon-breakeven.json
- E:/Github/skiing/research/south-shore-packs.json
- E:/Github/skiing/research/multipack-hunt.json
- E:/Github/skiing/research/logistics-lodging.json
