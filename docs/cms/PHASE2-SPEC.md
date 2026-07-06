# Phase 2 Spec — Cloud CMS (hosted Express + Supabase)

> **Design doc / source of truth for Phase 2.** Brainstormed & approved 2026-07-05.
> Owner writes all code (guided); this spec records *what* we're building and *why*.
> Companion to `CMS-BUILD-LOG.md` (§4 originally assumed serverless — **this spec supersedes
> that:** we keep the Express server, we do NOT go serverless).

---

## 1. Goal

Make the CMS work in **production**, not just on the owner's laptop:
- Shani (or the owner) logs into `/admin` from anywhere, uploads/deletes/reorders media.
- The **live site** shows those changes **immediately** — no code change, no redeploy.

Only two hard requirements drive everything:
1. **The backend must be reachable in production** (today it's `localhost:3001` — laptop-only).
2. **Files must be durable** (survive redeploys; no disk-size limits on video).

---

## 2. Key decisions (and why)

| # | Decision | Choice | Why |
|---|---|---|---|
| 1 | Backend hosting | **Keep the Express server, host it always-on** (Render / Railway / Fly) | Reuses the code + mental model the owner already understands; only the storage layer changes. **No serverless.** |
| 2 | Why not serverless | Rejected | Would force a full rewrite (file-per-endpoint, stateless) **and** hit Vercel's ~4.5 MB request limit — fatal for video uploads. A hosted Express server has **no such limit**. |
| 3 | File storage | **Supabase Storage bucket** | Durable cloud storage; survives redeploys; no disk limit. Replaces `public/work/` on local disk. |
| 4 | Data model | **Supabase Postgres `media` table** (not just listing the bucket) | Needed for **reordering** — a bucket has no concept of order. Table also absorbs category/type that used to be folder structure. |
| 5 | Reordering | **In scope for Phase 2** (owner requested) | Drives decision 4. Represented by a `sort_order` column. |
| 6 | Human auth | **Keep the shared token, hardened** | Requirement is unchanged: one shared password for owner + Shani. Supabase Auth solves problems we don't have (per-user accounts). |
| 7 | Server→Supabase auth | **Supabase service key**, server-only env var | The function's own credential to read/write the bucket + table. The browser NEVER sees it. Separate from the human login. |

---

## 3. Architecture

```
Shani's browser                     Express server                        Supabase
(/admin dashboard)   ── HTTPS ──►   (hosted on Render, always-on)   ──►   ├─ Storage bucket  (the files)
                                     SAME routes as Phase 1                └─ media table     (facts + sort_order)
Live site (WorkGrid) ── HTTPS ──►   same GET /api/media/:category ────────┘
```

**Stays as-is:** route structure, `requireAuth`, `validateCategory`, request flow, all frontend logic.
**Changes:** only the storage layer inside 3 routes (disk → Supabase), plus a new reorder route.

---

## 4. Data model — the `media` table

One row per file. Category and video/photo (which were *folders* in Phase 1) become *columns*.

| column | type | notes |
|---|---|---|
| `id` | uuid, PK, default `gen_random_uuid()` | row id |
| `category` | text | `photoshoot` / `weddings` / `management` / `ugc` |
| `filename` | text | the `randomUUID().<ext>` object name in the bucket — links row → file |
| `type` | text | `video` or `photo` |
| `sort_order` | integer | GET returns rows `ORDER BY sort_order` — the reason the table exists |
| `original_name` | text, nullable | the human filename we discarded on disk; kept here for possible future display |
| `created_at` | timestamptz, default `now()` | upload time; fallback ordering |

**Bucket layout:** `work/<category>/<video|photo>/<uuid>.<ext>` (mirror Phase 1 paths so URLs stay familiar), OR flat `work/<uuid>.<ext>` — decide at build time; the table's `category`/`type` are the real source of truth either way.

---

## 5. Route changes (disk → Supabase)

The **shape** of each route is unchanged; only the storage calls swap.

| Route | Phase 1 (disk) | Phase 2 (Supabase) |
|---|---|---|
| `GET /api/media/:category` | `fs.readdir` two folders | `supabase.from('media').select().eq('category', …).order('sort_order')` → return public URLs |
| `POST /api/media/:category` | `multer` → disk | `multer` → **memory buffer** → `supabase.storage.upload()` **+** `insert` a `media` row |
| `DELETE /api/media/:category/:filename` | `fs.unlink` | `supabase.storage.remove()` **+** `delete` the matching row |
| `POST /api/media/:category/reorder` *(new)* | — | receive ordered list of ids → `update` each row's `sort_order` |

### 5.1 The one genuinely new mechanic — `multer` memory storage
Instead of `multer.diskStorage`, use **`multer.memoryStorage()`**: multer hands the route the file as a **buffer in memory** (`req.file.buffer`), which we pass to `supabase.storage.upload()`. No disk touched. Because this is a real hosted server (not serverless), **large videos are fine** — no size wall.

### 5.2 Two-systems sync (the new responsibility)
Every write now touches **two** systems (bucket + table). Failure to design for:
- Upload: file lands but row insert fails → **orphan file** (exists in bucket, invisible to the app).
- Delete: row deleted but file remove fails → **orphan file** (or vice-versa).
- **Plan:** on upload, insert the row **only after** the storage upload succeeds; on delete, remove the file **then** the row (or tolerate a missing file, like Phase 1's try/catch did). Full transactional guarantees are out of scope for v1 — log failures and keep it recoverable.

---

## 6. Supporting pieces

1. **Migration (one-time)** — script to upload existing `public/work/**` files into the Supabase bucket and seed the `media` table (assign `sort_order` by current sort). Nothing is lost. Verify counts match before trusting it.
2. **Live-site switch** — WorkGrid stops using the build-time `WORK_MEDIA` hybrid; `DetailView` fetches the hosted `GET /api/media/:category` in **both** dev and prod. This delivers the payoff: uploads appear live with no redeploy. (Remove the `import.meta.env.DEV` branch added as the Phase 1 stopgap.)
3. **Config + secrets:**
   - Frontend: replace hardcoded `http://localhost:3001` with an env-based base URL (`VITE_API_URL` → localhost in dev, Render URL in prod).
   - Server (Render env vars): **rotated** `ADMIN_TOKEN` (long random), `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`.
   - CORS: lock `Access-Control-Allow-Origin` from `*` to the admin/site origin(s).

---

## 7. Security (fold in during the port)

- **Rotate the admin token** — the Phase 1 value leaked into editor selections; generate a fresh long random value, store only in Render env + local `.env` (gitignored). Never commit.
- **Constant-time compare** — replace `token !== ADMIN_TOKEN` with `crypto.timingSafeEqual` (deferred hardening).
- **Service key stays server-only** — never sent to the browser, never in frontend code, never committed.
- **Carry over the portable upload validation** already written in Phase 1: extension↔MIME `ALLOWED` map, `randomUUID()` filenames.
- **CORS lockdown** — `*` → explicit admin + live-site origins.

---

## 8. Deferred / out of scope for Phase 2 v1

- Captions, cover-image selection (table can hold them later — columns are cheap).
- `.mov`→`.mp4` auto-convert on upload (ffmpeg is awkward off a laptop; revisit — maybe a transcode step or require mp4 on upload).
- Supabase Auth / per-user accounts (only if Shani ever needs her own separate login).
- Full transactional bucket↔table consistency (v1: insert-after-upload ordering + logging).

---

## 9. Build order (checklist — owner writes each, guided)

**Prereqs (owner does in browser — Claude can't run these interactive flows):**
- [ ] Create a Supabase account + project.
- [ ] Create a Storage bucket (public read) for the media.
- [ ] Create the `media` table (schema in §4).
- [ ] Grab `SUPABASE_URL` + `SUPABASE_SERVICE_KEY`; put them in `server/.env` (gitignored).
- [ ] Generate a new random `ADMIN_TOKEN`.

**Port the server (local first, still on localhost:3001 but talking to cloud Supabase):**
- [ ] `npm install @supabase/supabase-js`; create the Supabase client from env vars.
- [ ] GET → Supabase `select` (verify list works against cloud data).
- [ ] Switch multer to `memoryStorage`; POST → `storage.upload` + row `insert`.
- [ ] DELETE → `storage.remove` + row `delete`.
- [ ] New reorder route → `update` `sort_order`.
- [ ] Migration script → move existing `public/work` media up; verify.

**Go live:**
- [ ] Frontend: env-based API URL (`VITE_API_URL`).
- [ ] Live-site WorkGrid → fetch hosted API in prod too (remove Phase 1 hybrid).
- [ ] Deploy the server to Render/Railway with env vars; CORS lockdown.
- [ ] End-to-end test on the real live site: upload → appears live; delete → gone; reorder → sticks.

---

## 10. What we're NOT changing

The frontend `/admin` logic (login, tabs, grid, upload, delete handlers) is reused nearly as-is —
mostly the **API base URL** changes. The reorder **UI** (drag-and-drop vs up/down arrows) is a
frontend decision to make when we build that screen — not decided here.
