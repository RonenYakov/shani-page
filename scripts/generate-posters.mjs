import { execFileSync } from 'child_process';
import { mkdirSync, existsSync } from 'fs';
import { join, basename } from 'path';

const FFMPEG = 'C:\\Users\\97254\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.0.1-full_build\\bin\\ffmpeg.exe';
const BASE = 'C:\\Users\\97254\\Desktop\\shani-cinematic-stories - Lovable_files\\shani-page';

// Only the videos we're keeping in the carousels
const videos = [
  // Brands (5)
  { input: `${BASE}\\src\\assets\\brands\\mahlevet evri.mp4`,         poster: `${BASE}\\public\\posters\\brands\\mahlevet evri.webp` },
  { input: `${BASE}\\src\\assets\\brands\\streets.mp4`,               poster: `${BASE}\\public\\posters\\brands\\streets.webp` },
  { input: `${BASE}\\src\\assets\\brands\\ugc-B.mp4`,                 poster: `${BASE}\\public\\posters\\brands\\ugc-B.webp` },
  { input: `${BASE}\\src\\assets\\brands\\סרטון תדמית מסעדה-B.mp4`,  poster: `${BASE}\\public\\posters\\brands\\סרטון תדמית מסעדה-B.webp` },
  { input: `${BASE}\\src\\assets\\brands\\agalt-cafe.mp4`,            poster: `${BASE}\\public\\posters\\brands\\agalt-cafe.webp` },
  // Hotels (4)
  { input: `${BASE}\\src\\assets\\hotels\\v1c044g50000d2qrjgfog65q8kapaf30.mp4`,  poster: `${BASE}\\public\\posters\\hotels\\v1c044g50000d2qrjgfog65q8kapaf30.webp` },
  { input: `${BASE}\\src\\assets\\hotels\\v14044g50000d1ma62vog65k1sjdbu90.mp4`, poster: `${BASE}\\public\\posters\\hotels\\v14044g50000d1ma62vog65k1sjdbu90.webp` },
  { input: `${BASE}\\src\\assets\\hotels\\hotel drone shot.mp4`,                  poster: `${BASE}\\public\\posters\\hotels\\hotel drone shot.webp` },
  { input: `${BASE}\\src\\assets\\hotels\\v14044g50000d1pk9hfog65ji0k9nub0.mp4`, poster: `${BASE}\\public\\posters\\hotels\\v14044g50000d1pk9hfog65ji0k9nub0.webp` },
  // Weddings (5)
  { input: `${BASE}\\src\\assets\\weddings\\סושיאל חתונה.mp4`,                              poster: `${BASE}\\public\\posters\\weddings\\סושיאל חתונה.webp` },
  { input: `${BASE}\\src\\assets\\weddings\\מסיבת אירוסין-W.mp4`,                           poster: `${BASE}\\public\\posters\\weddings\\מסיבת אירוסין-W.webp` },
  { input: `${BASE}\\src\\assets\\weddings\\copy_4CB7BB16-8667-4394-9EFC-4820095F619E.mp4`, poster: `${BASE}\\public\\posters\\weddings\\copy_4CB7BB16-8667-4394-9EFC-4820095F619E.webp` },
  { input: `${BASE}\\src\\assets\\weddings\\חתונה-W.mp4`,                                   poster: `${BASE}\\public\\posters\\weddings\\חתונה-W.webp` },
  { input: `${BASE}\\src\\assets\\weddings\\proposel.mp4`,                                  poster: `${BASE}\\public\\posters\\weddings\\proposel.webp` },
];

// Create output dirs
for (const dir of ['brands','hotels','weddings']) {
  const p = `${BASE}\\public\\posters\\${dir}`;
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

for (const { input, poster } of videos) {
  process.stdout.write(`Poster: ${basename(input)}... `);
  try {
    execFileSync(FFMPEG, [
      '-ss', '1',          // seek to 1 second
      '-i', input,
      '-vframes', '1',     // extract exactly 1 frame
      '-vf', 'scale=640:-2',  // 640px wide, keep aspect
      '-y',
      poster
    ], { stdio: ['ignore','ignore','ignore'] });
    console.log('done');
  } catch (e) {
    console.log(`FAILED: ${e.message.slice(0,60)}`);
  }
}

console.log('\nAll posters generated in public/posters/');
