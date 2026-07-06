# CMS Build Log — Shani Workgrid Media Manager

> **Living document.** This is our single source of truth. We update the
> "Where we left off" + checklist every session so we can always catch up
> on what we did and why. Read this top-to-bottom to get back up to speed.

Last updated: **2026-07-05** · Status: **Phase 1 — CRUD dashboard COMPLETE + lean security pass done** (Node v22 / npm 10 confirmed). Next: prep Phase 2.

---

## 0. Why this project exists

The owner (you) is **learning fullstack development from scratch**:
- **Frontend:** React (already used by this site)
- **Backend:** JavaScript / Node.js (new — this is the main thing being learned)

The vehicle for learning is a **CMS (Content Management System)**: a small admin
tool that lets you and Shani add/remove the photos and videos shown in the
WorkGrid section — without editing code or redeploying.

> **CMS in plain terms:** a "control panel" for the website's content. Instead
> of a developer dropping files in a folder and rebuilding the site, a person
> logs into a web page, uploads a photo, and it appears on the live site.

---

## 1. ⭐ Teaching Contract — how to work with me (READ FIRST)

This is **how Claude must teach the owner.** Follow it every session:

> **⭐ TOP PRIORITY — the real goal is UNDERSTANDING THE WHOLE SYSTEM, not a finished app.**
> The owner is learning to build and reason about the entire stack on their own. Every step
> must deepen their mental model of how the pieces connect (browser ↔ fetch ↔ Express ↔ fs ↔
> disk, build-time vs runtime, auth flow, etc.). A working feature the owner doesn't understand
> is a FAILURE. Slow and understood beats fast and opaque.

1. **The owner writes ALL the code themselves — logic, markup, AND CSS.** Claude does NOT author
   code files (this includes "mechanical"/boilerplate/CSS — the earlier exception is RETIRED).
   Claude's job is to guide, explain, give small writable specs, and review — never to type the
   code for them. The only things Claude may edit directly are the docs/`.md` files and, when the
   owner explicitly asks, a specific fix they've okayed.
2. **Explain in simple terms** *why* we run a command or use a library — what
   problem it solves — before/while using it. No unexplained magic.
3. **Small steps.** One concept at a time. Confirm understanding before moving on.
4. **Define jargon** the first time it appears (see the Glossary, section 8).
5. **Connect to what they already know** — e.g. relate the new runtime API to the
   existing `import.meta.glob` they already understand.
6. **Pace:** depth over speed. It's fine to be slow if it means real understanding.
7. **Always tie a piece back to the whole.** When teaching one part, show where it sits in the
   end-to-end flow so the owner builds a system-level picture, not isolated snippets.

> If you (future Claude) are reading this: the owner is a **beginner full-stack
> developer** whose explicit goal is to understand the entire system end-to-end and write every
> line themselves. Treat every new tool/command as something to explain, not assume — and never
> hand them finished code (CSS included).

---

## 2. What we're building (scope)

**v1 must-haves (and nothing more — YAGNI):**
- ✅ Upload a photo or video to a category (photoshoot / weddings / management / ugc)
- ✅ Delete existing media from a category
- ✅ Shared password login (both the developer and Shani use one login)
- ✅ A clean dashboard a non-technical person (Shani) can use

**Explicitly deferred (NOT in v1):** reordering media, captions, cover-image
selection. We can add them later.

---

## 3. The core idea (the one concept that makes a CMS work)

**Today** the live site reads media at **build time**:
`src/content/workMedia.ts` uses Vite's `import.meta.glob` to scan the
`public/work/<category>/` folders *when the site is built*.

**Problem:** uploads happen *after* the site is built. Build-time scanning can
never see them.

**Solution:** read media at **runtime** instead. The live site asks a backend
*"what media exists for category X right now?"* and the backend answers from
storage that the CMS writes to. **Replacing build-time scanning with a runtime
API call is the heart of this whole project.**

---

## 4. Architecture

### Phase 1 — Local fullstack (we build this now → learn Node.js)

