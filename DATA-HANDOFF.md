# Data handoff: numbers to fetch for the Boreal trip

For a Claude agent running **locally on Bill's machine**, with a real browser. The cloud
agent that built this site can't reach airbnb.com (its egress proxy blocks it), and a plain
fetch can't read several resort pages because they render with JavaScript. So these numbers
are still Bill's reads or last month's, and a few are missing. Your job is to go and read
them off the real pages, put them in the data files, and push.

Read `HANDOFF.md` for how the site works and `AGENTS.md` before touching any Next.js code.
You shouldn't need to touch code here: everything below lives in `data/`.

Written 2026-09-29. **Oct 1 is the first deadline** (task 3).

---

## The rules (same as the rest of the site)

- **Never invent a price.** A number goes in only if you read it on the page, and it carries
  `status`, `source`, `sourceUrl` and `asOf`. If you can't get it, leave the field as it is
  and say so in your summary. A `null` price renders as "no price yet". That's correct
  behaviour, not a bug.
- **Airbnb totals come off the checkout screen, tax and fees included.** Not the nightly rate
  on the listing. Record the breakdown (nights × rate, cleaning, service fee, taxes) in the
  stay's `note`, because tax rates differ wildly between neighbouring listings (8.8% to 17.6%
  so far).
- **A quote belongs to its dates and guest count.** Different dates or headcount means a new
  `quotes` entry or a new stay record, never an edit to an old number.
- **`status: "verified"`** only when you read it yourself on the live page today. Bill's
  numbers stay `"estimate"` until you've confirmed them.

---

## Where things live

| What | File | How it's found |
|---|---|---|
| Houses | `data/locations.ts` → the `donner-summit` location's `stays` | by `id` |
| Lift passes | `data/locations.ts` → `donner-summit.lift` | `boreal-4pack`, `boreal-window-holiday` |
| The trips | `data/trips.ts` | `boreal-new-year` (4 days, Dec 29 – Jan 3) and `boreal-new-year-3-days` (Dec 30 – Jan 3) |
| Gear prices | `lib/choices.ts` → `GEAR.sj` | Sports Basement brackets |

Both Boreal trips are **5 people, age 21**. A trip's `shortlist` is the list of stay ids
shown on its page, cheapest first. `stay` is the one marked "the plan" and opened by
default. It's unset on the 4-day trip right now, so the page opens on the cheapest.

Current numbers, so you can tell if your change landed: the 4-day trip is **$681 per person**
in the hostel and $865 in the hotel. The 3-day trip shows **no total** (see task 2).

---

## Tasks, in order

### 1. Read the two 5-person listings properly

Both are for 5 adults, Dec 29, 2026 to Jan 3, 2027.

| id | Link | Bill's total | Bill's description |
|---|---|---|---|
| `boreal-hostel-5` | https://www.airbnb.com/rooms/1317130416914855663 | $1,786 | hostel, shared bathroom |
| `boreal-hotel-5` | https://www.airbnb.com/rooms/1597211501977273983 | $2,707 | hotel, one on a sofa bed |

For each, open the listing with `check_in=2026-12-29&check_out=2027-01-03&adults=5`, go to
the checkout ("Reserve"), and record:

- `name`: the listing's real title. The current names are placeholders.
- `kind`, `sleeps`, `sleepsMax`: as the listing states them. `sleeps` is how many sleep
  comfortably, and a sofa bed counts toward `sleepsMax`, not `sleeps`, if the listing is
  squeezed at 5.
- `sleepNote`: the bed and bath situation in one plain sentence. Keep the shared bathroom
  and the sofa bed in it; Bill wants those visible.
- `quotes`: `[{ guests: 5, totalUsd: <checkout total incl. tax>, asOf: "<today>" }]`
- `toLift`: the town, and the drive to Boreal (Castle Peak exit off I-80) in minutes.
- `perks`: 2–3 short items, including the rating and review count.
- `status: "verified"`, `source: "airbnb.com — checkout, 5 adults, Dec 29 – Jan 3"`,
  `sourceUrl`: the `/rooms/<id>` link, `asOf`: today.
