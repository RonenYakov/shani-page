# Shani Page — Complete Project Guide
### Everything you need to understand, edit, and grow from this codebase

---

## Table of Contents

1. [Big Picture — What Is This Site?](#1-big-picture)
2. [How the Code Is Organized](#2-code-structure)
3. [The Tech Stack — Every Tool Explained](#3-tech-stack)
4. [CSS & Styling System](#4-css--styling-system)
5. [Fonts — Why We Chose Each One](#5-fonts)
6. [Colors — The Brand Palette](#6-colors)
7. [The Language System (Hebrew / English)](#7-language-system)
8. [Every Component — What It Does & Why](#8-components)
9. [How to Change Text](#9-how-to-change-text)
10. [How to Change Photos](#10-how-to-change-photos)
11. [How to Change Videos](#11-how-to-change-videos)
12. [Buttons & CTAs — How They Work](#12-buttons--ctas)
13. [Animations — How They Work](#13-animations)
14. [The Logic We Used (Design Thinking)](#14-the-logic-we-used)
15. [What Can Be Improved](#15-what-can-be-improved)
16. [Glossary — Terms Every Developer Should Know](#16-glossary)

---

## 1. Big Picture

This is a **single-page marketing website** for Shani Basa — a social media manager and video content creator based in Israel.

**The goal of the site:**
- Build credibility and showcase real work
- Explain her process and pricing
- Generate leads (WhatsApp conversations, booking calls)

**The audience:**
- Israeli small-to-medium business owners (primary, Hebrew)
- International English-speaking clients (secondary)

**How it converts:**
Every section is designed to move a visitor one step closer to clicking the WhatsApp button. The flow is:
> Hero (who she is) → Work Grid (proof) → Process (how it works) → Results (what clients get) → Testimonials (social proof) → FAQ (remove objections) → Contact (take action)

---

## 2. Code Structure

```
shani-page-main/
│
├── index.html              ← The single HTML file the browser loads
├── src/
│   ├── main.tsx            ← Starts everything (like pressing "on")
│   ├── App.tsx             ← Wraps the whole app in providers
│   ├── index.css           ← Global styles, CSS variables, fonts
│   │
│   ├── pages/
│   │   └── IndexTest.tsx   ← The actual page layout (all sections in order)
│   │
│   ├── components/         ← Every visual section lives here
│   │   ├── HeroAbout.tsx
│   │   ├── work/WorkGrid.tsx
│   │   ├── ProcessTimeline.tsx
│   │   ├── ResultsReel.tsx
│   │   ├── Testimonials.tsx
│   │   ├── FAQ.tsx
│   │   ├── ContactBlock.tsx
│   │   ├── StickyWhatsApp.tsx
│   │   ├── Footer.tsx
│   │   └── ui/             ← Ready-made UI building blocks (buttons, cards...)
│   │
│   ├── content/            ← All the real data (text, links, FAQ answers...)
│   │   ├── socials.ts      ← WhatsApp, Instagram, TikTok links
│   │   ├── faq.json        ← FAQ questions and answers
│   │   ├── testimonials.json ← Client reviews
│   │   ├── services.json   ← Pricing packages
│   │   └── videoManifest.ts ← Auto-discovers all videos
│   │
│   └── i18n/               ← Language switching (Hebrew ↔ English)
│       ├── simple.tsx      ← The hook you use in every component
│       └── translations.ts ← All translated text strings
│
└── public/                 ← Static files (images, videos)
    ├── profile.webp        ← Shani's profile photo
    ├── posters/            ← Thumbnail images for the work grid
    └── videos/             ← All video files
```

**The key mental model:**
- `content/` = the data (what to show)
- `components/` = the presentation (how to show it)
- `i18n/` = the language layer (in which language)
- `public/` = raw media files (images, videos)

---

## 3. Tech Stack

### React
**What it is:** A JavaScript library for building UIs as reusable pieces called "components."

**Why we use it:** Instead of writing one giant HTML file, we write small focused components (like `<FAQ />`, `<ContactBlock />`). Each component manages its own state (open/closed, revealed/hidden) and only re-renders when something changes.

**Key concept — JSX:** React uses JSX, which looks like HTML inside JavaScript:
```jsx
const Title = () => <h1 style={{ color: "red" }}>Hello</h1>;
```

---

### TypeScript
**What it is:** JavaScript with type annotations.

**Why we use it:** Catches bugs before they run. If you write `color: 123` when the code expects `color: "string"`, TypeScript tells you immediately rather than showing a bug in the browser.

**Example:**
```typescript
// This tells TypeScript what shape an FAQ item must have
type FaqItem = {
  id: string;
  question: { he: string; en: string };
  answer: { he: string; en: string };
};
```

---

### Vite
**What it is:** The build tool that compiles and serves the project.

**Why we use it:** It's extremely fast. `bun run dev` starts a local server at `http://localhost:8080`. When you save a file, the browser updates instantly (Hot Module Replacement).

**Key commands:**
```bash
bun run dev      # Start development server
bun run build    # Build for production (creates /dist folder)
bun run preview  # Preview the production build locally
```

---

### Tailwind CSS
**What it is:** A utility-first CSS framework. Instead of writing separate CSS files, you add classes directly in HTML/JSX.

**Why we use it:** Speed. Instead of:
```css
.my-button { display: flex; align-items: center; padding: 1rem; }
```
You write:
```jsx
<button className="flex items-center p-4">
```

**Important:** In this project, the major sections use **inline styles** (not Tailwind) because they need dynamic values from JavaScript (scroll position, animation progress). Tailwind handles small utility things.

---

### Framer Motion
**What it is:** A React animation library.

**Why we use it:** Smooth, physics-based animations. `motion.div` wraps any element and gives it animation superpowers.

**How it's used in this project:**
- Word-by-word text reveals (`motion.span`)
- Card entry animations (`clipPath` bottom wipe)
- Hover effects (bottom-slide overlay)

**Example from WorkGrid:**
```jsx
<motion.span
  initial={{ y: '110%' }}    // starts below (invisible)
  animate={{ y: 0 }}          // animates to natural position
  transition={{ delay: i * 0.13 }}  // each word is staggered
>
  {word}
</motion.span>
```

---

### GSAP (GreenSock)
**What it is:** A professional animation library used for scroll-driven animations.

**Why we use it:** Framer Motion is great for component-level animations. GSAP is better for tying animation progress to scroll position, which we use in ProcessTimeline and ResultsReel.

**Pattern we use:**
```javascript
// As user scrolls, dwell goes from 0 to 1
const dwell = scrolled / totalHeight;
// Then we map that to opacity, position, etc.
element.style.opacity = Math.min(1, dwell * 5);
```

---

### React Router
**What it is:** Handles navigation between pages.

**Why we use it:** This site only has one page (`/`), but the router also handles the 404 page (`*` route → NotFound component).

---

## 4. CSS & Styling System

All global styles live in `src/index.css`. This is the most important file for visual identity.

### CSS Variables
CSS variables (custom properties) let you define a value once and reuse it everywhere. They start with `--`.

```css
:root {
  --color-orange: #D4622A;
  --font-body: 'DM Sans', sans-serif;
  --base-padding-x: max(5vw, 40px);
}
```

Then in any component:
```jsx
<h2 style={{ color: 'var(--color-orange)' }}>Title</h2>
```

**Why this matters:** If you want to change the brand orange color, you change it in **one place** (`src/index.css`) and it updates everywhere.

---

### The `clamp()` Function
Used everywhere for responsive typography and spacing. It means: "be at least X, scale with the viewport, but never exceed Y."

```css
font-size: clamp(3rem, 7vw, 7rem);
/*          ↑ minimum  ↑ scales  ↑ maximum */
```

This replaces writing separate `@media` breakpoints for every font size. The font smoothly scales between mobile and desktop.

---

### Inline Styles vs. CSS Classes
In this project we use both:

| Method | Used For | Example |
|--------|----------|---------|
| Inline styles (`style={{}}`) | Anything that depends on JS variables, scroll progress, language | `style={{ opacity: revealed ? 1 : 0 }}` |
| Tailwind classes (`className=""`) | Static layout utilities | `className="flex items-center gap-4"` |
| CSS custom classes (`.cta-pulse`) | Animations that can't be done inline | Keyframe animations |

---

### The Background Texture
The cream background has subtle vertical lines that look like light paper texture:

```css
body {
  background-color: var(--color-cream);   /* warm cream base */
  background-image:
    repeating-linear-gradient(
      88deg,                               /* nearly-vertical lines */
      rgba(26, 24, 20, 0.015) 0px,        /* dark at 1.5% opacity */
      rgba(26, 24, 20, 0.015) 1px,
      transparent 1px,
      transparent 80px                     /* repeat every 80px */
    );
}
```

The opacity is `0.015` (1.5%) so it's barely visible — just enough to add depth without being distracting.

---

### The Scrollbar
We hide the scrollbar without disabling scrolling:

```css
html {
  scrollbar-color: transparent transparent; /* Firefox */
}
html::-webkit-scrollbar-thumb {
  background: transparent;  /* Chrome/Safari */
}
```

**Why `overflow-x: clip` instead of `overflow-x: hidden`:**
This is an important CSS bug to understand. If you put `overflow: hidden` on a parent element, any child with `position: sticky` **stops working**. Using `clip` instead creates the same visual clipping without creating a scroll container.

```css
html {
  overflow-x: clip;  /* ✅ Clips without breaking sticky */
}
/* NOT: overflow-x: hidden  ← ❌ Breaks position: sticky */
```

---

## 5. Fonts

All fonts load from Google Fonts (in `index.html`). Each serves a specific purpose:

| Variable | Font | Used For |
|----------|------|---------|
| `--font-body` | DM Sans | All body text, buttons, descriptions |
| `--font-display` | Frank Ruhl Libre | Hebrew section headings (h2) |
| `--font-display-en` | Cormorant Garamond | English elegant text (occasional) |
| `--font-display-en-hero` | Abril Fatface | English big headings (h2) — bold/impactful |
| `--font-mono` | IBM Plex Mono | Section labels ("01 / WORK"), small caps |

**The thinking behind this:**
- Hebrew headings use Frank Ruhl Libre at weight 900 — it's a classic Israeli print newspaper font, conveying authority and creativity
- English headings use Abril Fatface — ultra-bold display font, communicates confidence and personality
- DM Sans for body text is highly legible at small sizes
- IBM Plex Mono for labels gives a "behind the scenes" technical feel

**How to change fonts:**
1. Pick a new font on [fonts.google.com](https://fonts.google.com)
2. Copy the `<link>` tag and replace it in `index.html`
3. Update the CSS variable in `src/index.css`

---

## 6. Colors

```
--color-cream:    #F5F0E8   ← Warm off-white background (like aged paper)
--color-ink:      #1A1814   ← Near-black text (warmer than pure #000)
--color-orange:   #D4622A   ← Brand accent — energy, creativity
--color-accent:   #C8A882   ← Soft brown — premium, warm
--color-ink-muted:#6B6560   ← Grey text for secondary information
```

**Why these colors work together:**
The cream and ink create a warm, editorial feel (like a luxury magazine). The orange is the only truly saturated color — it draws the eye to exactly what you want the user to focus on (CTAs, active states, highlighted text). The accent brown bridges the cream and ink.

**How to change a color:**
Find the variable in `src/index.css` and change the hex value. Every component that uses that variable updates automatically.

---

## 7. Language System

The site fully supports Hebrew (RTL) and English (LTR). The language system lives in `src/i18n/`.

### How It Works

```typescript
// In any component:
const { language, t, setLanguage } = useI18n();

const isRTL = language === 'he';  // true when Hebrew

// Get translated text:
t('cta.whatsapp')
// → Hebrew: "בואו נתחיל לעבוד יחד"
// → English: "Message me on WhatsApp"
```

### Where translations live
`src/i18n/translations.ts` — this file has every text string in both languages.

### RTL Layout
When Hebrew is active, we add `dir="rtl"` to sections:
```jsx
<section dir={isRTL ? 'rtl' : 'ltr'}>
```

CSS handles the rest — text aligns right, flex rows reverse, etc.

### Language Persistence
The selected language is saved to `localStorage`, so if a user refreshes the page, they stay in the same language.

---

## 8. Components

### `src/pages/IndexTest.tsx` — The Page Layout

This is the "blueprint" of the entire page. It lists all sections in order:

```tsx
<HeroAbout />        // Section 1
<WorkGrid />         // Section 2
<ProcessTimeline />  // Section 3
<ResultsReel />      // Section 4
<Testimonials />     // Section 5
<FAQ />              // Section 6
<ContactBlock />     // Section 7
<StickyWhatsApp />   // Floating button (always visible)
<Footer />           // Bottom copyright
```

**The order matters** — ResultsReel's spine animation exits at a specific coordinate that Testimonials' spine picks up from. Changing the order breaks the visual continuity.

---

### `HeroAbout.tsx` — Hero + About Section

**What it does:** The first thing visitors see. A cinematic full-screen hero that morphs into an About section as you scroll.

**Why it's designed this way:** Traditional sites have separate Hero and About sections with a hard cut. Merging them into one scroll-driven experience feels more cinematic and premium — the photo "grows" into the screen as you scroll.

**How the scroll animation works:**
```
Scroll 0%:     Hero text visible, photo small (right side)
Scroll 22-42%: Hero text fades out
Scroll 54-78%: About text fades in
Scroll 0-100%: Photo grows from 65% → 100% scale
```

**Key code pattern — `useTransform`:**
```typescript
import { useTransform, useScroll } from 'framer-motion';

const { scrollYProgress } = useScroll({ target: containerRef });

// Map scroll 0-1 to opacity 1-0
const heroOpacity = useTransform(scrollYProgress, [0.22, 0.42], [1, 0]);
```

**To change the profile photo:**
Replace `public/profile.webp` with a new file of the same name (keep the `.webp` format for performance).

**To change the headline text:**
Edit `src/i18n/translations.ts` — look for `hero.headline`.

---

### `work/WorkGrid.tsx` — Featured Work Grid

**What it does:** Showcases Shani's work across 6 niches: weddings, restaurants, social, save-the-date, hotels, brands.

**Why 6 categories:** Each niche has a completely different visual language. Weddings are romantic (soft pinks), restaurants are warm (orange/brown), social media work is bold (electric blue). Having separate color palettes per category shows range and intentionality.

**The grid layout:**
- 12-column grid with `2vw` gaps
- Cards each take 6 columns (half the width)
- Every other row is offset (`margin-top: 5em`) for a cascading effect

**The Lusion-inspired animation:**
Cards enter with a "bottom wipe" — they're clipped from the bottom up:
```javascript
initial={{ clipPath: 'inset(0 0 100% 0)' }}  // Fully hidden
animate={{ clipPath: 'inset(0 0 0% 0)' }}     // Fully visible
```
This creates a "sliding curtain" reveal effect.

**The hover effect:**
A colored overlay slides up from the bottom (`y: '100%' → '0%'`). The overlay color matches each niche's palette.

**To add a new work category:**
1. Add a new entry to the `WORK_ITEMS` array in `WorkGrid.tsx`
2. Add a poster image to `public/posters/[category]/`
3. Add videos to `public/videos/[category]/`
4. Define a color palette in the `PALETTES` object

---

### `ProcessTimeline.tsx` — "How I Work" Section

**What it does:** Shows Shani's 5-step workflow in a circular diagram. The circle draws itself as you scroll, and each step appears one at a time.

**Why a circle:** Linear lists are boring. A circular layout suggests a repeating, reliable process — not a one-time transaction.

**How the sticky scroll works:**
```jsx
// Outer div: 250vh tall (creates scroll distance)
<div style={{ height: '250vh', position: 'relative' }}>

  // Inner div: 100vh sticky (stays in view while you scroll the outer)
  <div style={{ position: 'sticky', top: 0, height: '100vh' }}>
    {/* Everything visible here */}
  </div>

</div>
```

The outer div is 2.5x the viewport height. As you scroll through those 250vh, the inner div stays fixed on screen. Your scroll progress through the outer div becomes the animation progress.

**The orange dot:**
```javascript
const activeStep = Math.min(N - 1, Math.floor((dwell / 0.85) * N));
```
`dwell` goes from 0 to 1 as you scroll. We map it to which step should be "active" (0-4). The dot highlights the active step.

**The 5 steps:**
Located near line 30 in `ProcessTimeline.tsx`:
```javascript
const STEPS_EN = ['Discovery', 'Concepts', 'Production', 'Publishing', 'Report & Iterate'];
const STEPS_HE = ['היכרות', 'קונספטים', 'הפקה', 'פרסום', 'דיווח ושיפור'];
```

**To change step names:** Edit these arrays. The geometry auto-adjusts.

---

### `ResultsReel.tsx` — Video Reel Section

**What it does:** Shows a video reel with an SVG spine that draws itself. The video rises up from the bottom as you scroll.

**The SVG spine animation:**
The spine path is drawn using `strokeDasharray`/`strokeDashoffset` — a classic CSS technique:
```javascript
// Total path length = 3000px
// At scroll 0%: dashOffset = 3000 (fully hidden)
// At scroll 65%: dashOffset = 0 (fully drawn)
pathEl.style.strokeDashoffset = (1 - drawProgress) * 3000;
```
This makes the line appear to "draw itself."

**The video rise animation:**
```javascript
// At scroll 42%: video is 105vh below the fold (invisible)
// At scroll 88%: video has risen to center (fully visible)
const riseProgress = easeOutCubic((dwell - 0.42) / 0.46);
videoContainer.style.transform = `translateY(${105 * (1 - riseProgress)}vh)`;
```

**To change the video:**
Replace the file in `public/` and update the `src` attribute in `ResultsReel.tsx`.

---

### `Testimonials.tsx` — Client Reviews

**What it does:** Shows client testimonials with a spine that visually continues from `ResultsReel`. Cards appear staggered as you scroll.

**Why the spine continues:** The visual thread (SVG line) runs from section to section, creating a sense that the whole page is one connected story rather than separate blocks. This is a design technique called "visual continuity."

**The spine connection:**
ResultsReel's spine exits at approximately `x=1480, y=370` (in a `0 0 1400 800` viewBox). Testimonials' spine starts at exactly `M 1480 370`. This makes them appear to be one continuous line.

**The card layout:**
CSS multi-column layout creates the masonry effect:
```jsx
<div style={{ columns: '3', columnGap: '1.5rem' }}>
  {testimonials.map(t => <Card key={t.id} />)}
</div>
```
Cards are placed top-to-bottom in each column, creating natural height variation.

**To add a testimonial:**
Edit `src/content/testimonials.json`. Each entry needs:
```json
{
  "id": "unique-id",
  "name": { "he": "שם בעברית", "en": "English Name" },
  "role": { "he": "תפקיד", "en": "Role" },
  "content": { "he": "תוכן הביקורת", "en": "Review content" },
  "rating": 5
}
```

---

### `FAQ.tsx` — Frequently Asked Questions

**What it does:** Accordion list of questions and answers. Clicking a question smoothly reveals the answer.

**The accordion animation:**
The challenge with accordion animations is that you can't animate to `height: auto` directly in CSS. We solve it by measuring the height with JavaScript:
```javascript
const bodyRef = useRef(null);
const [height, setHeight] = useState(0);

useEffect(() => {
  // When question opens, measure how tall the answer is
  setHeight(isOpen ? bodyRef.current.scrollHeight : 0);
}, [isOpen]);

// Then animate to that measured height
<div style={{ height: `${height}px`, transition: 'height 0.45s ...' }}>
```

**To add/edit FAQ items:**
Edit `src/content/faq.json`. Each item:
```json
{
  "id": "unique-id",
  "question": { "he": "שאלה בעברית?", "en": "English question?" },
  "answer": { "he": "תשובה בעברית.", "en": "English answer." }
}
```

---

### `ContactBlock.tsx` — "Let's Grow Together" Section

**What it does:** The final call-to-action before the footer. Dark background, big headline, WhatsApp button.

**Why dark background:** After all the cream sections, the dark section creates contrast — it signals "the page is ending, time to act." It also makes the orange WhatsApp button pop more than it would on a light background.

**The WhatsApp button:**
```jsx
<button
  className="cta-pulse"          // CSS keyframe: pulsing orange glow
  onClick={handleWhatsApp}        // Opens WhatsApp with pre-filled message
>
```

The `cta-pulse` class in `index.css` creates an infinite pulse animation that draws attention without being annoying.

**The pre-filled WhatsApp message:**
```typescript
const msg = language === 'he'
  ? 'היי שני! אני מעוניין/ת לשמוע עוד על השירותים שלך.'
  : "Hi Shani! I'd like to hear more about your services.";
window.open(`${socials.whatsappUrl}?text=${encodeURIComponent(msg)}`, '_blank');
```

This saves the user from typing — reducing friction increases conversion rates.

**Features grid (3 columns):**
The three icons (Zap, Calendar, MessageCircle) are from the `lucide-react` icon library. To change:
```tsx
import { Zap, Calendar, MessageCircle } from 'lucide-react';
// Browse all icons at: lucide.dev
```

---

### `StickyWhatsApp.tsx` — Floating WhatsApp Button

**What it does:** A green WhatsApp button fixed to the bottom corner of the screen, always visible.

**Why it exists:** Some users will scroll through the whole site without clicking any CTA. The floating button is always there as a fallback — 0 effort to reach.

**This is the most important conversion element on the page.**

---

### `Footer.tsx` — Copyright Footer

Minimal footer with copyright year (auto-updates via `new Date().getFullYear()`).

**Do not remove or modify the copyright text** — it's a legal notice.

---

### `Analytics.tsx` — Google Analytics

Fires tracking events when users interact with the site. This is how Shani knows where visitors come from, how long they stay, and what they click.

**To change the GA tracking ID:** Look for `G-XXXXXXXXXX` in this file and replace with your GA4 property ID.

---

## 9. How to Change Text

### Simple text (buttons, labels)
Go to `src/i18n/translations.ts`:
```typescript
export const translations = {
  he: {
    'cta.whatsapp': 'בואו נתחיל לעבוד יחד',  // ← Change this
  },
  en: {
    'cta.whatsapp': 'Message me on WhatsApp',  // ← And this
  }
}
```

### FAQ Questions & Answers
Go to `src/content/faq.json` and edit the `question` and `answer` fields.

### Testimonials
Go to `src/content/testimonials.json` and edit the `content`, `name`, `role` fields.

### Section headings (inline in components)
Some text is written directly in the component file. Example in `ContactBlock.tsx`:
```tsx
isRTL ? 'בואו נצמח יחד' : "Let's Grow Together"
```
Search for the text you want to change across the `src/components/` folder.

### Pricing / Services
Go to `src/content/services.json` and edit prices and descriptions.

---

## 10. How to Change Photos

All photos are in the `public/` folder. To replace a photo:

1. **Profile photo:** Replace `public/profile.webp`
   - Keep the exact filename `profile.webp`
   - Best size: 800×1000px portrait
   - Save as WebP for best performance

2. **Work grid thumbnails:** Replace files in `public/posters/[category]/`
   - Example: `public/posters/weddings/image1.jpg`
   - The WorkGrid component displays these as card backgrounds

3. **Logo:** Replace `public/shani-logo.webp`

4. **OG image** (appears when sharing on social media): Replace `public/images/og.webp`
   - Ideal size: 1200×630px

**Format recommendation:** Always use `.webp` — it's 30-50% smaller than JPG/PNG with the same quality.

**How to convert to WebP:**
- Online: squoosh.app (free, drag and drop)
- Or just keep JPG/PNG — the browser handles them fine, just slightly slower

---

## 11. How to Change Videos

### Main reel video (ResultsReel section)
Find the `<video>` element in `src/components/ResultsReel.tsx` and update the `src` attribute:
```tsx
<video src="/your-new-video.mp4" ... />
```
Place the video file in the `public/` folder.

### Work grid videos (per category)
Videos are auto-discovered from these folders:
```
public/videos/weddings/
public/videos/restaurants/
public/videos/social/
public/videos/savethedate/
public/videos/hotels/
public/videos/brands/
```

**To add a video to a category:** Drop the `.mp4` file into the correct folder. The site automatically picks it up (thanks to `src/content/videoManifest.ts`).

**To remove a video:** Delete the file. Done.

**Video format tips:**
- Use `.mp4` with H.264 encoding (most compatible)
- Under 10MB per video for fast loading
- 1080p max resolution is plenty
- Square (1:1) or portrait (9:16) formats look best for social media work

---

## 12. Buttons & CTAs

### WhatsApp Buttons
There are two main WhatsApp buttons:
1. **In HeroAbout** — primary hero CTA
2. **In ContactBlock** — end-of-page CTA
3. **StickyWhatsApp** — always-visible floating button

All use the same link from `src/content/socials.ts`:
```typescript
export const socials = {
  whatsappUrl: 'https://wa.me/message/D4AOECDSG35YE1',
  // ...
};
```

**To change the WhatsApp number/link:**
Update `whatsappUrl` in `src/content/socials.ts`. This automatically updates all three buttons.

### Calendly Button (Book a Call)
Currently disabled (`calendlyUrl: ''`). To enable:
```typescript
calendlyUrl: 'https://calendly.com/your-link',
```
The button will automatically appear in ContactBlock.

### Social Links
All in `src/content/socials.ts`:
```typescript
instagram: 'https://www.instagram.com/social__shani...',
tiktok: 'https://www.tiktok.com/@shanibasa...',
```

### The Pulse Animation
The orange WhatsApp button in ContactBlock has a pulsing glow:
```css
@keyframes ctaPulse {
  0%, 100% { box-shadow: 0 8px 32px rgba(212,98,42,0.35); }
  50%       { box-shadow: 0 8px 48px rgba(212,98,42,0.65), 0 0 0 6px rgba(212,98,42,0.1); }
}
.cta-pulse {
  animation: ctaPulse 2.8s ease-in-out infinite;
}
```
The `2.8s` duration is intentionally slightly off from a round number — it feels more natural than a mechanical 2s or 3s pulse.

---

## 13. Animations

### Pattern 1 — IntersectionObserver (Scroll-triggered)
Used in: FAQ, ContactBlock

```javascript
// When the section enters the viewport, set revealed = true
const observer = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) {
      setRevealed(true);
      observer.disconnect(); // Only trigger once
    }
  },
  { threshold: 0.1 } // Trigger when 10% of element is visible
);
observer.observe(sectionRef.current);
```

Then in the JSX:
```jsx
<p style={{
  opacity: revealed ? 1 : 0,
  transform: revealed ? 'translateY(0)' : 'translateY(20px)',
  transition: 'opacity 0.6s ease, transform 0.6s ease',
}}>
```

The element starts invisible and shifted down. When `revealed` becomes true, CSS transitions it to visible and natural position.

---

### Pattern 2 — Sticky Scroll (Position: Sticky)
Used in: ProcessTimeline, ResultsReel, Testimonials

```jsx
// Outer = the scroll distance (250vh = 2.5x viewport)
<div style={{ height: '250vh', position: 'relative' }}
     ref={outerRef}>

  // Inner = stays visible while scrolling through the outer
  <div style={{ position: 'sticky', top: 0, height: '100vh' }}>

    {/* Content here stays visible for 250vh of scroll */}

  </div>
</div>
```

JavaScript reads how far you've scrolled through the outer div:
```javascript
const rect = outerRef.current.getBoundingClientRect();
const scrolled = -rect.top;
const total = rect.height - window.innerHeight;
const dwell = Math.max(0, Math.min(1, scrolled / total));
// dwell = 0 (section just entered) → 1 (section about to leave)
```

---

### Pattern 3 — SVG Path Drawing
Used in: ResultsReel, Testimonials

SVG paths have a `strokeDasharray` and `strokeDashoffset` property. Setting dashArray equal to the path length, then reducing dashOffset from full-length to 0, creates the "drawing" effect:

```javascript
const pathLength = pathEl.getTotalLength(); // e.g. 3000px

// Fully "undrawn":
pathEl.style.strokeDasharray = pathLength;
pathEl.style.strokeDashoffset = pathLength;

// As user scrolls (drawProgress: 0→1):
pathEl.style.strokeDashoffset = pathLength * (1 - drawProgress);
```

---

### Pattern 4 — Word-by-Word Reveal
Used in: All section headings (FAQ, ContactBlock, Testimonials, WorkGrid)

```jsx
"Let's Grow Together".split(' ').map((word, i) => (
  <span style={{ overflow: 'hidden', display: 'inline-block' }}>
    <span style={{
      display: 'inline-block',
      transform: revealed ? 'translateY(0)' : 'translateY(110%)',
      transition: `transform 0.9s cubic-bezier(0.35,0,0,1) ${0.15 + i * 0.14}s`,
    }}>
      {word}
    </span>
  </span>
))
```

The outer `overflow: hidden` clips the inner word. The inner span slides up from below, appearing to "emerge" from behind an invisible floor.

---

### Pattern 5 — Clip Path Reveal (Lusion-style)
Used in: WorkGrid cards

```jsx
<motion.div
  initial={{ clipPath: 'inset(0 0 100% 0)' }}  // clipped from bottom = invisible
  animate={{ clipPath: 'inset(0 0 0% 0)' }}     // no clip = fully visible
  transition={{ duration: 1.0, ease: [0.35, 0, 0, 1] }}
/>
```

`inset(top right bottom left)` — by reducing the bottom clip from 100% to 0%, the card "wipes in" from the top.

---

## 14. The Logic We Used

### Design Philosophy
**Every decision had a reason:**

1. **Merged Hero + About** — Reduces cognitive load. User sees who Shani is and what she offers in one continuous experience.

2. **Scroll-driven animations** — These take longer to build but create a premium feel. The animation happening *because* you scroll (not just on load) makes users feel in control and engaged.

3. **SVG spine threading through sections** — Creates visual continuity. The page doesn't feel like separate blocks — it feels like one long story.

4. **Dark ContactBlock at the end** — Contrast creates hierarchy. After many light cream sections, the dark final section signals importance. It's a pattern used by luxury brands (Apple, etc.) to close with impact.

5. **Pre-filled WhatsApp message** — Every extra step a user has to take reduces conversion by ~20%. Removing friction is more valuable than adding features.

6. **Per-niche color palettes in WorkGrid** — Shows range and intentionality. A potential wedding client immediately sees Shani understands their visual language.

### Animation Timing Principles
- Fast animations (under 0.3s): for micro-interactions (hover states)
- Medium animations (0.5–0.8s): for reveals and transitions
- Slow animations (0.9–1.2s): for large-scale reveals (headings, card entries)
- Stagger delays: always `i * small_value` so consecutive elements have progressively increasing delays

### The Easing Curve
`cubic-bezier(0.35, 0, 0, 1)` — used everywhere as `--ease-brand`. It means: "start slow, accelerate in the middle, brake sharply at the end." This mimics how physical objects actually move and feels more natural than `ease-in-out`.

---

## 15. What Can Be Improved

These are honest improvements that would make you a better programmer and the site more robust.

### 1. Mobile Responsiveness (HIGH PRIORITY)
Most scroll animations use `position: sticky` with fixed height values — these don't adapt to mobile screens well. On a phone, the ProcessTimeline circle likely overlaps or is too small.

**What to do:** Add `@media (max-width: 768px)` breakpoints, or use the `useIsMobile()` hook to show a simplified mobile layout for sticky sections.

**Skill you'll learn:** Responsive design, media queries, mobile-first thinking.

---

### 2. Component Splitting (MEDIUM)
`HeroAbout.tsx` is one file that does two jobs (Hero and About). `ProcessTimeline.tsx` contains both layout and scroll logic in one place.

**What to do:** Extract the scroll hook into a custom hook (`useScrollDwell`), extract the step data into a JSON file.

**Skill you'll learn:** Separation of concerns, custom hooks, reusability.

---

### 3. No Loading State
If videos take time to load, there's no placeholder. Users see a blank space.

**What to do:** Add a `<Suspense>` fallback or a CSS skeleton animation while media loads.

**Skill you'll learn:** Lazy loading, Suspense, performance patterns.

---

### 4. No Error Boundaries
If any component crashes (JavaScript error), the whole page goes blank.

**What to do:** Wrap sections in React Error Boundaries so a crash in one section shows a fallback, not a blank page.

**Skill you'll learn:** Error boundaries, defensive programming.

---

### 5. Hardcoded Contact Info
The WhatsApp number, Instagram URL, and email are in `src/content/socials.ts`. This is fine now, but if the site grows, these should come from a CMS or environment variable.

**What to do:** Move to `.env` file:
```
VITE_WHATSAPP_URL=https://wa.me/...
VITE_INSTAGRAM_URL=https://instagram.com/...
```

**Skill you'll learn:** Environment variables, configuration management.

---

### 6. Accessibility Gaps
- Keyboard navigation for the FAQ accordion isn't fully tested
- SVG animations don't have `aria-label` attributes
- Color contrast on some dark overlays may not meet WCAG AA standard

**What to do:** Run `axe` Chrome extension to audit, add `aria-label` to interactive SVG elements, test with keyboard-only navigation.

**Skill you'll learn:** Web accessibility (a11y), ARIA, inclusive design.

---

### 7. Animation Performance
Some scroll handlers update `element.style` directly inside `requestAnimationFrame`. This is correct. But `ProcessTimeline` and `ResultsReel` each attach their own scroll listener. On low-end devices, multiple scroll listeners can cause jank.

**What to do:** Consolidate into a single scroll handler or use Intersection Observer where possible.

**Skill you'll learn:** Browser rendering pipeline, compositor layers, `will-change`.

---

### 8. The i18n System Could Be Stronger
Currently `t('key')` returns `'key'` if the translation is missing (silently fails). A missing translation should show a visible warning in development.

**What to do:** In `src/i18n/simple.tsx`, add:
```typescript
if (!translation && process.env.NODE_ENV === 'development') {
  console.warn(`Missing translation: ${key}`);
}
```

**Skill you'll learn:** Developer experience (DX), debugging tools, environment-aware code.

---

### 9. No Tests
There are zero unit or integration tests. For a production business site, at least the WhatsApp link and language switching should have tests.

**What to do:** Add Vitest + React Testing Library. Start with:
```typescript
test('WhatsApp link opens with correct URL', () => { ... });
test('Language toggle switches to English', () => { ... });
```

**Skill you'll learn:** Test-driven development, unit testing, CI/CD.

---

### 10. Images Are Not Optimized at Build Time
Images are served as-is from `public/`. There's no build-time compression, no srcset for different screen sizes.

**What to do:** Use Vite's image plugin or move to Next.js `<Image>` component which auto-compresses and serves the right size per device.

**Skill you'll learn:** Build-time optimization, responsive images, Core Web Vitals.

---

## 16. Glossary

**Component:** A reusable piece of UI. In React, a function that returns JSX.

**Props:** Data passed from a parent component to a child. Like function arguments.

**State:** Data that can change and when it does, the component re-renders. Example: `revealed` (true/false).

**Hook:** A special React function starting with `use`. Examples: `useState`, `useEffect`, `useRef`. They let functional components have state and side effects.

**useRef:** A hook that gives you a direct reference to a DOM element. Used for reading `.scrollHeight`, measuring positions, etc.

**useEffect:** A hook that runs code after the component renders. Used for setting up scroll listeners, IntersectionObserver, etc.

**JSX:** JavaScript + XML. The HTML-like syntax inside React components that compiles to `React.createElement()` calls.

**TypeScript:** JavaScript with types. The `: string` or `{ he: string; en: string }` annotations.

**CSS Variables (Custom Properties):** `--variable-name: value` in CSS. Referenced with `var(--variable-name)`.

**clamp():** CSS function: `clamp(min, preferred, max)`. The preferred value scales with viewport, but never goes below min or above max.

**vw / vh:** Viewport width / viewport height. `1vw` = 1% of the browser window width.

**RTL:** Right-to-left. Hebrew and Arabic text flows from right to left. The `dir="rtl"` attribute on a container reverses the layout.

**WebP:** A modern image format that's 25-35% smaller than JPG at the same quality. Supported by all modern browsers.

**sticky:** A CSS `position` value. The element scrolls normally until it hits a threshold (`top: 0`), then sticks until its parent is scrolled past.

**IntersectionObserver:** A browser API that fires a callback when an element enters or leaves the viewport. More efficient than scroll event listeners for "detect when visible" patterns.

**strokeDasharray / strokeDashoffset:** SVG properties used to animate path drawing. dashArray sets the dash pattern; dashOffset shifts where the dashes start. Animating offset from full-length to 0 creates the "drawing" illusion.

**cubic-bezier:** A mathematical curve defining animation easing. Four numbers define the shape: `cubic-bezier(0.35, 0, 0, 1)`.

**clipPath:** A CSS property that clips an element to a shape. `inset(0 0 100% 0)` clips everything from 100% of the bottom up = invisible. `inset(0 0 0% 0)` = fully visible.

**Framer Motion:** A React animation library. `motion.div` = animated div. `initial`, `animate`, `exit` props define keyframe states.

**GSAP:** GreenSock Animation Platform. Used for complex scroll-driven timelines.

**Vite:** Build tool. `bun run dev` starts it. Compiles TypeScript + JSX, serves files with HMR.

**HMR (Hot Module Replacement):** When you save a file, only the changed module updates in the browser — no full page reload.

**i18n:** Internationalization. The system for supporting multiple languages.

**CTA:** Call to Action. A button or link that asks the user to do something. "Message me on WhatsApp" is the primary CTA.

**LCP:** Largest Contentful Paint. A Core Web Vitals metric. How long until the largest visible element loads. Target: under 2.5 seconds.

**OG Image:** Open Graph image. Shows up when you share a URL on WhatsApp, Facebook, Twitter.

---

*This document was written to give you full ownership of this codebase. Every decision was made intentionally — understanding the why is more valuable than memorizing the what.*
