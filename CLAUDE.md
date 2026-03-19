# CLAUDE.md — Shani Basa Website

This file provides guidance to Claude Code when working with code in this repository.

---

## Business Context

**Client:** Shani Basa
**Service:** Social Media Management & Video Content Creation & social photography for weddings and events
**Audience:** Small-to-medium Israeli businesses
**Goal:** Convert visitors into leads — every section should drive toward contact (WhatsApp / email)
**Tone:** Professional, warm, creative, dynamic, selling — like a talented creative you trust

**Critical elements — NEVER break:**
- WhatsApp link in `src/content/socials.ts` → `whatsappUrl`
- All Hebrew text content — never translate or remove
- `public/` videos and images — real client work samples
- `testimonials.json`, `faq.json` — real content, do not alter

---

## Stack

- **Framework:** React + TypeScript + Vite
- **Package manager:** Bun (`bun run dev`, lockfile `bun.lockb`)
- **Styling:** Tailwind CSS utilities + inline styles for dynamic/scroll-driven values
- **Language:** Hebrew RTL primary — always preserve `dir="rtl"` and RTL layout
- **Dev port:** 8080 — `bun run dev`
- **Path alias:** `@` → `./src`
- **Single page:** `/` → `pages/IndexTest.tsx`
- **i18n:** `useI18n()` from `@/i18n/simple`, default Hebrew, translations in `src/i18n/translations.ts`
- **Animations:** Framer Motion (component-level) + scroll-driven JS (`requestAnimationFrame` + `IntersectionObserver`)
- **Assets:** `public/` as `.webp`/`.mp4`
- **Live site:** https://shani-page.vercel.app/

---

## Rules for Every Task

1. **Never commit or push without explicit user approval**
2. **Plan before coding** — for multi-step tasks, write the plan and confirm before touching files
3. **Screenshot = law** — when a reference screenshot is provided, study it carefully before writing any code
4. **Preserve content** — Hebrew text, videos, images, testimonials, FAQ stay exactly as they are
5. **RTL always** — every component must work correctly in RTL
6. **Mobile + desktop** — always keep desktop behaviour unchanged when fixing mobile

---

## Design System

### Brand Personality
Warm, creative, premium, editorial. Not corporate. Not generic.

### Color Palette
```css
--color-cream:      #F5F0E8   /* main background */
--color-cream-dark: #EDE8DF
--color-ink:        #1A1814   /* main text */
--color-ink-muted:  #6B6560
--color-orange:     #D4622A   /* accent — CTAs, highlights, spine */
--color-accent:     #C8A882
--color-line:       rgba(26, 24, 20, 0.05)
```

### Orange Rule
Orange is an accent — not a theme. Use for: headline first line, CTA buttons, mono labels, SVG spines. **Never** make large text blocks or section titles orange.

### Typography
| Variable | Font | Use |
|---|---|---|
| `--font-display-en-hero` | Abril Fatface | EN section h2s — bold/impactful |
| `--font-display` | Frank Ruhl Libre 900 | HE section h2s |
| `--font-display-en` | Cormorant Garamond | EN elegant sub-headings |
| `--font-body` | DM Sans | All body text, buttons |
| `--font-mono` | IBM Plex Mono | Section labels, tags, metadata |

**h2 rule:** EN → `var(--font-display-en-hero)` weight 400; HE → Frank Ruhl Libre weight 900.
Sizes: `clamp(2.2rem, 4.5vw, 4.5rem)` mid-sections · `clamp(3rem, 7vw, 7rem)` large hero-style.

### Motion & Easing
- **Signature easing:** `cubic-bezier(0.35, 0, 0, 1)` — everywhere
- Scroll-driven animations: sticky outer div (250–320vh) + `getBoundingClientRect()` scroll handler
- Component animations: Framer Motion `motion.div`

---

## Page Structure (`pages/IndexTest.tsx`)

Order is load-bearing — ResultsReel spine exits at exact coordinates that Testimonials picks up:

```
HeroAbout       → cinematic hero + about (260vh desktop, stacked mobile)
WorkGrid        → 6-niche Lusion grid
ProcessTimeline → 5-step process (250vh desktop, simple list mobile)
ResultsReel     → SVG spine + video rise (280vh desktop, 180vh mobile)
Testimonials    → dark ink, spine continues (320vh desktop, 220vh mobile)
FAQ             → centered accordion
ContactBlock    → dark ink, WhatsApp CTA
StickyWhatsApp  → fixed bottom bar (mobile only)
Footer          → copyright — DO NOT TOUCH
```

