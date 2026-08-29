# Backfill Timecards — visual thesis

## Direction: cassette-era reconstruction zine

Backfilling a week is closer to piecing together a mixtape than running a stopwatch: fragments are collected, labelled, rewound, and placed in order. The interface borrows the honest material language of a late-1980s cassette insert—warm paper, registration marks, hand-cut labels, blue ballpoint annotations, and a single fluorescent correction color—without turning the work surface into costume. Dense work rows feel like tracks on a side; the week summary is the handwritten track total.

This is an explicitly light, paper-like treatment. A dark theme would undermine the physical index-card metaphor, so the app paints every surface and sets `color-scheme: light`.

## Tokens

- Paper/background: `#F2E8D5` (aged invoice stock)
- Clean surface: `#FFFDF6` (fresh timecard)
- Ink/text: `#171717`
- Muted ink: `#5C564E`
- Tape blue/accent: `#155C78`; accent contrast `#FFFFFF`
- Correction coral: `#C83F36`
- Highlighter/success: `#426B3A`
- Warning: `#8A5200`
- Danger: `#A52A2A`
- Graphite rule: `#B7AA95`

All body and control combinations meet WCAG AA (4.5:1); fluorescent yellow is decorative only and never carries status.

## Type

- Display: `Arial Black`, `Arial`, sans-serif—compressed, blunt label-maker energy.
- Working copy and data: `ui-monospace`, `SFMono-Regular`, `Consolas`, monospace—tabular times and utilitarian annotations.
- No font files or third-party requests. Type steps: 14, 16, 20, 28, and clamp(32–52) px. Body is 16px minimum with 1.5 line height.

## Space, shape, and hierarchy

An 8px base rhythm with 4px for micro-spacing. Controls are at least 44px. Major regions use 16/24/32px gaps. Corners stay restrained (2–10px); slight offset shadows and dashed rules suggest stacked paper rather than generic floating cards. Day columns become a single vertical tape list at 820px so 390px phones prioritize entry and review over decoration.

## Interaction grammar

- A highlighter-yellow demo strip stays pinned above the paper workspace. It marks sample data clearly without changing the established cassette-insert surface.
- Adding a block resembles inserting a track: the row settles into its chronological slot and the weekly total updates.
- Source stamps—MANUAL, CALENDAR, PATTERN—make every block explainable; nothing claims inferred time.
- Destructive deletion names the block and offers Undo.
- Project selection recalls a saved client mapping but never invents billability or duration.
- Blue means a primary action; coral marks edit/correction; green communicates completed/ready states with text.
- The first screen leads with the freelancer's job and pairs the sample action with three tested facts. The cassette language remains visual rather than carrying instructions.

## Motion

State changes use a 180ms opacity/translate transition with physical origin from the relevant control. No looping animation. With `prefers-reduced-motion: reduce`, scrolling is instant and transforms/animations are removed; hierarchy remains through border, scale, and contrast.

## Original asset plan and provenance

One editorial hero still life clarifies the “reconstruct, don’t surveil” idea: a top-down cassette/timecard desk with seven labelled tracks, calendar scraps, pencil ticks, and no people or screens. It is atmosphere, not a depiction of automatic capability. The app icons are hand-authored SVG using the same cassette/timecard geometry.

Prompt sheet: “Top-down editorial still life, late-1980s cassette insert transformed into a weekly freelance timecard, seven ruled track lanes, blank paper labels, small calendar fragments, pencil and blue ballpoint marks, torn paper collage, subtle halftone and risograph texture, warm cream paper, deep black ink, muted tape blue, one coral correction sticker, tactile studio light, precise flat-lay composition, no legible text, no numbers, no people, no computer, no brand, no logo, no watermark.” Negative list: gradients, glossy 3D, neon cyberpunk, readable words, hands, faces, corporate dashboard, surveillance imagery, clocks as hero motif.

- Generated with the factory Azure image model (`factory-image`) on 2026-08-28. Original product asset; no third-party source material. Prompt stored beside the source image in `assets/src/hero-cassette.json`.
- Icons are original hand-authored SVG, created for this repository on 2026-08-28.