- `note`: the full checkout breakdown and the cancellation policy (the free-cancellation date
  matters).

If the checkout total differs from Bill's, use the checkout total and put Bill's figure in
the note.

### 2. Give the 3-day trip a house for five

`boreal-new-year-3-days` (check in **Dec 30**, check out Jan 3, **4 nights**) currently has only
`truckee-castle-creek-4n`, which takes 4 people max. At 5 it has no total.

Quote the same two listings for **5 adults, Dec 30 – Jan 3**, off the checkout. For each, add
a **new** stay record next to the originals, with `id` = the original id + `-4n`,
`nights: 4`, and its own quote and note. Then set the 3-day trip's shortlist to those ids in
`data/trips.ts`. Remove `truckee-castle-creek-4n` from that shortlist, and remove the trip's
`stay: "truckee-castle-creek-4n"` line so the page opens on the cheapest. Leave the
Castle Creek record itself in the data.

If a listing isn't available for those nights, say so. Don't substitute another listing.

### 3. Boreal iRide 4-Pack after Oct 1 (**deadline**)

`boreal-4pack` is `$239`, the listed "PRICE BEFORE 10/1". Boreal's own FAQ quotes `$259`,
which is probably the price afterwards, but the site never says so.

- **Before Oct 1:** confirm $239 is still on sale at
  https://www.rideboreal.com/day-access/tickets/iride/ and leave it.
- **On or after Oct 1:** read the new adult price and put it in `totalUsd`, with a new
  `asOf`. Update `blackouts` (it says "Buy before Oct 1") and `note` (it says "Price rises
  after 10/1").
  - Update the `deadline` block on **both** trips in `data/trips.ts`. It says "Buy … before
    Oct 1 … $239". Point it at the next price step if Boreal publishes one; otherwise delete
    the `deadline` block.
  - Also check the child price (`tiers`, $179) while you're there.

The page renders prices with JavaScript, so read it in a real browser.

### 4. Confirm Sports Basement for 2026-27

`GEAR.sj` in `lib/choices.ts` prices gear at the Adult Basic package: 2–4 days $85, 5–9 days
$145, with pickup and return days free (their words, which Bill sent). Check
https://www.sportsbasement.com/pages/snow-rental-rates in a real browser, since the table is
injected by JavaScript and a plain fetch mislabels rows. Confirm the $85 2–4 day price and
the free pickup/return policy for this season. If a number changed, update the `price`
function and the comment above `sj`.

### 5. Boreal day tickets over New Year (only if they're on sale)

`boreal-window-holiday` has `totalUsd: null` on purpose. Boreal's Go-Time tickets are
dynamically priced and weren't on sale for these dates. If the Go-Time page now shows real
prices for Dec 31, Jan 1 and Jan 2, record the adult price per day in the note. Set
`totalUsd` only if one price covers all three days; otherwise leave it `null` and describe
the prices in the note. Don't use the "$69–$144" range Bill pasted; it was never sourced.

### 6. Low priority

- `soda-springs-4p` ($1,680 for 4, `status: "estimate"`, link
  https://www.airbnb.com/rooms/877728571087501036) has never been read off a checkout. It's
  not on any trip right now, so only do this if everything above is done.

---

## Before you push

```bash
npx tsc --noEmit && npx eslint . && npm run build
npm run start   # then open /trips/boreal-new-year and /trips/boreal-new-year-3-days
```

Check that:

- both trip pages show a total;
- the house names are the real ones;
- the listing links open on the right dates with 5 guests;
- the "the plan" / "cheapest" labels make sense.

Save your raw reads (the checkout breakdowns, the page text you relied on) as
`research/boreal-5p-2026-09.json`, one object per finding with `source_url` and the date,
like the other research files.

Then commit and **push to `main`**. Bill has asked for changes to go straight to main.
Summarize the before/after numbers for Bill in plain words, and list anything you couldn't
get and why.
