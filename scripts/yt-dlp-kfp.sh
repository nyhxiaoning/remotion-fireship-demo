#!/usr/bin/env bash
set -euo pipefail
mkdir -p public/assets/kfp/clips
if [[ ! -f "scripts/kfp-links.txt" ]]; then
  echo "scripts/kfp-links.txt not found"; exit 1
fi
while IFS= read -r URL; do
  [[ -z "$URL" ]] && continue
  yt-dlp -f "bv*+ba/b" \
    -o "public/assets/kfp/clips/%(title).80s.%(ext)s" \
    --merge-output-format mp4 \
    --embed-metadata --write-info-json \
    "$URL"
done < scripts/kfp-links.txt

