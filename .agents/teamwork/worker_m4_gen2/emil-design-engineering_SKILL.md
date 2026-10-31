---
name: emil-design-engineering
description: >-
  Rules and design engineering standards inspired by Emil Kowalski (Linear/Vercel) for micro-interactions, spring animations, typography measure, hit areas, and snappy UI polish.
---

# Emil Kowalski Design Engineering Skill

Use this workflow to implement and polish high-craft web interactions.

## 1. Animation & Motion Rules
- **Speed Limit:** All UI transitions must resolve in `<= 300ms`.
  - Micro-interactions (hover, focus, active states): `100ms–150ms`.
  - Content disclosures, menus, dropdowns: `150ms–200ms`.
  - Modals, dialogs, drawers: `200ms–300ms`.
- **Entrance Scaling:** Never scale from `0`. Scale from `0.95` (`scale(0.95)` -> `scale(1)` with opacity `0` -> `1`).
- **Easing:** Never use `ease-in` on entrances. Use `ease-out` (`cubic-bezier(0.16, 1, 0.3, 1)`) or spring mechanics.
- **Button Feedback:** Instant active state compression: `:active { transform: scale(0.97); }`.
- **Performance:** Strictly animate `transform` and `opacity`. Never animate dimensions (`width`/`height`) or spacing (`margin`/`padding`).

## 2. Typography Standards
- **Line measure:** Body text capped at `65ch` (`max-w-prose`).
- **Tabular numbers:** Always add `font-variant-numeric: tabular-nums` or `tabular-nums` class on statistics, prices, timers, and aligned counters.
- **Letter-spacing:** Expand uppercase text letter spacing by `+0.05em` to `+0.1em`.
- **Underlines:** Hyperlinks only.

## 3. Hit Targets
- Ensure every clickable element is at least `44x44px` minimum hit area using padding or pseudo-elements.