```
┌─────────────────┐         HTTP          ┌──────────────────┐
│  React Admin     │  ───────────────────► │  Express server  │
│  /admin dashboard│  ◄─────────────────── │  localhost:3001  │
│  login, upload,  │   JSON + files        │                  │
│  list, delete    │                       │  reads/writes ↓  │
└─────────────────┘                        └────────┬─────────┘
        ▲                                            │ fs (filesystem)
        │ fetches media list                         ▼
┌─────────────────┐                        public/work/<category>/
│  Live site       │                          ├── videos/*.mp4
│  WorkGrid detail │ ◄───── same API ──────    └── photos/*.webp
└─────────────────┘
```

**Key decision — NO database in Phase 1.** The filesystem *is* the data:
- List media  = read a folder (`fs.readdir`)
- Upload      = write a file into the folder
- Delete      = remove a file (`fs.unlink`)

This is the runtime twin of what `import.meta.glob` already does, so it builds on
a mental model the owner already has, and lets us learn core Node without a
database in the way.

**Files go into the existing `public/work/<category>/videos|photos/` folders** so
the live site displays them with almost no change.

### Phase 2 — Serverless + cloud (LATER, do not build yet)

The payoff/lesson: **serverless functions have no permanent disk.** When we try
to deploy Phase 1 to Vercel, filesystem storage breaks — and *that failure
motivates Phase 2*:
- **Supabase Storage** → holds the actual files
- **Supabase Postgres (database)** → holds the metadata we used to get from `readdir`
- **Vercel Serverless Functions** → host the backend with the live site
- **Real auth** → proper login

We learn *why* each piece exists because we'll have hit the wall without it.

---

## 5. Tech stack & what each tool is for

| Tool | Phase | What it is, in plain terms |
|---|---|---|
| **React** | 1 | Builds the dashboard UI (already in this project). |
| **Express** | 1 | A Node.js library that makes it easy to write a web server — define "when a request comes to this URL, run this function." |
| **Node.js** | 1 | The runtime that lets JavaScript run *outside the browser* (on a server / your machine). |
| **multer** | 1 | An Express add-on that handles **file uploads** (reading an uploaded file out of a request and saving it to disk). |
| **fs / path** | 1 | Built-in Node modules for working with the **f**ile **s**ystem and file paths. |
| **fetch** | 1 | Browser function the React app uses to call the backend API. |
| **Supabase** | 2 | A hosted service bundling file storage + Postgres database + auth. |
| **Vercel Functions** | 2 | Runs backend code next to the static site, no separate server. |

---

## 6. Phase 1 — task checklist

Work top-to-bottom. Check items off as we complete them.

- [x] **Set up the server folder** — create `server/`, `npm init`, install `express`
- [x] **Hello-world Express server** — `app.listen(3001)`, one test route, run it
- [x] **`GET /api/media/:category`** — `fs.readdir` the category folders, return JSON (+ allowlist guard against path traversal)
- [x] **`POST /api/media/:category`** — install + use `multer` to save uploads (mimetype routes video→videos/, else photos/; returns `{ok, file}`; verified end-to-end)
  - [x] **Hardened upload** — `fileFilter` MIME allowlist (`ALLOWED_TYPES`) + `limits.fileSize` (5 MB; bump for real video). Blocks Stored XSS via `.html`/`.svg` uploads. Verified: `.html` rejected (400), valid `.jpg` accepted. (Auth = Password-gate step; CSP/serving headers = Phase 2.)
