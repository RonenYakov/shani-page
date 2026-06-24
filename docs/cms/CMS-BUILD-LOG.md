# CMS Build Log — Shani Workgrid Media Manager

> **Living document.** This is our single source of truth. We update the
> "Where we left off" + checklist every session so we can always catch up
> on what we did and why. Read this top-to-bottom to get back up to speed.

Last updated: **2026-06-16** · Status: **Phase 1 — in progress** (Node v22 / npm 10 confirmed)

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

1. **The owner writes code too.** Do NOT just dump finished files. Give small,
   writable pieces and let the owner type them. Guide, don't replace.
2. **Explain in simple terms** *why* we run a command or use a library — what
   problem it solves — before/while using it. No unexplained magic.
3. **Small steps.** One concept at a time. Confirm understanding before moving on.
4. **Define jargon** the first time it appears (see the Glossary, section 8).
5. **Connect to what they already know** — e.g. relate the new runtime API to the
   existing `import.meta.glob` they already understand.
6. **Pace:** depth over speed. It's fine to be slow if it means real understanding.

> If you (future Claude) are reading this: the owner is a **beginner backend
> developer**. Treat every new tool/command as something to explain, not assume.

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
- [ ] **Password gate** — a shared password in an env var + a check middleware
- [ ] **React `/admin` page** — login form, category picker, upload, grid, delete
- [ ] **Polish for Shani** — progress bar, errors, confirm-before-delete

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

**Next step:** **Password gate** — a shared admin token/password in an env var + a check
middleware on POST/DELETE, and lock CORS down from `*` to the admin origin (closes the
outstanding HIGH security finding). Then the React `/admin` dashboard. **Tie in here:** auto-convert
`.mov`→`.mp4` on upload + the queued filename sanitization/extension+magic-byte validation.

---

## 10. How to run things (fill in as we build)

```bash
# Frontend dev server (existing)
bun run dev          # http://localhost:8080

# Backend server (to be created in Phase 1)
# node server/index.js   → http://localhost:3001
```
