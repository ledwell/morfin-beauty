// The Morfin Beauty catalogue. Every product below is a placeholder.
//
// To add a real product, copy an entry and change it:
//   id          unique, lowercase-with-dashes
//   collection  one of the collection ids below
//   type        short product type shown under the name, e.g. "Matte Lipstick"
//   badge       small corner label such as "New", or null for none
//   shades      list of { name, hex } swatches, or [] for products without shades
//   image       path to a product photo, or null to show a "Coming Soon" card
//   art         drawing used on the "Coming Soon" card when there is no image
//   price       e.g. "$38", or null to show "Price TBA"
//   featured    true to show on the home page
window.MB_COLLECTIONS = [
  { id: 'lips', name: 'The Lip Collection', short: 'Lips', blurb: 'Lipstick, gloss and lip oil in rich, long-wearing shades.' },
  { id: 'fragrance', name: 'The Fragrance Collection', short: 'Fragrance', blurb: 'Warm, sensual scents designed to sit close to the skin.' },
  { id: 'face', name: 'The Face Collection', short: 'Face', blurb: 'Soft-focus base, blush and highlight for a fresh glow.' },
];

window.MB_PRODUCTS = [
  {
    id: 'signature-lip-gloss',
    name: 'Signature Lip Gloss',
    collection: 'lips',
    type: 'High-Shine Lip Gloss',
    badge: 'New',
    shades: [
      { name: 'Ruby', hex: '#8e1424' },
      { name: 'Cherry Kiss', hex: '#a8192d' },
      { name: 'Garnet', hex: '#6b0f1a' },
    ],
    description: 'A high-shine ruby gloss with a cushiony, non-sticky feel.',
    image: 'assets/img/product-signature-lip-gloss.webp',
    price: null,
    featured: true,
  },
  {
    id: 'rouge-royale-lipstick',
    name: 'Classic Rouge Lipstick',
    collection: 'lips',
    type: 'Velvet Matte Lipstick',
    badge: 'New',
    shades: [
      { name: 'Classic Rouge', hex: '#9e1b23' },
      { name: 'Rosewood', hex: '#8a3b3f' },
      { name: 'Merlot', hex: '#5c1420' },
      { name: 'Nude Rose', hex: '#b9776f' },
    ],
    description: 'A true red in a soft velvet-matte finish.',
    image: 'assets/img/product-rouge-royale-lipstick.webp',
    price: null,
    featured: true,
  },
  {
    id: 'glow-lip-oil',
    name: 'Glow Lip Oil',
    collection: 'lips',
    type: 'Shimmer Lip Oil',
    badge: 'New',
    shades: [
      { name: 'Golden Glow', hex: '#d9a35b' },
      { name: 'Rose Glow', hex: '#d98b80' },
    ],
    description: 'A sheer, golden-shimmer oil that keeps lips soft.',
    image: 'assets/img/product-glow-lip-oil.webp',
    price: null,
    featured: true,
  },
  {
    id: 'rose-gold-shimmer-gloss',
    name: 'Rose Gold Shimmer Gloss',
    collection: 'lips',
    type: 'Shimmer Lip Gloss',
    badge: 'New',
    shades: [
      { name: 'Rose Gold', hex: '#b9705f' },
      { name: 'Champagne', hex: '#d8ae86' },
    ],
    description: 'Warm rose with a fine gold shimmer.',
    image: 'assets/img/product-rose-gold-shimmer-gloss.webp',
    price: null,
    featured: true,
  },
  {
    id: 'reine-eau-de-parfum',
    name: 'Rosa Eau de Parfum',
    collection: 'fragrance',
    type: 'Eau de Parfum, 50 ml',
    badge: 'Coming soon',
    shades: [],
    description: 'Rose, amber and a touch of oud.',
    image: null,
    art: 'perfume',
    price: null,
    featured: false,
  },
  {
    id: 'velours-rouge-eau-de-parfum',
    name: 'Velours Rouge Eau de Parfum',
    collection: 'fragrance',
    type: 'Eau de Parfum, 50 ml',
    badge: 'Coming soon',
    shades: [],
    description: 'Black cherry and vanilla, made for evenings.',
    image: null,
    art: 'perfume-round',
    price: null,
    featured: false,
  },
  {
    id: 'velvet-crown-foundation',
    name: 'Second Skin Foundation',
    collection: 'face',
    type: 'Satin Liquid Foundation',
    badge: 'Coming soon',
    shades: [
      { name: 'Porcelain', hex: '#f1d3bc' },
      { name: 'Sand', hex: '#e2b896' },
      { name: 'Honey', hex: '#c99367' },
      { name: 'Caramel', hex: '#a8714a' },
      { name: 'Cocoa', hex: '#7b4b2e' },
      { name: 'Espresso', hex: '#5a3420' },
    ],
    description: 'Lightweight, satin-finish foundation with buildable coverage.',
    image: null,
    art: 'foundation',
    price: null,
    featured: false,
  },
  {
    id: 'rose-petal-blush',
    name: 'Rose Petal Blush',
    collection: 'face',
    type: 'Powder Blush',
    badge: 'Coming soon',
    shades: [
      { name: 'Rose Petal', hex: '#d98a8f' },
      { name: 'Peach', hex: '#e9a184' },
      { name: 'Berry', hex: '#a8455a' },
    ],
    description: 'A silky powder blush in a soft rose.',
    image: null,
    art: 'compact',
    price: null,
    featured: false,
  },
  {
    id: 'gilded-glow-highlighter',
    name: 'Golden Hour Highlighter',
    collection: 'face',
    type: 'Powder Highlighter',
    badge: 'Coming soon',
    shades: [
      { name: 'Champagne', hex: '#ecd0a5' },
      { name: 'Gold', hex: '#d4a24f' },
      { name: 'Bronze', hex: '#b07a45' },
    ],
    description: 'A warm gold highlighter for cheekbones and collarbones.',
    image: null,
    art: 'highlighter',
    price: null,
    featured: false,
  },
];
