# Suncoast Senior Living — `DESIGN.md`

> **These are rules I follow every time I touch UI in this repo.** Not
> suggestions. If a change violates a rule here, the change is wrong.
> Read this file before writing any markup or style.

---

## 0. Repo audit (what this project actually is)

Audited: `package.json`, `css/styles.css`, `index.html`, `pages/about.html`,
`pages/contact.html`, `pages/resources.html`, `js/main.js`.

- **Stack:** a **static, hand-authored HTML/CSS/JS site** served by `npx serve`.
  There is **no Tailwind config, no `globals.css`, no React, no build step, and
  no dependencies** in `package.json`.
- **Styling:** one stylesheet, `css/styles.css`, driven by CSS custom properties
  under `:root`. **These custom properties are the design layer.**
- **Consequence for this brief:** **shadcn/ui does not exist in this repo** and
  cannot be imported (`@/components/ui/*` paths are fictional here). Component
  reuse is therefore mapped to the **real CSS component classes** that already
  exist (§8). shadcn/ui only becomes relevant if we migrate to a React/Next
  stack — that is a separate, explicit decision, not something to assume.
- **If Tailwind is ever added:** its scale must be remapped onto the tokens
  below via `theme.extend`. Never emit a default Tailwind value
  (`text-2xl`, `p-4`, `bg-blue-700`, `rounded-lg`) that isn't mapped to a token.

---

## 1. Aesthetic direction — **Editorial** (committed)

One direction, chosen from {editorial, brutalist, technical, warm-minimal,
high-contrast mono} and committed: **Editorial.** Never "modern and clean."

Editorial here means: a serif display voice, dramatic type contrast, wide
margins, an asymmetric grid, and restraint with color. **Hierarchy is carried by
type weight and whitespace — not by borders, boxes, or a card around everything.**
The coastal palette (Harbor blue / Sunset orange / sand neutrals) is how this
brand expresses the Editorial direction.

---

## 2. Fonts

Three roles. Loaded from Google Fonts.

| Role | Family | Stack | Weights we use |
|---|---|---|---|
| **Display** | **Fraunces** | `'Fraunces', serif` | **200** (large display), 400, 800 |
| **Body** | **Libre Franklin** | `'Libre Franklin', sans-serif` | 400 (body), 600, **800** (labels/CTAs) |
| **Mono** | **IBM Plex Mono** | `'IBM Plex Mono', monospace` | 500, 600 (eyebrows, stats, data) |

```css
--font-display: 'Fraunces', serif;
--font-body:    'Libre Franklin', sans-serif;
--font-mono:    'IBM Plex Mono', monospace;
```

### NEVER use (banned fonts)

**Inter · Roboto · Open Sans · Arial · system-ui.** Not as a face, not as a
fallback, not "just for now." (This project previously used Open Sans — it is
being removed.)

---

## 3. Color

**One dominant, one accent.** Everything else is neutral or status.

```css
/* THE TWO BRAND COLORS */
--color-dominant: #1A5276;  /* Harbor Blue  — dominant, the brand */
--color-accent:   #E67E22;  /* Sunset Orange — accent, ACTIONS ONLY */
```

### Dominant ramp — Harbor (blue)

| Token | Name | Hex |
|---|---|---|
| `--harbor-900` | Deep Harbor | `#0F3A54` |
| `--harbor-800` | Midnight Harbor | `#154360` |
| `--harbor-700` | Harbor Blue *(dominant)* | `#1A5276` |
| `--harbor-600` | Tide Blue | `#2471A3` |
| `--harbor-500` | Coastal Blue | `#2E86C1` |
| `--harbor-200` | Sky Wash | `#A9CCE3` |
| `--harbor-50`  | Mist Blue | `#EAF2F8` |

### Accent ramp — Sunset (orange)

| Token | Name | Hex |
|---|---|---|
| `--sunset-700` | Ember | `#D35400` |
| `--sunset-600` | Sunset Orange *(accent)* | `#E67E22` |
| `--sunset-200` | Apricot | `#F5CBA7` |
| `--sunset-50`  | Peach Wash | `#FDF0E4` |

### Neutrals — coastal sand & driftwood

| Token | Name | Hex |
|---|---|---|
| `--ink`   | Deep Slate | `#2C3E50` |
| `--slate` | Driftwood Gray | `#5D6D7E` |
| `--fog`   | Fog Gray | `#DCE1E6` |
| `--mist`  | Sea Mist | `#F8F9FA` |
| `--sand`  | Warm Sand | `#FDF6EE` |
| `--cloud` | Cloud White | `#FFFFFF` |

