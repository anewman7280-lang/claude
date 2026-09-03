# Suncoast Senior Living — project memory

Working notes for maintaining events on the live WordPress site **suncoastsl.com**
(the "Suncoast Corp" site). Read this before creating or editing events.

## Event RSVP form routing (IMPORTANT — the core rule)

Every event gets its **own dedicated sign-up / RSVP page and its own RSVP form**.
The form's notification emails route by the **community that hosts the event**:

| Host community | RSVP notifications go to |
| --- | --- |
| **Suncoast East** | Carrie — `Cbonney@suncoasteastsl.com` **and** `life@suncoastsl.com` |
| **Suncoast House** | Lisa — `Lbeatty@suncoasthousesl.com` **and** `life@suncoasthousesl.com` |
| **Suncoast Club at Prestancia** | Steve — `sverdelli@suncoastclubsl.com` **and** `life@suncoastclubsl.com` |

- Match the host community, not the corporate site.
- The "questions can go to …" line in the RSVP section of each event page uses that
  community's coordinator address (Carrie / Lisa / Steve).
- Forms are **WPForms** (`[wpforms id="…"]` shortcode in the page). Existing form ids:
  East hospice `2416`, House fall-prevention `2409`. New WPForms forms must be created
  in **wp-admin → WPForms** (they can't be created through the REST API); set each new
  form's Notifications "Send To" to the two addresses above for its community.

## Community details (for Event Details cards)

| Community | Address | Phone | Site |
| --- | --- | --- | --- |
| Suncoast East | 2290 Cattlemen Road, Sarasota, FL 34232 | (941) 378-5757 | suncoasteastsl.com |
| Suncoast House | 3221 Fruitville Road, Sarasota, FL 34237 | (941) 955-7575 | suncoasthousesl.com |
| Suncoast Club at Prestancia | 3749 Sarasota Square Blvd, Sarasota, FL 34238 | (941) 922-1669 | suncoastclubsl.com |

Corporate: (941) 662-2507 · life@suncoastsl.com

## How events are built (the template / "rules")

- Each event = a WordPress **page** using the **`elementor_header_footer`** template,
  with the whole page as a self-contained **`<div class="soc-care">…</div>` block in
  `post_content`** (scoped `<style>` + inline HTML). Elementor supplies header/footer.
- Event detail page sections (see `events/_reference-todays-hospice.html`):
  split hero (flyer as the "poster" image) → About + Event Details card →
  "What to Expect" feature tiles (pull the 3–4 highlights from the flyer) →
  "Reserve Your Spot" RSVP section with the community's WPForms shortcode.
- Flyer image goes in the WP **Media Library**; hero poster + calendar link reference it.
- Brand tokens: `--navy:#1e3358`, `--accent/--orange:#c8621a`, `--cream:#faf7f2`;
  fonts Playfair Display (headings) + Open Sans (body).
- "Add to Calendar" = Google Calendar template link, times in **UTC** (Sarasota is
  ET; 2:00 PM ET = 18:00Z in summer/EDT).

## Events hub (`/events/`, page id 2393)

Two auto-sorting sections: **Upcoming Events** (top, soonest first) and **Past Events**
(bottom, most recent first). Each `.feature-ev` card has `data-start="YYYY-MM-DDTHH:MM"`;
an inline script splits Upcoming vs Past by today's date (cards also pre-sorted
server-side as a no-JS fallback). To add an event: copy a card into `#soc-upcoming-list`
with the right `data-start`. Deployed source: `events/wordpress-events-hub.html`.

## Publishing via REST API

- Endpoint `https://suncoastsl.com/wp-json/wp/v2/…`, auth via a revocable **Application
  Password** (never the account login). **Do not store credentials in this file or the repo.**
- Site is behind SiteGround's WAF: send a browser-like `User-Agent` and retry on
  HTTP 202 (captcha challenge = request didn't reach WordPress; safe to retry). Writes
  (POST/PUT) get challenged harder than reads — grind with a cookie jar + retries.
- Back up a page's current `content.raw` before overwriting it.

### IMPORTANT — the Events hub (page 2393) is an **Elementor** page

`_elementor_edit_mode` = `builder`, so the FRONT END renders `_elementor_data`, **not**
`post_content`. Editing `post_content` does nothing visible. The whole `.soc-care` hub
block lives in ONE Elementor **text-editor widget (id 37189351)** at
`_elementor_data[0].elements[0].settings.editor`. To update the hub:
1. GET `?context=edit&_fields=meta`, parse `_elementor_data` (JSON string), replace that
   widget's `editor` with the new block, PUT `{"meta":{"_elementor_data": "<json string>"}}`.
2. Keep `post_content` in sync (PUT `content`) so the repo copy matches.
3. **Flush Elementor's render cache**: `DELETE /wp-json/elementor/v1/cache`.
4. **Purge SiteGround cache**: `PUT /wp-json/siteground-optimizer/v1/purge-cache` `{}`.
   (SG also exposes enable/disable-memcache, autoflush-cache, etc. Don't toggle Memcached —
   disabling it can leave it off until re-enabled in Site Tools → Speed → Caching.)
5. Verify by fetching the public `/events/` (no auth). Individual event pages are plain
   `post_content` (not Elementor), so they publish normally and aren't page-cached (new URL).

## Live events on the site (verified) & open items

The events hub (`/events/`, page 2393) had been flattened by an editor save (all
`<div>`s + the auto-sort `<script>` stripped) — REBUILT and restored with the full
structure + auto-sort, all events, and correct Upcoming/Past. Deployed source:
`events/wordpress-events-hub.html`. Current events:

- **Effective Communication with People with Cognitive Challenges** (Still Alive Inside —
  Suncoast **House**, Thu Sep 24 2026, 3:30–4:00 PM): PUBLISHED at
  `/effective-communication/` (page id 2667) + Upcoming card. RSVP form is House `2409`
  (reused Fall-Prevention form — carries its email + **ECP CRM** lead flow). Flyer not
  yet uploaded (card uses 💬 placeholder). Source: `events/wordpress-effective-communication.html`.
- **Medicaid Long-Term Care Benefits** (Suncoast East, Sep 29 2026, 2:00 PM): live at
  `/medicaid-long-term-care/`, created outside this repo; preserved in the hub (Upcoming).
- **Wellness event** (SlimFit — Suncoast East, Wed Jul 29 2026): PUBLISHED `/wellness-slimfit/`
  (id 2528); flyer `wellness-flyer.png` now uploaded & used on the hub card. Form 2416 interim.
- **Medicare**: TWO pages exist — `/medicare-plans-options/` (id 2544, PUBLISHED, the live
  one; hub links here, flyer `medicare-flyer.png`) and my `/medicare-made-simple/` (id 2530,
  **DRAFT, redundant** — consider trashing). Do not publish the draft (would duplicate).
- Also live: `/todays-hospice/`, `/fall-prevention-virtusense/`, `/dont-get-tricked/`.

Open: upload flyers for the House event (and swap dedicated RSVP forms if wanted).
