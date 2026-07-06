/**
 * ONE-TIME migration: push existing public/work media into Supabase.
 *
 * For every real media file in public/work/<category>/<videos|photos>/ it:
 *   1. uploads the bytes to the Storage bucket at  <category>/<uuid>.<ext>
 *   2. inserts a `media` row  (category, filename, type, sort_order)
 *
 * Run ONCE.  Running twice ADDS duplicates (there is no dedup) — that's why the
 * guard below refuses to run when the table already has rows unless you pass
 * MIGRATE_FORCE=1 to consciously confirm.
 *
 *   cd server
 *   MIGRATE_FORCE=1 node migrate.js     (bash)
 *   $env:MIGRATE_FORCE=1; node migrate.js   (PowerShell)
 */

import 'dotenv/config'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const WORK_DIR = path.join(__dirname, '..', 'public', 'work')
const BUCKET = 'work-media'
const CATEGORIES = ['photoshoot', 'weddings', 'management', 'ugc']

// extension → the Content-Type Storage should serve the file with
const MIME = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.mp4': 'video/mp4', '.webm': 'video/webm',
}
const VIDEO_EXT = ['.mp4', '.webm']
const PHOTO_EXT = ['.jpg', '.jpeg', '.png', '.webp']

const { SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error('Supabase env vars missing — check server/.env')
}
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

/** filenames in `dir` whose extension is allowed (ignores strays); [] if no folder. */
async function listFiles(dir, allowedExts) {
  let names = []
  try {
    names = await fs.readdir(dir)
  } catch {
    return [] // this category has no such subfolder — fine, skip it
  }
  return names.filter((n) => allowedExts.includes(path.extname(n).toLowerCase()))
}

async function migrate() {
  // safety: refuse to run on a non-empty table unless explicitly forced
  const { count, error: countErr } = await supabase
    .from('media')
    .select('*', { count: 'exact', head: true })
  if (countErr) throw new Error(`Could not read table: ${countErr.message}`)
  if (count > 0 && process.env.MIGRATE_FORCE !== '1') {
    console.log(
      `⚠  The media table already has ${count} row(s). This script ADDS more (no dedup).\n` +
      `   If you're sure, re-run with MIGRATE_FORCE=1.`
    )
    return
  }

  let total = 0
  let failed = 0

  for (const category of CATEGORIES) {
    let order = 0 // per-category running order

    for (const { sub, type, exts } of [
      { sub: 'videos', type: 'video', exts: VIDEO_EXT },
      { sub: 'photos', type: 'photo', exts: PHOTO_EXT },
    ]) {
      const dir = path.join(WORK_DIR, category, sub)
      const files = await listFiles(dir, exts)

      for (const name of files) {
        const ext = path.extname(name).toLowerCase()
        const filename = `${randomUUID()}${ext}`
        const buffer = await fs.readFile(path.join(dir, name))

        // 1) bytes → Storage
        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(`${category}/${filename}`, buffer, { contentType: MIME[ext] })
        if (upErr) {
          console.error(`✗ upload  ${category}/${sub}/${name}: ${upErr.message}`)
          failed++
          continue
        }

        // 2) facts → table
        const { error: dbErr } = await supabase
          .from('media')
          .insert({ category, filename, type, sort_order: order })
        if (dbErr) {
          console.error(`✗ insert  ${category}/${sub}/${name}: ${dbErr.message}`)
          failed++
          continue
        }

        order++
        total++
        console.log(`✓ ${category}/${sub}/${name}  →  ${filename}`)
      }
    }
  }

  console.log(`\nDone. Migrated ${total} file(s)${failed ? `, ${failed} failed (see above)` : ''}.`)
}

migrate()
