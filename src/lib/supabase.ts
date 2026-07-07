import { createClient } from "@supabase/supabase-js";

// Public, read-only Supabase access for the LIVE SITE.
// These are the *publishable* (anon) credentials — SAFE to expose in the browser.
// With the read-only RLS policy on `media`, this key can ONLY read the media list.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const BUCKET = "work-media";

type MediaRow = { filename: string; type: string };

/**
 * Read one category's media straight from Supabase (list from the table +
 * public file URLs from Storage). Used by the live site so visitors never
 * depend on the Express/Render server being awake.
 */
export async function getMedia(
  category: string
): Promise<{ videos: string[]; photos: string[] }> {
  const { data, error } = await supabase
    .from("media")
    .select("filename, type")
    .eq("category", category)
    .order("sort_order")
    .returns<MediaRow[]>();

  if (error) throw error;

  const urlFor = (row: MediaRow) =>
    supabase.storage.from(BUCKET).getPublicUrl(`${category}/${row.filename}`).data.publicUrl;

  const videos = data.filter((r) => r.type === "video").map(urlFor);
  const photos = data.filter((r) => r.type === "photo").map(urlFor);
  return { videos, photos };
}

/**
 * Uploads bytes straight from the browser to Storage using a signed URL minted by
 * the admin server (see `server/index.js` `/sign`). Render never sees the file.
 */
export async function uploadToSignedUrl(path: string, token: string, file: File) {
  const { error } = await supabase.storage
    .from(BUCKET)
    .uploadToSignedUrl(path, token, file, { contentType: file.type });
  if (error) throw error;
}
