# Manual Steps to Complete

## Generate OG Image (Required for social sharing)

The OG meta tags point to `og-image.png` but the file doesn't exist yet.
Social scrapers (Telegram, WhatsApp, Twitter, iMessage) need a raster image — the SVG source won't work.

### Steps

1. Open `public/og-image-source.svg` in Chrome
2. Set device/emulation to 1200×630
3. Screenshot and save as `public/og-image.png`
4. Push:

```bash
git add public/og-image.png
git commit -m "chore: add rasterized OG image for social sharing"
git push
```

### Why this matters

Without this file, anyone sharing the link on social media sees a broken/blank preview.
With it, they see a dark red banner with the club crest, petition headline, and URL.
