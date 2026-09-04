import {
  Product,
  Category,
  Order,
  Coupon,
  Review,
  StoreSettings,
  AdminNotification,
  ActivityLog,
  StockHistoryItem,
  PakistaniAddress,
  OrderItem,
  OrderStatus
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_COUPONS,
  INITIAL_REVIEWS,
  INITIAL_SETTINGS,
  INITIAL_ORDERS
} from '../data/seedData';

// Storage keys
const KEYS = {
  PRODUCTS: 'rohan_products_v1',
  CATEGORIES: 'rohan_categories_v1',
  ORDERS: 'rohan_orders_v1',
  COUPONS: 'rohan_coupons_v1',
  REVIEWS: 'rohan_reviews_v1',
  SETTINGS: 'rohan_settings_v1',
  NOTIFICATIONS: 'rohan_notifications_v1',
  ACTIVITY_LOGS: 'rohan_activity_logs_v1',
  STOCK_HISTORY: 'rohan_stock_history_v1',
  WISHLIST: 'rohan_wishlist_v1'
};

function getLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Storage error:', err);
  }
}

// Initialize seed data once
export function initializeStorageIfNeeded(): void {
  if (!localStorage.getItem(KEYS.PRODUCTS)) {
    setLocal(KEYS.PRODUCTS, INITIAL_PRODUCTS);
  }
  if (!localStorage.getItem(KEYS.CATEGORIES)) {
    setLocal(KEYS.CATEGORIES, INITIAL_CATEGORIES);
  }
  if (!localStorage.getItem(KEYS.COUPONS)) {
    setLocal(KEYS.COUPONS, INITIAL_COUPONS);
  }
  if (!localStorage.getItem(KEYS.REVIEWS)) {
    setLocal(KEYS.REVIEWS, INITIAL_REVIEWS);
  }
  if (!localStorage.getItem(KEYS.SETTINGS)) {
    setLocal(KEYS.SETTINGS, INITIAL_SETTINGS);
  }
  if (!localStorage.getItem(KEYS.ORDERS)) {
    setLocal(KEYS.ORDERS, INITIAL_ORDERS);
  }
  if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
    const defaultNotifications: AdminNotification[] = [
      {
        id: 'notif-01',
        title: 'New COD Order Received',
        message: 'Order RP-2026-000002 placed by Fatima Zahra (Lahore) for Rs. 14,000.',
        type: 'new_order',
        link: '/admin/orders',
        read: false,
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString()
      },
      {
        id: 'notif-02',
        title: 'Low Stock Alert',
        message: 'Imperial Sandalwood & Vanilla has only 9 bottles remaining in inventory.',
        type: 'low_stock',
        link: '/admin/inventory',
        read: false,
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
      }
    ];
    setLocal(KEYS.NOTIFICATIONS, defaultNotifications);
  }
}

export function resetAllData(): void {
  localStorage.removeItem(KEYS.PRODUCTS);
  localStorage.removeItem(KEYS.CATEGORIES);
  localStorage.removeItem(KEYS.COUPONS);
  localStorage.removeItem(KEYS.REVIEWS);
  localStorage.removeItem(KEYS.SETTINGS);
  localStorage.removeItem(KEYS.ORDERS);
  localStorage.removeItem(KEYS.NOTIFICATIONS);
  localStorage.removeItem(KEYS.ACTIVITY_LOGS);
  localStorage.removeItem(KEYS.STOCK_HISTORY);
  initializeStorageIfNeeded();
}