---

## Mobile Strategy

**Breakpoint:** `window.innerWidth < 768` detected via `useState + useEffect` + `resize` listener.

**Pattern used in every component:**
```tsx
const [isMobile, setIsMobile] = useState(false);
useEffect(() => {
  const check = () => setIsMobile(window.innerWidth < 768);
  check();
  window.addEventListener('resize', check);
  return () => window.removeEventListener('resize', check);
}, []);
```

**Per-section mobile behaviour:**
| Section | Desktop | Mobile |
|---|---|---|
| HeroAbout | 260vh cinematic scroll | Static stacked (`md:hidden` / `hidden md:block`) |
| WorkGrid | 2-col grid, clipPath reveal | 1-col grid, opacity+y fade |
| ProcessTimeline | 250vh sticky circle | Simple vertical numbered list, no animation |
| ResultsReel | 280vh, video starts 105vh below | 180vh, video starts 50vh below, rises sooner |
| Testimonials | 320vh, 3-column cards | 220vh, 1-column cards |
| StickyWhatsApp | Hidden (`lg:hidden`) | Full-width green bar, `env(safe-area-inset-bottom)` |

**Critical mobile bug — clipPath + isMobile state switch:**
Framer Motion `initial` only applies on first mount. If `isMobile` switches after mount, the card keeps its first-render `initial` state. Always include `clipPath: 'inset(0 0 0% 0)'` in the `animate` (inView) target so it's explicitly reset regardless of starting state.

---

## Known CSS Gotchas

- **`overflow: hidden` breaks `position: sticky`** — use `overflow-x: clip` on `html` instead. `clip` clips visually without creating a scroll container.
- **SVG spine coordinates** — ResultsReel LTR spine exits at `M 1480 370` in `0 0 1400 800` viewBox. Testimonials LTR spine starts at exactly `M 1480 370` for visual continuity.
- **Accordion height animation** — can't animate `height: auto`. Measure with `bodyRef.current.scrollHeight` and animate to that px value.
- **Word-split reveal** — each word in `overflow: hidden` outer span + inner span with `translateY(110% → 0)`.
- **`bun` not in Claude bash PATH** — use `npx tsc --noEmit` to type-check. Run `bun run dev` from terminal manually.

---

## File Map

```
src/
├── pages/IndexTest.tsx          ← page order — change section order here
├── components/
│   ├── HeroAbout.tsx            ← Hero + About (combined cinematic scroll)
│   ├── work/WorkGrid.tsx        ← 6-niche portfolio grid
│   ├── ProcessTimeline.tsx      ← 5-step process
│   ├── ResultsReel.tsx          ← SVG spine + video reel
│   ├── Testimonials.tsx         ← client reviews
│   ├── FAQ.tsx                  ← accordion FAQ
│   ├── ContactBlock.tsx         ← final CTA section
│   ├── StickyWhatsApp.tsx       ← mobile fixed WhatsApp bar
│   ├── Footer.tsx               ← DO NOT TOUCH (copyright)
│   └── Analytics.tsx            ← Google Analytics
├── content/
│   ├── socials.ts               ← WhatsApp, Instagram, TikTok URLs ← CRITICAL
│   ├── faq.json                 ← FAQ Q&A — DO NOT ALTER
│   ├── testimonials.json        ← client reviews — DO NOT ALTER
│   ├── services.json            ← pricing packages
│   └── videoManifest.ts         ← auto-discovers public/videos/**/*.mp4
├── i18n/
│   ├── simple.tsx               ← useI18n() hook
│   └── translations.ts          ← all translated strings
└── index.css                    ← CSS vars, keyframes, scrollbar, overflow-x: clip
```

---

## Useful Commands

```bash
bun run dev        # Start dev server (port 8080)
bun run build      # Production build
bun run preview    # Preview production build
npx tsc --noEmit   # TypeScript check
```

---

## Phase Status

| Phase | Status | Summary |
|---|---|---|
| 1 — Foundation | ✅ Done | CSS vars, fonts, background texture |
| 2 — Hero + About | ✅ Done | Cinematic shared-element scroll, `HeroAbout.tsx` |
| 3 — Work Grid | ✅ Done | Lusion 6-niche grid, niche palettes, detail view |
| 4 — All sections | ✅ Done | Bold h2s, word-split reveals, spine animations, scrollbar fix |
| 5 — Mobile | ✅ Done | isMobile pattern, simplified layouts, StickyWhatsApp fix |
| 6 — Deploy & QA | ⬜ Next | Full device test, RTL audit, Vercel domain, performance |
