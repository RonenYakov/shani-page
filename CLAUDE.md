## Task Execution
- For timed or urgent tasks, produce a minimal working script first, then iterate — avoid lengthy DOM exploration or brainstorming up front
- Never echo, log, or commit API keys; if a key is needed, ask the user to paste it into a .env file

## Workflow
- After rewriting a file, diff against the previous version to confirm no functions (e.g., dismiss_ticker) were accidentally removed
- Commit and push after each completed feature unless told otherwise
- Keep CLAUDE.md concise: remove completed steps once verified

## Environment
- OS: Windows (use PowerShell syntax, not bash)
- Always activate the venv before running Python/Streamlit commands
- Avoid folder/path names containing '&' as they break npm script chaining on Windows
- For interactive CLI installers (npx, gh auth login), instruct the user to run them directly in their terminal

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
- **Language:** Hebrew-only (i18n removed 2026-06; remaining `language`/`isHe`/`isRTL` ternary machinery fully stripped 2026-06). **English section headers, Hebrew body content.** Section titles/labels are hardcoded English; all body copy is hardcoded Hebrew with per-element `dir="rtl"`. `index.html` sets `<html lang="he" dir="rtl">`. There is NO `useI18n`/provider/translations and NO `language`/`isHe` locals anymore — do not reintroduce them. Hebrew strings are written directly into JSX; `dir="rtl"` is hardcoded per element. (Inert `*En`/`en` fields still linger in `WorkGrid` `WORK_ITEMS`/`FEATURED` data and `ProcessTimeline` `STEPS` — unused by the UI, safe to delete if a fully clean data shape is wanted.)
- **Dev port:** 8080 — `bun run dev`
- **Path alias:** `@` → `./src`
- **Routes (`App.tsx`):** `/` → `pages/IndexTest.tsx` (main scroll) · `/process` → `pages/Process.tsx` · `/faq` → `pages/Faq.tsx`. Process & FAQ were pulled OFF the main page (2026-06) to shorten it — reachable via Hero nav (`<Link>`) + Footer nav. Sub-pages wrap their section with `components/SubPageNav` (Back/brand bar) + StickyWhatsApp + Footer.
- **Animations:** Framer Motion (component-level) + scroll-driven JS (`requestAnimationFrame` + `IntersectionObserver`)
- **Assets:** `public/` as `.webp`/`.mp4`
- **Live site:** https://shani-page.vercel.app/

---

## Rules for Every Task

> **⭐ CMS / learning work (the `server/` backend + `/admin` dashboard):** the owner is learning
> full-stack development and **writes ALL the code themselves — logic, markup, AND CSS.** Do NOT
> author code for them (no "mechanical"/CSS exception). Guide, explain the *why*, give small
> writable specs, review — but they type every line. The real goal is **understanding the whole
> system end-to-end**, not a finished feature. Full teaching contract: `docs/cms/CMS-BUILD-LOG.md` §1.

1. **Never commit or push without explicit user approval**
2. **Plan before coding** — for multi-step tasks, write the plan and confirm before touching files
3. **Screenshot = law** — when a reference screenshot is provided, study it carefully before writing any code
4. **Preserve content** — Hebrew text, videos, images, testimonials, FAQ stay exactly as they are
5. **RTL always** — every component must work correctly in RTL
6. **Mobile + desktop** — always keep desktop behaviour unchanged when fixing mobile

---

## Design System

