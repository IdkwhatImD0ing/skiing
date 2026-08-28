# Handoff

A trip-pricing site Bill sends to friends. Pick a mountain, a house, gear and wheels;
the bottom of the page says what each person pays.

**The one job:** a friend opens the link, sees what it costs *them*, and commits.

```bash
npm install && npm run dev        # port 3000, or the next free one
npx tsc --noEmit && npm run build # both clean as of this handoff
```

`.claude/launch.json` has `autoPort` on, because port 3000 is often taken by another
project on Bill's machine. The dev server will tell you which port it took.

Next 16 (App Router, Turbopack), React 19, Tailwind 4. No database, no API — all data
is committed TypeScript in `data/`.

---

## How this is styled

**Tailwind utilities, in the markup.** The configurator's markup was once written
against ~40 custom class names that were never added to `globals.css`, so the page
rendered nearly bare; the fix was to write utilities rather than the missing classes.

What stays in `app/globals.css` is only what a utility can't carry: the `@theme`
tokens, the page ground, and the primitives shared with `components/ui.tsx`
(`.marker-*`, `.prov*`, `.tag*`, `.panel`, `.num`, `.sr-only`). It went from 1,606
lines to ~400 when the board, ladder, trip grid and cost sheet CSS — all styling
components a rebuild had already deleted — came out.

Three things worth knowing before you touch it:

- **Selection is `aria-pressed`, styled with Tailwind's `aria-pressed:` variant.**
  There is no state class to keep in sync with the attribute screen readers read.
  Unavailable stays carry `data-off` and style through `data-[off]:`.
- **Keep base CSS inside `@layer base`.** Unlayered CSS outranks *every* Tailwind
  layer, so an unlayered rule cannot be overridden by a utility. This already caused
  one real bug: the focus ring lived unlayered, and the selected headcount button —
  which is filled sodium — was getting a sodium ring on sodium, invisible to keyboard
  users. It asks for `aria-pressed:focus-visible:outline-snow` and that only lands
  because the base rule is in a layer now.
- **Long Tailwind strings live in `const`s at the top of `configurator.tsx`**
  (`CHIP`, `CHIPS`, `STEP_H`, `CHIP_RATE`…), not inline. Tailwind's scanner reads
  them fine as long as the class names stay literal strings — never build one by
  interpolation.

---

## Map

```
app/page.tsx           hero + <Configurator/>
app/layout.tsx         fonts, metadata, header/footer, HeadcountProvider
app/globals.css        @theme tokens, page ground, ui.tsx primitives (see above)

components/
  configurator.tsx     the whole UI: 5 steps + the total. Client component.
  headcount.tsx        headcount context, persists to ?n= and localStorage
  ui.tsx               Marker, Num, Researching, Tag, Provenance
  site-header.tsx      wordmark + the $60 benchmark
  site-footer.tsx

lib/
  types.ts             Stay, LiftOption, Rental, SkiLocation, Provenance, PriceTier
                       + SKI_DAYS (4) and BENCHMARK_PER_DAY (60) — the trip's shape
  choices.ts           liftChoices() — every pass, one row per tier, priced and
                       ranked for SKI_DAYS. GEAR, CAR.
  quote.ts             quote() — prices one selection. The money lives here.
  cost.ts              stayTotalFor() per-guest lookup, stayOptions(), money()

data/locations.ts      the only data file. 3 locations, each with stays/lift/rentals.
research/*.json        raw research output, one file per dimension (see below)
```

Flow: pick a pass → the pass decides the location → that location's houses appear →
gear and car are independent → `quote()` returns lines plus per-person, per-night,
and how many of the four days the chosen pass actually covers.

---

## The rules that matter

**Never invent a price.** Every record carries `status`:

| status | meaning | price |
|---|---|---|
| `verified` | confirmed on a real source, `source`/`asOf` set | real |
| `estimate` | a working number Bill gave us | real, but soft |
| `researching` | nobody has confirmed it | **`null`** |

A `null` price must render as "we don't have this yet" — never `$0`, never a placeholder,
never a dash that could read as free. If any line is null, show **no total** rather than a
misleading partial one.

**Lodging is quoted per guest count, not per night.** `Stay.quotes` is a list of
`{guests, totalUsd}`. `stayTotalFor()` returns an exact quote when one exists, interpolates
between two, extrapolates beyond them — and **returns `null` from a single quote**, because
one point is not a curve. Interpolated results come back `estimated: true` and must look
different from a real quote.

Right now **every house has exactly one quote**, so the site can only price the group size
Bill actually asked Airbnb about. That is correct behaviour, not a bug.

