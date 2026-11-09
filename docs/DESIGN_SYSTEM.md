# Oxy Village Resort by De Verveil: Design System

Live reference: run `npm run dev` and open `/?design-system`.
Source of truth: `src/styles/tokens.css` (CSS) and `src/lib/motion.js`, `src/lib/breakpoints.js` (JS).

## 1. Identity

Concept: **held in green**. The resort sits in landscape, so the interface frames photography rather than competing with it. Warm ivory ground, deep forest depth, brass used only as a fine line.

Wordmark until the logo arrives: `OXY VILLAGE` in Cormorant Garamond, 0.24em tracking, with `RESORT · BY DE VERVEIL` beneath in small tracked Hanken Grotesk caps.

Reference points: boutique resorts, architectural studios, premium travel editorial. Nothing is copied from an existing site.

## 2. Colour

| Name | Token | Hex | Use |
|---|---|---|---|
| Deep Forest Green | `--forest` | #14201A | Primary dark, text on light, hero and footer ground |
| Moss Green | `--moss` | #2F4A3A | Secondary dark, alternate dark panels, hover fills |
| Sage | `--sage` | #8A9A82 | Muted UI, quiet icons |
| Mist | `--mist` | #CFD6CC | Hairlines on light |
| Warm Ivory | `--bone` | #F4EFE6 | Page ground, text on dark |
| Linen | `--linen` | #E9E1D2 | Alternate sections, image placeholders |
| Muted Brass | `--brass` | #B08D57 | Fine lines, ornaments, accent on dark |
| Natural Clay | `--clay` | #B6764E | Warm accent, large type and details only |

Text-safe variants: `--brass-text` #7A5B2E, `--clay-text` #8A4F2E, `--ink-muted` #4D5A52 (secondary text on ivory), `--bone-muted` #B9C2B8 (secondary text on forest). State: `--error` #9B3D2A, `--success` #3F6A4F.

Proportion: about 60% ivory/linen, 25% forest/moss, 10% sage/mist, 5% brass/clay. No decorative gradients. The only gradients are image scrims.

Semantic tokens (`--bg`, `--bg-alt`, `--fg`, `--fg-muted`, `--line`, `--accent`) are swapped by the `.theme-dark` class, so a component written with semantic tokens works on both grounds.

### Contrast (WCAG 2.x)

| Pair | Ratio | Result | Use |
|---|---|---|---|
| Forest on Ivory | 14.65:1 | AAA | Body text on light |
| Moss on Ivory | 8.48:1 | AAA | Headings, links on light |
| Ink muted on Ivory | 6.32:1 | AA | Secondary text on light |
| Brass text on Ivory | 5.45:1 | AA | Small accent text on light |
| Clay text on Ivory | 5.66:1 | AA | Small warm accent on light |
| Clay on Ivory | 3.22:1 | AA large only | Large type and decoration only |
| Ivory on Forest | 14.65:1 | AAA | Body text on dark |
| Bone muted on Forest | 9.17:1 | AAA | Secondary text on dark |
| Brass on Forest | 5.43:1 | AA | Accent text on dark |
| Sage on Forest | 5.61:1 | AA | Decorative or large text on dark |
| Ivory on Moss | 8.48:1 | AAA | Text on moss panels |
| Error on Ivory | 5.93:1 | AA | Form errors |

## 3. Typography

- Display: **Cormorant Garamond** 400/500, italic 400 for emphasis words.
- Body and UI: **Hanken Grotesk** 400/500/600.
- Loaded from `@fontsource` packages, self-hosted by Vite (no third-party font requests).

| Class | Token | Range (rem at base size) | Use |
|---|---|---|---|
| `.display-xl` | `--step-6` | 4.5 to 12 | One oversized statement per page |
| `.display` | `--step-5` | 3.75 to 8.5 | Hero title |
| `.h1` | `--step-4` | 3 to 5.5 | Section titles |
| `.h2` | `--step-3` | 2.2 to 3.5 | Sub-section titles |
| `.h3` | `--step-2` | 1.6 to 2.25 | Card titles |
| `.h4` | `--step-1` | 1.25 to 1.5 | Small headings |
| `.lede` | `--step-1` | 1.25 to 1.5 | Introductions |
| body | `--step-0` | 1 to 1.125 | Paragraphs |
| `.eyebrow` | `--step--1` | 0.78 to 0.85 | Uppercase labels, 0.18em tracking |

Rules: headings use `text-wrap: balance`, body uses `pretty`. Display leading 1.02, headings 1.1, body 1.65. Prose measure max 62ch. Italic is for emphasis words inside headlines, never whole paragraphs. Tracking tokens: `--track-tight` -0.02em, `--track-wide` 0.08em, `--track-caps` 0.18em, `--track-brand` 0.24em.

## 4. Spacing and grid

Spacing scale: `--space-1` 0.25rem, 2 0.5, 3 0.75, 4 1, 5 1.5, 6 2, 7 3, 8 4.5, 9 7, 10 10 (rem). Section rhythm: `--section-y` (5 to 11rem fluid), `--section-y-sm`.

Grid: 12 columns, `--col-gap` 1 to 2rem fluid. Containers: `.container` 90rem, `.container--wide` 105rem, `.container--narrow` 60rem, gutter `--gutter` 1.25 to 4rem fluid. Place items with `.col` and `--start` / `--span`; below 800px every `.col` becomes full width.

Asymmetry: large image on columns 1 to 7, small offset image on 9 to 12, nudged down so it breaks the line.

## 5. Breakpoints and devices

| Key | Min width | Devices |
|---|---|---|
| xs | 0 | Small Android phones and iPhones (320 to 479) |
| sm | 480 | Large phones (480 to 767) |
| md | 768 | Tablets (768 to 1023) |
| lg | 1024 | Laptops, landscape tablets (1024 to 1439) |
| xl | 1440 | Desktops (1440 to 1919) |
| xxl | 1920 | Large displays |

