# Oxy Village Resort by De Verveil

React + Vite + GSAP (ScrollTrigger) + Motion for React + Lenis + Lucide icons.

Version 1.0.0. Final production delivery (Prompt 10), on top of Prompts 1 to 9.

Before going live, read **Launch checklist** below.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build into dist/
npm run preview    # serve the production build locally
```

Requires Node 18.18 or newer (Node 20 LTS recommended, see `.nvmrc`). Open the folder in VS Code and run the three commands above in its terminal.

`package-lock.json` is included. Commit it so Vercel installs the same versions.

```bash
npm run check      # dependency-free: imports, exports, asset paths, nav targets, SEO metadata
npm run verify     # check + production build
```

## Deploy to Vercel

1. Push the folder to a GitHub repository (`.gitignore` already excludes `node_modules`, `dist` and `.env`).
2. In Vercel choose **Add New > Project**, import the repository. Framework preset: **Vite** (detected automatically). Build command `npm run build`, output directory `dist`. `vercel.json` already sets both.
3. Add the environment variable `VITE_SITE_URL` once the live address is known (see "SEO and the live domain"), then redeploy.

## Design system

Full guide: `docs/DESIGN_SYSTEM.md`. Live reference page: run the dev server and open `/?design-system`.

## Where to edit

| What | File |
|---|---|
| Page copy: hero, story, experiences, activities, highlights, gallery | `src/data/content.js` |
| Resort facts, accommodation, packages, facilities, contact, social links | `src/data/resort.js` (templates for accommodation and packages are in the file) |
| Photos, videos, logo, gallery | `src/data/assets.js` (add only after the file exists in `public/assets`) |
| Colours, type scale, spacing, motion timing | `src/styles/tokens.css`, `src/lib/motion.js` |
| Navigation links and the Book Now button | `src/data/nav.js` |
| Motion tokens and breakpoints | `src/lib/motion.js`, `src/lib/breakpoints.js` |
| Reusable motion components | `src/components/motion/` |
| A page section | `src/sections/<Name>/` |

## Content rules

- Anything not provided is `null` or an empty array. Sections hide or show a neutral message. Nothing is invented.
- Packages (day outing and corporate), Facilities and Gallery sections appear automatically once data exists. The Packages nav link appears with them.
- Every card without a real photograph shows a clearly labelled "photograph to be added" placeholder. No stock or AI-generated property images are used.
- Social entries in `resort.social` are `{ label, handle, url }`. If `url` is `null` the footer shows the name as plain text.
- The enquiry form does not book or take payment. It prepares a message and hands it to WhatsApp or email using `resort.contact`; the visitor can also copy it.

## Assets

```
public/assets/images/{brand,hero,accommodation,dining,facilities,experiences,events,gallery,location}
public/assets/video/hero
```
Use lowercase kebab-case names, WebP/AVIF for images, MP4 (H.264) for video, and a poster image for every video.

## Page structure (Prompt 4)

Loader, then: Hero (`#top`), Our Story (`#story`), Experiences (`#experiences`), Activities (`#activities`),
Highlights (`#highlights`), Accommodation (`#stay`), Day Outings (`#packages`), Stay & Dining (`#stay-dining`),
Gallery (`#gallery`), Contact and Location (`#contact`), Enquiry (`#enquiry`, the Book Now target).

- The loader plays once per browser session and is skipped for reduced-motion visitors. Force it with `/?loader`.
- Every image slot is a labelled placeholder until you set a real path in `content.js` or `assets.js`.
- The hero shows an abstract layered-hills backdrop (design, not a photograph of the resort, so it has no visible label) until `assets.hero.poster` or `assets.hero.video` is set.
- The Facilities section component is kept in `src/sections/Facilities/` but is no longer rendered, because Experiences now covers the same ground. Its data is still in `resort.js`.
- "Book Now" scrolls to the enquiry form, which prepares a WhatsApp or email message. There is no payment or live booking.

## Accommodation and packages (Prompt 5)

- **Data:** `resort.accommodations` (six stays), `resort.packages` (day outing, corporate), `resort.stayPackages` (stay with breakfast, stay with meals) in `src/data/resort.js`. Copy is in `src/data/content.js`.
- **Prices** are shown exactly as supplied. The basis (per night, per person or per package) was not supplied, so none is shown. The note "Confirm package details with the resort." appears at the top of the section and in each detail view.
- **Jacuzzi Couple Room** is `enquiryOnly: true` with `price: null`. It shows as an enquiry-based option and nothing else is assumed.
- **Photos:** add real photographs to an accommodation with `images: [{ src: '/assets/images/accommodation/file.webp', alt: '...' }]` after the files exist. The first image is the card image; all of them fill the detail gallery.
- **Details:** each card opens a drawer (`src/components/ui/Drawer.jsx`) showing that stay. Focus is trapped, Escape closes it, and Previous / Next move between stays.
- **Enquiry handoff:** every Enquire / Check Package Details / Plan Your Visit button calls `requestEnquiry()` in `src/lib/enquiry.js`. It pre-selects "Interested in" in the existing form and scrolls to it. WhatsApp links use `whatsappUrl()` with `resort.contact.whatsapp`. Prompt 6 can plug a real booking system into this one file.
- Deep links to a single stay (for example `#stay-the-loft-suite`) are not implemented.

