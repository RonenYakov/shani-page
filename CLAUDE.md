# CLAUDE.md

# CLAUDE.md — Shani Basa Website

This file provides guidance to Claude Code when working with code in this repository.
--
## Business Context
**Client:** Shani Basa
**Service:** Social Media Management & Video Content Creation & social photography for weddings and events
**Audience:** Small-to-medium Israeli businesses
**Goal:** Convert visitors into leads — every section should drive toward contact (WhatsApp / email)
**Tone:** Professional, warm, creative, dynamic, selling — like a talented creative you trust

**Critical business elements that must ALWAYS be preserved:**
- WhatsApp contact button/link — never remove or break
- All CTAs that lead to contact (forms, buttons, links)
- Phone number and contact info
- All Hebrew text content — never translate or remove
- Existing videos and images in `public/` — these are real client work samples
- Testimonials content — real social proof, do not touch
- FAQ content — real customer questions

---

## Stack

- **Framework:** React + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Package manager:** Bun (`bun` commands, lockfile `bun.lockb`)
- **Language:** Hebrew (RTL) — always preserve `dir="rtl"` and RTL layout
- **Dev port:** 8080
- **Path alias:** `@` maps to `./src`
- **Single page:** `/` → `pages/IndexTest.tsx`
- **i18n:** `useI18n()` from `@/i18n/simple`, `t('key')` dot notation, default Hebrew, translations in `src/i18n/translations.ts`
- **UI primitives:** shadcn/ui in `src/components/ui/`
- **Animations:** Framer Motion (components) + GSAP (scroll/timeline)
- **Assets:** `public/` as `.webp`/`.mp4`, posters in `public/posters/`
- **Live site:** https://shani-page.vercel.app/

---

## ⚠️ ACTIVE REBRANDING — READ THIS FIRST

The site is undergoing a complete visual redesign. The content stays — only the presentation changes.

### Golden rules for this rebranding
1. **Plan before implementing** — always write out what you're going to do and get confirmation before touching files
2. **Never break working functionality** — WhatsApp links, contact CTAs, navigation anchors, i18n keys must survive every change
3. **Screenshot = law** — when a screenshot of a reference site is provided, study it carefully and match it as closely as possible before writing any code. Ask clarifying questions if anything is unclear.
4. **One phase at a time** — complete and verify each phase before starting the next
5. **Preserve content** — all Hebrew text, videos, images, testimonials, FAQ stay exactly as they are
6. **RTL always** — every new component must work correctly in RTL

### Sections being redesigned
| Section | Status | Notes |
|---------|--------|-------|
| Hero + About | ✅ Done | Cinematic shared-element scroll in `HeroAbout.tsx` |
| Work/Portfolio | ✅ Done | `WorkGrid.tsx` — 6 categories, niche palettes, Lusion layout |

### Sections to leave completely untouched
| Section | Reason |
|---------|--------|
| FAQ | Real customer questions — content and structure |
| Footer | Contains all contact links including WhatsApp |
| Testimonials | Real social proof — do not redesign without explicit ask |
| Navigation | Contains WhatsApp CTA — preserve all links |

---

## How to Work on This Project

### Before starting ANY task
1. Re-read the relevant section of this CLAUDE.md
2. If the task involves a new UI section → run `/superpowers:brainstorming` first
3. If the task involves multiple steps → run `/superpowers:writing-plans` and present the plan before touching code
4. If a screenshot is provided → study it carefully, identify: layout grid, spacing, typography, colors, animations, hover states. Then describe what you see and confirm with the user before implementing.

### When a screenshot is provided
This is the most important instruction for visual work:
- Treat the screenshot as the exact target
- Identify and note: column count, card sizes, font weights, spacing rhythm, border radius, color values, animation hints
- Do NOT approximate — if something is unclear in the screenshot, ask
- Build a pixel-faithful version, then adjust for RTL and Hebrew content
- Use Stitch MCP to generate a mockup draft first if building from scratch

### After completing any task
Always run `/superpowers:verification-before-completion` before saying you're done.

---

## New Brand Direction

### Personality
Warm, creative, premium, editorial. Not corporate. Not generic. Alive and confident.

### Color Palette
```css
:root {
  /* Backgrounds */
  --color-cream: #F5F0E8;
  --color-cream-dark: #EDE8DF;
  --color-off-white: #FAF8F4;

  /* Text */
  --color-ink: #1A1814;
  --color-ink-muted: #6B6560;

  /* Accents */
  --color-orange: #D4622A;  /* added Phase 2 — accent only, see orange rule below */
  --color-accent: #C8A882;
  --color-accent-dark: #A8845A;
  --color-line: rgba(26, 24, 20, 0.05);

  /* Interactive (Lusion-derived) */
  --color-blue: #1a2ffb;
  --color-grey-blue: #2b2e3a;

  /* Layout */
  --grid-gap: 2vw;
  --grid-space: calc((100% - 11 * var(--grid-gap)) / 12);
  --global-border-radius: 16px;
  --base-padding-x: max(5vw, 40px);
  --base-padding-y: clamp(30px, 4vw, 50px);
}
```