**Capacity is two numbers.** `sleeps` is comfortable; `sleepsMax` includes air mattresses.
Over `sleeps` sets `squeeze` — style it as a caption, not an alarm. Bill would take that
trade.

**Dates are not a constraint.** Bill: *"each proposal is time shiftable, we just care about
price."* Blackout text is a caption. Never gate, grey out, or de-rank an option for having
restrictions.

**But the trip's shape is.** Bill: *"we want 4 full day ski sessions."* `SKI_DAYS = 4` in
`lib/types.ts` is a property of the trip, and the pass has to meet it. This is *not* the
same thing as a date restriction, and the difference is the one distinction the pricing
turns on:

- A **blackout** says *when* you can ski. Shift the trip; it costs nothing. Caption it.
- **Coverage** says *how many full days you actually get*. A night pass sells 3–8pm, and
  no quantity of evenings is a full day. That option cannot do what Bill asked, however
  cheap it looks, and a rate per day computed from days it does not supply is a lie.

So `LiftOption` carries `coverage` (`"pack" | "unlimited" | "day"`, how the price relates
to days) and `fullDaysPerTrip` (what it delivers inside *one* trip). Options that fall
short stay visible and pickable — nothing is hidden here — but they lead with what they
can't do instead of a per-day figure, they sort last, and selecting one states the hole
in the trip beside the total.

Per-day, computed against the four days, is still the only ranking axis *among options
that cover the trip*.

---

## What's true right now

Verified against resort pages, 2026-27. Per-day is **against Bill's four full days**,
which is why some of these differ from what an earlier handoff claimed:

| Product | Cost for the trip | Per full day | Note |
|---|---|---|---|
| **Boreal iRide 4-Pack** | **$239** | **$59.75** | The benchmark, and the cheapest adult pass that covers the trip. **Price rises after Oct 1** |
| Soda Springs Unlimited | $279 ($264 at 18–23) | $69.75 | *Not* $55.80 — that assumed five visits. Above the benchmark at four |
| Epic Day Pass 4-day | $359 (+$63 peak) | $89.75 | |
| Ikon Session · under 23 | $419 | $104.75 | |
| Palisades 4-pack | $440 | $110.00 | Unrestricted. Beats Ikon Session on the same mountain |
| Ikon Session 4-day | $529 | $132.25 | No peak dates at any price |
| Play Forever Friday | $35 | — | $35 all day, but one trip holds one Friday: **covers 1 of 4** |
| Boreal Night Pass | $219 | — | Unlimited, no blackouts, but 3–8pm: **covers 0 of 4** |
| Boreal rental | $59/day | | Not the $40 originally assumed |

The last two used to head the board at $35 and $43.80/day. They were the cheapest things
here and they cannot deliver a full-day trip — see the coverage rule above.

Lodging, all quoted for Dec 29 – Jan 3, one guest count each:

| House | Guests | Total | /person/night |
|---|---|---|---|
| Olympic Valley | 8 | $2,900 | $72.50 |
| Heavenly | 8 | $3,067 | $76.68 |
| Soda Springs house | 7 | $3,254 | $92.97 |
| Soda Springs cabin | 6 | $2,900 | $96.33 |
| *(unlinked 4-person place)* | 4 | $1,680 | $84.00 |

Still soft: San Jose rental at **$20/day** is Bill's estimate, never verified.
Food at $30/day and gas at $90/car are assumptions baked into `lib/quote.ts`.

---

## Findings worth keeping in the UI

These came out of the numbers and are the reason the site exists.

**Cheap lift beats cheap lodging.** Sorted by all-in cost, the lodging column runs
*backwards*. The cheapest house ($72.50/night at Olympic Valley) produces the most
expensive trip, because its lift is $110/day. Boreal at $59.75/day is worth more than any
Airbnb saving available.

**Car rental is bigger than the lift ticket.** At a flat $500/car, renting costs ~$142/person
against ~$26 for gas alone. If two people can drive, that is the single largest saving on
the board.

**Cars create a sawtooth.** At 4 seats a car, 4 people and 8 people cost the same per head;
5 costs everyone ~$89 more than 4, and 9 costs ~$49 more than 8. Full carloads are the
sweet spots. The old headcount board plotted this; the configurator currently does not
show it at all, and probably should.

**A retraction, so it isn't rediscovered as fact.** An earlier version claimed this house
charged ~$525 per extra guest and that bigger groups cost everyone more. That came from
treating two different listings as one. It is wrong. There is currently *no* evidence of
per-guest pricing on any listing — but also no evidence against it, because every house has
a single quote. **One more quote at a different guest count on any one house would settle
it** and is the highest-value number left to gather.

---

## Design direction

