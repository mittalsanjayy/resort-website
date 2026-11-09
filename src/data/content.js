// Editorial copy and section content. Presentation components read from here.
// Facts about the resort live in resort.js; do not add unsupplied claims in this file.
// `image: null` shows a clearly labelled placeholder. Set a path only once the real photo exists
// in public/assets (for example '/assets/images/experiences/pool.webp').

export const hero = {
  headline: 'Find Your *Stillness.*',
  lines: ['Find Your', 'Stillness.'],
  support: 'A secluded escape into nature, thoughtfully created for moments that matter.',
  location: 'Kumbalgod, Bengaluru.',
  primary: { label: 'Discover the Resort', href: '#story' },
  secondary: { label: 'Explore Stays', href: '#stay' },
};

export const story = {
  eyebrow: 'Our Story',
  title: 'An Escape, Held in *Green.*',
  paragraphs: [
    'Oxy Village Resort by De Verveil is set across approximately 1.8 acres of greenery at Kumbalgod, on Mysore Road near Ramohalli, Bengaluru.',
    'It is made for a peaceful kind of time: room to slow down in nature, to relax, and to gather with the people who matter.',
    'Families, couples, friends and teams come for different reasons. The setting is the same for all of them: quiet, green and set apart from the city.',
  ],
  facts: [
    { value: '1.8', unit: 'acres', label: 'of greenery', prefix: 'Approx.' },
    {
      value: '45',
      unit: 'minutes',
      label: 'from Bengaluru',
      prefix: 'Approx.',
      note: 'Resort-provided estimate',
    },
  ],
  media: [
    { label: 'Resort photograph', ratio: '3 / 4', image: '/assets/images/gallery/buddha-garden.webp', alt: 'Terracotta Buddha statue on a wooden platform in the resort garden' },
    { label: 'Resort photograph', ratio: '4 / 5', image: '/assets/images/accommodation/assam-bamboo-hut.webp', alt: 'Bamboo hut raised on stilts with a wooden deck, among citrus trees' },
  ],
};

export const experiences = {
  eyebrow: 'Experiences',
  title: 'Days that *unfold*',
  intro: 'From still water to a late fire, here is what the resort offers.',
  items: [
    { id: 'swimming-pool', name: 'Swimming Pool', tag: 'Relax', image: null },
    { id: 'jacuzzi', name: 'Jacuzzi', tag: 'Relax', image: null },
    { id: 'bonfire', name: 'Bonfire', tag: 'Evenings', image: null },
    { id: 'karaoke', name: 'Karaoke', tag: 'Evenings', image: null },
    { id: 'indoor-games', name: 'Indoor Games', tag: 'Play', image: null },
    { id: 'outdoor-sports', name: 'Outdoor Sports', tag: 'Play', image: null },
    { id: 'dining', name: 'Dining', tag: 'Dine', image: null },
    { id: 'family-gatherings', name: 'Family Gatherings', tag: 'Together', image: null },
    { id: 'corporate-get-togethers', name: 'Corporate Get-togethers', tag: 'Together', image: null },
  ],
};

export const activities = {
  eyebrow: 'Activities',
  title: 'Room to *play*',
  intro: 'Simple games, played together.',
  items: [
    { id: 'football', name: 'Football' },
    { id: 'volleyball', name: 'Volleyball' },
    { id: 'badminton', name: 'Badminton' },
    { id: 'cricket', name: 'Cricket' },
    { id: 'chess', name: 'Chess' },
    { id: 'ludo', name: 'Ludo' },
    { id: 'carrom', name: 'Carrom' },
    { id: 'frisbee', name: 'Frisbee' },
    { id: 'tug-of-war', name: 'Tug of War' },
  ],
};

export const highlights = {
  eyebrow: 'Highlights',
  title: 'The resort, *at a glance*',
  media: { label: 'Resort photograph', image: '/assets/images/accommodation/kerala-style-villa.webp', alt: 'Kerala-style laterite stone villa with a tiled roof and covered veranda' },
  items: [
    { id: 'greenery', title: '1.8 acres of greenery', icon: 'trees', feature: true },
    { id: 'accommodation', title: 'Nature-inspired accommodation', icon: 'leaf' },
    { id: 'pool-villa', title: 'Private pool villa', icon: 'waves' },
    { id: 'wellness', title: 'Relaxation and wellness', icon: 'sparkles' },
    { id: 'family-group', title: 'Family and group experiences', icon: 'users' },
    { id: 'corporate', title: 'Corporate gatherings', icon: 'briefcase' },
  ],
};