### Typography
- **Display/body:** `DM Sans` (400/500) — warm, modern, readable in Hebrew
- **Labels/tags/mono:** `IBM Plex Mono` — for categories, dates, small metadata
- **Scale:** always fluid — `clamp()` + `vw` units for headings, never fixed `px`
- Import both from Google Fonts in `index.html`

### Background Texture
Warm cream with very subtle vertical lines — barely visible, atmospheric:
```css
body {
  background-color: var(--color-cream);
  background-image: repeating-linear-gradient(
    90deg,
    var(--color-line) 0px,
    var(--color-line) 1px,
    transparent 1px,
    transparent 80px
  );
}
```
Lines opacity should be 4–6%. If it looks like notebook paper, it's too strong.

### Orange Usage Rule
**Orange is an accent, not a theme.** Use for: headline first line, CTA buttons, mono labels (e.g. "ABOUT"). Keep headings and body text in `--color-ink`. Never make large text blocks or section titles orange — user feedback: "a bit more black".

### Motion & Easing
- **Signature easing:** `cubic-bezier(0.35, 0, 0, 1)` — use this everywhere
- Framer Motion for component animations
- GSAP for scroll-triggered and timeline sequences
- Animations feel physical and weighted — not bouncy, not instant

---

## Hero + About — Cinematic Shared Element (✅ IMPLEMENTED)

**File:** `src/components/HeroAbout.tsx` — replaces both `HeroNew.tsx` and `About.tsx` in `IndexTest.tsx`.

### Mechanic
Single scroll section (`minHeight: 260vh`, sticky inner `100vh`). One image morphs from Hero to About as you scroll.

- Image (`/profile.webp`) starts RIGHT side, small (`scale: 0.65`), grows to full size (`scale: 1.0`) in About state
- Image x: stays on right — `+22vw` LTR / `-22vw` RTL — barely moves horizontally
- Hero text fades out at scroll progress `0.22–0.42`; About text fades in at `0.54–0.78`
- Mobile: static stacked layout, no scroll animation — `hidden md:block` / `md:hidden`
- **TODO:** swap `HERO_IMAGE` constant in `HeroAbout.tsx` for a background-removed PNG cutout

### RTL + useTransform pattern
Always declare both LTR and RTL transform values at the top level, then pick with a ternary. Never use computed property keys inside `useTransform` arrays:
```tsx
const imageXLTR = useTransform(scrollYProgress, [0, 0.35, 0.78], ['22vw', '22vw', '20vw'])
const imageXRTL = useTransform(scrollYProgress, [0, 0.35, 0.78], ['-22vw', '-22vw', '-20vw'])
const imageX = isRTL ? imageXRTL : imageXLTR
```

### Framer Motion gotcha
`whileDrag={{ zIndex: N }}` does **not** work — Framer Motion cannot animate zIndex. Manage it via React state + inline `style` prop instead:
```tsx
style={{ zIndex: isDragging ? 20 : 2 }}
```

---

## Work Section Spec — Lusion Grid

**Reference:** lusion.co — exact measurements below

### Grid measurements (at 919px viewport)
- Section padding: `46px` sides, `37px` top/bottom
- 12-column grid, `2vw` gap
- Each card: `span 6` = 2 per row, `65%` aspect ratio via `padding-top: 65%`
- Row 3+ stagger: `margin-top: 5em` (NOT CSS `row-gap`)
- `border-radius: 15px` on `.project-item-main` only

### Typography in cards
- Section title: `8vw`, weight 400, `letter-spacing: -0.02em`, `line-height: 0.9`
- Tags (line-1): `0.9vw`, IBM Plex Mono, uppercase, `opacity: 0.85`
- Project name (line-2): `3vw`, `letter-spacing: -0.01em`

### Hover behavior
- Image: `scale(1.03)` with `0.6s cubic-bezier(0.35, 0, 0, 1)`
- Arrow icon slides in from left
- Title text shifts right to make room

### Card data fields
```ts
interface WorkItem {
  tags: string       // e.g. "סושיאל מדיה • ווידאו • תוכן"
  title: string      // Client or project name (Hebrew)
  asset: string      // path to image/video in public/
  type: 'image' | 'video'
}
```

---

## File Structure

```
shani-page/
├── components/
│   ├── HeroAbout.tsx            ← Hero + About combined (cinematic scroll) ✅ ACTIVE
│   ├── hero/
│   │   ├── HeroNew.tsx          ← superseded, kept as reference
│   │   └── DraggableCard.tsx    ← superseded, kept as reference
│   ├── work/
│   │   └── WorkGrid.tsx         ← Lusion-style grid (Phase 3 — next)
│   ├── About.tsx                ← superseded by HeroAbout.tsx
│   ├── FAQ.tsx                  ← DO NOT TOUCH
│   ├── Footer.tsx               ← DO NOT TOUCH (WhatsApp link lives here)
│   ├── HeroWorking.tsx          ← OLD fallback, do not use
│   └── Testimonials.tsx         ← DO NOT TOUCH
├── styles/
│   └── globals.css              ← CSS variables + background texture go here
├── content/
├── hooks/
├── i18n/
├── pages/
│   └── IndexTest.tsx            ← swap sections here during rebranding
├── utils/
├── App.tsx
├── main.tsx
└── index.html                   ← add Google Fonts here
```

