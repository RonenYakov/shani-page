# Hero Phase 2 — Design Spec

**Date:** 2026-03-17
**Reference:** richardekwonye.com (layout/drag mechanic)
**Status:** Approved

---

## Overview

Replace `HeroWorking.tsx` with a new editorial hero: cream background, large orange headline, single draggable card stack that reveals a second photo when the top card is dragged off screen. A GSAP curtain transition wipes down on scroll to uncover the About section.

`HeroWorking.tsx` is NOT deleted — kept as fallback until Phase 2 is confirmed working.

---

## CSS Variables — Add to `src/index.css` first

Add this variable to the `:root` block (Phase 1 added the others):
```css
--color-orange: #D4622A;
```

Confirm Phase 1 is complete — the following must already exist in `src/index.css`:
- `--color-cream: #F5F0E8`
- `--color-line: rgba(26,24,20,0.05)`
- `--ease-brand: cubic-bezier(0.35,0,0,1)`
- `--font-body: 'DM Sans', sans-serif`
- `--font-mono: 'IBM Plex Mono', monospace`
- `--base-padding-x: max(5vw, 40px)`
- Body rule: `background-color: var(--color-cream)` + `repeating-linear-gradient` texture

Use `var(--color-orange)` everywhere in code — never hardcode `#D4622A`.

---

## Visual Design

### Typography
- **Mono label** (above headline): `font-family: var(--font-mono)`, `0.7rem`, uppercase, `letter-spacing: 0.15em`, color `var(--color-ink)` (`#1A1814`)
  - Hebrew: `ניהול סושיאל מדיה • תוכן וידאו`
  - English: `SOCIAL MEDIA MANAGEMENT • VIDEO CONTENT`
- **Headline:** `font-family: var(--font-body)`, weight 700, `clamp(2.8rem, 9vw, 7.5rem)`
  - Most words: `color: var(--color-orange)`
  - Last 2 words: `color: var(--color-ink)` (bold black for contrast)
  - Hebrew: `"סושיאל + וידאו"` (orange) + `"שמביא תוצאות"` (black)
  - English: `"Social + Video"` (orange) + `"that drives results"` (black)
- **Subtitle:** `font-family: var(--font-body)`, `1rem`, color `var(--color-ink-muted)` (`#6B6560`)

---

## Layout

### Z-index Stack (complete table)
| Layer | z-index |
|-------|---------|
| Nav bar | 30 |
| Headline block | 10 |
| Card 1 (top, idle) | 2 |
| Card 2 (bottom, static) | 1 |
| Card 1 (while dragging) | 20 |
| Curtain div | 5 |

Note: curtain (5) sits above cards (1–2) — this is intentional. The curtain covers the card stack as the user scrolls away. Cards are no longer interactive once the curtain begins to wipe.

### Hero section
```
position: relative
min-height: 200vh   ← extra scroll room for curtain trigger
overflow: hidden
```

### Nav bar
```
position: absolute; top: 0; left: 0; right: 0
padding: 1.5rem var(--base-padding-x)
display: flex; align-items: center; justify-content: space-between
z-index: 30
```
- RTL: logo on right (`order: 2`), language switcher on left (`order: 1`)
- LTR: logo on left (`order: 1`), language switcher on right (`order: 2`)
- Logo `shani-logo2.webp`: height `2.5rem` (40px)
- Language switcher pill buttons — **new cream-background styles**:
  - Inactive: `background: rgba(26,24,20,0.08); color: var(--color-ink); border-radius: 9999px; padding: 0.25rem 0.75rem`
  - Active: `background: var(--color-ink); color: white`

### Hero content area
```
position: sticky; top: 0
height: 100vh
padding-top: 6rem        ← clears nav
padding-inline: var(--base-padding-x)
display: flex; align-items: center
```
Sticky so content stays visible while the curtain scrolls away underneath.

### Headline block
```
position: relative
z-index: 10
max-width: 55%       ← desktop only, removed on mobile
```

