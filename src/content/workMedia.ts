/**
 * Auto-discovers the media shown inside each Work category's detail view.
 * Just drop files into the right folder and they appear — no code changes.
 *
 *   public/work/<category>/videos/*.mp4                  → reel (9:16 clips)
 *   public/work/<category>/photos/*.{webp,jpg,jpeg,png}  → gallery (landscape)
 *
 * Categories (must match the WORK_ITEMS ids in WorkGrid.tsx):
 *   photoshoot · weddings · management · ugc
 */

const videoGlobs = import.meta.glob('/public/work/*/videos/*.mp4', { eager: true })
const photoGlobs = import.meta.glob('/public/work/*/photos/*.{webp,jpg,jpeg,png}', { eager: true })

/** Group "/public/work/<cat>/.../file" paths into { cat: [publicUrl, …] }. */
const groupByCategory = (modules: Record<string, unknown>): Record<string, string[]> => {
  const out: Record<string, string[]> = {}
  for (const path of Object.keys(modules)) {
    const cat = path.match(/\/public\/work\/([^/]+)\//)?.[1]
    if (!cat) continue
    ;(out[cat] ??= []).push(path.replace('/public', ''))
  }
  for (const cat of Object.keys(out)) out[cat].sort()
  return out
}

export interface WorkMedia {
  videos: string[]
  photos: string[]
}

const videos = groupByCategory(videoGlobs)
const photos = groupByCategory(photoGlobs)

export const WORK_MEDIA: Record<string, WorkMedia> = Object.fromEntries(
  [...new Set([...Object.keys(videos), ...Object.keys(photos)])].map(cat => [
    cat,
    { videos: videos[cat] ?? [], photos: photos[cat] ?? [] },
  ]),
)