---

## Code Standards

```tsx
interface Props {
  title: string
  isVisible?: boolean
}

const MyComponent = ({ title, isVisible = true }: Props) => {
  return <div>{title}</div>
}

export default MyComponent
```

- TypeScript interfaces for all props — no `any`
- `const` over `let`
- Components under 150 lines — split if longer
- One component per file
- RTL: use `dir="rtl"`, logical CSS props (`margin-inline-start` etc.)

---

## Performance Targets

| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| FID / INP | < 100ms |
| CLS | < 0.1 |

**Rebranding performance notes:**
- Drag cards: `will-change: transform`, avoid layout thrashing
- Images: `.webp`, lazy load below fold
- Fonts: `font-display: swap`, preload critical weights
- GSAP: tree-shake — only import what's used
- Run `npx vite-bundle-visualizer` after each phase

---

## Skills — When to Use

| Situation | Skill |
|-----------|-------|
| Before any new section or component | `/superpowers:brainstorming` |
| Before any multi-step task | `/superpowers:writing-plans` |
| Building or redesigning any UI | `/frontend-design` |
| Screenshot provided as reference | `/frontend-design` + study screenshot first |
| After completing any feature | `/superpowers:verification-before-completion` |
| Bug or unexpected behavior | `/superpowers:systematic-debugging` |
| Cleaning up or refactoring | `/simplify` |

---

## MCP Tools — When to Use

### Stitch (`mcp__stitch__*`)
AI UI design generation. Use **before implementing** any new section.

Workflow:
1. `create_project` — set up a Stitch project
2. `generate_screen_from_text` — generate mockup from description
3. `get_screen` — retrieve the design
4. Review with user → then implement in code

Use for: Hero layout drafts, Work grid, About layout.

### nano-banana (`mcp__nano-banana__*`)
AI image generation via Gemini (512px–4K).

Use when: New visual assets or background images are needed.
Do NOT use for: existing client work — those come from `public/`.

---

## Rebranding Execution Plan

**Rule: plan → confirm → implement → verify. Never skip to code.**

### Phase 1 — Foundation ✅ DONE
CSS variables, Google Fonts (DM Sans + IBM Plex Mono), background texture.

### Phase 2 — Hero + About ✅ DONE
`HeroAbout.tsx` — cinematic shared-element scroll transition. Image morphs from Hero to About on scroll.

### Phase 3 — Work Grid ✅ DONE
`src/components/work/WorkGrid.tsx` — 6 categories, 2-col Lusion grid, per-niche palette shifts on expansion, layoutId morph, horizontal gallery scroll. Old carousels (HotelsVideoCarousel, BrandsVideoCarousel, WeddingsVideoGallery) removed.

### Phase 4 — Integration & Polish ⬜ ← NEXT
- [ ] Swap sections in `IndexTest.tsx`
- [ ] Full RTL audit
- [ ] All links and WhatsApp CTAs working ✓
- [ ] Performance audit
- [ ] Mobile + cross-browser check
- [ ] Deploy to Vercel and verify

---

## Useful Commands

```bash
bun run dev        # Start dev server (port 8080)
bun run build      # Production build
bun run preview    # Preview production build
bun run lint       # Lint
npx tsc --noEmit   # TypeScript check (bun not in PATH in bash — use npx)
npx vite-bundle-visualizer  # Bundle size check
```

---

## Notes & Learnings

> Claude updates this after each session.

- Project started: March 2026
- Stack confirmed: React + TypeScript + Vite + Bun ✅
- Rebranding started: March 2026
- Design direction: Warm cream + vertical lines + cinematic scroll transitions
- References: theboathouse.agency (stacking/cinematic scroll), lusion.co (work grid)
- WhatsApp link location: Footer.tsx — never break this
- Hero + About merged into single `HeroAbout.tsx` — shared scroll context is required for shared-element transitions; two separate components cannot share a `useScroll` ref
- Orange rule: accent only — headline line 1, CTA buttons, mono labels. Headings stay `--color-ink`.
- WorkGrid niche palettes: each `WorkItem` has a `paletteKey` → `NichePalette` (bg, accent, heading, body, muted, divider, scrollbar) — detail view reads from it for full color shift
- Old carousels removed: `HotelsVideoCarousel`, `BrandsVideoCarousel`, `WeddingsVideoGallery` no longer in `IndexTest.tsx`
- Stitch MCP (`mcp__stitch__generate_screen_from_text`) returned empty in testing — don't block on it, design directly if it fails
- `bun` not in shell PATH during Claude Code bash sessions — use `npx tsc --noEmit` to type-check; run `bun run dev` from terminal manually