// ================= PRODUCT SERVICE =================
export const ProductService = {
  getAll(): Product[] {
    initializeStorageIfNeeded();
    return getLocal<Product[]>(KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },

  getBySlug(slug: string): Product | undefined {
    return this.getAll().find((p) => p.slug === slug);
  },

  getById(id: string): Product | undefined {
    return this.getAll().find((p) => p.id === id);
  },

  save(product: Product, adminEmail: string = 'balochrohan50@gmail.com'): Product {
    const products = this.getAll();
    const existingIndex = products.findIndex((p) => p.id === product.id);
    const now = new Date().toISOString();

    let updatedProduct: Product;
    if (existingIndex >= 0) {
      updatedProduct = { ...product, updatedAt: now };
      products[existingIndex] = updatedProduct;
      ActivityLogService.log(
        adminEmail,
        `Updated fragrance: ${product.name}`,
        'product',
        product.id,
        { price: product.price, stock: product.stock }
      );
    } else {
      updatedProduct = { ...product, createdAt: now, updatedAt: now };
      products.unshift(updatedProduct);
      ActivityLogService.log(
        adminEmail,
        `Created new fragrance: ${product.name}`,
        'product',
        product.id
      );
    }

    setLocal(KEYS.PRODUCTS, products);
    return updatedProduct;
  },

  delete(id: string, adminEmail: string = 'balochrohan50@gmail.com'): boolean {
    const products = this.getAll();
    const product = products.find((p) => p.id === id);
    const filtered = products.filter((p) => p.id !== id);
    setLocal(KEYS.PRODUCTS, filtered);
    if (product) {
      ActivityLogService.log(adminEmail, `Deleted fragrance: ${product.name}`, 'product', id);
    }
    return true;
  },

  create(product: Partial<Product>, adminEmail: string = 'balochrohan50@gmail.com'): Product {
    const id = product.id || `prod-${Date.now()}`;
    const slug = product.slug || (product.name || 'perfume').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newProduct: Product = {
      id,
      name: product.name || 'Unnamed Fragrance',
      slug,
      description: product.description || '',
      shortDescription: product.shortDescription || '',
      price: product.price || 5000,
      salePrice: product.salePrice,
      costPrice: product.costPrice,
      sku: product.sku || `RP-${Date.now()}`,
      category: product.category || "Men's Collection",
      collection: product.collection || "Men's Collection",
      size: product.size || '100ml',
      availableSizes: product.availableSizes || [product.size || '100ml'],
      fragranceNotes: product.fragranceNotes || { top: [], middle: [], base: [] },
      fragranceType: product.fragranceType || 'Extrait de Parfum',
      gender: product.gender || 'Unisex',
      stock: product.stock !== undefined ? product.stock : 20,
      lowStockThreshold: product.lowStockThreshold || 5,
      featured: Boolean(product.featured),
      bestSeller: Boolean(product.bestSeller),
      newArrival: Boolean(product.newArrival),
      published: product.published !== undefined ? product.published : true,
      images: product.images && product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80'],
      rating: product.rating || 5.0,
      reviewsCount: product.reviewsCount || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return this.save(newProduct, adminEmail);
  },

  update(id: string, updates: Partial<Product>, adminEmail: string = 'balochrohan50@gmail.com'): Product | undefined {
    const existing = this.getById(id);
    if (!existing) return undefined;
    const merged: Product = { ...existing, ...updates, id, updatedAt: new Date().toISOString() };
    return this.save(merged, adminEmail);
  },

  adjustStock(
    productId: string,
    newQuantity: number,
    reason: string,
    adminEmail: string = 'balochrohan50@gmail.com'
  ): Product | undefined {
    const products = this.getAll();
    const product = products.find((p) => p.id === productId);
    if (!product) return undefined;

    const previousStock = product.stock;
    product.stock = Math.max(0, newQuantity);
    product.updatedAt = new Date().toISOString();
    setLocal(KEYS.PRODUCTS, products);

    // Record stock history
    const history: StockHistoryItem[] = getLocal<StockHistoryItem[]>(KEYS.STOCK_HISTORY, []);
    history.unshift({
      id: `stk-${Date.now()}`,
      productId,
      productName: product.name,
      previousStock,
      newStock: product.stock,
      changeAmount: product.stock - previousStock,
      changeType: 'manual_adjustment',
      reason,
      adminEmail,
      timestamp: new Date().toISOString()
    });
    setLocal(KEYS.STOCK_HISTORY, history);

    // Notification if low stock
    if (product.stock <= product.lowStockThreshold && product.stock > 0) {
      NotificationService.create(
        'Low Stock Warning',
        `${product.name} has fallen to ${product.stock} units!`,
        'low_stock',
        '/admin/inventory'
      );
    } else if (product.stock === 0) {
      NotificationService.create(
        'Out of Stock Alert',
        `${product.name} is completely out of stock.`,
        'out_of_stock',
        '/admin/inventory'
      );
    }

    ActivityLogService.log(
      adminEmail,
      `Adjusted stock for ${product.name} from ${previousStock} to ${product.stock}`,
      'inventory',
      productId
    );

    return product;
  },

  getStockHistory(): StockHistoryItem[] {
    return getLocal<StockHistoryItem[]>(KEYS.STOCK_HISTORY, []);
  }
};

// ================= CATEGORY SERVICE =================
export const CategoryService = {
  getAll(): Category[] {
    initializeStorageIfNeeded();
    return getLocal<Category[]>(KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },

  save(category: Category, adminEmail: string = 'balochrohan50@gmail.com'): Category {
    const categories = this.getAll();
    const index = categories.findIndex((c) => c.id === category.id);
    if (index >= 0) {
      categories[index] = category;
      ActivityLogService.log(adminEmail, `Updated category: ${category.name}`, 'settings', category.id);
    } else {
      categories.push(category);
      ActivityLogService.log(adminEmail, `Created category: ${category.name}`, 'settings', category.id);
    }
    setLocal(KEYS.CATEGORIES, categories);
    return category;
  },

  delete(id: string, adminEmail: string = 'balochrohan50@gmail.com'): void {
    const categories = this.getAll().filter((c) => c.id !== id);
    setLocal(KEYS.CATEGORIES, categories);
    ActivityLogService.log(adminEmail, `Deleted category id: ${id}`, 'settings', id);
  }
};

// ================= ORDER SERVICE =================
export const OrderService = {
  getAll(): Order[] {
    initializeStorageIfNeeded();
    return getLocal<Order[]>(KEYS.ORDERS, INITIAL_ORDERS);
  },

  getById(id: string): Order | undefined {
    return this.getAll().find((o) => o.id === id || o.orderNumber === id);
  },

  getByOrderNumber(orderNumber: string): Order | undefined {
    const norm = orderNumber.trim().toUpperCase();
    return this.getAll().find((o) => o.orderNumber.toUpperCase() === norm);
  },

  getByPhone(phone: string): Order[] {
    const clean = phone.replace(/[^0-9]/g, '');
    if (!clean) return [];
    return this.getAll().filter((o) => o.phone.replace(/[^0-9]/g, '').includes(clean));
  },

  // Server-side calculation & order submission
  createOrder(payload: {
    customerId?: string;
    customerName: string;
    phone: string;
    email?: string;
    address: PakistaniAddress;
    cartItems: { productId: string; quantity: number; selectedSize: string }[];
    couponCode?: string;
    customerNotes?: string;
  }): { success: boolean; order?: Order; error?: string } {
    initializeStorageIfNeeded();
    const products = ProductService.getAll();
    const settings = SettingsService.get();

    // 1. Validate items & compute server-side prices
    const orderItems: OrderItem[] = [];
    let computedSubtotal = 0;

    for (const item of payload.cartItems) {
      const prod = products.find((p) => p.id === item.productId);
      if (!prod) {
        return { success: false, error: `Product not found: ${item.productId}` };
      }
      if (prod.stock < item.quantity) {
        return {
          success: false,
          error: `Insufficient stock for "${prod.name}". Only ${prod.stock} left in warehouse.`
        };
      }

      const activePrice = prod.salePrice || prod.price;
      computedSubtotal += activePrice * item.quantity;

      orderItems.push({
        productId: prod.id,
        productName: prod.name,
        productImage: prod.images[0] || '',
        price: activePrice,
        quantity: item.quantity,
        size: item.selectedSize || prod.size,
        sku: prod.sku
      });
    }

    // 2. Validate coupon securely
    let discount = 0;
    let validatedCoupon: Coupon | undefined;
    if (payload.couponCode) {
      const couponCheck = CouponService.validate(payload.couponCode, computedSubtotal);
      if (couponCheck.valid && couponCheck.coupon) {
        discount = couponCheck.discountAmount;
        validatedCoupon = couponCheck.coupon;
      }
    }

    // 3. Calculate shipping fee
    let shippingFee = settings.defaultShippingFee;
    if (computedSubtotal >= settings.freeShippingThreshold || validatedCoupon?.discountType === 'free_shipping') {
      shippingFee = 0;
    }

    const finalTotal = Math.max(0, computedSubtotal - discount + shippingFee);

    // 4. Generate sequential order number RP-2026-XXXXXX
    const orders = this.getAll();
    const orderCount = orders.length + 1;
    const orderNumber = `RP-2026-${String(orderCount).padStart(6, '0')}`;
    const newOrderId = `ord-${Date.now()}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      id: newOrderId,
      orderNumber,
      customerId: payload.customerId,
      customerName: payload.customerName,
      phone: payload.phone,
      email: payload.email,
      address: payload.address,
      items: orderItems,
      subtotal: computedSubtotal,
      discount,
      couponCode: validatedCoupon?.code,
      shippingFee,
      total: finalTotal,
      paymentMethod: 'COD',
      paymentStatus: 'Pending',
      orderStatus: 'Pending',
      orderDate: now,
      updatedDate: now,
      customerNotes: payload.customerNotes
    };

    // 5. Decrement Inventory Safely
    for (const item of orderItems) {
      const p = products.find((prod) => prod.id === item.productId);
      if (p) {
        const prev = p.stock;
        p.stock = Math.max(0, p.stock - item.quantity);
        p.updatedAt = now;

        // Add to stock history
        const history = ProductService.getStockHistory();
        history.unshift({
          id: `stk-${Date.now()}-${item.productId}`,
          productId: p.id,
          productName: p.name,
          previousStock: prev,
          newStock: p.stock,
          changeAmount: -item.quantity,
          changeType: 'order_placed',
          reason: `Order placed (${orderNumber})`,
          timestamp: now
        });
        setLocal(KEYS.STOCK_HISTORY, history);
      }
    }
    setLocal(KEYS.PRODUCTS, products);

    // 6. Increment coupon usedCount if applied
    if (validatedCoupon) {
      CouponService.incrementUsage(validatedCoupon.id);
    }

    // 7. Save Order
    orders.unshift(newOrder);
    setLocal(KEYS.ORDERS, orders);

    // 8. Create admin notification
    NotificationService.create(
      'New COD Order Placed!',
      `Order ${orderNumber} received from ${newOrder.customerName} (${newOrder.address.city}) for Rs. ${newOrder.total.toLocaleString()}.`,
      'new_order',
      '/admin/orders'
    );

    return { success: true, order: newOrder };
  },

  updateStatus(
    orderId: string,
    newStatus: OrderStatus,
    optionsOrNotes?: string | { courier?: string; trackingNumber?: string; trackingUrl?: string; adminNotes?: string },
    adminEmail: string = 'balochrohan50@gmail.com'
  ): Order | undefined {
    const orders = this.getAll();
    const order = orders.find((o) => o.id === orderId);
    if (!order) return undefined;

    order.orderStatus = newStatus;
    order.updatedDate = new Date().toISOString();

    if (typeof optionsOrNotes === 'string') {
      order.adminNotes = optionsOrNotes;
    } else if (optionsOrNotes) {
      if (optionsOrNotes.adminNotes) order.adminNotes = optionsOrNotes.adminNotes;
      if (optionsOrNotes.courier) order.courierName = optionsOrNotes.courier;
      if (optionsOrNotes.trackingNumber) order.courierTrackingNumber = optionsOrNotes.trackingNumber;
    }

    // If marked delivered, COD payment status becomes Paid
    if (newStatus === 'Delivered') {
      order.paymentStatus = 'Paid';
    }

    // If cancelled, restock inventory
    if (newStatus === 'Cancelled') {
      const products = ProductService.getAll();
      for (const item of order.items) {
        const p = products.find((prod) => prod.id === item.productId);
        if (p) {
          p.stock += item.quantity;
        }
      }
      setLocal(KEYS.PRODUCTS, products);
    }

    setLocal(KEYS.ORDERS, orders);
    ActivityLogService.log(
      adminEmail,
      `Updated order ${order.orderNumber} status to "${newStatus}"`,
      'order',
      orderId
    );

    return order;
  },

  updateTracking(
    orderId: string,
    courierName: string,
    trackingNumber: string,
    adminEmail: string = 'balochrohan50@gmail.com'
  ): Order | undefined {
    const orders = this.getAll();
    const order = orders.find((o) => o.id === orderId);
    if (!order) return undefined;

    order.courierName = courierName;
    order.courierTrackingNumber = trackingNumber;
    order.orderStatus = 'Shipped';
    order.updatedDate = new Date().toISOString();
    setLocal(KEYS.ORDERS, orders);

    ActivityLogService.log(
      adminEmail,
      `Dispatched order ${order.orderNumber} via ${courierName} #${trackingNumber}`,
      'order',
      orderId
    );
    return order;
  }
};

// ================= COUPON SERVICE =================
export const CouponService = {
  getAll(): Coupon[] {
    initializeStorageIfNeeded();
    return getLocal<Coupon[]>(KEYS.COUPONS, INITIAL_COUPONS);
  },

  validate(
    code: string,
    cartSubtotal: number
  ): { valid: boolean; message: string; discountAmount: number; coupon?: Coupon } {
    const normalized = code.trim().toUpperCase();
    const coupons = this.getAll();
    const coupon = coupons.find((c) => c.code.toUpperCase() === normalized && c.active);

    if (!coupon) {
      return { valid: false, message: 'Invalid or expired promotional voucher code.', discountAmount: 0 };
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      return { valid: false, message: 'This coupon has expired.', discountAmount: 0 };
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, message: 'This coupon usage limit has been reached.', discountAmount: 0 };
    }

    if (cartSubtotal < coupon.minOrderAmount) {
      return {
        valid: false,
        message: `Requires a minimum order of Rs. ${coupon.minOrderAmount.toLocaleString()}.`,
        discountAmount: 0
      };
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((cartSubtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else if (coupon.discountType === 'fixed_pkr') {
      discount = coupon.discountValue;
    } else if (coupon.discountType === 'free_shipping') {
      discount = coupon.discountValue || 250;
    }

    return {
      valid: true,
      message: `Coupon "${coupon.code}" applied! Saving Rs. ${discount.toLocaleString()}`,
      discountAmount: discount,
      coupon
    };
  },

  incrementUsage(couponId: string): void {
    const coupons = this.getAll();
    const c = coupons.find((item) => item.id === couponId);
    if (c) {
      c.usedCount += 1;
      setLocal(KEYS.COUPONS, coupons);
    }
  },

  save(coupon: Coupon, adminEmail: string = 'balochrohan50@gmail.com'): Coupon {
    const coupons = this.getAll();
    const index = coupons.findIndex((c) => c.id === coupon.id);
    if (index >= 0) {
      coupons[index] = coupon;
      ActivityLogService.log(adminEmail, `Updated coupon ${coupon.code}`, 'coupon', coupon.id);
    } else {
      coupons.unshift(coupon);
      ActivityLogService.log(adminEmail, `Created coupon ${coupon.code}`, 'coupon', coupon.id);
    }
    setLocal(KEYS.COUPONS, coupons);
    return coupon;
  },

  delete(id: string, adminEmail: string = 'balochrohan50@gmail.com'): void {
    const coupons = this.getAll().filter((c) => c.id !== id);
    setLocal(KEYS.COUPONS, coupons);
    ActivityLogService.log(adminEmail, `Deleted coupon id ${id}`, 'coupon', id);
  },

  create(coupon: Partial<Coupon>, adminEmail: string = 'balochrohan50@gmail.com'): Coupon {
    const id = coupon.id || `cpn-${Date.now()}`;
    const newCoupon: Coupon = {
      id,
      code: (coupon.code || 'COUPON').toUpperCase(),
      discountType: coupon.discountType || 'percentage',
      discountValue: coupon.discountValue || 10,
      minOrderAmount: coupon.minOrderAmount || 0,
      maxDiscount: coupon.maxDiscount,
      usageLimit: coupon.usageLimit || 1000,
      usedCount: coupon.usedCount || 0,
      expiryDate: coupon.expiryDate || '2026-12-31',
      active: coupon.active !== undefined ? coupon.active : true
    };
    return this.save(newCoupon, adminEmail);
  },

  update(id: string, updates: Partial<Coupon>, adminEmail: string = 'balochrohan50@gmail.com'): Coupon | undefined {
    const coupons = this.getAll();
    const c = coupons.find((item) => item.id === id);
    if (!c) return undefined;
    const updated = { ...c, ...updates, id };
    return this.save(updated, adminEmail);
  }
};

// ================= REVIEW SERVICE =================
export const ReviewService = {
  getAll(): Review[] {
    initializeStorageIfNeeded();
    return getLocal<Review[]>(KEYS.REVIEWS, INITIAL_REVIEWS);
  },

  getByProduct(productId: string): Review[] {
    return this.getAll().filter((r) => r.productId === productId && r.status === 'approved');
  },

  submit(review: Omit<Review, 'id' | 'date' | 'status'>): Review {
    const reviews = this.getAll();
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'pending' // requires admin approval to prevent spam
    };
    reviews.unshift(newRev);
    setLocal(KEYS.REVIEWS, reviews);

    NotificationService.create(
      'New Customer Review',
      `${review.customerName} reviewed "${review.productName}". Awaiting moderation.`,
      'new_review',
      '/admin/reviews'
    );

    return newRev;
  },

  updateStatus(id: string, status: 'approved' | 'rejected', adminEmail: string = 'balochrohan50@gmail.com'): void {
    const reviews = this.getAll();
    const rev = reviews.find((r) => r.id === id);
    if (rev) {
      rev.status = status;
      setLocal(KEYS.REVIEWS, reviews);
      ActivityLogService.log(adminEmail, `Moderated review ${id} to ${status}`, 'review', id);
    }
  },

  approve(id: string, adminEmail: string = 'balochrohan50@gmail.com'): void {
    this.updateStatus(id, 'approved', adminEmail);
  },

  delete(id: string): void {
    const reviews = this.getAll().filter((r) => r.id !== id);
    setLocal(KEYS.REVIEWS, reviews);
  }
};

// ================= SETTINGS SERVICE =================
export const SettingsService = {
  get(): StoreSettings {
    initializeStorageIfNeeded();
    return getLocal<StoreSettings>(KEYS.SETTINGS, INITIAL_SETTINGS);
  },

  save(newSettings: StoreSettings, adminEmail: string = 'balochrohan50@gmail.com'): StoreSettings {
    setLocal(KEYS.SETTINGS, newSettings);
    ActivityLogService.log(adminEmail, 'Updated store configurations & shipping parameters', 'settings', 'store');
    return newSettings;
  },

  update(partial: Partial<StoreSettings>, adminEmail: string = 'balochrohan50@gmail.com'): StoreSettings {
    const current = this.get();
    const merged: StoreSettings = { ...current, ...partial };
    return this.save(merged, adminEmail);
  }
};

// ================= NOTIFICATION SERVICE =================
export const NotificationService = {
  getAll(): AdminNotification[] {
    initializeStorageIfNeeded();
    return getLocal<AdminNotification[]>(KEYS.NOTIFICATIONS, []);
  },

  create(
    title: string,
    message: string,
    type: AdminNotification['type'],
    link?: string
  ): AdminNotification {
    const notifs = this.getAll();
    const item: AdminNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      link,
      read: false,
      timestamp: new Date().toISOString()
    };
    notifs.unshift(item);
    setLocal(KEYS.NOTIFICATIONS, notifs);
    return item;
  },

  markAsRead(id: string): void {
    const notifs = this.getAll();
    const item = notifs.find((n) => n.id === id);
    if (item) {
      item.read = true;
      setLocal(KEYS.NOTIFICATIONS, notifs);
    }
  },

  markAllAsRead(): void {
    const notifs = this.getAll().map((n) => ({ ...n, read: true }));
    setLocal(KEYS.NOTIFICATIONS, notifs);
  }
};

// ================= ACTIVITY LOG SERVICE =================
export const ActivityLogService = {
  getAll(): ActivityLog[] {
    initializeStorageIfNeeded();
    return getLocal<ActivityLog[]>(KEYS.ACTIVITY_LOGS, [
      {
        id: 'log-01',
        adminId: 'admin-baloch',
        adminEmail: 'balochrohan50@gmail.com',
        action: 'System initialized with Pakistani luxury perfume catalog',
        entityType: 'product',
        entityId: 'system',
        timestamp: new Date().toISOString()
      }
    ]);
  },

  log(
    adminEmail: string,
    action: string,
    entityType: ActivityLog['entityType'],
    entityId: string,
    metadata?: Record<string, unknown>
  ): void {
    const logs = this.getAll();
    logs.unshift({
      id: `log-${Date.now()}`,
      adminId: 'admin-baloch',
      adminEmail,
      action,
      entityType,
      entityId,
      timestamp: new Date().toISOString(),
      metadata
    });
    setLocal(KEYS.ACTIVITY_LOGS, logs.slice(0, 100)); // Keep latest 100
  }
};

// ================= WISHLIST SERVICE =================
export const WishlistService = {
  get(): string[] {
    return getLocal<string[]>(KEYS.WISHLIST, []);
  },

  toggle(productId: string): string[] {
    const list = this.get();
    let updated: string[];
    if (list.includes(productId)) {
      updated = list.filter((id) => id !== productId);
    } else {
      updated = [...list, productId];
    }
    setLocal(KEYS.WISHLIST, updated);
    return updated;
  }
};