export const gallery = {
  eyebrow: 'Gallery',
  title: 'A closer *look*',
  intro: 'Resort, rooms, water, greenery, table and evenings, gathered in one place.',
  // Shown only while assets.gallery is empty. These are labelled placeholders, never real photographs.
  placeholderNote:
    'Placeholder frames only. The resort has not yet supplied its photographs; each frame is replaced as real images are added.',
  feature: { ratio: '21 / 9', category: 'resort', label: 'Resort photograph to be added' },
  // Order here is the order of the filter tabs.
  categories: [
    { id: 'all', label: 'All' },
    { id: 'resort', label: 'Resort' },
    { id: 'accommodation', label: 'Accommodation' },
    { id: 'pool', label: 'Pool' },
    { id: 'nature', label: 'Nature' },
    { id: 'dining', label: 'Dining' },
    { id: 'experiences', label: 'Experiences' },
  ],
  // Placeholder slots, used only while assets.gallery is empty. Ratios vary to build the masonry rhythm.
  placeholders: [
    { category: 'resort', ratio: '4 / 5' },
    { category: 'pool', ratio: '4 / 3' },
    { category: 'nature', ratio: '3 / 4' },
    { category: 'accommodation', ratio: '1 / 1' },
    { category: 'dining', ratio: '4 / 5' },
    { category: 'experiences', ratio: '4 / 3' },
    { category: 'resort', ratio: '3 / 4' },
    { category: 'pool', ratio: '4 / 5' },
    { category: 'nature', ratio: '4 / 3' },
    { category: 'accommodation', ratio: '4 / 5' },
    { category: 'dining', ratio: '1 / 1' },
    { category: 'experiences', ratio: '3 / 4' },
  ],
  lightbox: { close: 'Close gallery', next: 'Next photograph', prev: 'Previous photograph' },
};

export const stay = {
  eyebrow: 'Accommodation',
  title: 'Stay Somewhere *Extraordinary.*',
  intro: 'Discover thoughtfully designed spaces where comfort meets the calm of nature.',
  // Prices are shown exactly as supplied. The basis (per night, per person, per package) is unknown.
  priceLabel: 'Price',
  priceNote: 'Confirm package details with the resort.',
  priceFootnote: 'Prices are as supplied by the resort.',
  enquiryOnlyLabel: 'Enquiry-based',
  enquiryOnlyPrice: 'Pricing on enquiry',
  enquiryOnlyText:
    'This room is available at the resort. Detailed amenities and pricing have not yet been listed here, so please enquire and the resort will confirm them.',
  photoLabel: 'Photograph to be added',
};

export const dayOuting = {
  eyebrow: 'Day Outings',
  title: 'Make a Day *of It.*',
  intro: 'Time at the resort for families, groups and teams, without staying the night.',
  cta: 'Check Package Details',
};

export const stayDining = {
  eyebrow: 'Dining',
  title: 'Rest well. *Dine well.*',
  // Editorial copy only. No menus, dishes, timings or prices are stated because none were supplied.
  intro:
    'Time at the table is part of time away. The resort offers stays with breakfast and stays with meals, so mornings and evenings can be unhurried.',
  statement:
    'Slow breakfasts, shared tables and quiet evenings among the greenery. Menus, meal timings and inclusions are confirmed by the resort when you enquire.',
  media: {
    main: { label: 'Dining photograph to be added', ratio: '4 / 5' },
    inset: { label: 'Dining photograph to be added', ratio: '1 / 1' },
  },
  pending: 'Prices, menus and meal inclusions are confirmed with the resort.',
  cta: 'Enquire About Dining',
  plan: {
    title: 'Planning a visit?',
    text: 'Tell the resort what you have in mind and they will help you put it together.',
    cta: 'Plan Your Visit',
  },
};