### Status only (NOT brand colors)

| Token | Name | Hex | Use |
|---|---|---|---|
| `--palm-600` | Palm Green | `#1E8449` | success |
| `--clay-600` | Clay Red | `#C0392B` | error |
| `--gold-500` | Sunlight Gold | `#F1C40F` | rating stars |

### Color rules

- **Gradients only within the Harbor blue ramp** (e.g. Deep Harbor → Tide Blue),
  or a solid field. **Purple and indigo are banned** — no purple/indigo
  gradients, and never a purple/indigo gradient sitting on white.
- Accent (Sunset) is reserved for the **primary action**. Scarcity is the point.
- Reference **semantic roles** in components, never a raw hex:
  `--color-surface`, `--color-surface-invert`, `--color-text`,
  `--color-text-muted`, `--color-border`, `--color-brand`, `--color-action`,
  `--color-success`, `--color-error`, `--color-focus`.

---

## 4. Spacing — 8px rhythm

One scale. **Everything is a multiple of 8px (0.5rem base).** No 5px, 12px, 18px
one-offs. (Single exception: `--space-hair 0.125rem` for 1–2px optical borders.)

| Token | rem | px |
|---|---|---|
| `--space-1` | 0.5rem | 8 |
| `--space-2` | 1rem | 16 |
| `--space-3` | 1.5rem | 24 |
| `--space-4` | 2rem | 32 |
| `--space-5` | 2.5rem | 40 |
| `--space-6` | 3rem | 48 |
| `--space-8` | 4rem | 64 |
| `--space-10`| 5rem | 80 |
| `--space-12`| 6rem | 96 |

Section vertical padding: `--space-10`/`--space-12`. Card interior: `--space-3`.
Container gutter: `--space-3`.

---

## 5. Type scale — weight extremes, 3× jumps

Hierarchy is built from **two weight extremes and big size leaps**, not a dense
ladder of near-equal sizes. Timid 1.5× neighbors are banned; the signature move
is the **~3× body → display jump** carried by weight 200 vs 800.

| Token | size | weight | font | Role |
|---|---|---|---|---|
| `--text-label`   | 0.75rem (12px) | **800** | mono | Eyebrows/labels, uppercase, `letter-spacing:0.12em` |
| `--text-body`    | 1.0625rem (17px) | 400 | body | Body copy (≥17px for legibility) |
| `--text-lead`    | 1.375rem (22px) | 400 | body | Lead paragraphs *(bridge, used sparingly)* |
| `--text-title`   | 2rem (32px) | 400 | display | Section headline *(bridge)* |
| `--text-display` | `clamp(3.375rem, 6vw, 4.25rem)` (54–68px) | **200** | display | Hero display — **~3× body** |

```css
--weight-light: 200;   /* display voice */
--weight-regular: 400;
--weight-semibold: 600;
--weight-black: 800;    /* labels, CTAs, emphasis */
--leading-tight: 1.1;   --leading-snug: 1.25;
--leading-normal: 1.6;  --leading-relaxed: 1.7;
--tracking-tight: -0.02em;  --tracking-label: 0.12em;
```

**Rule:** a screen should read as Label (heavy, tiny) → Body → Display (light,
huge). Reach for the two bridges (`--text-lead`, `--text-title`) only when a
section genuinely needs a middle beat.

---

## 6. Border radius

| Token | value | Use |
|---|---|---|
| `--radius-sm` | 0.25rem (4px) | inline chips, inputs (tight) |
| `--radius-md` | 0.5rem (8px) | **buttons, inputs, selects** |
| `--radius-lg` | 0.75rem (12px) | content cards, form panels |
| `--radius-xl` | 1rem (16px) | media wells |
| `--radius-pill` | 999px | badges/tags |
| `--radius-circle` | 50% | step numerals, icon coins |

Interactive controls → `md`. Cards → `lg`. Single word/number → `pill`/`circle`.

---

## 7. Elevation & motion

Shadows are tinted with Deep Harbor, **used purposefully — not stamped on every
element**. Depth mostly comes from color fields and space, not shadow.

```css
--shadow-sm: 0 2px 8px  rgba(15,58,84,0.06);
--shadow-md: 0 4px 20px rgba(15,58,84,0.08);
--shadow-lg: 0 10px 34px rgba(15,58,84,0.16);
--shadow-xl: 0 18px 48px rgba(15,58,84,0.22);

--dur-fast: 150ms;  --dur-base: 200ms;  --dur-slow: 320ms;  --dur-slower: 520ms;
--ease-standard: cubic-bezier(0.2,0,0,1);
--ease-out:      cubic-bezier(0.16,1,0.3,1);
--stagger: 70ms;
```

