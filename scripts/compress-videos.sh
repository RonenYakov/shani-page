#!/bin/bash
# Compress all .mov videos in public/ to H.264 MP4
# CRF 23 = good quality, ~70-85% smaller than raw MOV
# -vf scale=-2:1080 = cap at 1080p, keep aspect ratio

FFMPEG="/c/Users/97254/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.0.1-full_build/bin/ffmpeg.exe"
PUBLIC="c:/Users/97254/Desktop/shani-cinematic-stories - Lovable_files/shani-page/public"

compress_video() {
  local input="$1"
  local output="${input%.mov}.mp4"
  local before_size=$(stat -c%s "$input" 2>/dev/null || stat -f%z "$input")

  echo "Compressing: $(basename "$input")"
  "$FFMPEG" -i "$input" \
    -c:v libx264 \
    -crf 23 \
    -preset fast \
    -vf "scale='min(1920,iw)':-2" \
    -c:a aac \
    -b:a 128k \
    -movflags +faststart \
    -y \
    "$output" 2>/dev/null

  if [ $? -eq 0 ]; then
    local after_size=$(stat -c%s "$output" 2>/dev/null || stat -f%z "$output")
    local saving=$(( (before_size - after_size) * 100 / before_size ))
    echo "  ✓ $(basename "$output")  $(numfmt --to=iec $before_size) → $(numfmt --to=iec $after_size)  (-${saving}%)"
  else
    echo "  ✗ Failed: $(basename "$input")"
  fi
}

echo "=== Compressing videos in public/ ==="
for f in "$PUBLIC"/*.mov; do
  [ -f "$f" ] && compress_video "$f"
done

echo ""
echo "Done. Check .mp4 files alongside .mov originals."
echo "Once code is updated, delete the .mov files."
