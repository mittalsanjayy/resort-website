// SEO helpers shared by vite.config.js (build) and scripts/check-seo.mjs (tests).
// No domain is hard-coded anywhere in this project. Set VITE_SITE_URL (for example in Vercel's
// Environment Variables, or in a local .env file) to the live origin, such as https://your-domain.com.
// While it is empty the build leaves out the canonical link, og:url, sitemap and the Sitemap line in
// robots.txt, and keeps og:image relative, instead of guessing an address.
import { resort } from '../src/data/resort.js';

const OG_IMAGE_PATH = '/og-image.png';

// Accepts "https://example.com", "https://example.com/" or "http://localhost:4173". Returns the origin
// only (no path, query or trailing slash), or null when empty. Throws on anything that is not an http(s) URL.
export function normalizeSiteUrl(raw) {
  const value = (raw || '').trim();
  if (!value) return null;
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`VITE_SITE_URL is not a valid URL: "${value}". Use the full origin, e.g. https://your-domain.com`);
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error(`VITE_SITE_URL must start with https:// (or http:// for local testing), got "${value}"`);
  }
  return url.origin;
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// schema.org "Resort", using only facts already in src/data/resort.js. No ratings, prices, geo
// coordinates or street address are included because none were supplied.
export function structuredData(siteUrl) {
  const sameAs = Object.values(resort.social || {})
    .filter((s) => s && s.url && !s.isSearch)
    .map((s) => s.url);
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Resort',
    name: `${resort.name} ${resort.endorsement}`,
    description: `Luxury nature resort at ${resort.location.area}, ${resort.location.city}.`,
    telephone: resort.contact.phone,
    email: resort.contact.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: resort.location.city,
      addressRegion: resort.location.state,
      addressCountry: 'IN',
    },
    hasMap: resort.location.mapUrl,
  };
  if (sameAs.length) data.sameAs = sameAs;
  if (siteUrl) {
    data.url = `${siteUrl}/`;
    data.image = `${siteUrl}${OG_IMAGE_PATH}`;
  }
  return data;
}

// Escapes "<" so the JSON can never close its own <script> tag.
const jsonLd = (data) => JSON.stringify(data).replace(/</g, '\\u003c');

export function applySeo(html, siteUrl) {
  let out = html;
  const tags = [];
  if (siteUrl) {
    tags.push(`<link rel="canonical" href="${esc(siteUrl)}/" />`);
    tags.push(`<meta property="og:url" content="${esc(siteUrl)}/" />`);
    out = out.split(`content="${OG_IMAGE_PATH}"`).join(`content="${esc(siteUrl)}${OG_IMAGE_PATH}"`);
  }
  tags.push(`<script type="application/ld+json">${jsonLd(structuredData(siteUrl))}</script>`);
  const block = tags.map((t) => `    ${t}`).join('\n');
  if (!out.includes('<!-- seo:site -->')) throw new Error('index.html is missing the <!-- seo:site --> marker');
  return out.replace('<!-- seo:site -->', block);
}

export function robotsTxt(siteUrl) {
  const lines = ['User-agent: *', 'Allow: /'];
  if (siteUrl) lines.push('', `Sitemap: ${siteUrl}/sitemap.xml`);
  return `${lines.join('\n')}\n`;
}

export function sitemapXml(siteUrl) {
  if (!siteUrl) return null;
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${esc(siteUrl)}/</loc></url>\n</urlset>\n`;
}