## Booking enquiry and contact (Prompt 6)

- **Enquiry form** (`src/sections/Enquiry/`): name, mobile, optional email, enquiry type (Accommodation, Day Outing, Corporate, Celebration), room / package (list follows the type), preferred date, optional check-out (Accommodation only), guests and message. Logic lives in `src/lib/enquiryForm.js` (pure functions: validation, sanitising, message building).
- **Validation:** name and mobile required; Indian 10-digit mobiles (with or without +91 / 91 / 0) or international numbers starting with +; email checked only if given; date must be today or later (within two years); guests a whole number from 1. Errors show inline, in a summary that links to each field, and are announced to screen readers.
- **WhatsApp:** on submit the page opens `https://wa.me/918147567379?text=...` with every detail, URL-encoded. The visitor must press Send in WhatsApp. If the browser blocks the window, a button opens it. Email (opens the visitor's own mail app) and Copy are alternatives.
- **No false confirmation:** the result panel says "Not confirmed yet" and that availability and rates are confirmed by the resort. Nothing says "Booking Confirmed".
- **No backend, no email service:** this is a static site. It does not send email or store enquiries, and it says so on the page. To receive enquiries automatically later, add a server or a form service and keep its key on the server, never in this front-end code.
- **Privacy / security:** no API keys or environment variables exist in the project. Form data is held in memory only (no localStorage, no analytics, no third-party requests). Inputs are sanitised (control and bidi characters stripped, lengths capped) and a hidden honeypot field ignores simple bots. External links use `rel="noopener noreferrer"`.
- **Contact section** (`src/sections/Location/`): Call, WhatsApp, Email cards, Instagram, Facebook, address and an "Open in Google Maps" button using the exact link in `resort.location.mapUrl`. There is no embedded map: Google does not allow its short share links to be embedded, and a guessed embed could pin the wrong spot.
- **Facebook:** the page URL was not supplied, so the link opens a Facebook search for "Oxy Village Resort". Replace `resort.social.facebook.url` with the real page URL and delete `isSearch`.
- **Floating WhatsApp button** (`src/components/layout/FloatingContact.jsx`) appears after the hero and hides while the enquiry form is on screen.
- The "Enquire" buttons from Prompt 5 still work: they pre-select the enquiry type and the room / package.

## Prompt 7: cinematic visuals

- **Gallery** (`src/sections/Gallery`): full-bleed feature frame, category filters (Resort, Accommodation, Pool, Nature, Dining, Experiences), masonry grid with staggered mask reveals, hover frame and "View" cursor, and a lightbox (`src/components/ui/Lightbox.jsx`) with arrows, keyboard, swipe and focus trap. Add real photographs to `assets.gallery` in `src/data/assets.js` as `{ src, alt, ratio, category }`. Until then every frame is a labelled placeholder; categories with no photographs are hidden once real photographs exist.
- **Dining** (`src/sections/StayDining`): photography composition, editorial copy, Stay with breakfast / Stay with meals, enquiry buttons. Add photographs via `assets.dining.main` and `assets.dining.inset`. No menus, dishes or prices are shown.
- **Motion**: `ScrubText`, `CursorLabel`, `useSectionTransition` join `SplitText`, `MaskImage` and `ParallaxMedia`. Section transitions, parallax drift and scrubbed text run only on suitable screens and are skipped for `prefers-reduced-motion`.
- **Navigation**: rolling-label links with a brass active dot, indexed full-screen menu with masked line reveals, header glide-in after the loader. A Dining link was added.
- `npm run build` was not executed in the authoring environment (no network for `npm install`). Run `npm install && npm run verify` locally.


## Prompt 8: responsiveness, accessibility, performance

**Layout**
- Phone landscape (any screen under 540px tall): the hero becomes two columns (headline left, text and buttons right) and fits one screen. Header, menu, lightbox and accommodation drawer also have short-screen layouts. Content respects notches (`env(safe-area-inset-*)`).
- Small phones (320px): smaller headline and spacing so the buttons and location line stay on the first screen. Laptops: headline is capped at 17% of screen height.
- Section transition (clip-path) now runs only on mouse devices at 900px and wider.

**Tap targets and focus**
- Every button and link is at least 44px tall on touch (ghost buttons, "Enquire" links, footer, contact and social links, the logo, the scroll cue).
- Focus ring uses `--accent` (darker brass on light, bright brass on dark). Jump links move focus to the target section. Escape in the menu returns focus to the menu button.

**Navigation**
- One shared handler (`handleAnchorClick` in `src/lib/lenis.js`) runs every `#link`, instead of Lenis's own anchor option. It honours reduced motion, updates the URL and moves focus. Programmatic scrolls also use it.

**Images and performance**
- `src/lib/images.js` + `imageVariants` in `src/data/assets.js` give photographs a `srcset` (640px and full size) plus width and height. Phones download about 65% less per photograph. Logo has 192px and 384px copies (was 640px for a 58px slot).
- To add a photograph with a small copy: make `name-640.webp`, then add an entry to `imageVariants`. Photographs with no entry still work.
- Hero parallax runs only on 768px+ mouse devices. Paper grain overlay and backdrop blur are off on phones. `ScrollTrigger.config({ ignoreMobileResize: true })` stops address-bar jank. The hero video does not play when the visitor has Data Saver on.
- `vercel.json`: photographs and video cache for 30 days (not "immutable"), so replacing a photograph with the same file name shows up. Built JS and CSS stay immutable.

**Checks**
- `npm run check` also verifies that every `/assets/...` path in the data files exists and that every nav link has a matching section id.

## Prompt 9: final QA, SEO readiness, cleanup

**Fixed**
- **320px sideways overflow.** The page was 327px wide on a 320px screen, which also stretched the fixed header (its burger button sat 7px off-centre). Cause: in the "What we are" list in `Our Story`, the word "accommodation" at 48px is wider than a 320px screen. The list now sizes by screen width on phones (`min(var(--step-4), 11vw)`), has a smaller active-item shift, and may wrap long words.
- **Gallery feature image at 320px.** `min-height: 16rem` combined with the 4 / 3 aspect ratio forced the frame to 341px wide. The frame now has an explicit `width: 100%`.
- **Safety nets** so a long word or a wide font can never widen the page again: headings use `overflow-wrap: anywhere`, every single-column grid uses `minmax(0, 1fr)` instead of `1fr`, and the Highlights cards have `min-width: 0`. Stress-tested at 280 to 1280px, including with a deliberately very wide font.
- **Header and menu links now update the address bar** (`#stay`, and a clean URL for Home), as the in-page links already did. Shared helper: `setHash()` in `src/lib/lenis.js`.

**Hero**: the visible "Placeholder · resort photograph to be added" label was removed (and its CSS). Add `assets.hero.poster` / `assets.hero.video` to replace the abstract backdrop.

**Cleanup**: removed the unused `useMediaQuery` hook. The 640px master logo files (`logo.png`, `logo.webp`, about 300 KB) moved from `public/` to `source-assets/brand/`, so they are no longer copied into the production build. The Facilities section is intentionally kept but not rendered (see above).

**Version**: `package.json` and `package-lock.json` are 0.9.0 (Prompt 9).

## SEO and the live domain

No domain is written anywhere in this project. Everything that needs the final address is driven by one variable:

```
VITE_SITE_URL=https://your-domain.com     # origin only; set in Vercel > Settings > Environment Variables, or in a local .env
```

| With `VITE_SITE_URL` set | With it empty (default) |
|---|---|
| `<link rel="canonical">`, `og:url`, absolute `og:image` and `twitter:image`, `url` and `image` in the structured data, `sitemap.xml`, and a `Sitemap:` line in `robots.txt` | None of those are produced; `og:image` stays `/og-image.png`. A warning is printed during `npm run build`. |

Always present: title, description, Open Graph and Twitter tags, `og:image` (`public/og-image.png`, 1200 x 630), icons, `lang="en"`, a `<noscript>` message with the resort's contact details, and schema.org `Resort` structured data built only from `src/data/resort.js` (name, phone, email, locality, map link, Instagram). No rating, price, street address or coordinates are included because none were supplied. Facebook is left out of the structured data until a real page URL replaces the search link.

Code: `scripts/seo.mjs` (logic), the `oxy-seo` plugin in `vite.config.js`, tests in `scripts/check-seo.mjs`, template in `.env.example`.

## Launch checklist

1. Run `npm install && npm run verify` on your machine, then open `npm run preview` on a real phone.
2. Set `VITE_SITE_URL` to the live origin in Vercel, then redeploy.
3. After deploying, paste the home page into a share debugger (Facebook Sharing Debugger, LinkedIn Post Inspector) to confirm the preview image.
4. Replace the Facebook search link in `resort.social.facebook` with the real page URL and delete `isSearch`.
5. Add real photographs (hero, dining, more gallery images) as described under "Assets".

## Prompt 10: final polish and delivery

**Fixed**
- **Headings lost the space before italic words** ("Held inGreen.", "Days thatunfold", "Room toplay", "Make a Dayof It."). The `*italic*` parser in `SplitText.jsx` was gluing the italic word onto the word before it. Only punctuation that directly follows a closing asterisk is glued now. This affected every section heading.
- **Gallery grid left empty columns** when there are only a few photographs (4 photographs in 3 columns). The column count now follows the number of photographs (`--gal-cols`), so 3 to 4 photographs sit in two balanced columns, one or two stay centred, and five or more use the full three-column masonry.
- **Gallery filter chips** wrap on phones instead of scrolling sideways, so every category is visible.
- **Cache headers.** Built JS and CSS now go to `/_assets/` (`build.assetsDir`), so `vercel.json` can cache them for a year without also matching the photographs in `/assets/`, which keep a 30-day cache. Before, two rules matched the same photograph URLs.

**Added**
- Icons: `favicon.ico` (16/32/48), `favicon-16.png`, `favicon-32.png`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, all made from the resort logo, plus `site.webmanifest`.
- Metadata: `robots` meta (index, follow, large image previews), `author`, `og:image:type`, descriptive `og:image:alt` and `twitter:image:alt`.
- `public/404.html`, a branded page that links back to the home page (Vercel serves it for unknown addresses).
- Security headers in `vercel.json`: `X-Frame-Options`, `Permissions-Policy` (camera, microphone, location off), alongside the existing `nosniff` and `Referrer-Policy`.
- `npm run check` now also verifies every icon, the manifest and its icons, every local `<link href>` in `index.html`, and the `robots` meta.

**Unchanged on purpose:** all copy, prices, approved designs, the six accommodation entries, the enquiry flow. No facts were added. Cards without a real photograph (Oxy Meadow Farmhouse Villa, The Loft Suite, Jacuzzi Couple Room, dining, experiences) still show an honest "photograph to be added" placeholder; add real files as described under "Assets".

**Images:** the four photographs (and the logo) are already WebP with a 640px copy for phones (`srcset`), lazy-loaded below the fold, with intrinsic width and height so nothing shifts. No further compression was applied, because re-encoding WebP again would visibly lose quality.

## Verification status (honest record)

The final delivery was prepared in an environment with **no access to the npm registry**, so `npm install` could not download packages and **`npm run build` (real Vite) was NOT run**. The same limit applied to earlier prompts. What was and was not tested:

| Check | Result |
|---|---|
| `npm run check` (project files, imports, asset paths, nav targets, SEO metadata, icons, manifest, SEO build helpers with and without a domain) | **Passed** (run for real) |
| `package.json` and `package-lock.json` agree; lockfile v3, all 120 download URLs point to registry.npmjs.org | Checked by script |
| `vercel.json` and `site.webmanifest` are valid JSON | Checked |
| Source bundled with esbuild (minified, CSS included) and loaded in Chromium, with GSAP, Motion, Lenis and Lucide replaced by small stand-ins that do not animate | **Passed** |
| 1,044 browser assertions (Playwright) at 320x568, 360x640, 390x844, 414x896, 667x375, 768x1024, 1024x768, 1280x800 and 1920x1080: no horizontal overflow, every image loads, one `h1`, every header and menu link lands on its section and updates the address, menu Escape and focus return, Book Now, all six accommodation drawers (price, Previous / Next through all six, WhatsApp link, Escape), Enquire Now from a card and from a drawer pre-selecting the room, gallery (every filter count, lightbox open, arrows, keyboard, Escape), floating WhatsApp button (link, rel, 44px tap size), booking form (empty-submit errors, valid submit opens the WhatsApp link with the entered details, "Not confirmed yet" shown), every `#` link has a target, every external link has `rel="noopener"`, no console errors, no HTTP errors | **Passed** |
| `npm install` and `npm run build` with the real Vite, and the real GSAP, Motion and Lenis animation, smooth scrolling | **Not run / not tested.** Run `npm install && npm run verify` on your machine; it is the first thing to do after extracting. |
| The real web fonts (Cormorant Garamond, Hanken Grotesk), real phones, the actual WhatsApp app handoff, Safari and Firefox | **Not tested** (fallback fonts were used in screenshots) |

Package versions in the lockfile are the ones installed in an earlier networked session of this project (Vite 5.4.21, React 18.3.1, GSAP 3.15.1, Motion 11.18.2, Lenis 1.3.27, lucide-react 0.454.0).