- [x] **`DELETE /api/media/:category/:filename`** — `fs.unlink` (filename guard blocks `/`,`\`,`..` path traversal; subfolder chosen by extension; try/catch → "No such file"; verified: real delete OK, missing handled, attack URL blocked & faq.json safe)
- [x] **Wire the live site** — `WorkGrid` `DetailView` now `fetch`es `http://localhost:3001/api/media/:category` via `useState`+`useEffect` (replaced dead `VIDEO_MANIFEST`/build-time globs). Also: trimmed WorkGrid to the 4 real categories + purged all i18n/dead code; added `http://localhost:3001` to the `connect-src` CSP in `index.html` (dev-only — remove in Phase 2 when API is same-origin). Verified end-to-end in browser: upload → appears in panel, delete → removed.
- [x] **Password gate (server side)** — shared `ADMIN_TOKEN` in `.env` (loaded via `dotenv`, fail-fast if missing, `.env` gitignored) + `requireAuth` middleware on POST/DELETE (reads `Authorization: Bearer <token>`, 401 if mismatch, `next()` if valid). GET left public. Verified with curl: no token → 401, valid token → reaches handler. **Still open:** CORS lockdown (`*` → admin origin) + constant-time compare (`crypto.timingSafeEqual`) — deferred to Phase-2 hardening.
- [x] **React `/admin` page — FULL CRUD dashboard** (owner wrote all TSX + CSS). Login gate (token in `localStorage`, lazy init, `handleLogin`/`handleLogout`, server verify via `GET /api/auth/check`). **Category tabs** (`CATEGORIES.map`, active-tab base+modifier class). **Media grid**: `loadMedia()` extracted (one fetch, `cache:"no-store"`), `useEffect(...,[category])` reads on tab change; grouped Photos/Videos `<section>`s with counts + empty states; responsive CSS grid (`repeat(auto-fill, minmax(160px,1fr))`) + square `aspect-ratio`/`object-fit:cover` tiles. **Upload**: `<input type=file>` → `FormData` → `POST` with `Bearer` token → `loadMedia()` refresh. **Delete**: per-tile button (filename via `url.split("/").pop()`), `window.confirm` guard, `DELETE` with token → `loadMedia()`. All wired with `try/catch`. **NOTE:** `Admin.css` login/shell was pre-written by Claude before the "owner writes CSS" rule (study reference); owner wrote everything from the tabs onward.
- [x] **Lean upload security pass** (owner-written, all logic ports to Phase 2). (1) `fileFilter` now checks an **extension→MIME `ALLOWED` map** — extension must be known AND match the claimed MIME (MIME alone is client-controlled, untrustworthy). (2) Saved filename = **`randomUUID()`+validated ext** (kills overwrite, weird chars, path tricks; original name discarded — friendly name → Phase 2 DB column if wanted). (3) `X-Content-Type-Options: nosniff` on all API responses — but noted the real payoff is Phase 2 (Express doesn't serve the media files; Vite/Vercel/Supabase do).
- [~] **Polish for Shani** — confirm-before-delete ✅ done. Still: upload progress, error auto-clear on success, styled upload/delete affordances, loading state.
- [x] **Ongoing thread:** DevTools/QA literacy — taught in-context: Console logging, Network tab (200 vs **304**/ETag caching, watching DELETE→GET fire), reject-path & failure-path testing, brace-matching to locate syntax errors.

---

## 7. Decisions log (why we chose what)

| Decision | Choice | Reason |
|---|---|---|
| Architecture | Local Express first, serverless later | Learn Node basics before cloud complexity |
| Backend host (Phase 1) | Local Express server, not Vercel | "Build without serverless for now to catch Node.js basics" |
| Database (Phase 1) | None — filesystem is the data | Simpler; mirrors existing `import.meta.glob` model |
| File location | Existing `public/work/<cat>/` | Live site shows them with almost no change |
| Auth | One shared password | Both developer + Shani use it; minimal to build |
| v1 features | Upload + delete only | YAGNI; reorder/captions deferred |
| Teaching style | Owner writes code, Claude explains | Owner is learning Node from scratch |

---

## 8. Glossary (simple definitions, grow this as we go)

- **Backend** — code that runs on a server, not in the browser. Handles data,
  files, logins. The browser can't do these safely on its own.
- **Frontend** — code that runs in the browser (the React UI the user sees).
- **API** — a set of URLs the frontend can call to ask the backend to do things
  (e.g. `GET /api/media/weddings` = "give me the weddings media").
- **Route / endpoint** — one URL + method the server responds to.
- **Middleware** — a function that runs *before* your route handler (e.g. to check
  a password) and can stop or pass the request along.
- **Runtime vs build time** — build time = when the site is compiled before
  deploy; runtime = while the site is actually running for a visitor.
- **Environment variable (`.env`)** — a secret/config value (like a password) kept
  out of the code so it isn't committed to git.
- **`app.get(path, handler)`** — defines a route: "when a GET request comes to
  `path`, run `handler(req, res)`." `req` = the incoming request, `res` = our reply
  (`res.send(...)` sends text back to the browser). Siblings: `app.post`,
  `app.delete` for other HTTP methods.
- **HTTP methods** — the "verb" of a request. GET = read/give me data,
  POST = send/save data (uploads), DELETE = remove. Same `app.<verb>` pattern.
- **`app.listen(port, cb)`** — actually starts the server and makes it wait for
  requests on `port` forever (that's why the terminal "hangs"). `cb` runs once on
  startup. Defining routes alone does nothing until `listen` runs.
- **Port** — a numbered "door" on the machine so requests find the right server.
  Frontend = 8080, backend = 3001.
- **`console.log(...)`** — prints to the developer's terminal (only you see it),
  vs `res.send(...)` which sends to the visitor's browser. Used to see what's
  happening inside the server / debug.
- **Route parameter (`:category`)** — the `:` makes a URL segment a variable. One
  route serves all categories; the value lands in `req.params.category`.
- **`async` / `await`** — disk/network work takes time. `await` pauses until it
  finishes, then continues with the result. Only usable inside an `async` function.
- **`fs.readdir(dir)`** — returns an array of the filenames inside a folder.
- **`.map(fn)`** — transforms every item in an array (e.g. filename → public URL).
- **`res.json(obj)`** — sends structured JSON data back (vs `res.send` = plain text).
- **Untrusted input** — any value the outside world controls (URL params, body).
  Never use it directly in file paths / queries; validate it first.
- **Path traversal** — an attack using `..` in input to escape the intended folder
  and reach other files. Prevented here by an allowlist.
- **Allowlist** — only explicitly permitted values pass; everything else is rejected
  (`CATEGORIES.includes(category)`). Safer than trying to block bad values.
- **HTTP status codes** — how the server says how it went: 200 OK, 400 Bad Request,
  404 Not Found, 500 Server Error. Set with `res.status(code)`.
- **`return` in a handler** — stops the function immediately so later (e.g. unsafe)
  code doesn't run after an error response.

---

## 8.5 Tech debt (note now, fix later — NOT blocking the CMS)

- **`src/components/work/WorkGrid.tsx` is large (~821 lines).** It holds 4 components
  (`WorkGrid`, `WorkCard`, `VideoLightbox`, `DetailView`) + data arrays (`PALETTES`,
  `WORK_ITEMS`, `FEATURED`) in one file. `DetailView` alone is ~400 lines.
- It also mixes **inline `style={{}}` (39 of them) with a 276-line `WorkGrid.css`** —
  inconsistent. NOTE: many inline styles are *dynamic* (e.g. `background: p.bg` from the
  per-category `PALETTES`) and legitimately can't move to static CSS; only the static ones
  should migrate.
- **Suggested cleanup (own task, later):** split `DetailView` into its own file, move data
  arrays to a `workData.ts`, and make inline-vs-CSS consistent. Do this carefully — file has
  Hebrew text, the critical WhatsApp link, and animations that must be preserved.

## 9. Where we left off

**Session 2026-06-16:** Brainstormed and approved the design (this document).

**Session 2026-06-21:** Built the backend foundation:
- Created `server/` with its own `package.json` (`"type": "module"`), installed Express.
- Wrote `server/index.js`: hello-world route + `GET /api/media/:category` that
  `fs.readdir`s the category's `videos/`+`photos/` folders and returns `{videos, photos}`
  as `/work/...` URLs (same shape as `workMedia.ts`).
- Added an allowlist guard (`CATEGORIES`) → fixes a path-traversal vuln flagged by
  security review + handles bad categories with a 400.
- Verified: valid category works, bad/malicious categories rejected.

**Session 2026-06-22:** Built and verified the **upload route** `POST /api/media/:category`:
- Chain: `validateCategory` → `upload.single('file')` (multer) → handler returns `{ok:true, file}`.
- multer `storage` routes by mimetype: `video/*` → `videos/`, everything else → `photos/`.
- Verified end-to-end with curl: video landed in `videos/`, photo in `photos/`, and the
  GET route then listed both with `/work/...` URLs. Test files cleaned up afterward.
- Gotcha learned: Windows `curl.exe` can't read git-bash `/tmp/` paths (curl error 26).
  Not a server bug — only affects CLI testing; the React dashboard sends files directly.

**Session 2026-06-22 (cont.):** Built and verified the **DELETE route** + hardened upload:
- `DELETE /api/media/:category/:filename`: filename guard (rejects `/`,`\`,`..` → 400),
  subfolder picked by extension (`.mp4`/`.webm`→videos, else photos), `try`/`catch` around
  `fs.unlink` ("No such file" if missing). Verified: real delete OK, missing handled,
  path-traversal attack URL blocked and `src/content/faq.json` confirmed untouched.
- Upload hardened with `fileFilter` (MIME allowlist) + `limits.fileSize` (5 MB — bump for video).
- **Backend API is now feature-complete for v1: GET (list) + POST (upload) + DELETE (remove).**
- Recurring gotcha: stale `node` servers from old sessions answer on :3001 and cause confusing
  404s/empty responses. Always kill what's on the port before restarting (Claude manages the
  test server). Also: Windows `curl.exe` can't read git-bash `/tmp/` paths (curl error 26).

**Session 2026-06-23:** **Wired the live site** — the Work `DetailView` now fetches media at
runtime from the backend instead of build-time globs:
- `WorkGrid.tsx` `DetailView`: `const [media,setMedia]=useState<WorkMedia>({videos:[],photos:[]})`
  + a `useEffect(...,[item.id])` that `fetch`es `http://localhost:3001/api/media/:category`,
  parses JSON into state (`.catch` → empty). `videos`/`hasVideos`/`galleryItems` now read from
  `media`. Replaced the dead `VIDEO_MANIFEST`/`item.videos`/`item.gallery` leftovers.
- Trimmed WorkGrid to the 4 real categories (photoshoot/weddings/management/ugc) and purged all
  i18n + dead-niche code.
- **CSP fix:** the fetch was silently blocked by the `connect-src` directive in `index.html`
  (only `'self'`+analytics were allowed). Added `http://localhost:3001`. **Dev-only — remove in
  Phase 2** when the API becomes same-origin (`/api` on Vercel, covered by `'self'`).
- Debug lesson: a blocked `fetch` shows **no Network row** — the CSP violation only surfaces in
  the **Console**. Check Console first when a request seems to "not fire".
- Verified end-to-end in the real browser UI: uploaded a test PNG → appeared in the panel with no
  code change/redeploy; deleted it via the DELETE route → gone. `tsc --noEmit` clean.

**Session 2026-06-24:** **`.mov` → `.mp4` conversion** (Shani uploaded most videos as `.mov`):
- Root cause: `.mov` files were **HEVC/H.265** (confirmed via `ffprobe`) — Safari plays them,
  but Chrome/Firefox do **not**. Fix = transcode to H.264 `.mp4` (universal playback).
- Batch-converted all **22 `.mov`** with `ffmpeg` (`-c:v libx264 -pix_fmt yuv420p -crf 23
  -preset medium -c:a aac -movflags +faststart`), verified H.264 + full size, then deleted the
  `.mov` originals. Now 32 `.mp4` total (22 converted + 10 already-mp4). ugc was already all mp4.
- **ffmpeg-in-a-loop gotcha:** ffmpeg reads **stdin**, so in a `while read` loop it eats the next
  filenames (garbled names, "Enter command" prompts). Fix: `ffmpeg -nostdin ... </dev/null` and
  iterate with `find -print0 | while read -d ''` for Hebrew names/spaces. Also kill stray ffmpeg
  before deleting outputs (a lingering process locks the file → "Device or resource busy").
- **Decision:** future dashboard will **auto-convert `.mov`→`.mp4` on upload** (server-side ffmpeg).
  Works on the local Express server; **revisit for Phase 2** (Vercel serverless can't run ffmpeg
  easily — may need a transcode service or client-side conversion).
- **GET route now filters to real media** — videos `.mp4`/`.webm`, photos `.jpg/.jpeg/.png/.webp`;
  stray files (leftover `.mov`, `README.txt`, `.DS_Store`) are skipped, never served as broken media.

**Session 2026-06-25:** **Password gate (server side)** — built shared-token auth:
- `npm install dotenv`; created `.env` (project root, gitignored line 30) with `ADMIN_TOKEN=...`.
  Loaded via `import 'dotenv/config'` at the very top; pulled into `const ADMIN_TOKEN` with a
  **fail-fast** `throw` if missing (caught a real "empty .env" bug — crashed loud instead of running
  a broken gate). Gotcha learned: `dotenv/config` reads `.env` from the **cwd you launch node from**,
  not the file's folder — start the server from the project root (or use `config({path})`).
- `requireAuth(req,res,next)`: strips `Bearer ` off `req.headers.authorization`, compares to
  `ADMIN_TOKEN`, `401` on mismatch, `next()` on match. Wired into POST **before** `upload.single`
  (so an unauthorized file never hits disk) and into DELETE after `validateCategory`. GET stays public.
- Verified with curl on a non-existent file: no token → `401 Invalid token`; valid token →
  `400 No such file` (proves it passed the gate into the real handler). Teaching note reinforced:
  middleware must either send a response or call `next()` — falling off the end hangs the request.

**Session 2026-06-28/29:** **`/admin` login gate — built + verified end-to-end** (owner wrote all code):
- Setup: moved `dotenv` into `server/` (was wrongly in root), moved `.env` → `server/.env` (so cwd
  matches when launched from `server/`), added **nodemon** as a devDep + `"server": "nodemon index.js"`
  script (auto-restart on save; named `server` not `dev` to avoid clashing with the front-end `bun run dev`).
- `App.tsx`: added `<Route path="/admin" element={<Admin />} />`. Entry point = **bookmark only**, no
  public link (keeps the marketing site clean; the gate is the real protection).
- `Admin.tsx` (owner-written): `token` state via **lazy init** `useState(() => localStorage.getItem(KEY)||"")`
  so a refresh stays logged in; `handleLogin`/`handleLogout` write/remove the token. Login is a single
  password field; `token===""` ⇒ logged out (conditional render swaps login ↔ shell).
- **Real verification (step 2):** added `GET /api/auth/check` (server) — `requireAuth` + `res.json({ok:true})`,
  a read-only, side-effect-free probe. `handleLogin` is now `async`, `fetch`es it with `Authorization:
  Bearer <input>`; `res.ok` → save+login, else "invalid password", `catch` → "can't reach server".
  Taught: `fetch` only throws on network failure, NOT on 401 — use `res.ok` for HTTP errors.
- **CORS preflight wall (hit intentionally, then fixed):** cross-origin `:8080`→`:3001` + custom
  `Authorization` header triggers an `OPTIONS` preflight; old middleware only sent `Allow-Origin`, so the
  browser blocked it (surfaced as the `catch`/"can't reach server" branch). Fix: added
  `Access-Control-Allow-Headers: Authorization, Content-Type`, `Allow-Methods`, and `OPTIONS`→`204`.
- Concepts cemented this session: stateless auth (server re-checks every request; client login = UX only,
  never security — attackers skip the UI and curl the endpoint directly); routes = the only doorway the
  browser can reach server code through; startup-registers-routes vs per-request-runs-matched-handler.

**Session 2026-07-05:** **Full CRUD dashboard + lean security pass — Phase 1 functionally COMPLETE** (owner wrote every line, TSX + CSS):
- **Category tabs → live grid:** taught `useEffect`/dependency array as the *trigger* (re-fetch on `[category]`); extracted `loadMedia()` so both the effect and the write-handlers can call one fetch (DRY). Grid grouped into Photos/Videos `<section>`s with counts + `=== 0` empty states. **CSS lessons (owner wrote):** flexbox for the tab bar (base `.admin-tab` + `.is-active`/`admin-tab-active` modifier — same element, both classes; specificity + inherited shape = DRY), and CSS Grid for the gallery (`repeat(auto-fill, minmax(160px,1fr))` = responsive with no media queries; `aspect-ratio:1/1` + `object-fit:cover` for tidy square tiles). Colour lesson: `--rose` is *light* → pair with **ink text**, never white (contrast; same reason the Enter button is ink-filled).
- **Upload:** `<input type=file>` (accept = hint only, not security) → capture `File|null` in state (taught the `<File|null>` generic — needed because `useState(null)` infers `null`) → `FormData` (files aren't JSON) → `POST` with `Bearer` token, **no** hand-set `Content-Type` (let the browser set the multipart boundary) → on success `setFile(null)` + `loadMedia()`.
- **Delete:** per-tile button in a `.admin-tile` wrapper (**key moves to the wrapper** — taught *why* keys matter: React matches list items by key across renders; url key = unique+stable so deleting one tile doesn't reload the others). Handler takes the filename as an **argument** (each button passes its own), `window.confirm` guard, `DELETE` (target in URL, no body) with token → `loadMedia()`.
- **The refresh insight (owner asked "why a function not just cache?"):** cache controls *what* a fetch returns; the bug was *when* it runs — the effect only fires on `category` change, so upload/delete need a second trigger → a callable `loadMedia()`. `cache:"no-store"` is the separate, smaller fix (fresh data after a write).
- **Lean security pass** (see checklist) — extension↔MIME allowlist, `randomUUID()` filenames, `nosniff`. Framed explicitly as **portable logic** for Phase 2, after owner asked whether hardening the soon-to-be-replaced Express server is futile (answer: validation *rules* + the *why* port; only Express plumbing is throwaway — don't gold-plate it).
- **QA/DevTools taught in-context:** 200 vs 304/ETag revalidation, watching DELETE→GET fire in Network, reject-path (`.txt` → 400) and failure-path (kill server → `catch` message) testing, and locating an extra-`}` syntax error by brace-matching (error reports at EOF, cause is where counting broke).

**Publish status (owner asked):** two separate things. (1) **Public videos** = publishable now via git commit + push (Vercel rebuilds the build-time `WORK_MEDIA` from committed `public/work/` files) — needs owner's explicit go-ahead + a git-tracking check on `public/work/`. (2) **The `/admin` dashboard itself** is **local-only** and does NOT work in production (it fetches `localhost:3001`, which doesn't exist on Vercel) — it goes live only in **Phase 2**, and the exposed `ADMIN_TOKEN` must be **rotated** first.

**Next step — PREP PHASE 2** (agreed: finish security first ✅, then go cloud). Do a proper **brainstorm/spec** before coding (it's big enough to deserve a design doc). Phase 2 = swap the *backend*, not the frontend (fetch/upload/delete logic stays; mostly URLs change): **Supabase Storage** for files (+ decide if we even need a DB table or just list the bucket like the current `readdir`), **Vercel serverless functions** for the API, production CORS/env vars, real auth. **Pre-reqs:** create a Supabase account+project, **rotate the exposed admin token**, and re-apply the portable upload-validation rules inside the serverless handler. Still queued from before: server-side `.mov`→`.mp4` auto-convert (revisit — serverless can't run ffmpeg easily), CORS lockdown (`*` → admin origin) + constant-time token compare.

---

## 10. How to run things (fill in as we build)

```bash
# Frontend dev server (existing)
bun run dev          # http://localhost:8080

# Backend server (to be created in Phase 1)
# node server/index.js   → http://localhost:3001
```
