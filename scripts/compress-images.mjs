import sharp from 'sharp';
import { readdir, stat, rename } from 'fs/promises';
import { join, extname, basename } from 'path';

const PUBLIC_DIR = decodeURIComponent(new URL('../public', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'));

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.JPG', '.JPEG', '.png', '.PNG'];

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

async function compressImage(filePath) {
  const ext = extname(filePath).toLowerCase();
  const dir = filePath.substring(0, filePath.lastIndexOf('/') + 1) || filePath.substring(0, filePath.lastIndexOf('\\') + 1);
  const base = basename(filePath, extname(filePath));
  const outPath = join(dir, base + '.webp');

  const beforeStat = await stat(filePath);
  const beforeSize = beforeStat.size;

  try {
    const img = sharp(filePath);
    const meta = await img.metadata();

    // Resize if wider than 1920px (keeps aspect ratio)
    let pipeline = img;
    if (meta.width && meta.width > 1920) {
      pipeline = pipeline.resize(1920, null, { withoutEnlargement: true });
    }

    // WebP at quality 82 — good quality/size balance
    await pipeline.webp({ quality: 82 }).toFile(outPath);

    const afterStat = await stat(outPath);
    const afterSize = afterStat.size;
    const saving = ((1 - afterSize / beforeSize) * 100).toFixed(0);

    console.log(`✓ ${basename(filePath)} → ${basename(outPath)}  ${formatBytes(beforeSize)} → ${formatBytes(afterSize)}  (-${saving}%)`);
    return { before: beforeSize, after: afterSize };
  } catch (err) {
    console.error(`✗ ${basename(filePath)}: ${err.message}`);
    return { before: beforeSize, after: beforeSize };
  }
}

async function main() {
  // Find all images in public/ (top-level + subdirs)
  async function findImages(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    const results = [];
    for (const entry of entries) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...await findImages(full));
      } else if (IMAGE_EXTENSIONS.includes(extname(entry.name))) {
        results.push(full);
      }
    }
    return results;
  }

  const images = await findImages(PUBLIC_DIR);
  console.log(`Found ${images.length} images to compress\n`);

  let totalBefore = 0, totalAfter = 0;
  for (const img of images) {
    const result = await compressImage(img);
    totalBefore += result.before;
    totalAfter += result.after;
  }

  console.log(`\n===== TOTAL =====`);
  console.log(`Before: ${formatBytes(totalBefore)}`);
  console.log(`After:  ${formatBytes(totalAfter)}`);
  console.log(`Saved:  ${formatBytes(totalBefore - totalAfter)} (-${((1 - totalAfter / totalBefore) * 100).toFixed(0)}%)`);
  console.log(`\nWebP files created alongside originals.`);
  console.log(`Once you update the code to use .webp paths, you can delete the originals.`);
}

main().catch(console.error);