### Card stack (desktop)
```
position: absolute
top: 50%; transform: translateY(-40%)
inset-inline-end: var(--base-padding-x)
z-index: 2
```

---

## Card Stack Component: `DraggableCard.tsx`

### Props
```tsx
interface DraggableCardProps {
  topImage: string    // path to top card image
  bottomImage: string // path to bottom card image
  isMobile: boolean   // disables drag when true
}
```

### Import path for i18n
```tsx
import { useI18n } from '@/i18n/simple'
```

### Dimensions
- Desktop: `width: 380px; height: 500px`
- Mobile: `width: 260px; height: 340px` (controlled by `isMobile` prop)

### Images
- Card 1 (top): `/story1.webp` — real asset, will be swapped for final photo later. Add `// TODO: replace with final hero image` comment.
- Card 2 (bottom): `/profile.webp` — real asset, same note.
- Both: `<img src={...} alt="" role="presentation" style={{ width:'100%', height:'100%', objectFit:'cover' }} />`
- Image loading state: render a `background: var(--color-cream-dark)` placeholder div until image loads. Use `onLoad` to swap.

### Card 1 — Drag logic
```tsx
// State
const [isRemoved, setIsRemoved] = useState(false)
const [isDragging, setIsDragging] = useState(false)
const [showHint, setShowHint] = useState(true)
const dragOrigin = useRef({ x: 0, y: 0 })
const cardControls = useAnimation()

// On drag start
const handleDragStart = () => {
  setIsDragging(true)
  setShowHint(false) // hide badge immediately, stays hidden
}

// On drag — check horizontal threshold only
const handleDrag = (_: PointerEvent, info: PanInfo) => {
  const dx = info.offset.x
  if (Math.abs(dx) > 180) flyOff(dx)
}

// Fly off — animate horizontally to off-screen in drag direction
const flyOff = (dx: number) => {
  const targetX = dx > 0 ? 2000 : -2000
  cardControls.start({
    x: targetX,
    transition: { duration: 0.35, ease: [0.35, 0, 0, 1] }
  }).then(() => setIsRemoved(true))
}

// On drag end — snap back if below threshold
const handleDragEnd = (_: PointerEvent, info: PanInfo) => {
  setIsDragging(false)
  if (Math.abs(info.offset.x) <= 180) {
    cardControls.start({ x: 0, transition: { duration: 0.4, ease: [0.35, 0, 0, 1] } })
  }
}
```

### Card 1 — z-index via state (not whileDrag)
```tsx
// zIndex managed via style prop, not whileDrag
style={{ zIndex: isDragging ? 20 : 2, cursor: isDragging ? 'grabbing' : 'grab', willChange: 'transform' }}
```

### Framer Motion props on Card 1
```tsx
<motion.div
  drag={isMobile ? false : 'x'}   // horizontal only
  animate={cardControls}
  dragElastic={0.08}
  dragTransition={{ bounceStiffness: 80, bounceDamping: 15 }}
  onDragStart={handleDragStart}
  onDrag={handleDrag}
  onDragEnd={handleDragEnd}
  style={{ zIndex: isDragging ? 20 : 2, cursor: isDragging ? 'grabbing' : 'grab', willChange: 'transform' }}
>
```

If `isRemoved`, render `null` for Card 1.

### Drag hint badge
```tsx
// Only visible on desktop, fades when drag starts
{!isMobile && (
  <motion.div
    animate={{ opacity: showHint ? 1 : 0 }}
    transition={{ duration: 0.2 }}
    style={{
      position: 'absolute', bottom: 12,
      insetInlineEnd: 12,    // RTL/LTR aware
      width: 48, height: 48,
      borderRadius: '50%',
      background: 'var(--color-orange)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none'
    }}
  >
    <span style={{ color: 'white', fontFamily: 'var(--font-mono)', fontSize: '0.55rem' }}>
      {language === 'he' ? 'גרור' : 'DRAG'}
    </span>
  </motion.div>
)}
```

---

## WhatsApp CTA

