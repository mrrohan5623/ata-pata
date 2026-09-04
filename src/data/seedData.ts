import { Product, Category, Coupon, Review, StoreSettings, Order } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-men',
    name: "Men's Collection",
    slug: 'men',
    description: 'Commanding, deep woody and spicy perfumes crafted for modern gentlemen.',
    active: true,
  },
  {
    id: 'cat-women',
    name: "Women's Collection",
    slug: 'women',
    description: 'Sensual floral, fruity, and amber bouquets of regal refinement.',
    active: true,
  },
  {
    id: 'cat-unisex',
    name: 'Unisex Collection',
    slug: 'unisex',
    description: 'Transcendent, versatile compositions that defy conventional boundaries.',
    active: true,
  },
  {
    id: 'cat-bestsellers',
    name: 'Best Sellers',
    slug: 'best-sellers',
    description: 'Pakistan’s most adored signatures, praised for exceptional longevity and sillage.',
    active: true,
  },
  {
    id: 'cat-new',
    name: 'New Arrivals',
    slug: 'new-arrivals',
    description: 'Fresh olfactory marvels formulated with rare ingredients.',
    active: true,
  },
  {
    id: 'cat-premium',
    name: 'Premium Royale',
    slug: 'premium-collection',
    description: 'Extrait de Parfum concentrations aged with genuine Cambodian Oud and Saffron.',
    active: true,
  },
  {
    id: 'cat-gifts',
    name: 'Luxury Gift Sets',
    slug: 'gift-sets',
    description: 'Handcrafted velvet presentation boxes ideal for weddings and milestone celebrations.',
    active: true,
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    name: 'Sultanul Oud Royale',
    slug: 'sultanul-oud-royale',
    description: 'An opus of ancient luxury. Sultanul Oud Royale opens with crisp Italian bergamot and fiery saffron before sinking into an intoxicating heart of Taif rose and smoky Cambodian agarwood. The dry-down commands authority with ambergris, royal leather, and white musk.',
    shortDescription: 'Commanding Cambodian Oud, Royal Saffron & Taif Rose in Extrait concentration.',
    price: 11500,
    salePrice: 9450,
    costPrice: 4200,
    sku: 'RP-OUD-001',
    category: "Men's Collection",
    collection: 'Premium Royale',
    size: '100ml / 3.4 FL. OZ.',
    availableSizes: ['50ml Extrait', '100ml Extrait'],
    fragranceNotes: {
      top: ['Royal Kashmiri Saffron', 'Italian Bergamot', 'Cardamom Pods'],
      middle: ['Taif Rose Petals', 'Cambodian Aged Agarwood', 'Nutmeg'],
      base: ['Ambergris', 'Tuscan Leather', 'Smoked Vetiver', 'Vanilla Bourbon']
    },
    fragranceType: 'Extrait de Parfum',
    gender: 'Men',
    stock: 24,
    lowStockThreshold: 5,
    featured: true,
    bestSeller: true,
    newArrival: false,
    published: true,
    images: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=900&q=80'
    ],
    rating: 4.9,
    reviewsCount: 48,
    seoTitle: 'Sultanul Oud Royale Extrait de Parfum | Rohan Perfume Pakistan',
    seoDescription: 'Experience Sultanul Oud Royale by Rohan Perfume. The pinnacle of Cambodian oud and saffron crafted for Pakistan luxury fragrance connoisseurs.',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-02-15T12:00:00Z'
  },
  {
    id: 'prod-02',
    name: 'Koh-i-Noor Amber',
    slug: 'koh-i-noor-amber',
    description: 'Dazzling like the imperial gem itself, Koh-i-Noor Amber is a warm, luminous symphony of golden resin, roasted tonka, and Madagascar vanilla swirled with spiced coriander and cinnamon bark.',
    shortDescription: 'Radiant golden amber, spiced cinnamon & sweet tonka bean with 14+ hours longevity.',
    price: 8800,
    salePrice: 7200,
    costPrice: 3100,
    sku: 'RP-AMB-002',
    category: 'Unisex Collection',
    collection: 'Best Sellers',
    size: '100ml / 3.4 FL. OZ.',
    availableSizes: ['50ml EDP', '100ml EDP'],
    fragranceNotes: {
      top: ['Sweet Mandarin', 'Pink Peppercorn', 'Ceylon Cinnamon'],
      middle: ['Baltic Amber Resin', 'Benzoin Tears', 'Heliotrope'],
      base: ['Madagascar Vanilla', 'Roasted Tonka Bean', 'Cedarwood Virginia']
    },
    fragranceType: 'Eau de Parfum',
    gender: 'Unisex',
    stock: 18,
    lowStockThreshold: 4,
    featured: true,
    bestSeller: true,
    newArrival: false,
    published: true,
    images: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=80'
    ],
    rating: 4.8,
    reviewsCount: 32,
    seoTitle: 'Koh-i-Noor Amber Eau de Parfum | Rohan Perfume',
    seoDescription: 'Unisex luxury amber fragrance with incredible winter projection. Fast Cash on Delivery across Pakistan.',
    createdAt: '2026-01-12T11:00:00Z',
    updatedAt: '2026-02-18T15:00:00Z'
  },
  {
    id: 'prod-03',
    name: 'Noor-e-Jahan Velvet Flora',
    slug: 'noor-e-jahan-velvet-flora',
    description: 'Inspired by Mughal empresses who commanded rose gardens of Lahore. A lush, romantic tapestry of Kashmiri dewy jasmine, damascena rose water, white tuberose, and soft cashmere musk.',
    shortDescription: 'Regal Mughal damascena rose, white tuberose and velvety cashmere musk.',
    price: 9200,
    salePrice: 7800,
    costPrice: 3400,
    sku: 'RP-FLO-003',
    category: "Women's Collection",
    collection: 'Best Sellers',
    size: '100ml / 3.4 FL. OZ.',
    availableSizes: ['50ml EDP', '100ml EDP'],
    fragranceNotes: {
      top: ['Lychee Nectar', 'Bergamot Zest', 'Rhubarb'],
      middle: ['Turkish Rose', 'Night-Blooming Jasmine', 'Tuberose', 'Peony'],
      base: ['Cashmere Musk', 'White Cedar', 'Golden Amber', 'Vetiver']
    },
    fragranceType: 'Eau de Parfum',
    gender: 'Women',
    stock: 14,
    lowStockThreshold: 3,
    featured: true,
    bestSeller: true,
    newArrival: false,
    published: true,
    images: [
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=900&q=80'
    ],
    rating: 4.9,
    reviewsCount: 41,
    seoTitle: 'Noor-e-Jahan Velvet Flora Fragrance | Rohan Perfume Pakistan',
    seoDescription: 'Exquisite women’s floral perfume blending Turkish rose and cashmere musk. Cash on delivery Pakistan.',
    createdAt: '2026-01-15T09:30:00Z',
    updatedAt: '2026-02-20T10:00:00Z'
  },
  {
    id: 'prod-04',
    name: 'Night in Margalla',
    slug: 'night-in-margalla',
    description: 'Capturing the crisp, aromatic highland breeze whispering across Islamabad’s Margalla Hills at midnight. Pine needles, iced grapefruit, crushed lavender, and smoky cedar evoke peaceful masculine serenity.',
    shortDescription: 'Crisp mountain pine, iced grapefruit, French lavender & smoky cedar.',
    price: 7900,
    salePrice: 6500,
    costPrice: 2800,
    sku: 'RP-MAR-004',
    category: "Men's Collection",
    collection: 'New Arrivals',
    size: '100ml / 3.4 FL. OZ.',
    availableSizes: ['100ml EDP'],
    fragranceNotes: {
      top: ['Iced Grapefruit', 'Cardamom Green', 'Crushed Mint'],
      middle: ['French Alpine Lavender', 'Himalayan Pine Needle', 'Geranium'],
      base: ['Smoky Atlas Cedar', 'Oakmoss', 'Grey Amber', 'Patchouli']
    },
    fragranceType: 'Eau de Parfum',
    gender: 'Men',
    stock: 30,
    lowStockThreshold: 6,
    featured: false,
    bestSeller: false,
    newArrival: true,
    published: true,
    images: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=80'
    ],
    rating: 4.7,
    reviewsCount: 19,
    seoTitle: 'Night in Margalla Eau de Parfum | Fresh Woody Men Fragrance',
    seoDescription: 'Fresh aromatic mountain cologne for Pakistani men. Long lasting silage for hot summers & crisp nights.',
    createdAt: '2026-02-01T14:00:00Z',
    updatedAt: '2026-02-22T08:00:00Z'
  },
  {
    id: 'prod-05',
    name: 'Imperial Sandalwood & Vanilla',
    slug: 'imperial-sandalwood-vanilla',
    description: 'Creamy Mysore sandalwood bathed in velvety vanilla cream and toasted almond. A masterclass in understated elegance, creating a cocoon of comfort and opulence.',
    shortDescription: 'Mysore sandalwood, toasted almond & Madagascar vanilla pod.',
    price: 10500,
    salePrice: 8900,
    costPrice: 3900,
    sku: 'RP-SAN-005',
    category: 'Unisex Collection',
    collection: 'Premium Royale',
    size: '100ml / 3.4 FL. OZ.',
    availableSizes: ['50ml Extrait', '100ml Extrait'],
    fragranceNotes: {
      top: ['Toasted Almond', 'Bergamot Cream', 'Nutmeg'],
      middle: ['Mysore Sandalwood Heart', 'Iris Butter', 'Cinnamon Silk'],
      base: ['Pure Vanilla Bean', 'Dry White Amber', 'Soft Benzoin']
    },
    fragranceType: 'Extrait de Parfum',
    gender: 'Unisex',
    stock: 9,
    lowStockThreshold: 4,
    featured: true,
    bestSeller: false,
    newArrival: true,
    published: true,
    images: [
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=80'
    ],
    rating: 4.9,
    reviewsCount: 27,
    seoTitle: 'Imperial Sandalwood & Vanilla Extrait | Rohan Perfume',
    seoDescription: 'Top tier unisex gourmand woody perfume. Premium extrait longevity across Pakistan.',
    createdAt: '2026-02-05T12:00:00Z',
    updatedAt: '2026-02-25T11:00:00Z'
  },
  {
    id: 'prod-06',
    name: 'Mystic Saffron Leather',
    slug: 'mystic-saffron-leather',
    description: 'Dark, magnetic, and intoxicating. Tannery leather soaked in rich raspberry liqueur and crimson saffron stigmas, grounded by thyme and birch tar.',
    shortDescription: 'Deep Russian leather, wild raspberry & saffron infused with dark amber.',
    price: 8500,
    salePrice: 7100,
    costPrice: 3000,
    sku: 'RP-LEA-006',
    category: "Men's Collection",
    collection: 'Best Sellers',
    size: '100ml / 3.4 FL. OZ.',
    availableSizes: ['100ml EDP'],
    fragranceNotes: {
      top: ['Wild Raspberry', 'Crimson Saffron', 'Wild Thyme'],
      middle: ['Night Jasmine', 'Olibanum Resin', 'Spiced Leather'],
      base: ['Black Suede', 'Birch Wood', 'Golden Amber']
    },
    fragranceType: 'Eau de Parfum',
    gender: 'Men',
    stock: 12,
    lowStockThreshold: 5,
    featured: false,
    bestSeller: true,
    newArrival: false,
    published: true,
    images: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80'
    ],
    rating: 4.8,
    reviewsCount: 35,
    seoTitle: 'Mystic Saffron Leather | Luxury Men Fragrance Pakistan',
    seoDescription: 'Tuscan style raspberry leather for discerning men in Karachi, Lahore, Islamabad.',
    createdAt: '2026-01-20T08:00:00Z',
    updatedAt: '2026-02-24T16:00:00Z'
  },
  {
    id: 'prod-07',
    name: 'Lahore Jasmine & Dewdrop',
    slug: 'lahore-jasmine-dewdrop',
    description: 'The poetic essence of Lahore spring twilight. Fresh Sambac jasmine plucked at dawn, adorned with dew-kissed neroli, sweet pear nectar, and crystalline white amber.',
    shortDescription: 'Fresh Sambac jasmine, green pear nectar & sparkling citrus blossoms.',
    price: 7400,
    salePrice: 5950,
    costPrice: 2400,
    sku: 'RP-JAS-007',
    category: "Women's Collection",
    collection: 'New Arrivals',
    size: '100ml / 3.4 FL. OZ.',
    availableSizes: ['50ml EDP', '100ml EDP'],
    fragranceNotes: {
      top: ['Green Pear', 'Italian Neroli', 'Lemon Blossom'],
      middle: ['Sambac Jasmine Buds', 'Freesia Blossom', 'Honeysuckle'],
      base: ['White Amber', 'Clean Musk', 'Blonde Woods']
    },
    fragranceType: 'Eau de Parfum',
    gender: 'Women',
    stock: 22,
    lowStockThreshold: 4,
    featured: true,
    bestSeller: false,
    newArrival: true,
    published: true,
    images: [
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=900&q=80'
    ],
    rating: 4.7,
    reviewsCount: 16,
    seoTitle: 'Lahore Jasmine & Dewdrop Fragrance | Rohan Perfume',
    seoDescription: 'Breathtakingly fresh feminine jasmine perfume designed for Pakistani weather.',
    createdAt: '2026-02-08T10:00:00Z',
    updatedAt: '2026-02-26T12:00:00Z'
  },
  {
    id: 'prod-08',
    name: 'Celestial Musk & Vetiver',
    slug: 'celestial-musk-vetiver',
    description: 'Clean luxury redefined. A sheer, ultra-sophisticated veil of velvety white musk, Haitian vetiver root, and powdery Florentine iris. A signature scent of effortless distinction.',
    shortDescription: 'Florentine iris, silky white musk & Haitian vetiver root.',
    price: 9500,
    salePrice: 8200,
    costPrice: 3300,
    sku: 'RP-MSK-008',
    category: 'Unisex Collection',
    collection: 'Premium Royale',
    size: '100ml / 3.4 FL. OZ.',
    availableSizes: ['100ml Extrait'],
    fragranceNotes: {
      top: ['Pink Pepper', 'Bergamot Dew', 'Ambrette Seed'],
      middle: ['Florentine Iris Root', 'Silky Hedione', 'White Violet'],
      base: ['Crystal White Musk', 'Haitian Vetiver', 'Iso E Super', 'Ambroxan']
    },
    fragranceType: 'Extrait de Parfum',
    gender: 'Unisex',
    stock: 15,
    lowStockThreshold: 4,
    featured: false,
    bestSeller: true,
    newArrival: false,
    published: true,
    images: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=80'
    ],
    rating: 4.8,
    reviewsCount: 22,
    seoTitle: 'Celestial Musk & Vetiver Extrait | Rohan Perfume',
    seoDescription: 'Minimalist, alluring second-skin scent that garners unconditional compliments.',
    createdAt: '2026-01-25T14:00:00Z',
    updatedAt: '2026-02-27T09:00:00Z'
  },
  {
    id: 'prod-09',
    name: 'Royal Heritage Discovery Box',
    slug: 'royal-heritage-discovery-box',
    description: 'The ultimate olfactory journey into the house of Rohan Perfume. Includes five 10ml travel atomizers featuring Sultanul Oud, Koh-i-Noor Amber, Noor-e-Jahan, Imperial Sandalwood, and Night in Margalla.',
    shortDescription: 'Curated 5 x 10ml travel spray collection in an embossed black velvet chest.',
    price: 6500,
    salePrice: 5200,
    costPrice: 2100,
    sku: 'RP-SET-009',
    category: 'Gift Sets',
    collection: 'Best Sellers',
    size: '5 x 10ml Luxury Vials',
    availableSizes: ['5 x 10ml Coffret'],
    fragranceNotes: {
      top: ['Variety of Bergamot, Saffron, Mandarin & Lychee'],
      middle: ['Aged Agarwood, Taif Rose, Mysore Sandalwood'],
      base: ['Rich Amber, Leather, Vanilla & Cashmere Musk']
    },
    fragranceType: 'Extrait de Parfum',
    gender: 'Unisex',
    stock: 25,
    lowStockThreshold: 5,
    featured: true,
    bestSeller: true,
    newArrival: false,
    published: true,
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=80'
    ],
    rating: 5.0,
    reviewsCount: 54,
    seoTitle: 'Royal Heritage Discovery Set | 5 Luxury Fragrance Coffret',
    seoDescription: 'The perfect luxury gift set for perfume lovers in Pakistan with nationwide Cash on Delivery.',
    createdAt: '2026-01-05T12:00:00Z',
    updatedAt: '2026-02-28T14:00:00Z'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coup-welcome',
    code: 'ROHAN10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 4000,
    maxDiscount: 2000,
    usageLimit: 500,
    usedCount: 42,
    expiryDate: '2026-12-31',
    active: true
  },
  {
    id: 'coup-eid',
    code: 'FESTIVE1000',
    discountType: 'fixed_pkr',
    discountValue: 1000,
    minOrderAmount: 8000,
    usageLimit: 200,
    usedCount: 18,
    expiryDate: '2026-12-31',
    active: true
  },
  {
    id: 'coup-free',
    code: 'FREESHIP',
    discountType: 'free_shipping',
    discountValue: 250,
    minOrderAmount: 3000,
    usageLimit: 1000,
    usedCount: 88,
    expiryDate: '2026-12-31',
    active: true
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-01',
    productId: 'prod-01',
    productName: 'Sultanul Oud Royale',
    customerName: 'Hamza Tariq',
    customerEmail: 'hamza.tariq@example.pk',
    rating: 5,
    comment: 'SubhanAllah, the projection on this oud is unbelievable. Wore it to a wedding in Lahore and got at least 7 people asking which niche brand this was. Stays on clothes for 2 days!',
    date: '2026-02-14',
    status: 'approved'
  },
  {
    id: 'rev-02',
    productId: 'prod-02',
    productName: 'Koh-i-Noor Amber',
    customerName: 'Zainab Abbasi',
    customerEmail: 'zainab.a@example.pk',
    rating: 5,
    comment: 'Warm, opulent and deeply sophisticated. The amber and roasted tonka dry-down is pure bliss. COD delivery to Islamabad arrived within 48 hours in immaculate packaging.',
    date: '2026-02-18',
    status: 'approved'
  },
  {
    id: 'rev-03',
    productId: 'prod-03',
    productName: 'Noor-e-Jahan Velvet Flora',
    customerName: 'Ayesha Malik',
    customerEmail: 'ayesha.m@example.pk',
    rating: 5,
    comment: 'The softest, most regal rose fragrance I have ever possessed in Pakistan. Truly feels like pure luxury without the synthetic sting of cheap clones.',
    date: '2026-02-20',
    status: 'approved'
  },
  {
    id: 'rev-04',
    productId: 'prod-04',
    productName: 'Night in Margalla',
    customerName: 'Bilal Khan',
    customerEmail: 'bilal.k@example.pk',
    rating: 5,
    comment: 'Incredible fresh aromatic woody scent. Perfect signature scent for daily office wear in Islamabad. 10/10 recommendation!',
    date: '2026-02-25',
    status: 'approved'
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'Rohan Perfume',
  storeDescription: 'Artisanal Haute Parfumerie engineered for Pakistan’s distinguished connoisseurs. Hand-blended with Cambodian Oud, Taif Rose, and rare ambers.',
  contactEmail: 'support@rohanperfume.com',
  whatsappNumber: '+923001234567',
  phoneNumber: '+923001234567',
  currency: 'Rs.',
  defaultShippingFee: 250,
  freeShippingThreshold: 6000,
  returnPolicy: 'We offer a 7-day hassle-free replacement or return on unopened fragrances in original cellophane wrapping. If your bottle arrives damaged, we replace it immediately free of charge.',
  deliveryInformation: 'Cash on Delivery (COD) available nationwide across Pakistan via TCS and Leopards Courier. Karachi, Lahore, Islamabad orders delivered in 2-3 business days. Other cities 3-5 business days.',
  socialLinks: {
    instagram: 'https://instagram.com/rohanperfume',
    facebook: 'https://facebook.com/rohanperfume',
    tiktok: 'https://tiktok.com/@rohanperfume'
  },
  announcementText: '✨ FREE EXPRESS DELIVERY ACROSS PAKISTAN ON ALL ORDERS OVER RS. 6,000 | CASH ON DELIVERY AVAILABLE',
  maintenanceMode: false
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-01',
    orderNumber: 'RP-2026-000001',
    customerId: 'cust-01',
    customerName: 'Daniyal Qureshi',
    phone: '03018899771',
    email: 'daniyal.q@example.pk',
    address: {
      customerName: 'Daniyal Qureshi',
      phone: '03018899771',
      email: 'daniyal.q@example.pk',
      houseFlat: 'House 42-B, Street 14',
      street: 'KDA Scheme 1',
      area: 'Tipu Sultan Road',
      city: 'Karachi',
      province: 'Sindh',
      postalCode: '75350',
      specialInstructions: 'Please ring the bell twice, COD cash ready.'
    },
    items: [
      {
        productId: 'prod-01',
        productName: 'Sultanul Oud Royale',
        productImage: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80',
        price: 9450,
        quantity: 1,
        size: '100ml Extrait',
        sku: 'RP-OUD-001'
      }
    ],
    subtotal: 9450,
    discount: 0,
    shippingFee: 0,
    total: 9450,
    paymentMethod: 'COD',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    courierTrackingNumber: 'TCS-77492109',
    courierName: 'TCS Express',
    orderDate: '2026-02-20T14:30:00Z',
    updatedDate: '2026-02-23T11:00:00Z',
    adminNotes: 'Customer satisfied. Repeat customer prospect.'
  },
  {
    id: 'ord-02',
    orderNumber: 'RP-2026-000002',
    customerId: 'cust-02',
    customerName: 'Fatima Zahra',
    phone: '03214455667',
    email: 'fatima.zahra@example.pk',
    address: {
      customerName: 'Fatima Zahra',
      phone: '03214455667',
      email: 'fatima.zahra@example.pk',
      houseFlat: 'Villa 112',
      street: 'Sector Y, Phase 3',
      area: 'DHA',
      city: 'Lahore',
      province: 'Punjab',
      postalCode: '54792',
      specialInstructions: 'Deliver between 3 PM and 7 PM.'
    },
    items: [
      {
        productId: 'prod-03',
        productName: 'Noor-e-Jahan Velvet Flora',
        productImage: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=900&q=80',
        price: 7800,
        quantity: 1,
        size: '100ml EDP',
        sku: 'RP-FLO-003'
      },
      {
        productId: 'prod-02',
        productName: 'Koh-i-Noor Amber',
        productImage: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=80',
        price: 7200,
        quantity: 1,
        size: '100ml EDP',
        sku: 'RP-AMB-002'
      }
    ],
    subtotal: 15000,
    discount: 1000,
    couponCode: 'FESTIVE1000',
    shippingFee: 0,
    total: 14000,
    paymentMethod: 'COD',
    paymentStatus: 'Pending',
    orderStatus: 'Shipped',
    courierTrackingNumber: 'LEO-9912048',
    courierName: 'Leopards Courier',
    orderDate: '2026-03-01T10:15:00Z',
    updatedDate: '2026-03-02T16:00:00Z',
    adminNotes: 'Package handed over to Leopards DHA Hub.'
  }
];
