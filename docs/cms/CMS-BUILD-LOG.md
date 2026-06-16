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

- [ ] **Set up the server folder** — create `server/`, `npm init`, install `express`
- [ ] **Hello-world Express server** — `app.listen(3001)`, one test route, run it
- [ ] **`GET /api/media/:category`** — `fs.readdir` the category folders, return JSON
- [ ] **Wire the live site** — rewrite `src/content/workMedia.ts` to `fetch` the API
- [ ] **`POST /api/media/:category`** — install + use `multer` to save uploads
- [ ] **`DELETE /api/media/:category/:filename`** — `fs.unlink`
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

---

## 9. Where we left off

**Session 2026-06-16:** Brainstormed and approved the design (this document).
No code written yet. **Next step:** create the implementation plan, then start
the Phase 1 checklist at "Set up the server folder."

---

## 10. How to run things (fill in as we build)

```bash
# Frontend dev server (existing)
bun run dev          # http://localhost:8080

# Backend server (to be created in Phase 1)
# node server/index.js   → http://localhost:3001
```
