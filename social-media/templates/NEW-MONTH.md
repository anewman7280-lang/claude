# New Month Checklist — Suncoast Flyer Kit

Follow this to produce a new month's kit by hand (the automated routine does the
same steps). Target: **8 flyers** covering all 4 locations and a mix of themes.

## 1. Create the folder
```
content/<YYYY-MM>/
  flyers/   captions.md   calendar.md   exports/
```
Copy last month's `flyers/*.html` as starting points and edit the copy.

## 2. Pick the month's angles (aim for this mix)

| # | Type | Owner | Notes |
|---|------|-------|-------|
| 01 | Educational | Corporate | Evergreen family-guide topic (signs, questions to ask, how to choose) |
| 02 | Holiday/observance | Corporate | The month's main holiday (see list below) |
| 03 | Community + real photo | Suncoast Club | Resort/premium angle |
| 04 | Community + stock/illustration | Suncoast East | Home-like/memory-care angle |
| 05 | Community + real photo | Suncoast House | Intimate/family-style angle |
| 06 | Educational/seasonal | Corporate | Tie to the season (heat, flu, holidays, hydration) |
| 07 | Testimonial/social proof | Corporate | Rotate a real 5-star family quote |
| 08 | Holiday/fun engagement | Corporate + all | Lighthearted "national ___ day," ask a question |

Rotate topics each month so content stays fresh; keep all 4 locations covered.

## 3. Monthly holiday cheat-sheet (US senior-living friendly)

- **Jan** New Year · Nat'l Hobby Month · MLK Day
- **Feb** Valentine's Day · American Heart Month · Random Acts of Kindness
- **Mar** St. Patrick's Day · Nat'l Nutrition Month · first day of Spring
- **Apr** Easter · Nat'l Volunteer Month · Earth Day
- **May** Mother's Day · Older Americans Month · Memorial Day · Nurses Week
- **Jun** Father's Day · Alzheimer's & Brain Awareness Month · first day of Summer
- **Jul** Independence Day (4th) · Nat'l Ice Cream Day (3rd Sun) · heat safety
- **Aug** Nat'l Senior Citizens Day (21st) · Nat'l Wellness Month · back-to-school (grandkids)
- **Sep** Labor Day · Healthy Aging Month · Grandparents Day (1st Sun after Labor Day) · Fall Prevention Week
- **Oct** Halloween · Breast Cancer Awareness · Nat'l Physical Therapy Month
- **Nov** Thanksgiving · Nat'l Family Caregivers Month · Veterans Day · Alzheimer's Awareness Month
- **Dec** Christmas/Hanukkah · Nat'l Cookie Day · New Year's Eve · winter wellness

> Always confirm the exact date/weekday for the target year before baking it
> into a flyer or caption.

## 4. Build & render
- Edit each flyer's headline, list items, footer, and location.
- `node social-media/render.js <YYYY-MM>`
- Eyeball every PNG in `exports/`.

## 5. Captions & calendar
- Write FB / IG / GBP / LinkedIn captions in `captions.md` (see last month's format).
- Lay out `calendar.md` with 3–4 posts/week, all 4 locations represented.

## 6. Ship
- Commit and push to a `social-media/<YYYY-MM>` branch for review.