```tsx
<button
  onClick={() => window.open('https://wa.me/message/D4AOECDSG35YE1', '_blank')}
  style={{
    background: 'var(--color-orange)',
    color: 'white',
    borderRadius: '9999px',
    padding: '0.75rem 2rem',
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    border: 'none', cursor: 'pointer'
  }}
>
  {/* WhatsApp SVG — copy from HeroWorking.tsx */}
  {language === 'he' ? 'בואו נתחיל לעבוד יחד' : "Let's work together"}
</button>
```

Link `https://wa.me/message/D4AOECDSG35YE1` — **never change**.

---

## Micro-proof Chips

New styles for cream background (replace white/transparent from `HeroWorking.tsx`):
```css
background: rgba(26,24,20,0.06);
border: 1px solid rgba(26,24,20,0.12);
color: var(--color-ink);
border-radius: 9999px;
padding: 0.25rem 0.75rem;
font-size: 0.8rem;
```

---

## Curtain Transition (Desktop only — skip on `pointer: coarse`)

Last child of the hero section:
```tsx
<div
  ref={curtainRef}
  style={{
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: '100vh',
    background: 'var(--color-cream)',
    zIndex: 5,
    pointerEvents: 'none'
  }}
/>
```

GSAP in `useEffect`:
```tsx
// Only run on desktop
if (window.matchMedia('(pointer: coarse)').matches) return
// Respect reduced motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.set(curtainRef.current, { yPercent: 100 }) // skip animation, just hide curtain
  return
}
gsap.to(curtainRef.current, {
  yPercent: 100,
  ease: 'none',
  scrollTrigger: {
    trigger: heroRef.current,
    start: 'center center',
    end: 'bottom top',
    scrub: 1,
    scroller: window,
  }
})
// Cleanup
return () => ScrollTrigger.getAll().forEach(t => t.kill())
```

Import: `import { gsap } from 'gsap'` and `import { ScrollTrigger } from 'gsap/ScrollTrigger'` — tree-shaken, only these two.

---

## Mobile Layout

Detect: `const isMobile = window.matchMedia('(pointer: coarse)').matches`
Breakpoint for CSS layout: `< 768px` (Tailwind `md:` prefix)

On mobile (`< 768px` / `pointer: coarse`):
- Hero section: `min-height: 100vh` (no 200vh — no curtain scroll space needed)
- Content: `display: flex; flex-direction: column; align-items: center; text-align: center`
- Headline block: `max-width: 100%` (full width, no 55% constraint)
- Card stack: flows in document below headline, NOT absolutely positioned. `width: 260px; height: 340px; margin: 2rem auto 0`
- Drag disabled, badge hidden
- Below card: static label `"הזזי לצפייה בעבודות ←"` (Hebrew — `←` points left, indicating swipe-left gesture which is natural in RTL scroll lists) / English: `"Swipe to see work →"`
- Curtain: not rendered on mobile

---

## Accessibility & Reduced Motion

- Draggable card: `aria-label={language === 'he' ? 'גרור לגילוי עבודה נוספת' : 'Drag to reveal more work'}` on the motion.div
- Card images: `alt=""` + `role="presentation"` (decorative)
- GSAP curtain: skip animation if `prefers-reduced-motion: reduce` (see curtain section above)
- Drag interaction: no keyboard equivalent needed (decorative, not functional navigation)

---

## Files

| File | Action |
|------|--------|
| `src/index.css` | Add `--color-orange: #D4622A` to `:root` |
| `src/components/hero/HeroNew.tsx` | Create — hero shell, nav, headline, CTA, curtain |
| `src/components/hero/DraggableCard.tsx` | Create — card stack with drag logic |
| `src/pages/IndexTest.tsx` | Modify — swap `HeroWorking` → `HeroNew` |

---

## Non-Negotiables

- WhatsApp link `https://wa.me/message/D4AOECDSG35YE1` — never change
- `useI18n` from `@/i18n/simple` — language switcher and all text via this hook
- Logo `shani-logo2.webp` preserved
- All Hebrew text preserved
- `dir="rtl"` on the section root when `language === 'he'`
