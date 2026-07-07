import { Input, Output, Conversion, ALL_FORMATS, BlobSource, Mp4OutputFormat, BufferTarget } from "mediabunny";

// Supabase Storage free-tier per-file cap.
const MAX_OUTPUT_BYTES = 50 * 1024 * 1024;
// Guard against a phone video large enough to OOM the tab while decoding.
const MAX_INPUT_BYTES = 2 * 1024 * 1024 * 1024;
// 1080p-equivalent long edge (works for both portrait and landscape phone footage).
const MAX_LONG_EDGE = 1920;
// Default bitrate target when a transcode is already required (HEVC input, oversized frame, etc).
const DEFAULT_BITRATE = 4_000_000;
// Retry rungs if the output still doesn't fit under MAX_OUTPUT_BYTES. `undefined` on the
// first rung means "only force a bitrate if something else already forced a transcode" —
// this lets an already-compliant H.264 MP4/MOV take the fast remux path instead of re-encoding.
const RETRY_BITRATES: (number | undefined)[] = [undefined, 2_500_000, 1_200_000];

function isBrowserSupported() {
  return typeof VideoEncoder !== "undefined" && typeof VideoDecoder !== "undefined";
}

async function buildVideoOptions(input: Input, forceBitrate?: number) {
  const track = await input.getPrimaryVideoTrack();
  if (!track) return null;

  const codec = await track.getCodec();
  const width = await track.getDisplayWidth();
  const height = await track.getDisplayHeight();
  const longEdge = Math.max(width, height);

  const opts: { codec?: "avc"; width?: number; height?: number; bitrate?: number } = {};
  if (codec !== "avc") opts.codec = "avc"; // anything but H.264 must be re-encoded to play everywhere
  if (longEdge > MAX_LONG_EDGE) {
    if (width >= height) opts.width = MAX_LONG_EDGE;
    else opts.height = MAX_LONG_EDGE;
  }
  // Only re-encode (and therefore only need a bitrate cap) when something above forced a transcode.
  if (forceBitrate || opts.codec || opts.width || opts.height) {
    opts.bitrate = forceBitrate ?? DEFAULT_BITRATE;
  }
  return opts;
}

async function runConversion(file: File, forceBitrate: number | undefined, onProgress?: (p: number) => void) {
  const input = new Input({ source: new BlobSource(file), formats: ALL_FORMATS });
  const videoOptions = await buildVideoOptions(input, forceBitrate);
  if (!videoOptions) {
    throw new Error("הקובץ שנבחר אינו קובץ וידאו תקין.");
  }

  const output = new Output({ format: new Mp4OutputFormat(), target: new BufferTarget() });
  const conversion = await Conversion.init({ input, output, video: videoOptions });

  if (!conversion.isValid) {
    throw new Error("לא הצלחנו להמיר את הווידאו הזה. נסי לייצא אותו כ-MP4 מהטלפון ולנסות שוב.");
  }

  conversion.onProgress = (progress) => onProgress?.(progress);
  await conversion.execute();

  const buffer = (output.target as BufferTarget).buffer;
  if (!buffer) throw new Error("ההמרה נכשלה — נסי שוב.");
  return buffer;
}

/**
 * Converts any video file (MOV, MP4, etc.) into a web-ready MP4: H.264, capped at
 * ~1080p and ≤50MB (Supabase's per-file limit). Already-compliant H.264 MP4s take a
 * fast remux path instead of a full re-encode.
 */
export async function convertVideoForUpload(
  file: File,
  onProgress?: (progress: number) => void
): Promise<File> {
  if (!isBrowserSupported()) {
    throw new Error("הדפדפן הזה לא תומך בהמרת וידאו. נסי כרום או ספארי מעודכנים.");
  }
  if (file.size > MAX_INPUT_BYTES) {
    throw new Error("הקובץ גדול מדי (מעל 2GB). נסי לקצר את הסרטון בטלפון ולהעלות שוב.");
  }

  let buffer: ArrayBuffer | null = null;
  let lastError: Error | null = null;

  for (const bitrate of RETRY_BITRATES) {
    try {
      buffer = await runConversion(file, bitrate, onProgress);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      break; // a real conversion failure — retrying at a lower bitrate won't help
    }
    if (buffer.byteLength <= MAX_OUTPUT_BYTES) break;
    buffer = null; // too big — step down the ladder and try again
  }

  if (!buffer) {
    throw lastError ?? new Error("הסרטון גדול מדי גם אחרי דחיסה. נסי לקצר אותו או להוריד את האיכות בטלפון.");
  }

  const name = file.name.replace(/\.[^.]+$/, "") + ".mp4";
  return new File([buffer], name, { type: "video/mp4" });
}
