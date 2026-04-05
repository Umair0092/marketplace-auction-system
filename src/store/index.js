// BidX Global State Store — vanilla pub/sub reactive store

const createStore = (initialState) => {
  let state = structuredClone(initialState);
  const listeners = new Map(); // key -> Set of callbacks

  const getState = () => state;

  const setState = (updater) => {
    const prev = state;
    state = typeof updater === 'function' ? updater(structuredClone(state)) : { ...state, ...updater };
    // Notify all listeners
    for (const [key, fns] of listeners) {
      fns.forEach(fn => fn(state, prev));
    }
  };

  const subscribe = (key, fn) => {
    if (!listeners.has(key)) listeners.set(key, new Set());
    listeners.get(key).add(fn);
    return () => listeners.get(key).delete(fn);
  };

  const notify = (key, ...args) => {
    if (listeners.has(key)) {
      listeners.get(key).forEach(fn => fn(...args));
    }
  };

  return { getState, setState, subscribe, notify };
};

// --- Mock Auction Data ---

const now = Date.now();
const hours = (h) => h * 60 * 60 * 1000;
const minutes = (m) => m * 60 * 1000;

const mockAuctions = [
  {
    id: 'macbook-pro-m3',
    title: 'MacBook Pro M3 Max Space Black',
    description: 'The MacBook Pro (16-inch) with M3 Max is the ultimate powerhouse for creative professionals. Featuring a 14-core CPU and 30-core GPU, this machine handles the most demanding workflows with ease. The Liquid Retina XDR display provides industry-leading brightness and color accuracy.',
    category: 'electronics',
    seller: { name: 'Apple Elite', id: 'seller-1', rating: 4.9 },
    images: [
      'https://picsum.photos/1200/900?random=101',
      'https://picsum.photos/400/400?random=102',
      'https://picsum.photos/400/400?random=103',
      'https://picsum.photos/400/400?random=104',
    ],
    specs: { Model: 'M3 Max 16" (2024)', Memory: '64GB Unified Memory', Storage: '2TB SSD Storage', Condition: 'Factory Sealed' },
    startingPrice: 3500,
    currentBid: 4250,
    minIncrement: 10,
    totalBids: 38,
    endTime: now + hours(2) + minutes(45),
    bids: [],
    featured: true,
  },
  {
    id: 'rolex-submariner',
    title: 'Rolex Submariner Date 41mm',
    description: 'The Oyster Perpetual Submariner Date in Oystersteel with a Cerachrom bezel insert in black ceramic. A reference among divers\u2019 watches, the Submariner was introduced in 1953.',
    category: 'watches',
    seller: { name: 'LuxWatch Co', id: 'seller-2', rating: 4.8 },
    images: [
      'https://picsum.photos/1200/900?random=201',
      'https://picsum.photos/400/400?random=202',
      'https://picsum.photos/400/400?random=203',
      'https://picsum.photos/400/400?random=204',
    ],
    specs: { Model: 'Submariner Date 126610LN', Case: '41mm Oystersteel', Movement: 'Calibre 3235', Condition: 'Pre-owned Excellent' },
    startingPrice: 8000,
    currentBid: 9800,
    minIncrement: 50,
    totalBids: 22,
    endTime: now + hours(1) + minutes(12),
    bids: [],
    featured: false,
  },
  {
    id: 'vintage-les-paul',
    title: '1959 Gibson Les Paul Standard',
    description: 'An exceptional example of the holy grail of electric guitars. This 1959 Les Paul Standard features the coveted flame maple top, PAF pickups, and Brazilian rosewood fingerboard.',
    category: 'collectibles',
    seller: { name: 'Heritage Guitars', id: 'seller-3', rating: 5.0 },
    images: [
      'https://picsum.photos/1200/900?random=301',
      'https://picsum.photos/400/400?random=302',
      'https://picsum.photos/400/400?random=303',
      'https://picsum.photos/400/400?random=304',
    ],
    specs: { Year: '1959', Finish: 'Cherry Sunburst', Pickups: 'Original PAF Humbuckers', Condition: 'Vintage Excellent' },
    startingPrice: 200000,
    currentBid: 245000,
    minIncrement: 1000,
    totalBids: 15,
    endTime: now + hours(5) + minutes(30),
    bids: [],
    featured: false,
  },
  {
    id: 'ps5-pro-bundle',
    title: 'PS5 Pro Limited Edition Bundle',
    description: 'PlayStation 5 Pro 30th Anniversary Limited Edition bundle. Includes custom DualSense controller, vertical stand, and exclusive game titles. Factory sealed, numbered unit.',
    category: 'electronics',
    seller: { name: 'GameVault', id: 'seller-4', rating: 4.7 },
    images: [
      'https://picsum.photos/1200/900?random=401',
      'https://picsum.photos/400/400?random=402',
      'https://picsum.photos/400/400?random=403',
      'https://picsum.photos/400/400?random=404',
    ],
    specs: { Model: 'PS5 Pro 30th Anniversary', Storage: '2TB SSD', Extras: 'Limited Controller + Stand', Condition: 'Factory Sealed' },
    startingPrice: 800,
    currentBid: 1350,
    minIncrement: 10,
    totalBids: 56,
    endTime: now + minutes(45),
    bids: [],
    featured: false,
  },
  {
    id: 'herman-miller-eames',
    title: 'Herman Miller Eames Lounge Chair',
    description: 'Authentic Herman Miller Eames Lounge Chair and Ottoman in Santos Palisander veneer with black MCL leather. Manufactured 2023, pristine condition with certificate.',
    category: 'furniture',
    seller: { name: 'ModernLiving', id: 'seller-5', rating: 4.6 },
    images: [
      'https://picsum.photos/1200/900?random=501',
      'https://picsum.photos/400/400?random=502',
      'https://picsum.photos/400/400?random=503',
      'https://picsum.photos/400/400?random=504',
    ],
    specs: { Designer: 'Charles & Ray Eames', Material: 'Santos Palisander + MCL Leather', Year: '2023', Condition: 'Like New w/ Certificate' },
    startingPrice: 4000,
    currentBid: 4800,
    minIncrement: 25,
    totalBids: 19,
    endTime: now + hours(3) + minutes(15),
    bids: [],
    featured: false,
  },
  {
    id: 'first-edition-dune',
    title: 'First Edition "Dune" — Frank Herbert',
    description: 'A true first edition, first printing of Frank Herbert\'s Dune (1965, Chilton Books). Dust jacket in excellent condition with minimal wear. One of the most sought-after sci-fi collectibles.',
    category: 'collectibles',
    seller: { name: 'RareBooks Inc', id: 'seller-6', rating: 4.9 },
    images: [
      'https://picsum.photos/1200/900?random=601',
      'https://picsum.photos/400/400?random=602',
      'https://picsum.photos/400/400?random=603',
      'https://picsum.photos/400/400?random=604',
    ],
    specs: { Edition: 'First Edition, First Printing', Publisher: 'Chilton Books, 1965', Jacket: 'Excellent w/ Minor Wear', Condition: 'Near Fine / Very Good+' },
    startingPrice: 15000,
    currentBid: 18200,
    minIncrement: 100,
    totalBids: 31,
    endTime: now + hours(8),
    bids: [],
    featured: false,
  },
  {
    id: 'ipad-pro-m4',
    title: 'iPad Pro M4 13" 1TB + Apple Pencil Pro',
    description: 'The thinnest Apple product ever. M4 chip, tandem OLED Ultra Retina XDR display, 1TB storage. Bundled with Apple Pencil Pro and Magic Keyboard.',
    category: 'electronics',
    seller: { name: 'TechDeals', id: 'seller-7', rating: 4.5 },
    images: [
      'https://picsum.photos/1200/900?random=701',
      'https://picsum.photos/400/400?random=702',
      'https://picsum.photos/400/400?random=703',
      'https://picsum.photos/400/400?random=704',
    ],
    specs: { Model: 'iPad Pro 13" M4 (2024)', Storage: '1TB', Display: 'Ultra Retina XDR OLED', Condition: 'Open Box — Like New' },
    startingPrice: 1200,
    currentBid: 1580,
    minIncrement: 10,
    totalBids: 44,
    endTime: now + hours(1) + minutes(55),
    bids: [],
    featured: false,
  },
  {
    id: 'vintage-porsche-911',
    title: '1973 Porsche 911 Carrera RS 2.7',
    description: 'Numbers-matching 1973 Porsche 911 Carrera RS 2.7 Lightweight in Grand Prix White with Green script. Fully documented history, concours-ready condition.',
    category: 'motors',
    seller: { name: 'Classic Motorwerks', id: 'seller-8', rating: 5.0 },
    images: [
      'https://picsum.photos/1200/900?random=801',
      'https://picsum.photos/400/400?random=802',
      'https://picsum.photos/400/400?random=803',
      'https://picsum.photos/400/400?random=804',
    ],
    specs: { Year: '1973', Engine: '2.7L Flat-Six, 210hp', Mileage: '48,200 km', Condition: 'Concours Restored' },
    startingPrice: 900000,
    currentBid: 1120000,
    minIncrement: 5000,
    totalBids: 8,
    endTime: now + hours(12),
    bids: [],
    featured: false,
  },
];

const categories = [
  { id: 'all', label: 'All Collections' },
  { id: 'electronics', label: 'Electronics' },
  { id: 'watches', label: 'Fine Watches' },
  { id: 'collectibles', label: 'Collectibles' },
  { id: 'furniture', label: 'Furniture' },
  { id: 'motors', label: 'Private Motors' },
];

// --- Initialize Store ---

const store = createStore({
  auctions: mockAuctions,
  categories,
  user: JSON.parse(localStorage.getItem('bidx_user') || 'null'),
  notifications: [],
  filters: {
    category: 'all',
    maxPrice: 10000,
    sort: 'featured',
  },
});

export default store;
