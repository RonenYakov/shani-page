/**
 * Auto-discovers all .mp4 videos from public/videos/[category]/
 * Drop any .mp4 file into the right folder — it appears automatically.
 *
 * Folder structure:
 *   public/videos/weddings/         → Weddings category
 *   public/videos/social-managment/ → Social Media Management category
 *   public/videos/social/           → Social Shoots category
 *   public/videos/savethedate/      → Save the Date category
 *   public/videos/hotels/           → Hotels & Vacations category
 *   public/videos/brands/           → Brands & Content category
 */

const toUrls = (modules: Record<string, unknown>) =>
  Object.keys(modules).map(p => p.replace('/public', ''))

const weddings        = import.meta.glob('/public/videos/weddings/*.mp4',         { eager: true })
const socialManagment = import.meta.glob('/public/videos/social-managment/*.mp4', { eager: true })
const social          = import.meta.glob('/public/videos/social/*.mp4',           { eager: true })
const savethedate     = import.meta.glob('/public/videos/savethedate/*.mp4',      { eager: true })
const hotels          = import.meta.glob('/public/videos/hotels/*.mp4',           { eager: true })
const brands          = import.meta.glob('/public/videos/brands/*.mp4',           { eager: true })

export const VIDEO_MANIFEST: Record<string, string[]> = {
  weddings:    toUrls(weddings),
  restaurants: toUrls(socialManagment),
  social:      toUrls(social),
  savethedate: toUrls(savethedate),
  hotels:      toUrls(hotels),
  brands:      toUrls(brands),
}