Per device:

- **Android phones (360 to 412):** single column, 44px minimum tap targets, overlay menu, no pinned sections, horizontal showcases become swipe rows.
- **iPhones (375 to 440):** as Android plus safe-area insets (`env(safe-area-inset-*)`), 16px minimum form fields (prevents iOS zoom), `100svh` for full-screen sections, `viewport-fit=cover`.
- **Tablets:** two-column editorial layouts, overlay menu below 900px, touch rules (no hover-only effects), pinned horizontal scroll off below 900px.
- **Laptops:** full navigation, asymmetric 12-column layouts, pinned storytelling and horizontal scroll on.
- **Desktop:** container 90rem, generous whitespace, all motion on.
- **Large displays:** root font size 112.5% at 1920px and 125% at 2560px, so type, spacing and container scale together. Supply imagery at 2560px wide or more.

## 6. Buttons

Variants: `primary` (outline, fill sweeps up on hover), `light` (outline for dark grounds), `solid` (filled forest), `solid-light` (filled ivory), `ghost` (text with animated underline). Sizes: `sm`, `md`, `lg`. Uppercase, 0.16em tracking, 2px radius, optional arrow icon. Hover effects are wrapped in `@media (hover: hover)`. Press: Motion `whileTap` scale 0.975. Disabled: 45% opacity, no pointer events. Focus: 2px brass outline.

## 7. Navigation

Transparent over imagery with ivory text. After 60px: ivory glass background, forest text, hairline border. Hides on scroll down past 500px, returns on scroll up (always visible for reduced motion and when focus enters it). 1px brass progress line. Active section underlined (`aria-current`). Below 900px: menu button opens a full-screen forest overlay (clip-path wipe, staggered links), Escape closes, scroll locked, Lenis paused.

## 8. Image treatment

- Ratios: portrait 4/5, tall 3/4, landscape 16/9, wide 21/9, square 1/1 (`.ratio-*`).
- Minimal grading (`.img-grade`: saturate 0.96, contrast 1.02). The real light carries the page.
- One scrim recipe (`.scrim-bottom`): forest gradient, 72% to transparent over the lower 65%. Text over imagery always sits on it.
- Full-bleed for hero and showcases, inset for supporting images, offset for asymmetry.
- Missing photograph: `MediaFrame` shows a labelled linen placeholder, never a broken image.
- Specs: WebP/AVIF at 2560px wide, responsive sizes below; MP4 H.264 for video with a poster image; every informative image has descriptive alt text, decorative images use `alt=""`.

## 9. Motion language

Principle: **breathe, don't bounce.** Slow expo-out easing, no overshoot springs, reveal once, never repeatedly.

Tokens (`src/lib/motion.js`, mirrored in `tokens.css`):

| Token | Value |
|---|---|
| `duration.micro / ui / reveal / scene / slow` | 0.2 / 0.5 / 0.9 / 1.4 / 1.8 s |
| `ease.out` (GSAP `expo.out`) | cubic-bezier(0.16, 1, 0.3, 1) |
| `ease.inOut` (GSAP `expo.inOut`) | cubic-bezier(0.65, 0, 0.35, 1) |
| `ease.soft` | cubic-bezier(0.25, 0.1, 0.25, 1) |
| `stagger.text / cards / list` | 0.06 / 0.12 / 0.08 s |
| `distance.reveal / parallax / hover` | 24px / 8% / 6px |
| `scroll.start` | top 85% |

**GSAP + ScrollTrigger** (cinematic, scroll-linked): `SplitText` (word-mask rise, `*italic*` markup), `MaskImage` (clip-path reveal with settling zoom), `ParallaxMedia` (scrubbed drift), `HorizontalScroll` (pinned sideways track on desktop, swipe row elsewhere), hero sequence, story highlight.

**Motion for React** (interface): header and overlay transitions, `Modal`, `Button` press, hover shifts, `Reveal` fade-up.

**Lenis**: smooth scroll for pointer devices only when reduced motion is off. Overlays and modals carry `data-lenis-prevent` and pause Lenis while open.

Rules: animate only `transform`, `opacity` and `clip-path`. Create ScrollTriggers inside `gsap.context()` and revert on unmount. Pin only at 900px and wider via `gsap.matchMedia()`. `prefers-reduced-motion` disables smooth scroll, parallax, pinning, splitting and reveals; content shows instantly. Use `will-change` sparingly.

## 10. Component guidelines

| Component | Where | Notes |
|---|---|---|
| `Button` | `components/ui` | Link or button, 5 variants, 3 sizes |
| `Modal` | `components/ui` | Focus trap, Escape, returns focus, pauses Lenis |
| `MediaFrame` | `components/ui` | Image or labelled placeholder, ratio prop |
| `Reveal` | `components/motion` | Fade-up once on entering view |
| `SplitText` | `components/motion` | Headline word reveal, accessible label |
| `MaskImage` | `components/motion` | Clip-path image reveal |
| `ParallaxMedia` | `components/motion` | Scroll drift inside a frame |
| `HorizontalScroll` | `components/motion` | Pinned or swipeable showcase |
| `Header`, `Footer` | `components/layout` | Navigation and footer |

Each page section lives in `src/sections/<Name>/` with its own CSS, reads content only from `src/data`, and uses tokens, never raw values.

## 11. Accessibility and performance

Skip link, semantic landmarks, visible focus, labelled form fields with inline errors, tap targets at least 44px, reduced-motion support throughout, text contrast per the table above. Performance: self-hosted fonts, route-level lazy loading for the design system page, vendor chunk splitting, lazy images, poster-first video, transform/opacity-only animation.
