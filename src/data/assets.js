// Add an entry ONLY after the file exists in public/assets.
// Paths are public URLs, e.g. '/assets/images/hero/hero-poster.webp'.

export const assets = {
  brand: {
    // 384px for the footer and loader, 192px for the header. The 640px original stays as the master copy.
    logo: '/assets/images/brand/logo-384.webp',
    logoSmall: '/assets/images/brand/logo-192.webp',
  },
  hero: {
    // poster: '/assets/images/hero/hero-poster.webp',
    // video: '/assets/video/hero/hero.mp4',
  },
  // Gallery item: { src, alt, ratio, category, caption? }
  //   category: 'resort' | 'accommodation' | 'pool' | 'nature' | 'dining' | 'experiences'
  //   example:  { src: '/assets/images/gallery/01.webp', alt: 'Describe the photograph', ratio: '4 / 5', category: 'pool' }
  // While this list is empty the gallery shows labelled placeholder frames.
  gallery: [
    { src: '/assets/images/accommodation/ring-bamboo-cottage.webp', alt: 'Ring-shaped green slatted cottage with a large glass window, set among trees', ratio: '1076 / 745', category: 'accommodation' },
    { src: '/assets/images/gallery/buddha-garden.webp', alt: 'Terracotta Buddha statue on a wooden platform in the resort garden', ratio: '1076 / 767', category: 'nature' },
    { src: '/assets/images/accommodation/kerala-style-villa.webp', alt: 'Kerala-style laterite stone villa with a tiled roof and covered veranda', ratio: '1076 / 701', category: 'accommodation' },
    { src: '/assets/images/accommodation/assam-bamboo-hut.webp', alt: 'Bamboo hut raised on stilts with a wooden deck, among citrus trees', ratio: '1076 / 745', category: 'accommodation' },
  ],
  // Dining photography (optional). Add only real photographs that exist in public/assets.
  dining: {
    // main: { src: '/assets/images/dining/main.webp', alt: 'Describe the photograph' },
    // inset: { src: '/assets/images/dining/inset.webp', alt: 'Describe the photograph' },
  },
};

// Responsive copies. Key = the full-size file used in the page; value = { width, height, small } where
// `small` is a 640px-wide copy of the same photograph. Components then offer the browser both sizes
// (srcset), so phones download the small one. Add an entry only after BOTH files exist in public/assets.
// Photographs without an entry still work: they load as a single image.
export const imageVariants = {
  '/assets/images/accommodation/kerala-style-villa.webp': { width: 1076, height: 701, small: '/assets/images/accommodation/kerala-style-villa-640.webp', smallWidth: 640 },
  '/assets/images/accommodation/assam-bamboo-hut.webp': { width: 1076, height: 745, small: '/assets/images/accommodation/assam-bamboo-hut-640.webp', smallWidth: 640 },
  '/assets/images/accommodation/ring-bamboo-cottage.webp': { width: 1076, height: 745, small: '/assets/images/accommodation/ring-bamboo-cottage-640.webp', smallWidth: 640 },
  '/assets/images/gallery/buddha-garden.webp': { width: 1076, height: 767, small: '/assets/images/gallery/buddha-garden-640.webp', smallWidth: 640 },
};
