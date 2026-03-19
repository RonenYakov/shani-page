# Mobile Fixes Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:executing-plans to implement this plan.

**Goal:** Fix four broken mobile UX issues while keeping the desktop version pixel-perfect.

**Architecture:** Each fix is isolated to one component. Mobile layouts are gated behind `window.innerWidth < 768` checks in JS (for scroll-driven sections) and CSS `@media (max-width: 767px)` or inline conditional styles using a React `isMobile` state.

**Tech Stack:** React, TypeScript, inline styles with ternary mobile guards, CSS `@media` in index.css

---

### Fix 1 — StickyWhatsApp: not centered

**File:** `src/components/StickyWhatsApp.tsx`

Problem: `pb-safe` Tailwind class isn't a standard utility; it may shift content. The bar is full-width but visual centering may be off due to padding asymmetry.

Fix: Replace `pb-safe` with explicit `paddingBottom: 'env(safe-area-inset-bottom, 0px)'` and ensure icon + text are truly centered.

---

### Fix 2 — WorkGrid: only 1 column on mobile

**File:** `src/components/work/WorkGrid.tsx`

Problem: Each card uses `gridColumn: 'span 6'` on a 12-col grid — on a 375px phone that's ~170px per card, too small.

Fix: Detect `isMobile` with `useState/useEffect` + `window.innerWidth < 768`. When mobile, set `gridTemplateColumns: '1fr'` and each card `gridColumn: 'span 1'`. Remove row-stagger margin on mobile.

---

### Fix 3 — ProcessTimeline: completely broken on mobile

**File:** `src/components/ProcessTimeline.tsx`

Problem: The component uses `position: sticky` + 250vh outer, a circular diagram with absolute percentage positioning, and text anchored via transform strings. On small screens the circle overflows and overlaps everything.

Fix: On mobile, render a completely different layout — NO sticky, NO circle, NO scroll animation. Instead: simple full-width vertical accordion-style numbered list. Each step shows immediately (no scroll-driven opacity). Height: `auto`. Keep the same data (STEPS_HE/EN), same heading, same cream background.

---

### Fix 4 — ResultsReel: video never arrives / text invisible on mobile

**File:** `src/components/ResultsReel.tsx`

Problem:
- Outer height `280vh` on mobile means the section takes 3× the screen height — the video starts at `translateY(window.innerHeight * 1.05)` and may not rise fully because scroll range is large relative to scroll budget.
- Font size `clamp(1.6rem, 2.8vw, 3.2rem)` → `2.8vw` on 375px = 10.5px → hits 1.6rem floor — this is fine. But the text lives inside the video container which starts far below the fold.

Fix: On mobile, reduce outer height to `160vh`, start video already partially in view (`translateY(50vh)` not `105vh`), and set `fontSize` of the title to `clamp(1.4rem, 5vw, 2rem)` for readability.

---
