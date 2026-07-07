# Phase 3 Plan — MOV Uploads, CMS Speed, Site Speed

> Written 2026-07-07. Execute from this file. Before touching code, re-read
> "Teaching contract note" at the bottom.

## Goal

Shani can upload her iPhone `.MOV` videos through `/admin` and they appear on the live
site as web-ready MP4s — and both the CMS and the site stop feeling slow.

**Success criteria**
1. A real `.MOV` from Shani's phone, dropped in `/admin`, plays on the site (Chrome + Safari + Android) with no manual conversion step.
2. Admin dashboard is interactive in ≤ ~2s; no 30–60s hangs.
3. Every stored video is ≤ 50MB (Supabase free-tier per-file cap), ≤ 1080p, H.264.
4. Video tiles keep today's exact behavior (blank until scrolled into view, then plays) — just start playback noticeably faster; Lighthouse mobile perf score improves (measure before/after).

## Constraints

- **Budget: ₪0.** Render free tier (512MB RAM, ~0.1 CPU, sleeps after 15 min idle), Supabase free tier (~1GB storage, 5GB egress/mo, 50MB max per file), Vercel hobby (serverless body limit 4.5MB).
- Server-side video transcoding is **impossible** on this Render tier — too little CPU/RAM, requests would time out.
- Live site already reads media directly from Supabase (`src/lib/supabase.ts` → `getMedia`) — visitors never depend on Render. Keep it that way.
- Existing stack: Express (`server/index.js`) + multer memory storage (50MB cap) + Supabase `work-media` bucket + `media` table (`category, filename, type, sort_order`).
- Owner is learning full-stack — the Express server is her coursework; don't delete/replace it.

## Out of Scope

- Cloudinary / Mux / Cloudflare Stream migration (new paid-ish service, splits media across systems).
- HLS / adaptive bitrate streaming.
- Replacing the shared-password auth with Supabase Auth (keep the token; optional hardening note only).
- Moving the API off Render to Vercel functions (4.5MB body limit makes it pointless for uploads; revisit only if Render dies).
- Paying for Render/Supabase upgrades.
- Any visual redesign of the site or admin.

## Architecture (target)

```
Browser /admin ──(1) convert MOV→MP4 in-browser (Mediabunny/WebCodecs)
              ──(2) POST /api/media/:cat/sign  → Render Express (auth, tiny JSON)
              ──(3) PUT bytes directly → Supabase Storage (signed upload URL)
              ──(4) POST confirm → Express inserts `media` row (+ poster filename)
Live site     ── reads `media` table + public URLs directly from Supabase (unchanged)
Render Express ── control plane only: auth check, sign, confirm, delete, reorder
UptimeRobot   ── pings Render every 10 min so it never cold-starts during a work session
```

Video bytes never pass through Render again. `media` table gains a `poster` column (nullable text).

## Phases

### Phase 0 — Quick wins (ships in ~1 hour, retires "is it the cold start?")
- Create a free UptimeRobot (or cron-job.org) monitor hitting the Render URL `/` every 10 min. Free tier's 750 instance-hours/month cover 24/7 for one service.
- Admin reads: replace `loadMedia`'s fetch-through-Render with the existing `getMedia()` from `src/lib/supabase.ts`. Tab switches become instant and work even when Render sleeps.
- Code-split `/admin`: `React.lazy` the Admin route in `App.tsx` so visitors stop downloading dnd-kit + admin code.
- **Measure**: time-to-interactive of /admin before/after; Lighthouse baseline of the live site (save the numbers in this file).

### Phase 1 — MOV upload with in-browser conversion (the riskiest assumption — validate first)
- In `/admin`, accept `.mov` (`video/quicktime`) in the file input.
- Before upload, run a client-side pipeline with **Mediabunny** (MIT, WebCodecs-based):
  - H.264-in-MOV → **remux** to MP4 (seconds, lossless).
  - HEVC → **transcode** to H.264, cap at 1080p / ~4Mbps (hardware-accelerated via WebCodecs).
  - Show progress UI; if output would exceed 50MB, step bitrate down; if still too big, reject with a clear Hebrew message.
- Upload the resulting `.mp4` through the **existing** POST endpoint (unchanged server = smallest first step).
- **Acceptance test with 3–4 of Shani's real MOVs** (HEVC, HDR, portrait/rotated) before building anything else. If WebCodecs can't decode HEVC in her browser, fall back to ffmpeg.wasm for that path (slower but universal).

