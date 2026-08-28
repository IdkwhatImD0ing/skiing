# Handoff

A trip-pricing site Bill sends to friends. Pick a mountain, a house, gear and wheels;
the bottom of the page says what each person pays.

**The one job:** a friend opens the link, sees what it costs *them*, and commits.

```bash
npm install && npm run dev        # http://localhost:3000
npx tsc --noEmit && npm run build # both clean as of this handoff
```

Next 16 (App Router, Turbopack), React 19, Tailwind 4. No database, no API — all data
is committed TypeScript in `data/`.

---

## Start here: the site is unstyled

Everything builds and the numbers are right, but **the configurator markup uses classes
that don't exist in `app/globals.css`**, so the page renders nearly bare. This is the
next job and it is the whole job.

Missing, all of them:

```
.conf  .step  .step-h  .step-n  .step-sub  .step-advice
.chips  .chips-tight
.chip  .chip-n  .chip-lift  .chip-stay  .chip-opt
.chip-top  .chip-resort  .chip-name  .chip-meta  .chip-note
.chip-rate  .chip-rate-off  .chip-unit  .chip-est  .chip-rec
.total  .total-empty  .total-table  .total-detail
.total-out  .total-cell  .total-cell-quiet
.total-num  .total-label  .total-notes
```

Chips are `<button>` with `aria-pressed`, so style selection off `[aria-pressed="true"]`,
not a class. Unavailable stays carry `data-off`.

`globals.css` is ~1,600 lines and most of it styles components that no longer exist —
it predates a rebuild. **Don't delete it wholesale**: the tokens, `.panel`, `.tag`,
`.marker-*`, `.prov*`, `.sr-only`, focus and reduced-motion rules are all still live and
still good. Mine it, then drop what's genuinely orphaned.

---

## Map

```
app/page.tsx           hero + <Configurator/>
app/layout.tsx         fonts, metadata, header/footer, HeadcountProvider
app/globals.css        tokens + inherited styles (see above)

components/
  configurator.tsx     the whole UI: 5 steps + the total. Client component.
  headcount.tsx        headcount context, persists to ?n= and localStorage
  ui.tsx               Marker, Num, Researching, Tag, Provenance
  site-header.tsx      wordmark + the $60 benchmark
  site-footer.tsx

lib/
  types.ts             Stay, LiftOption, Rental, SkiLocation, Provenance, PriceTier
  choices.ts           liftChoices() — every pass, one row per tier. GEAR, CAR.
  quote.ts             quote() — prices one selection. The money lives here.
  cost.ts              stayTotalFor() per-guest lookup, stayOptions(), money()

data/locations.ts      the only data file. 3 locations, each with stays/lift/rentals.
research/*.json        raw research output, 2 of 9 dimensions
```

Flow: pick a pass → the pass decides the location → that location's houses appear →
gear and car are independent → `quote()` returns lines plus per-person and per-day.

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
restrictions. Price per day is the only ranking axis.

---

## What's true right now

Verified against resort pages, 2026-27:

| Product | | Note |
|---|---|---|
| Boreal iRide 4-Pack | **$239** · $59.75/day | **Price rises after Oct 1** |
| Boreal Night Pass | $219 · $43.80/night over 5 | Unlimited 3–8pm, **no blackouts** |
| Play Forever Friday | $35/day | ~9 Fridays a season |
| Soda Springs Unlimited | $279 ($264 at 18–23) | $55.80/day at 5 visits |
| Epic Day Pass 4-day | $359, +$63 for peak | |
| Palisades 4-pack | $440 unrestricted | Beats Ikon Session on the same mountain |
| Ikon Session 4-day | $529 / $419 under 23 | No peak dates at any price |
| Boreal rental | $59/day | Not the $40 originally assumed |

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

Traps that already cost a round of screenshots:

- **Never put `display:flex` on an element containing bare text.** Each text run becomes
  its own flex item and prose wraps a word at a time. Use an `inline-flex` child.
- Percentage padding on a table cell resolves against the *table*, not the cell.
- `minmax(400px, 1fr)` forces a 400px track at 390px and scrolls the body sideways. Use
  `minmax(min(400px, 100%), 1fr)`.
- `auto-fill`, not `auto-fit`, or two cards stretch across a full row.

Floor: responsive to 390px, visible keyboard focus, `prefers-reduced-motion` respected,
real semantic tables, no horizontal body scroll. Motion restrained.

---

## Research

The workflow stalled at **2 of 9 dimensions** and has not moved. Raw output:

- `research/donner-summit-cluster.json` — 21 findings, Boreal/Soda Springs/Sugar Bowl
- `research/north-west-shore-independents.json` — 37 findings, incl. Homewood operating
  again for 2026-27

Never ran: South Bay rentals, Ikon/Epic break-even, South Shore packs, on-site rentals,
multi-pack hunt, logistics/lodging, big-resort discounts. Re-running those is optional —
Bill has been sourcing prices himself and they have been better than the research.

---

## Open

1. **The 4-person listing has no URL.** It's in `data/locations.ts` as `soda-springs-4p`,
   third-cheapest per night, unlinkable in a proposal until Bill sends the link.
2. **A second quote on any one house** — see the retraction above.
3. **Buy-by Oct 1** for the Boreal 4-pack and Soda Springs pass. The site does not surface
   this anywhere and probably should; it's the only thing here with a deadline.
4. **The Night Pass may be the actual answer** and is currently buried as one chip among
   many. $219, no blackouts, $43.80/night — for a group leaving San Jose at midday it beats
   everything. Worth asking Bill whether the group would ski afternoons before designing
   around it.
