# Suncoast Senior Living — Monthly Social Media Flyer Kit

A repeatable system for producing **postable, on-brand flyers with captions**
every month, for all four locations (Corporate, Suncoast East, Suncoast Club at
Prestancia, Suncoast House) across **Facebook, Instagram, Google Business
Profile, and LinkedIn**.

Each month you get:
- 8 designed flyers (a mix of educational, holiday/seasonal, community
  highlights, and social proof — some with real-photo drop-in slots, some
  fully illustrated so they're postable as-is),
- ready-to-paste captions tailored per platform, and
- a posting calendar spread across the month.

---

## Folder structure

```
social-media/
├── README.md            ← you are here
├── brand-kit.md         ← colors, voice, per-location facts, hashtag banks
├── assets/
│   └── flyer.css        ← the shared flyer design system
├── render.js            ← renders flyer HTML → PNG (uses pre-installed Chromium)
├── templates/
│   └── NEW-MONTH.md     ← checklist for producing a new month
└── content/
    └── 2026-07/         ← one folder per month (YYYY-MM)
        ├── flyers/      ← HTML source, one file per flyer
        ├── exports/     ← rendered PNGs  ← THESE ARE WHAT YOU POST
        ├── captions.md  ← captions per platform per flyer
        └── calendar.md  ← the month's posting schedule
```

## How to post (the 60-second version)

1. Open `content/<month>/exports/` — every `.png` is a finished, square (1080×1080)
   graphic ready to upload.
2. Open `content/<month>/captions.md`, copy the caption for that flyer +
   platform.
3. Follow `content/<month>/calendar.md` for what to post when and where.
4. For flyers marked **real-photo placeholder** (03 Club, 05 House), drop a real,
   consented photo into the placeholder first (see below), then re-render.

## Rendering the PNGs

The renderer uses the environment's pre-installed Chromium — no browser
download needed.

```bash
npm run flyers            # renders the newest month
node social-media/render.js 2026-07   # render a specific month
```

PNGs land in that month's `exports/` folder. You can also just open any
`flyers/*.html` file in a browser and screenshot the card.

> If `playwright-core` isn't installed yet: `npm install`
> (it's listed as a devDependency). The renderer auto-detects the Chromium
> binary under `/opt/pw-browsers`; override with `CHROMIUM_PATH=/path/to/chrome`.

## Swapping in a real photo

Flyers with a `.photo-slot` (dashed "DROP REAL PHOTO HERE" box) are built to
receive a real, **consented** photo of the community:

1. In the flyer's `.html`, replace the `<div class="...photo-slot">…</div>`
   with `<img src="my-photo.jpg" style="width:100%;height:100%;object-fit:cover">`
   (put the image next to the HTML file).
2. Re-run the renderer.

Never post a real resident photo without written consent (see `brand-kit.md`).

## Designing a new flyer

1. Copy an existing flyer in `flyers/` as a starting point.
2. Keep the structure: `.brandbar` → `.body` → `.footer`, inside a
   `<div class="canvas …">`.
3. Pull colors, facts, and hashtags from `brand-kit.md`.
4. Re-render and eyeball the PNG.

See `templates/NEW-MONTH.md` for the full monthly checklist.

---

## The automated monthly routine

A **monthly Routine** is scheduled to run automatically (see below). On the 1st
of each month it:

1. Spins up a fresh Claude Code session in this environment.
2. Reads this README, `brand-kit.md`, and the most recent month as a reference.
3. Generates the **next month's** flyer kit — new HTML flyers (with that month's
   holidays/observances baked in), captions for all 4 platforms, and a posting
   calendar — covering all 4 locations and the same theme mix.
4. Renders the PNGs.
5. Pushes the work to a new branch named `social-media/<YYYY-MM>` and notifies
   you to review.

You review the branch, swap in any real photos, and post. Nothing goes public
automatically — the routine only prepares and pushes a draft branch.

**Managing the routine:** it was created via the scheduling integration. To
pause, change the day/time, or stop it, ask in a session ("pause the monthly
social flyer routine") or manage it from your Claude Code triggers.

**Manual run any time:** you don't have to wait for the 1st — in a session,
say *"generate next month's Suncoast flyer kit,"* and the same steps run on
demand.
