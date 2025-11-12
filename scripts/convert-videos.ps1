# Video Conversion Script for Web Optimization (PowerShell)
# Converts .mov files to WebM and MP4 formats optimized for web delivery
# Usage: .\convert-videos.ps1 -InputDir "public" -OutputDir "public/optimized"

param(
    [string]$InputDir = "public",
    [string]$OutputDir = "public/optimized"
)

# Check if FFmpeg is installed
$ffmpegExists = Get-Command ffmpeg -ErrorAction SilentlyContinue
if (-not $ffmpegExists) {
    Write-Host "Error: FFmpeg is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install FFmpeg from https://ffmpeg.org/download.html" -ForegroundColor Yellow
    exit 1
}

# Create output directories
New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null
New-Item -ItemType Directory -Force -Path "$OutputDir/posters" | Out-Null

Write-Host "========================================"  -ForegroundColor Blue
Write-Host "   Video Optimization Script" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue
Write-Host ""
Write-Host "Input directory: $InputDir" -ForegroundColor Green
Write-Host "Output directory: $OutputDir" -ForegroundColor Green
Write-Host ""

# Find all .mov files
$videoFiles = Get-ChildItem -Path $InputDir -Filter *.mov -Recurse -File

if ($videoFiles.Count -eq 0) {
    Write-Host "No .mov files found in $InputDir" -ForegroundColor Yellow
    exit 1
}

Write-Host "Found $($videoFiles.Count) video file(s) to convert" -ForegroundColor Green
Write-Host ""

$totalFiles = 0
$convertedFiles = 0
$failedFiles = 0
$totalSizeBefore = 0
$totalSizeAfter = 0

foreach ($video in $videoFiles) {
    $totalFiles++
    $filename = $video.BaseName
    
    Write-Host "[$totalFiles/$($videoFiles.Count)] Processing: $filename" -ForegroundColor Blue
    
    # Get original file size
    $sizeBefore = $video.Length / 1KB
    $totalSizeBefore += $sizeBefore
    
    # Create poster image
    Write-Host "  → Creating poster image..." -ForegroundColor Gray
    $posterPath = Join-Path $OutputDir "posters\${filename}.jpg"
    $posterArgs = @(
        "-i", $video.FullName,
        "-ss", "00:00:01",
        "-vframes", "1",
        "-q:v", "2",
        $posterPath,
        "-hide_banner",
        "-loglevel", "error",
        "-y"
    )
    
    $process = Start-Process -FilePath "ffmpeg" -ArgumentList $posterArgs -Wait -NoNewWindow -PassThru
    if ($process.ExitCode -eq 0) {
        Write-Host "  ✓ Poster created" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Poster creation failed" -ForegroundColor Yellow
    }
    
    # Convert to WebM
    Write-Host "  → Converting to WebM..." -ForegroundColor Gray
    $webmPath = Join-Path $OutputDir "${filename}.webm"
    $webmArgs = @(
        "-i", $video.FullName,
        "-c:v", "libvpx-vp9",
        "-crf", "30",
        "-b:v", "0",
        "-row-mt", "1",
        "-threads", "4",
        "-c:a", "libopus",
        "-b:a", "96k",
        "-vf", "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease",
        $webmPath,
        "-hide_banner",
        "-loglevel", "error",
        "-y"
    )
    
    $process = Start-Process -FilePath "ffmpeg" -ArgumentList $webmArgs -Wait -NoNewWindow -PassThru
    if ($process.ExitCode -eq 0) {
        $sizeWebm = (Get-Item $webmPath).Length / 1KB
        $reductionWebm = [math]::Round(100 - ($sizeWebm * 100 / $sizeBefore), 1)
        Write-Host "  ✓ WebM created ($reductionWebm% smaller)" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ WebM conversion failed" -ForegroundColor Yellow
    }
    
    # Convert to MP4
    Write-Host "  → Converting to MP4..." -ForegroundColor Gray
    $mp4Path = Join-Path $OutputDir "${filename}.mp4"
    $mp4Args = @(
        "-i", $video.FullName,
        "-c:v", "libx264",
        "-preset", "slow",
        "-crf", "23",
        "-profile:v", "high",
        "-level", "4.0",
        "-c:a", "aac",
        "-b:a", "128k",
        "-movflags", "+faststart",
        "-vf", "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease",
        $mp4Path,
        "-hide_banner",
        "-loglevel", "error",
        "-y"
    )
    
    $process = Start-Process -FilePath "ffmpeg" -ArgumentList $mp4Args -Wait -NoNewWindow -PassThru
    if ($process.ExitCode -eq 0) {
        $sizeMp4 = (Get-Item $mp4Path).Length / 1KB
        $reductionMp4 = [math]::Round(100 - ($sizeMp4 * 100 / $sizeBefore), 1)
        Write-Host "  ✓ MP4 created ($reductionMp4% smaller)" -ForegroundColor Green
        $convertedFiles++
        $totalSizeAfter += $sizeWebm + $sizeMp4
    } else {
        Write-Host "  ⚠ MP4 conversion failed" -ForegroundColor Yellow
        $failedFiles++
    }
    
    Write-Host ""
}

# Calculate total savings
$totalSizeBeforeMB = [math]::Round($totalSizeBefore / 1024, 2)
$totalSizeAfterMB = [math]::Round($totalSizeAfter / 1024, 2)
$totalReduction = [math]::Round(100 - ($totalSizeAfter * 100 / $totalSizeBefore), 1)

# Print summary
Write-Host "========================================" -ForegroundColor Blue
Write-Host "   Conversion Summary" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue
Write-Host ""
Write-Host "Total files processed: $totalFiles" -ForegroundColor Green
Write-Host "Successfully converted: $convertedFiles" -ForegroundColor Green
Write-Host "Failed: $failedFiles" -ForegroundColor Yellow
Write-Host ""
Write-Host "Original size: $totalSizeBeforeMB MB" -ForegroundColor Yellow
Write-Host "Optimized size: $totalSizeAfterMB MB" -ForegroundColor Green
Write-Host "Total reduction: $totalReduction%" -ForegroundColor Green
Write-Host ""
Write-Host "✓ Optimization complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Test videos in browser"
Write-Host "2. Update video sources in components"
Write-Host "3. Deploy optimized videos"
Write-Host ""

