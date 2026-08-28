/* ------------------------------------------------------------------
   Shared chip and step classes. Both the scenario page and the explorer
   render the same vocabulary, so it lives in one place — a chip that
   only looks selected on one of the two pages is the kind of drift this
   file exists to prevent.

   Every option is a real <button> carrying aria-pressed, so selection is
   styled off the attribute with Tailwind's aria-pressed: variant and
   there is no state class to keep in sync. Things we can't price carry
   data-off.

   Selected chips get the lit top edge: the same sodium lamp the rest of
   the page stands under. Amber stays scarce — the human voice, the $60
   benchmark, and the one thing you picked. Glacier is reserved for
   numbers somebody actually measured.
   ------------------------------------------------------------------ */

export const CHIP = [
  "relative grid content-start gap-1.5 rounded border p-[13px_14px] text-left",
  "border-hair bg-pane transition-colors duration-150 cursor-pointer",
  "hover:border-ridge hover:bg-snow/5",
  "aria-pressed:border-sodium/60 aria-pressed:bg-linear-to-b aria-pressed:from-dusk aria-pressed:to-pane",
  // The lit top edge.
  "aria-pressed:before:absolute aria-pressed:before:inset-x-[18%] aria-pressed:before:-top-px",
  "aria-pressed:before:h-px aria-pressed:before:content-['']",
  "aria-pressed:before:bg-linear-to-r aria-pressed:before:from-transparent",
  "aria-pressed:before:via-sodium aria-pressed:before:to-transparent",
  // Unpriced, or won't sleep the group. Dimmed, not disabled — the dates
  // move and so can the booking, and picking it is how you learn why.
  "data-[off]:border-dashed data-[off]:bg-transparent data-[off]:opacity-60",
].join(" ");

/* auto-fill, not auto-fit: a fit would stretch three gear options across the
   whole row. min() keeps the track from forcing a sideways scroll at 390px. */
export const CHIPS =
  "grid grid-cols-[repeat(auto-fill,minmax(min(232px,100%),1fr))] gap-2.5";

/* No flex on the heading: it holds bare text alongside its spans, and a flex
   container would make every word its own item. */
export const STEP_H =
  "mb-4 font-display text-[clamp(1.15rem,2.6vw,1.4rem)] font-bold [font-stretch:108%] tracking-[-0.02em] leading-tight";

export const STEP_N = [
  "mr-[0.6em] inline-flex h-[1.75em] w-[1.75em] items-center justify-center align-[-0.35em]",
  "rounded-[3px] border border-ridge bg-well",
  "font-data text-[0.62em] font-medium tracking-normal text-muted",
].join(" ");

/** The quiet note beside a step heading: not a choice, just context. */
export const STEP_SUB =
  "ml-[0.65em] font-data text-[0.6em] font-normal uppercase tracking-[0.12em] text-muted";

export const CHIP_NAME =
  "font-display text-[0.98rem] font-bold [font-stretch:106%] tracking-[-0.015em] leading-snug";
export const CHIP_META =
  "font-data text-[10px] uppercase tracking-[0.09em] text-muted";
export const CHIP_RATE =
  "mt-0.5 font-data tabular-nums text-[1.18rem] font-bold tracking-[-0.03em] leading-none text-glacier";
export const CHIP_UNIT =
  "ml-1 text-[11.5px] font-normal tracking-normal text-muted";
export const CHIP_NOTE = "text-xs leading-normal text-snow/66";

/* Invert the unpriced state: shrink the mark, promote the sentence. A big
   figure where a price belongs reads as a price. The dashed ring is the same
   "we don't have this" mark used everywhere else on the site. */
export const CHIP_RATE_OFF = [
  "mt-0.5 inline-flex items-center gap-[7px] text-[12px] font-normal leading-snug text-snow/78",
  "before:size-[11px] before:flex-none before:rounded-full",
  "before:border-[1.5px] before:border-dashed before:border-muted before:content-['']",
].join(" ");

export const PILL =
  "ml-2 inline-block rounded-[2px] border px-1.5 py-px align-[0.2em] font-data text-[9.5px] font-medium uppercase tracking-[0.12em]";

/* Two columns once there's room: the choices scroll, the receipt doesn't.
   `items-start` is load-bearing — a stretched grid item fills the row and has
   no room left to move, so the rail would never actually stick. */
export const LAYOUT =
  "grid items-start gap-x-14 gap-y-10 pb-[clamp(3rem,6vw,5rem)] lg:grid-cols-[minmax(0,1fr)_330px]";

export const STEPS = "flex flex-col gap-[clamp(2.25rem,4.5vw,3.25rem)]";

/* The receipt runs taller than a laptop viewport once a warning is showing, so
   the rail scrolls inside itself rather than pushing its own bottom off the
   screen. py-px gives the lit top edge, which sits at -1px, somewhere the
   scroll container won't clip it. The header is a consistent 60px from 1024
   up, so 80 leaves a 20px gap. */
export const RAIL =
  "lg:sticky lg:top-20 lg:max-h-[calc(100dvh-100px)] lg:overflow-y-auto lg:py-px";