> **2026-06 redesign COMPLETE** — ALL sections now use the NEW design language
> (see "New Design Language" below). Design skills stack: `my-design-style` (lead) + `impeccable`
> (review/execution pass — used for the About rework and the CMS `/admin` dashboard) + inspo files in
> `C:\Users\97254\Desktop\shani-portfolio\project\` (Shani.html = hero, sections.jsx = about/work).
> `/contact-ribbon.webp` is an AI-generated backdrop (Higgsfield nano_banana) for the Contact finale.
>
> **Gotcha:** word-mask headline reveals (`initial y:110%` inside `overflow:hidden` span) must be
> driven by a `useInView` observer on the **h2 itself** — never `whileInView` on the clipped span
> (a clipped element never intersects, so it never animates). Also never put JSX `{" "}` between
> word spans — trailing spaces inside inline-blocks collapse; word gaps come from
> `.xx-word:not(:last-child){margin-right:0.24em}`.

### New Design Language (Hero / About / Work)
- **Background:** full white `#fff` (hero: light radial gradient)
- **Accent (2026-06 "gentle" pass):** bright rose `#F2B1B1` is THE accent everywhere (`--rose` in every scoped section). Deeper companion `#E08F8F` (`--rose-deep`) only where tiny text/open-state text needs contrast on white (hero badge text, FAQ open question). The old dusty `#9A6F86` is retired.
- **Display fonts:** section h2s still Archivo 800/900 uppercase, BUT the hero headline is now gentle/feminine: kicker "Social Media" + giant "MANAGER" in **Cormorant Garamond** (kicker italic 600, giant 500 uppercase, letter-spacing +0.015em), caption "Perfection" italic Cormorant. Mobile menu links also italic Cormorant.
- **Hebrew display font:** **Noa Shalev** (calligraphic serif, AlefAlefAlef) — local `/fonts/noa-shalev.woff2`, `--font-he-display` + `--font-display` in index.css. Applied to: About lead, Contact sub, FAQ question text. Long Hebrew body + chat bubbles stay on `--font-body`. Source pack: `C:\Users\97254\Desktop\fonts\hebrew fonts\` (Maarvon=western slab, Sagite demo=no Hebrew glyphs, StamSefarad=religious — all rejected).
- **Language:** section headers/labels English LTR · body copy Hebrew RTL (`dir="rtl"` per element)
- **Motifs:** hairline crosses, mono chips with rose dot, giant word-mask reveals, film grain
- **Sections are scoped:** `.shani-hero` (Hero.css), `.shani-about` (About.css), `.shani-work` (WorkGrid.css)

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

## Page Structure

Sections are self-contained (each scopes its own `.shani-*` CSS); no cross-section spine handoff anymore. Page was shortened 2026-06 — Process & FAQ moved to their own routes.

**Main page (`pages/IndexTest.tsx`):**
```
Hero          → "SHANI · Social Media Manager" light cinematic hero (Hero.tsx)
About         → "Stories that stop the scroll" — label + Hebrew lead + giant headline + 4 staggered parallax tiles
WorkGrid      → "The Work" — 4 featured cards (FEATURED config), staggered heights, hover flex-expand, mobile snap carousel. WORK_ITEMS still holds all 6 niches + 'ugc'; savethedate/hotels/brands kept in data but not rendered. DetailView overlay unchanged.
ResultsReel   → "Real Results" — giant outlined marquee + thin rose spine draw, recomendations.mp4 frame rises on scroll (170vh desktop / 150vh mobile)
Testimonials  → "Word of Mouth" — LIGHT warm-cream (#F1EBE4) WhatsApp-style chat: 3 REAL convos (CHATS array, transcribed, NO names), white bubbles, typing-dots → spring-pop, blue ✓✓ ticks. (placeholder testimonials.json + screenshot marquee removed)
ContactBlock  → "Let's Talk" — dark finale over /contact-ribbon.webp (the page's single dramatic dark moment), word marquee, magnetic WhatsApp CTA, mono feature chips, rotating badge
HomeButton    → frosted "SHANI" pill, fixed top-left, fades in after hero, smooth-scrolls to top (HomeButton.tsx, main page only)
StickyWhatsApp→ fixed bottom bar (mobile only)
Footer        → copyright + secondary nav — DO NOT alter copyright text
```

**Sub-pages:** `pages/Process.tsx` (ProcessTimeline — "The Process" horizontal filmstrip) · `pages/Faq.tsx` (FAQ — "Questions?" accordion). Both wrapped in `SubPageNav` + StickyWhatsApp + Footer.
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

**Mobile hero (2026-06 mobile pass):**
- Giant "MANAGER" sized `clamp(3rem, 16.5vw, 7rem)` + `white-space: nowrap` — 16.5vw is the max that fits 7 Cormorant caps in 88vw; the old Archivo 30vw overflowed badly.
- Touch devices get **scroll-driven parallax** (headline rises/fades, figure drifts+scales) instead of mouse parallax — branch on `(pointer: coarse)` in Hero.tsx.
- Burger now opens a real **full-screen mobile menu** (`.mobile-menu`, z-index 8, blurred rose-tinted backdrop, staggered italic Cormorant links + rose CTA). It needs its own X close button — the burger lives in `.ui` (z 3) and is buried under the overlay.
- Caption gets a frosted pill on mobile (readability over the photo); animated "scroll" hint in white over the figure; both sit `74px+` above bottom to clear the sticky bar.
- StickyWhatsApp is now **rose** (`#F2B1B1→#E89E9E`, ink text) and slides in only after `scrollY > 45vh`, with touch press scale feedback.
- Hero "Let's Work" CTAs (topbar + mobile menu) open `socials.whatsappUrl`.

**Screenshot tooling:** `scripts/shot.mjs` + `scripts/fontcheck.mjs` (puppeteer-core via system Edge, dev server on :8080, output → `../screenshots/`). Install with `npm i --no-save puppeteer-core`.

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
│   ├── Hero.tsx / Hero.css      ← cinematic hero
│   ├── About.tsx / About.css    ← "Stories that stop the scroll"
│   ├── work/WorkGrid.tsx + .css ← "The Work" 4 featured cards (+ DetailView overlay)
│   ├── ProcessTimeline.tsx+.css ← "The Process" horizontal filmstrip
│   ├── ResultsReel.tsx + .css   ← "Real Results" marquee + rising video
│   ├── Testimonials.tsx + .css  ← "Word of Mouth" chat bubbles
│   ├── FAQ.tsx + .css           ← "Questions?" accordion
│   ├── ContactBlock.tsx + .css  ← "Let's Talk" final CTA section
│   ├── StickyWhatsApp.tsx       ← mobile fixed WhatsApp bar
│   ├── Footer.tsx               ← DO NOT TOUCH (copyright)
│   └── Analytics.tsx            ← Google Analytics
├── content/
│   ├── socials.ts               ← WhatsApp, Instagram, TikTok URLs ← CRITICAL
│   ├── faq.json                 ← FAQ Q&A — DO NOT ALTER
│   ├── testimonials.json        ← client reviews — DO NOT ALTER
│   ├── services.json            ← pricing packages
│   └── videoManifest.ts         ← auto-discovers public/videos/**/*.mp4
└── index.css                    ← CSS vars, keyframes, scrollbar, overflow-x: clip
   (i18n/ removed — site is Hebrew-only, English headers hardcoded)
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



