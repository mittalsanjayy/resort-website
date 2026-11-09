// SINGLE SOURCE OF TRUTH for resort content.
// null / empty array = not yet provided. Never fill with guesses.
// Sections hide or show a neutral message for missing data.
//
// Only set an image path AFTER a real photograph exists in public/assets.
// Until then every card shows a clearly labelled "photograph to be added" placeholder.

export const resort = {
  name: 'Oxy Village Resort',
  endorsement: 'by De Verveil',
  positioning: [
    'Luxury nature resort',
    'Family getaways',
    'Romantic escapes',
    'Corporate retreats',
    'Unique accommodation',
  ],
  // Draft wording, edit freely. Kept deliberately free of specific facility claims.
  audiences: [
    { id: 'family', title: 'Family getaways', line: 'Time together in open air, away from the city.' },
    { id: 'romantic', title: 'Romantic escapes', line: 'Quiet, unhurried time for two.' },
    { id: 'corporate', title: 'Corporate retreats', line: 'Room to step back, regroup and reconnect as a team.' },
    { id: 'unique', title: 'Unique accommodation', line: 'Stays that feel different from the usual.' },
  ],

  // Figures supplied by the resort. Both are approximate; show them with "approximately".
  facts: {
    acres: '1.8',
    driveFromBengaluru: '45 minutes', // resort-provided estimate, not a measured route time
  },

  location: {
    area: 'Kumbalgod, Mysore Road, near Ramohalli',
    city: 'Bengaluru',
    state: 'Karnataka',
    address: null, // full postal address not supplied
    // Exact Google Maps link supplied by the resort. Do not shorten, rewrite or replace it.
    mapUrl: 'https://maps.app.goo.gl/9AKDv4f1mzb2z57y8?g_st=ic',
  },

  contact: {
    phone: '+91 8147567379',
    whatsapp: '918147567379', // same number as phone, digits with country code
    email: 'oxyvillage@gmail.com',
  },

  // Each entry: { label, handle, url }. url may be null: the footer then shows the name as plain text.
  social: {
    instagram: { label: 'Instagram', handle: '@oxyvillage', url: 'https://www.instagram.com/oxyvillage/' },
    // The Facebook page URL was not supplied. This is a Facebook search for the page name so the link works
    // today. Replace it with the real page URL (and remove isSearch) as soon as you have it.
    facebook: {
      label: 'Facebook',
      handle: 'Oxy Village Resort',
      url: 'https://www.facebook.com/search/top?q=Oxy%20Village%20Resort',
      isSearch: true,
    },
    youtube: null,
  },

  // ---------------------------------------------------------------------------
  // ACCOMMODATION: six options. Details and prices were NOT included in the
  // project files or in the messages available when this file was populated,
  // so the list is intentionally empty. The Stay section shows a neutral
  // "enquire" message until it is filled. Template for each option:
  //
  // {
  //   id: 'kebab-case-id',
  //   name: 'Exact name',
  //   summary: 'One line, exactly as supplied',
  //   details: ['Each supplied detail on its own line'],
  //   price: 'Exactly as it should display, including any basis the resort states',
  //   image: null, // '/assets/images/accommodation/file.webp' only once the real photo exists
  // }
  // ---------------------------------------------------------------------------
  accommodations: [
    {
      id: 'oxy-meadow-farmhouse-villa',
      name: 'Oxy Meadow Farmhouse Villa',
      kind: 'Farmhouse villa',
      summary: 'Eight air-conditioned bedrooms with private bathrooms, a private swimming pool and a jacuzzi, set among garden and nature views.',
      details: [
        '8 bedrooms',
        'Private swimming pool',
        'Jacuzzi',
        'Garden and nature views',
        'Air-conditioned rooms',
        'Private bathrooms',
      ],
      price: '\u20B975,000',
      image: null,
      images: [],
    },
    {
      id: 'assam-bamboo-hut',
      name: 'Assam Bamboo Hut',
      kind: 'Bamboo hut',
      summary: 'Bamboo-crafted accommodation with a double bed, air conditioning and a private wooden deck or balcony.',
      details: [
        'Bamboo-crafted accommodation',
        'Double bed',
        'Air conditioning',
        'Private wooden deck or balcony',
        'Attached washroom',
        'Warm lighting',
      ],
      price: '\u20B99,000',
      image: '/assets/images/accommodation/assam-bamboo-hut.webp',
      images: [{ src: '/assets/images/accommodation/assam-bamboo-hut.webp', alt: 'Bamboo hut raised on stilts with a wooden deck, black steel stairs and citrus trees in front' }],
    },
    {
      id: 'kerala-style-villa-2bh',
      name: '2 BH Kerala-Style Villa',
      kind: 'Kerala-style villa',
      summary: 'Two bedrooms and a hall in a Kerala-inspired design, with a refrigerator, microwave and electric kettle.',
      details: [
        '2 bedrooms and 1 hall',
        'Kerala-inspired design',
        'Air conditioning',
        'Refrigerator',
        'Microwave',
        'Electric kettle',
      ],
      price: '\u20B925,000',
      image: '/assets/images/accommodation/kerala-style-villa.webp',
      images: [{ src: '/assets/images/accommodation/kerala-style-villa.webp', alt: 'Kerala-style laterite stone villa with a tiled roof, carved window and covered veranda' }],
    },
    {
      id: 'the-loft-suite',
      name: 'The Loft Suite',
      kind: 'Suite',
      summary: 'A king-size bed with premium linen, marble flooring and an attached bathroom.',
      details: [
        'King-size bed',
        'Premium linen',
        'Wardrobe',
        'Air conditioning',
        'Attached bathroom',
        'Marble flooring',
      ],
      price: '\u20B98,000',
      image: null,
      images: [],
    },
    {
      id: 'little-heaven-cottage-ring-bamboo',
      name: 'Little Heaven Cottage Ring Bamboo',
      kind: 'Bamboo cottage',
      summary: 'Bamboo-inspired interiors with a double bed, a glass window, greenery views and a private garden water feature.',
      details: [
        'Bamboo-inspired interiors',
        'Double bed',
        'Glass window',
        'Greenery views',
        'Private garden water feature',
      ],
      price: '\u20B913,000',
      image: '/assets/images/accommodation/ring-bamboo-cottage.webp',
      images: [{ src: '/assets/images/accommodation/ring-bamboo-cottage.webp', alt: 'Ring-shaped green slatted cottage with a large glass window, set among trees and a garden path' }],
    },
    {
      id: 'jacuzzi-couple-room',
      name: 'Jacuzzi Couple Room',
      kind: 'Couple room',
      summary: 'A jacuzzi couple room, available at the resort. Amenities and pricing are shared on enquiry.',
      details: [],
      price: null, // not supplied
      enquiryOnly: true, // shown as an enquiry-based option; nothing else is assumed
      image: null,
      images: [],
    },
  ],

  // ---------------------------------------------------------------------------
  // DAY OUTING AND CORPORATE PACKAGES: details were not available either, so
  // this is empty and the Packages section and its nav link stay hidden.
  // Template for each package:
  //
  // {
  //   id: 'day-outing',
  //   label: 'Day outing',        // or 'Corporate'
  //   name: 'Exact package name',
  //   summary: 'One line, exactly as supplied',
  //   inclusions: ['Each supplied inclusion on its own line'],
  //   price: 'Exactly as it should display',
  //   note: null,                  // optional extra line, only if supplied
  // }
  // ---------------------------------------------------------------------------
  packages: [
    {
      id: 'family-group-day-outing',
      label: 'Day outing',
      name: 'Family & Group Day Outing',
      priceAmount: '\u20B91,800',
      priceBasis: 'per person',
      price: '\u20B91,800 per person',
      conditions: [],
      inclusions: ['Includes one meal (lunch or dinner)'],
      note: null,
      image: null,
    },
    {
      id: 'corporate-get-together',
      label: 'Corporate',
      name: 'Corporate Get-together',
      priceAmount: '\u20B91,500',
      priceBasis: 'per person',
      price: '\u20B91,500 per person',
      conditions: ['Minimum 12 guests'],
      inclusions: ['Includes one meal'],
      note: null,
      image: null,
    },
  ],

  // Stay packages with meals. Prices, menus and meal inclusions were NOT supplied; none are shown.
  stayPackages: [
    { id: 'stay-with-breakfast', name: 'Stay with breakfast' },
    { id: 'stay-with-meals', name: 'Stay with meals' },
  ],

  // Facility names as supplied. No descriptions, capacities or timings were given, so none are added.
  facilities: [
    { id: 'swimming-pool', name: 'Swimming pool', summary: null, image: null },
    { id: 'jacuzzi', name: 'Jacuzzi', summary: null, image: null },
    { id: 'karaoke', name: 'Karaoke', summary: null, image: null },
    { id: 'indoor-games', name: 'Indoor games', summary: null, image: null },
    { id: 'bonfire', name: 'Bonfire', summary: null, image: null },
    { id: 'outdoor-activities', name: 'Outdoor activities', summary: null, image: null },
  ],
};
