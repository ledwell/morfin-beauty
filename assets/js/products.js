// The Morfin Beauty catalogue. Every product below is a placeholder.
//
// To add a real product, copy an entry and change it:
//   id          unique, lowercase-with-dashes
//   collection  one of the collection ids below
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
    description: 'A high-shine ruby gloss with a cushiony, non-sticky feel.',
    image: 'assets/img/product-signature-lip-gloss.webp',
    price: null,
    featured: true,
  },
  {
    id: 'rouge-royale-lipstick',
    name: 'Classic Rouge Lipstick',
    collection: 'lips',
    description: 'A true red in a soft velvet-matte finish.',
    image: 'assets/img/product-rouge-royale-lipstick.webp',
    price: null,
    featured: true,
  },
  {
    id: 'glow-lip-oil',
    name: 'Glow Lip Oil',
    collection: 'lips',
    description: 'A sheer, golden-shimmer oil that keeps lips soft.',
    image: 'assets/img/product-glow-lip-oil.webp',
    price: null,
    featured: true,
  },
  {
    id: 'rose-gold-shimmer-gloss',
    name: 'Rose Gold Shimmer Gloss',
    collection: 'lips',
    description: 'Warm rose with a fine gold shimmer.',
    image: 'assets/img/product-rose-gold-shimmer-gloss.webp',
    price: null,
    featured: true,
  },
  {
    id: 'reine-eau-de-parfum',
    name: 'Rosa Eau de Parfum',
    collection: 'fragrance',
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
    description: 'A warm gold highlighter for cheekbones and collarbones.',
    image: null,
    art: 'highlighter',
    price: null,
    featured: false,
  },
];
