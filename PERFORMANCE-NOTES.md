# Page-Speed & Image Audit (TASK-016)

## Done in this PR (code)
- **Lazy-loading:** Added `loading="lazy" decoding="async"` to 166 below-fold
  `<img>` tags across 57 pages. The first image on each page (logo / LCP candidate)
  is intentionally left eager.
- **Logo to WebP:** Swapped the nav logo from `SunriseLogo.jpeg` to the existing
  `SunriseLogo.webp` site-wide (smaller payload; the WebP asset already existed).
- The homepage already had explicit `width`/`height` on its images, an eager logo,
  and lazy content images.

## Needs the build environment / image tooling (not available in this container)
This container has no `lighthouse` (Chrome) or `cwebp`/ImageMagick, so the following
were not performed here and are recommended follow-ups:
- **Run Lighthouse (mobile)** on the homepage + top 3 service pages; target LCP < 2.5s.
  Use the Vercel preview URL or `npx lighthouse <url> --preset=desktop/mobile`.
- **Convert remaining large JP/PNG hero/content images to WebP** (notably
  `images/Roof Installation_edited.jpg`) and reference the WebP, keeping JPEG
  fallbacks via `<picture>` if desired. Many images already have `.webp` siblings
  in `/images` that can be wired in.
- **Add explicit width/height** to any remaining images that lack them (prevents CLS).
- **Preload the LCP image** on the homepage + key landing pages if Lighthouse flags it.
