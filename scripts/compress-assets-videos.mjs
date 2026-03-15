import { execFileSync } from 'child_process';
import { readdirSync, statSync } from 'fs';
import { join, extname, basename } from 'path';

const FFMPEG = 'C:\\Users\\97254\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.0.1-full_build\\bin\\ffmpeg.exe';
const ASSETS_DIR = 'C:\\Users\\97254\\Desktop\\shani-cinematic-stories - Lovable_files\\shani-page\\src\\assets';

function formatMB(bytes) {
  return (bytes / 1024 / 1024).toFixed(0) + 'MB';
}

function findMovFiles(dir) {
  const results = [];
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findMovFiles(full));
    } else if (extname(entry.name).toLowerCase() === '.mov') {
      results.push(full);
    }
  }
  return results;
}

const movFiles = findMovFiles(ASSETS_DIR);
console.log(`Found ${movFiles.length} MOV files to compress\n`);

let totalBefore = 0, totalAfter = 0;

for (const movPath of movFiles) {
  const mp4Path = movPath.slice(0, -4) + '.mp4';
  const before = statSync(movPath).size;

  process.stdout.write(`Compressing ${basename(movPath)}... `);

  try {
    execFileSync(FFMPEG, [
      '-i', movPath,
      '-c:v', 'libx264',
      '-crf', '23',
      '-preset', 'fast',
      '-vf', "scale='min(1920,iw)':-2",
      '-c:a', 'aac',
      '-b:a', '128k',
      '-movflags', '+faststart',
      '-y',
      mp4Path
    ], { stdio: ['ignore', 'ignore', 'ignore'] });

    const after = statSync(mp4Path).size;
    const saving = Math.round((1 - after / before) * 100);
    console.log(`${formatMB(before)} → ${formatMB(after)} (-${saving}%)`);
    totalBefore += before;
    totalAfter += after;
  } catch (err) {
    console.log(`FAILED: ${err.message.slice(0, 80)}`);
    totalBefore += before;
    totalAfter += before;
  }
}

console.log(`\n===== TOTAL =====`);
console.log(`Before: ${formatMB(totalBefore)}`);
console.log(`After:  ${formatMB(totalAfter)}`);
console.log(`Saved:  ${formatMB(totalBefore - totalAfter)} (-${Math.round((1 - totalAfter / totalBefore) * 100)}%)`);
