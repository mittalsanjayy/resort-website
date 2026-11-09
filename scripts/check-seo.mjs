// SEO and metadata check (no dependencies). Run: npm run check
// Verifies index.html metadata, the share image, icons, and that the build helpers behave with and
// without VITE_SITE_URL. The test origin below is deliberately unresolvable; it is never used by the site.
import fs from 'node:fs';
import { applySeo, normalizeSiteUrl, robotsTxt, sitemapXml, structuredData } from './seo.mjs';

let bad = 0;
const fail = (msg) => { console.log('SEO FAIL:', msg); bad++; };
const ok = (cond, msg) => { if (!cond) fail(msg); };

const html = fs.readFileSync('index.html', 'utf8');
const meta = (attr, name) => {
  const m = html.match(new RegExp(`<meta\\s+${attr}="${name}"\\s+content="([^"]*)"`, 's'));
  return m ? m[1] : null;
};

// ---- Source index.html
const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
ok(title.length >= 20 && title.length <= 65, `title length ${title.length} (want 20-65)`);
const desc = meta('name', 'description') || '';
ok(desc.length >= 70 && desc.length <= 160, `description length ${desc.length} (want 70-160)`);
ok(/<html lang="[a-z-]+"/.test(html), 'html lang attribute missing');
ok(/name="viewport"/.test(html), 'viewport meta missing');
for (const [attr, name] of [['property', 'og:type'], ['property', 'og:title'], ['property', 'og:description'], ['property', 'og:image'],
  ['property', 'og:image:width'], ['property', 'og:image:height'], ['property', 'og:image:alt'], ['property', 'og:site_name'],
  ['name', 'twitter:card'], ['name', 'twitter:title'], ['name', 'twitter:description'], ['name', 'twitter:image']]) {
  ok(meta(attr, name), `missing ${name}`);
}
ok(!/rel="canonical"/.test(html), 'canonical must not be hard-coded; it is injected from VITE_SITE_URL');
ok(!/property="og:url"/.test(html), 'og:url must not be hard-coded; it is injected from VITE_SITE_URL');
ok(html.includes('<!-- seo:site -->'), 'index.html is missing the <!-- seo:site --> marker');
ok(!/https?:\/\/(?!www\.w3\.org)[^"'\s]*\.(com|in|co|net|org|app)\b/i.test(html.replace(/<noscript>[\s\S]*?<\/noscript>/, '')), 'index.html contains a hard-coded domain');
ok(meta('property', 'og:image') === '/og-image.png' && meta('name', 'twitter:image') === '/og-image.png', 'source og:image / twitter:image should be the relative /og-image.png (made absolute at build time)');

// ---- Share image and icons
for (const f of ['public/og-image.png', 'public/favicon.ico', 'public/favicon-16.png', 'public/favicon-32.png', 'public/icon-192.png', 'public/icon-512.png',
  'public/apple-touch-icon.png', 'public/site.webmanifest', 'public/robots.txt', 'public/404.html']) ok(fs.existsSync(f), `missing ${f}`);
// Every local href/src in index.html must exist (public/ is served from the site root).
for (const m of html.matchAll(/<link[^>]+href="(\/[^"]+)"/g)) ok(fs.existsSync('public' + m[1]), `index.html links to ${m[1]} but public${m[1]} does not exist`);
if (fs.existsSync('public/site.webmanifest')) {
  let man = null; try { man = JSON.parse(fs.readFileSync('public/site.webmanifest', 'utf8')); } catch { fail('site.webmanifest is not valid JSON'); }
  if (man) for (const i of man.icons || []) ok(fs.existsSync('public' + i.src), `manifest icon ${i.src} missing`);
}
ok(/name="robots"/.test(html), 'robots meta missing');
if (fs.existsSync('public/og-image.png')) {
  const buf = fs.readFileSync('public/og-image.png');
  const isPng = buf.slice(1, 4).toString() === 'PNG';
  const [w, h] = isPng ? [buf.readUInt32BE(16), buf.readUInt32BE(20)] : [0, 0];
  ok(isPng && w === Number(meta('property', 'og:image:width')) && h === Number(meta('property', 'og:image:height')), `og-image.png is ${w}x${h}, meta says ${meta('property', 'og:image:width')}x${meta('property', 'og:image:height')}`);
  ok(buf.length < 600 * 1024, `og-image.png is ${Math.round(buf.length / 1024)} KB (keep under 600 KB)`);
}
ok(fs.existsSync('.env.example') && /VITE_SITE_URL=/.test(fs.readFileSync('.env.example', 'utf8')), '.env.example with VITE_SITE_URL is missing');

// ---- Build helpers WITHOUT a domain: nothing may be invented
const bare = applySeo(html, normalizeSiteUrl(''));
ok(!/rel="canonical"/.test(bare) && !/og:url/.test(bare), 'canonical / og:url present although VITE_SITE_URL is empty');
ok(/content="\/og-image\.png"/.test(bare), 'og:image should stay relative without a domain');
ok(!/Sitemap:/.test(robotsTxt(null)) && sitemapXml(null) === null, 'sitemap / robots Sitemap line present without a domain');
ok(!/"url"|"image"/.test(JSON.stringify(structuredData(null))), 'structured data has url/image without a domain');

// ---- Build helpers WITH a domain
const TEST = 'https://seo-test.invalid';
ok(normalizeSiteUrl(' https://seo-test.invalid/some/path/?x=1 ') === TEST, 'normalizeSiteUrl should reduce to the origin');
let threw = false; try { normalizeSiteUrl('not a url'); } catch { threw = true; }
ok(threw, 'normalizeSiteUrl should reject an invalid URL');
threw = false; try { normalizeSiteUrl('ftp://x.test'); } catch { threw = true; }
ok(threw, 'normalizeSiteUrl should reject non-http(s) URLs');
const live = applySeo(html, TEST);
ok(live.includes(`<link rel="canonical" href="${TEST}/" />`), 'canonical missing with a domain');
ok(live.includes(`<meta property="og:url" content="${TEST}/" />`), 'og:url missing with a domain');
ok(live.includes(`property="og:image" content="${TEST}/og-image.png"`) && live.includes(`name="twitter:image" content="${TEST}/og-image.png"`), 'og:image / twitter:image not absolute with a domain');
ok(!/content="\/og-image\.png"/.test(live), 'a relative og:image is left over with a domain');
ok(robotsTxt(TEST).includes(`Sitemap: ${TEST}/sitemap.xml`), 'robots.txt Sitemap line missing with a domain');
ok((sitemapXml(TEST) || '').includes(`<loc>${TEST}/</loc>`), 'sitemap.xml missing the home URL with a domain');

// ---- Structured data is valid JSON and contains only supplied facts
const ld = (live.match(/<script type="application\/ld\+json">([^]*?)<\/script>/) || [])[1];
try {
  const data = JSON.parse(ld);
  ok(data['@type'] === 'Resort' && data.name && data.telephone && data.email, 'structured data is missing core fields');
  ok(data.url === `${TEST}/` && data.image === `${TEST}/og-image.png`, 'structured data url/image wrong with a domain');
  ok(!(data.sameAs || []).some((u) => /facebook\.com\/search/.test(u)), 'structured data must not list a Facebook search URL');
} catch { fail('structured data is not valid JSON'); }

console.log('seo checks: problems', bad);
process.exit(bad ? 1 : 0);
