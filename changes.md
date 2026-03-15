# Changelog

## 2026-03-05 — Poster-First Carousels (Option E)

### Carousel Loading Strategy Rewrite
- **Before:** 28 `<video>` elements mounted on page load → ~30 HTTP requests for video before user scrolls
- **After:** 0 video elements on load → video only downloads when user hovers a card
- Each carousel card shows a static WebP poster thumbnail by default
- `<video>` is lazy-mounted on hover (`preload="none"`) and fully unmounted on hover-end
- Added play button icon overlay on all cards for clear visual affordance

### Video Count Reduction
- Brands: 9 → 5 videos
- Hotels: 8 → 4 videos
- Weddings: 11 → 5 videos

### Poster Thumbnails Generated
- 14 WebP thumbnails extracted from videos at 1s using ffmpeg (640px wide)
- Stored in `public/posters/brands/`, `public/posters/hotels/`, `public/posters/weddings/`
- Added `scripts/generate-posters.mjs` for future use

---

## 2026-03-04 — Performance & Code Quality Overhaul

### Dead Code Removal
- Deleted 11 unused components: `Hero.tsx`, `Index.tsx`, `LanguageSwitcher.tsx`, `Services.tsx`, `ValueProps.tsx`, `WorkCategories.tsx`, `CaseStudies.tsx`, `LeadMagnet.tsx`, `CaseStudyCard.tsx`, `VideoModal.tsx`, `OptimizedVideo.tsx`
- Removed unused `react-query` dependency from `App.tsx`
- Removed dead `/index` route from router

### CSS Cleanup (`index.css`)
- Reduced from 518 → 178 lines
- Removed ~15 unused CSS classes (`.btn-gold`, `.heading-xl`, `.cinematic-hero-text`, `.brand-logos`, etc.)
- Fixed critical bug: `section { transition: var(--transition-cinematic) }` was applying a 0.7s transition to every section on the page

### Component Fixes
- **BrandsVideoCarousel**: removed dead `hoveredVideo` state, fixed infinite `tryShowFrame` loop, removed gibberish comment
- **HotelsVideoCarousel**: same loop + dead state fixes, removed unused `t` from i18n
- **WeddingsVideoGallery**: same loop fix, fixed `whileInView={{ scale: 1.03 }}` bug (cards were permanently 3% larger)
- **ResultsReel**: changed `preload="auto"` → `preload="metadata"` on 31MB video
- **StoriesGalleryModal**: added auto-focus so keyboard navigation works on open
- **StickyWhatsApp**: removed unused `t` from i18n
- **Analytics**: removed dead `trackEvent` export
- **Testimonials**: replaced `any[]` with proper `Testimonial` type
- **HeroWorking**: removed broken `<source src="/video-glam.webm">`, removed noisy console errors, fixed video source

### Image Compression (`public/` — 82 MB → 5.9 MB, **-93%**)
- Converted all 26 images from JPG/PNG → WebP (quality 82, max 1920px)
- Updated all references in `About.tsx`, `HeroWorking.tsx`, `StoriesGalleryModal.tsx`, `index.html`
- Notable savings: `story10.jpg` 12MB → 68KB, `profile.JPG` 8.1MB → 413KB, `shani-logo2.png` 1.5MB → 65KB

### Video Compression (`public/` — 145 MB → 77 MB, **-47%**)
- Re-encoded 6 MOV files to H.264 MP4 (CRF 23, max 1920p)
- Updated references in `HeroWorking.tsx`, `ResultsReel.tsx`

### Video Compression (`src/assets/` — 1.38 GB → 674 MB, **-51%**)
- Re-encoded 24 carousel MOV files to H.264 MP4
- Updated file references in `BrandsVideoCarousel.tsx`, `HotelsVideoCarousel.tsx`, `WeddingsVideoGallery.tsx`
- Added `src/assets/**/*.mov` and `src/assets/**/*.mp4` to `.gitignore` (too large for git)

### Tools Added
- `scripts/compress-images.mjs` — Node.js script using `sharp` for future image compression
- `scripts/compress-assets-videos.mjs` — Node.js script using ffmpeg for future video compression
- Installed `sharp` (dev dependency) and `ffmpeg` (via winget)
