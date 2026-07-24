# Suncoast Senior Living — Events (suncoastsl.com)

How events work on the live WordPress site, what's deployed, and what's pending.

## How the site is built

Event content on **suncoastsl.com** lives in WordPress **page `post_content`** as a
self-contained `<div class="soc-care">…</div>` block (scoped CSS + inline HTML). The
pages use the **`elementor_header_footer`** page template, so Elementor supplies the
site header/footer and the `post_content` block renders in between. No Elementor
widget/editor data is involved — editing = editing the HTML block.

Brand tokens (defined in the scoped `<style>`): `--navy:#1e3358`, `--accent/--orange:#c8621a`,
`--cream:#faf7f2`; fonts Playfair Display (headings) + Open Sans (body).

## Deployed

- **`wordpress-events-hub.html`** — the exact block published to the Events page
  (`/events/`, page id **2393**), replacing the old single-list layout.
  - Two sections: **Upcoming Events** (top) and **Past Events** (bottom).
  - Cards carry `data-start="YYYY-MM-DDTHH:MM"`. A small inline script splits them by
    today's date — **Upcoming sorted soonest-first, Past sorted most-recent-first** —
    so events move to "Past" automatically once their date passes. Cards are also
    pre-sorted server-side, so the split is still correct if a security plugin ever
    strips the script.
  - To add an event: paste a `.feature-ev` card (copy an existing one) into
    `#soc-upcoming-list` with the right `data-start`; the script files it correctly.

## Reference

- **`_reference-todays-hospice.html`** — the raw `post_content` of an existing event
  detail page (`/todays-hospice/`), captured as the canonical event-page template
  (split hero with flyer "poster", About + Event Details card, "What to Expect"
  feature tiles, and a `[wpforms id="…"]` RSVP section).
- **`medicare-made-simple.html` / `index.html`** — standalone-HTML drafts from an
  earlier pass (self-contained pages). Kept for reference; the live site uses the
  `post_content` block pattern above, not standalone pages.

## Pending

- **Medicare event** (Janet Lambert / Lambert Insurance — Suncoast East, Tue Aug 11,
  2026, 2:00 PM). Ready to build as a `/…/` event page + Upcoming card, but needs:
  1. The **Medicare flyer uploaded to the WP Media Library** (the chat-pasted image
     can't be uploaded from here) — or a flyer URL.
  2. RSVP form decision: create a **new WPForms form** for it, or reuse an existing
     form id (each current event has its own: hospice `2416`, fall-prevention `2409`).
- **Wellness event** (SlimFit of Sarasota — Suncoast East, Aug 29, 2026). On hold:
  the flyer prints "Wednesday, August 29" but Aug 29, 2026 is a **Saturday** — needs a
  date decision — plus the flyer uploaded to Media.

## Publishing notes

- The site is behind SiteGround's bot-protection WAF; REST API calls need a
  browser-like `User-Agent` and may need a retry or two (HTTP 202 → captcha challenge
  means the request didn't reach WordPress — safe to retry).
- Auth is a revocable **Application Password** over the REST API (`/wp-json/wp/v2/`),
  not the account login. Rotate/revoke credentials after changes.
