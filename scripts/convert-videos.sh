#!/bin/bash

# Video Conversion Script for Web Optimization
# Converts .mov files to WebM and MP4 formats optimized for web delivery
# Usage: ./convert-videos.sh [input_directory] [output_directory]

INPUT_DIR="${1:-public}"
OUTPUT_DIR="${2:-public/optimized}"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR/posters"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Video Optimization Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "Input directory: ${GREEN}$INPUT_DIR${NC}"
echo -e "Output directory: ${GREEN}$OUTPUT_DIR${NC}"
echo ""

# Counter for stats
total_files=0
converted_files=0
failed_files=0
total_size_before=0
total_size_after=0

# Find all video files
shopt -s nullglob
video_files=("$INPUT_DIR"/*.mov "$INPUT_DIR"/*.MOV "$INPUT_DIR"/**/*.mov "$INPUT_DIR"/**/*.MOV)

if [ ${#video_files[@]} -eq 0 ]; then
    echo -e "${YELLOW}No .mov files found in $INPUT_DIR${NC}"
    exit 1
fi

echo -e "Found ${GREEN}${#video_files[@]}${NC} video file(s) to convert"
echo ""

for video in "${video_files[@]}"; do
    ((total_files++))
    
    # Get filename without extension
    filename=$(basename "$video" | sed 's/\.[^.]*$//')
    
    echo -e "${BLUE}[$total_files/${#video_files[@]}]${NC} Processing: ${GREEN}$filename${NC}"
    
    # Get original file size
    size_before=$(du -k "$video" | cut -f1)
    total_size_before=$((total_size_before + size_before))
    
    # Create poster image (first frame at 1 second)
    echo "  → Creating poster image..."
    if ffmpeg -i "$video" -ss 00:00:01 -vframes 1 -q:v 2 \
        "$OUTPUT_DIR/posters/${filename}.jpg" \
        -hide_banner -loglevel error -y; then
        echo -e "  ${GREEN}✓${NC} Poster created"
    else
        echo -e "  ${YELLOW}⚠${NC} Poster creation failed"
    fi
    
    # Convert to WebM (VP9) - Best compression
    echo "  → Converting to WebM..."
    if ffmpeg -i "$video" \
        -c:v libvpx-vp9 \
        -crf 30 \
        -b:v 0 \
        -row-mt 1 \
        -threads 4 \
        -c:a libopus \
        -b:a 96k \
        -vf "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease" \
        "$OUTPUT_DIR/${filename}.webm" \
        -hide_banner -loglevel error -y; then
        size_webm=$(du -k "$OUTPUT_DIR/${filename}.webm" | cut -f1)
        reduction_webm=$(( 100 - (size_webm * 100 / size_before) ))
        echo -e "  ${GREEN}✓${NC} WebM created (${reduction_webm}% smaller)"
    else
        echo -e "  ${YELLOW}⚠${NC} WebM conversion failed"
    fi
    
    # Convert to MP4 (H.264) - Compatibility fallback
    echo "  → Converting to MP4..."
    if ffmpeg -i "$video" \
        -c:v libx264 \
        -preset slow \
        -crf 23 \
        -profile:v high \
        -level 4.0 \
        -c:a aac \
        -b:a 128k \
        -movflags +faststart \
        -vf "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease" \
        "$OUTPUT_DIR/${filename}.mp4" \
        -hide_banner -loglevel error -y; then
        size_mp4=$(du -k "$OUTPUT_DIR/${filename}.mp4" | cut -f1)
        reduction_mp4=$(( 100 - (size_mp4 * 100 / size_before) ))
        echo -e "  ${GREEN}✓${NC} MP4 created (${reduction_mp4}% smaller)"
        ((converted_files++))
        total_size_after=$((total_size_after + size_webm + size_mp4))
    else
        echo -e "  ${YELLOW}⚠${NC} MP4 conversion failed"
        ((failed_files++))
    fi
    
    echo ""
done

# Calculate total savings
total_size_before_mb=$((total_size_before / 1024))
total_size_after_mb=$((total_size_after / 1024))
total_reduction=$(( 100 - (total_size_after * 100 / total_size_before) ))

# Print summary
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Conversion Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "Total files processed: ${GREEN}$total_files${NC}"
echo -e "Successfully converted: ${GREEN}$converted_files${NC}"
echo -e "Failed: ${YELLOW}$failed_files${NC}"
echo ""
echo -e "Original size: ${YELLOW}${total_size_before_mb} MB${NC}"
echo -e "Optimized size: ${GREEN}${total_size_after_mb} MB${NC}"
echo -e "Total reduction: ${GREEN}${total_reduction}%${NC}"
echo ""
echo -e "${GREEN}✓ Optimization complete!${NC}"
echo ""
echo -e "Next steps:"
echo -e "1. Test videos in browser"
echo -e "2. Update video sources in components"
echo -e "3. Deploy optimized videos"
echo ""

