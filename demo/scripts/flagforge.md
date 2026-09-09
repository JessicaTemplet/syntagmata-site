# FlagForge — walkthrough script

Target length: ~35-45s. Record at 1280x720 or higher, browser chrome hidden if possible.

| # | Action (what to click) | On-screen text callout | Timing |
|---|---|---|---|
| 1 | Land on empty dashboard | "FlagForge — feature flag management" | 0-3s |
| 2 | Point at "FLAGS" panel (empty state) | "No flags yet" | 3-5s |
| 3 | Click **+ New Flag** | "Create a flag" (small label pinned near the button on click) | 5-7s |
| 4 | Modal opens — type key `new-checkout-flow` | "Key: unique flag identifier" | 7-11s |
| 5 | Type description "Roll out new checkout UI" | "Optional description" | 11-14s |
| 6 | Point at Enabled checkbox | "Kill switch — toggle without deploying" | 14-17s |
| 7 | Point at Variants JSON box | "Variants: define arbitrary payloads per flag, not just on/off" | 17-22s |
| 8 | Click **+ Rule** | "Targeting rules — evaluated top to bottom, first match wins" | 22-27s |
| 9 | Fill in a rule (e.g. attribute = plan, value = enterprise → on) | "Ship to a segment before everyone" | 27-33s |
| 10 | Click **Save** | "Flag live immediately, no redeploy" | 33-36s |
| 11 | Back on dashboard — point at AUDIT LOG panel | "Every change is logged" | 36-40s |
| 12 | Toggle the flag off/on once | "Real-time — no deploy needed" | 40-43s |

**Notes for recording:**
- Do the cold-start wait *before* you hit record (or trim it in post) — viewers don't need to watch the Render spinner.
- Keep each callout on screen for the full duration of the action it labels, not just a flash.
- If your tool doesn't auto-zoom on click, manually zoom ~1.3x on the modal steps (4-10) so form fields are readable.
