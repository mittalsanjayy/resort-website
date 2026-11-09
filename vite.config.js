import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { applySeo, normalizeSiteUrl, robotsTxt, sitemapXml } from './scripts/seo.mjs';

// Canonical URL, og:url, absolute og:image, sitemap and robots Sitemap line, all driven by VITE_SITE_URL.
// Leave it unset until the live domain exists: nothing is guessed (see scripts/seo.mjs).
function seoPlugin(siteUrl) {
  let outDir = 'dist';
  return {
    name: 'oxy-seo',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    transformIndexHtml: (html) => applySeo(html, siteUrl),
    closeBundle() {
      // Runs after public/ has been copied, so these files win over public/robots.txt.
      fs.writeFileSync(path.join(outDir, 'robots.txt'), robotsTxt(siteUrl));
      const sitemap = sitemapXml(siteUrl);
      if (sitemap) fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const siteUrl = normalizeSiteUrl(env.VITE_SITE_URL);
  if (mode === 'production' && !siteUrl) {
    console.warn(
      '\n[seo] VITE_SITE_URL is not set: building WITHOUT canonical URL, og:url, absolute og:image and sitemap.\n' +
        '      Set it to the live origin (https://your-domain.com) before the public launch.\n'
    );
  }
  return {
    plugins: [react(), seoPlugin(siteUrl)],
    build: {
      target: 'es2020',
      // Hashed JS/CSS go to /_assets so vercel.json can cache them forever without touching the photographs in /assets.
      assetsDir: '_assets',
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            gsap: ['gsap', 'gsap/ScrollTrigger'],
            motion: ['motion/react'],
          },
        },
      },
    },
  };
});
