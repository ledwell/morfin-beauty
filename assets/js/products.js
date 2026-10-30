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
  { id: 'lips', name: 'The Lip Collection', short: 'Lips', blurb: 'Velvet color and liquid gold, made to be remembered.' },
  { id: 'fragrance', name: 'The Fragrance Collection', short: 'Fragrance', blurb: 'A signature that lingers long after you leave the room.' },
  { id: 'face', name: 'The Face Collection', short: 'Face', blurb: 'A flawless canvas, kissed with light.' },
];

window.MB_PRODUCTS = [
  {
    id: 'signature-lip-gloss',
    name: 'Signature Lip Gloss',
    collection: 'lips',
    description: 'Our iconic ruby gloss. High-shine, cushion-soft, unmistakably Morfin.',
    image: 'assets/img/product-signature-lip-gloss.webp',
    price: null,
    featured: true,
  },
  {
    id: 'rouge-royale-lipstick',
    name: 'Rouge Royale Lipstick',
    collection: 'lips',
    description: 'A regal, velvet-matte red in a hand-polished gold case.',
    image: 'assets/img/product-rouge-royale-lipstick.webp',
    price: null,
    featured: true,
  },
  {
    id: 'glow-lip-oil',
    name: 'Glow Lip Oil',
    collection: 'lips',
    description: 'A sheer veil of golden shimmer that nourishes as it shines.',
    image: 'assets/img/product-glow-lip-oil.webp',
    price: null,
    featured: true,
  },
  {
    id: 'rose-gold-shimmer-gloss',
    name: 'Rose Gold Shimmer Gloss',
    collection: 'lips',
    description: 'Warm rose flecked with gold. Catches the light, and every eye.',
    image: 'assets/img/product-rose-gold-shimmer-gloss.webp',
    price: null,
    featured: true,
  },
  {
    id: 'reine-eau-de-parfum',
    name: 'Reine Eau de Parfum',
    collection: 'fragrance',
    description: 'Damask rose, warm amber and a whisper of oud. Worn like a crown.',
    image: null,
    art: 'perfume',
    price: null,
    featured: false,
  },
  {
    id: 'velours-rouge-eau-de-parfum',
    name: 'Velours Rouge Eau de Parfum',
    collection: 'fragrance',
    description: 'Black cherry, red velvet and vanilla. Seductive, after dark.',
    image: null,
    art: 'perfume-round',
    price: null,
    featured: false,
  },
  {
    id: 'velvet-crown-foundation',
    name: 'Velvet Crown Foundation',
    collection: 'face',
    description: 'A weightless, satin-finish foundation for a flawless, lasting canvas.',
    image: null,
    art: 'foundation',
    price: null,
    featured: false,
  },
  {
    id: 'rose-petal-blush',
    name: 'Rose Petal Blush',
    collection: 'face',
    description: 'A silken flush of rose, the color of a stolen glance.',
    image: null,
    art: 'compact',
    price: null,
    featured: false,
  },
  {
    id: 'gilded-glow-highlighter',
    name: 'Gilded Glow Highlighter',
    collection: 'face',
    description: 'Molten gold light for cheekbones, collarbones and shoulders.',
    image: null,
    art: 'highlighter',
    price: null,
    featured: false,
  },
];
