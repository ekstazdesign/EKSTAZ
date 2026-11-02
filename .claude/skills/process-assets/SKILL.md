---
name: process-assets
description: Use when Elton or Haris supplies artwork, letters, marks or other files (uploads, zips, Drive) that need to become site-ready: web sizes, transparent cut-outs of red-on-black marks, gallery wiring, and the sources record.
---

1. **Look first.** Make a contact sheet of the files (Pillow) and read it. Identify each piece; do not guess titles. Missing titles or mediums go to STATUS as working titles for Elton.
2. **Never alter the original look.** Resize only (never upscale), re-encode JPEG at quality about 84 (full, longest side up to 2000) and about 80 (`-sm`, 640 wide). Cutting a flat red-on-black mark to transparent is allowed for site use only (alpha from the red channel); log it.
3. **Run `python3 -I dev/prep-assets.py <art|mark|letter> <source> <name>`** (add `--box x0,y0,x1,y1` to crop a mark out of a framed file), then view the result on a dark background to check edges.
4. **Wire in:** add a gallery `<li>` to `work.html` (`data-art`, `data-title`, `data-medium`, `data-full`, `srcset`, `width`, `height`, `loading="lazy"`, descriptive `alt`); the viewer, share addresses and keyboard navigation pick it up automatically. Letters and marks live in `assets/letters/` and `assets/marks/`.
5. **Record** every file in `docs/ASSET-SOURCES.md` (supplier, date, processing, size, any caveat such as a small source).
6. **Verify:** `dev/artwork-checks.mjs` (unique slugs, viewer, wrap-around navigation), and look at `work.html` at 390 and 1440 px.
7. Hand off with `asset-steward` rules in mind: third-party marks need a rights check (STATUS D9).