### Phase 2 — Uploads bypass Render (signed upload URLs)
- New Express endpoints: `POST /api/media/:category/sign` (auth → `createSignedUploadUrl`) and `POST /api/media/:category/confirm` (auth → insert `media` row). Browser PUTs bytes straight to Supabase.
- Retire the multer upload path once the new flow works; keep DELETE and reorder.
- Fix reorder: replace the N-sequential-updates loop with a single `upsert` of `(category, filename, sort_order)` rows.
- Result: Render handles only tiny JSON — cold start becomes nearly irrelevant even without the ping.

### Phase 3 — Site speed pass
- **Keep current video UX as-is** (no poster image — owner explicitly wants to keep the blank-until-scrolled-in behavior). Speed it up instead:
  - Smaller source files: Phase 1's 1080p/~4Mbps cap already means new uploads buffer faster than raw iPhone footage.
  - Earlier invisible pre-buffering: add `rootMargin` (~300px) to the `IntersectionObserver` in `LazyVideo` (`WorkGrid.tsx`) so the browser starts fetching bytes just before the tile scrolls into view, instead of only once it's 25% visible. No visual change — playback just starts sooner once triggered.
  - Guard against bandwidth contention with other on-screen content: set `fetchpriority="low"` on the video so the browser yields to anything more urgent already in flight, and check `navigator.connection` (`saveData` / `effectiveType`) to skip the early trigger entirely on slow/data-saver connections — those users keep today's exact-threshold behavior instead of extra contention.
- Photos: compress/resize client-side before upload too (canvas → webp, max ~1600px) — protects the 1GB storage cap.
- Bundle check: confirm admin chunk split landed; `vite build` + inspect chunk sizes; lazy-load sub-pages if heavy.
- Re-run Lighthouse; record before/after in this file.

## Key Decisions

1. **Convert MOV→MP4 in the browser (Mediabunny + WebCodecs), not on a server.**
   Render free can't transcode; browser conversion is free, hardware-accelerated, and files arrive already small — solving the 50MB/1GB/5GB caps at the same time.
   *Alternatives*: server ffmpeg (Render too weak), Cloudinary (extra service, media split), upload raw MOV (won't play on Chrome/Android, blows quotas).
2. **Keep Render + Express, but demote it to a thin control plane; bytes go browser→Supabase via signed URLs; keep-alive ping meanwhile.**
   Preserves the learning project, removes every heavy byte from the slow tier.
   *Alternatives*: Vercel functions (4.5MB limit), Render Starter $7/mo (works, costs money).
3. **Site speed = smaller files + earlier pre-buffering, not infrastructure, and not a UX change.** Supabase Storage already sits behind a CDN; the weight is raw uploads. Cap 1080p/H.264/~4Mbps + `rootMargin` lookahead on the existing `IntersectionObserver` + existing `preload="none"`. No poster image — owner wants the current preview behavior kept exactly as-is.

## Risks

| Risk | Mitigation |
|---|---|
| Her browser's WebCodecs can't decode HEVC | Feature-detect; fall back to ffmpeg.wasm for decode (slower). Validate in Phase 1 with real files before anything else. |
| Rotation/HDR metadata mangled in conversion | Phase 1 acceptance test uses real portrait + HDR clips; Mediabunny preserves rotation — verify visually. |
| 5GB/mo egress cap as traffic grows | Compression + posters cut per-view cost ~10×; monitor Supabase dashboard monthly; accept — upgrade only if real traffic demands it. |
| Keep-alive ping vs Render free-tier expectations | Common practice, within 750h allowance; accepted. Phase 2 makes it optional anyway. |
| Very large MOVs (multi-GB) OOM the browser tab | Mediabunny streams; still set a UI guard (~2GB input cap) with a clear message. |

## Teaching contract note (read before executing)

CLAUDE.md says the owner writes ALL `server/` + `/admin` code herself (see
`docs/cms/CMS-BUILD-LOG.md` §1). The owner has explicitly requested Claude-executed
implementation for this plan ("switch to Opus for execution", 2026-07-07). Confirm at
session start which mode applies — full execution, or guided specs per the contract —
and for either mode explain the *why* of each step as you go. Commit after each phase.