Night skiing at Donner Summit — Boreal runs lights till 9 and this group drives up after
work. Tokens are in `globals.css`:

```
night #080C17   dusk #131C33   ridge #24304F
snow  #E8F0FA   muted #8FA0BD
sodium #FF9A3C (accent)   glacier #74D8EC (data)
```

Type: **Archivo** display (width axis is load-bearing — resort signage is a wide
grotesque), **Public Sans** body, **Chivo Mono** for every figure, tabular-nums.

Trail-difficulty markers encode budget, not terrain: green circle under $60/day, blue
square at it, black diamond over, dashed circle unpriced.

Inherited from the previous design pass, worth keeping:

- **Two accents, non-overlapping jobs.** Sodium = the human voice and the $60 benchmark,
  nothing else. Glacier = a number we measured. Keeping amber scarce is what stops this
  reading as the default dark-page-with-one-accent look.
- **A three-step confidence vocabulary:** dashed ring = missing, solid ring = estimated,
  filled disc = quoted. Cheap, and it makes "still checking" legible without words.
- **Invert the unpriced state:** shrink the dash, promote the sentence. A big em-dash where
  a total belongs reads as a value; a small muted one beside real text reads as absence.

Traps that already cost a round of screenshots. All of them still bite through
Tailwind — a `flex` utility is `display:flex`:

- **Never put `flex` on an element containing bare text.** Each text run becomes its
  own flex item and prose wraps a word at a time. This is why the step headings and
  `.chip-name`-equivalents are *not* flex: they hold bare text beside a `<span>`. Use
  an `inline-flex` child, or `align-[…]` on the child, instead.
- Percentage padding on a table cell resolves against the *table*, not the cell.
- `minmax(400px,1fr)` forces a 400px track at 390px and scrolls the body sideways. Use
  `minmax(min(400px,100%),1fr)` — as `CHIPS` does.
- `auto-fill`, not `auto-fit`, or two cards stretch across a full row.
- `transition-colors` includes `outline-color`, so a focus ring fades in. If you measure
  computed styles to check a ring, wait out the duration or you'll read the start value.

Floor: responsive to 390px, visible keyboard focus, `prefers-reduced-motion` respected,
real semantic tables, no horizontal body scroll. Motion restrained.

---

## Research

From the first pass:

- `research/donner-summit-cluster.json` — 21 findings, Boreal/Soda Springs/Sugar Bowl
- `research/north-west-shore-independents.json` — 37 findings, incl. Homewood operating
  again for 2026-27

A second sweep covers the dimensions that never ran, each researched and then re-checked
by a separate agent briefed to *refute* its prices rather than agree with them:

- `research/south-bay-rentals.json` — the $20/day San Jose gear estimate, never verified
- `research/onsite-rentals.json` — the $59/day resort rental, and Truckee shops
- `research/epic-ikon-breakeven.json` — Epic vs Ikon vs single-resort packs, plus
  student/military/group rates and every buy-by deadline
- `research/south-shore-packs.json` — Sierra-at-Tahoe, Diamond Peak, Mt Rose, Homewood
- `research/multipack-hunt.json` — Costco, ski clubs, Snowbomb, retail promos
- `research/logistics-lodging.json` — non-Airbnb lodging, real gas cost, chain control,
  **resort parking fees** and the car-rental assumption

`research/SUMMARY.md` is the one to read: it separates prices confirmed against a live
2026-27 page (with the exact field each belongs in) from everything still soft, and
lists the costs the quote ignores entirely.

**Nothing from research lands in `data/` automatically.** A number goes in only if it
came back confirmed with a source URL, and it carries `status`/`source`/`asOf` when it
does. Bill has been sourcing prices himself and they have often been better than the
research — where they disagree, ask him rather than overwriting.

---

## Open

1. **The 4-person listing has no URL.** It's in `data/locations.ts` as `soda-springs-4p`,
   third-cheapest per night, unlinkable in a proposal until Bill sends the link.
2. **A second quote on any one house** — see the retraction above. Still the
   highest-value number left to gather.

**Closed since the last handoff.** The configurator is styled (Tailwind, see above).
The **Oct 1 buy-by** deadline now shows in amber on all four affected passes — every
lift option already carried a `blackouts` string that nothing rendered. The **carload
sawtooth** is stated in step 1, deriving the full carloads from `SEATS_PER_CAR` so the
sentence can't drift from the arithmetic.

And the Night Pass question is **answered: Bill wants four full-day sessions**, so it is
out, along with Play Forever Friday. Both are still on the page, marked for what they
cover. Don't reopen this by looking at their sticker prices — that is exactly the trap
the coverage rule exists to stop.