Micro-interactions: buttons lift on hover + return on `:active`; nav links get a
left-anchored underline; cards lift with `--shadow-lg`; scroll reveals fade+rise
staggered by `--stagger`; every control shows a 3px `--color-focus` ring on
`:focus-visible`. All motion respects `prefers-reduced-motion: reduce`.

---

## 8. Component reuse (reuse — do not hand-roll)

**shadcn/ui is not available in this repo** (no React/build). The reusable units
here are CSS component classes in `css/styles.css`. **Reuse these; do not invent
parallel styles.**

| Component | Class(es) | Defined in |
|---|---|---|
| Button (variants/sizes) | `.btn` + `.btn-primary` `.btn-accent` `.btn-outline` `.btn-outline-light` · `.btn-sm` `.btn-lg` `.btn-nav` `.btn-full` | `css/styles.css` |
| Container | `.container` | `css/styles.css` |
| Card | `.community-card` / `.card-body` / `.card-actions` | `css/styles.css` |
| Section header | `.section-header` | `css/styles.css` |
| Form field | `.form-group` (+ `label`, `input`, `select`, `textarea`) · `.form-row` | `css/styles.css` |
| Lead form | `.lead-form` (+ `.form-success`) | `css/styles.css` |
| Sidebar card | `.sidebar-card` | `css/styles.css` |
| FAQ accordion | `.faq-item` / `.faq-question` / `.faq-answer` (JS: `js/main.js`) | `css/styles.css` |
| Compare table | `.compare-table` | `css/styles.css` |
| Nav / mobile nav | `.site-header` / `.nav-links` / `.nav-toggle` (JS toggles `.open`) | `css/styles.css` |

*If we adopt shadcn/ui later:* Button, Input, Select, Dialog, Accordion, Skeleton
map onto the classes above; migrate, don't duplicate. Do not add that dependency
without an explicit decision.

---

## 9. Component states (required for any async/data/filter component)

Reference: the **Community Results** grid (search-filtered). Any component that
fetches, filters, or submits must implement all four, switched via a single
`data-state` attribute (`ready`/`loading`/`empty`/`error`):

- **Empty** — illustrated panel + constructive copy + a reset action. Never blank.
- **Loading** — **skeletons that match the real card shape** (same footprint, no
  layout shift) with a shimmer.
- **Error** — Clay Red framing, plain-language cause, a **Try again** retry.
- **Success** — the results + a live `aria-live="polite"` count.

---

## 10. Forbidden (hard "no")

1. **Three rounded cards in a row** as the default section layout. Vary rhythm —
   asymmetric spans, a feature row, editorial lists. (Current Communities &
   Testimonials sections violate this — remediation item.)
2. **Centered-everything heroes.** Use the asymmetric grid (§11). (Current home
   hero is centered — remediation item.)
3. **0.1-opacity drop shadows on everything.** Shadow is purposeful, not ambient.
   (Current cards use blanket `0.08` shadows — remediation item.)
4. **Purple or indigo gradients**, especially on white.
5. **Lorem ipsum** or placeholder copy ("Feature one / Feature two"). Use real,
   specific Suncoast content (real community names, real Sarasota details).
6. **Hierarchy from borders and boxes.** Lead with type weight and space.
7. **Banned fonts** (§2). **Off-scale spacing** (§4). **Raw hex** in components (§3).

---

## 11. Layout & grid

```css
--max-width: 1200px;
--container-pad: var(--space-3);
```

Editorial asymmetry (never symmetric/centered for hero & feature blocks):
- Hero: `1.35fr / 0.9fr` (lead copy heavier than the aside).
- Lead-form / overview: `1.5fr / 1fr`.
- Break the "3 equal cards" grid: mix column spans and non-card editorial rows.

---

## 12. Definition of done

- [ ] Fonts: Fraunces / Libre Franklin / IBM Plex Mono only. Zero banned fonts.
- [ ] Color: one dominant + one accent; status colors not used as brand; no
      purple/indigo gradient; no raw hex in components.
- [ ] Spacing on the 8px scale. Type from the weight-extreme scale (200 vs 800).
- [ ] No forbidden pattern (§10) present.
- [ ] Hero/feature blocks asymmetric, not centered.
- [ ] Async/filter components implement all four states (§9).
- [ ] `:focus-visible` on every control; `prefers-reduced-motion` honored.
- [ ] Contrast ≥ 4.5:1; body ≥ 17px; touch targets ≥ 44px; real content only.
