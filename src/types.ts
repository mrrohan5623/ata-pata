export type UserRole = 'customer' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  savedAddress?: PakistaniAddress;
  createdAt: string;
  totalOrders?: number;
  totalSpent?: number;
}

export type PakistanProvince =
  | 'Punjab'
  | 'Sindh'
  | 'Khyber Pakhtunkhwa'
  | 'Balochistan'
  | 'Islamabad Capital Territory'
  | 'Gilgit-Baltistan'
  | 'Azad Jammu & Kashmir';

export interface PakistaniAddress {
  customerName: string;
  phone: string;
  email?: string;
  houseFlat: string;
  street: string;
  area: string;
  city: string;
  province: PakistanProvince;
  postalCode?: string;
  specialInstructions?: string;
}

export type FragranceType = 'Extrait de Parfum' | 'Eau de Parfum' | 'Parfum Oil' | 'Attar';
export type FragranceGender = 'Men' | 'Women' | 'Unisex';

export interface FragranceNotes {
  top: string[];
  middle: string[];
  base: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  salePrice?: number;
  costPrice?: number; // admin view
  sku: string;
  category: string;
  collection: string;
  size: string; // e.g., "100ml / 3.4 oz"
  availableSizes?: string[];
  fragranceNotes: FragranceNotes;
  fragranceType: FragranceType;
  gender: FragranceGender;
  stock: number;
  lowStockThreshold: number;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  published: boolean;
  images: string[];
  rating: number;
  reviewsCount: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  active: boolean;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned'
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'out for delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export type PaymentMethod = 'COD' | 'Online (Card)';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  size: string;
  sku: string;
  name?: string; // alias
  selectedSize?: string; // alias
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. RP-2026-000001
  customerId?: string;
  customerName: string;
  phone: string;
  email?: string;
  address: PakistaniAddress;
  shippingAddress?: PakistaniAddress; // alias
  items: OrderItem[];
  subtotal: number;
  discount: number;
  discountAmount?: number; // alias
  couponCode?: string;
  shippingFee: number;
  total: number;
  totalAmount?: number; // alias
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  status?: OrderStatus; // alias
  courierTrackingNumber?: string;
  courierName?: string;
  courier?: string; // alias
  trackingNumber?: string; // alias
  trackingUrl?: string; // alias
  orderDate: string;
  createdAt?: string; // alias
  updatedDate: string;
  adminNotes?: string;
  customerNotes?: string;
}

export interface StockHistoryItem {
  id: string;
  productId: string;
  productName: string;
  previousStock: number;
  newStock: number;
  changeAmount: number;
  changeType: 'order_placed' | 'order_cancelled' | 'manual_adjustment' | 'restock';
  reason: string;
  adminEmail?: string;
  timestamp: string;
}

export type CouponDiscountType = 'percentage' | 'fixed_pkr' | 'fixed_amount' | 'free_shipping';
export type DiscountType = CouponDiscountType;

export interface Coupon {
  id: string;
  code: string;
  discountType: CouponDiscountType;
  discountValue: number;
  minOrderAmount: number;
  minSpend?: number; // alias
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  expiryDate: string;
  active: boolean;
  isActive?: boolean; // alias
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  approved?: boolean; // alias
}

export interface StoreSettings {
  storeName: string;
  storeLogo?: string;
  storeDescription: string;
  contactEmail: string;
  whatsappNumber: string;
  phoneNumber: string;
  currency: string;
  defaultShippingFee: number;
  freeShippingThreshold: number;
  returnPolicy: string;
  deliveryInformation: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
  };
  announcementText: string;
  maintenanceMode: boolean;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'new_order' | 'low_stock' | 'out_of_stock' | 'new_review' | 'cancelled_order';
  link?: string;
  read: boolean;
  timestamp: string;
}

export interface ActivityLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  details?: string; // alias
  entityType: 'product' | 'order' | 'inventory' | 'coupon' | 'settings' | 'review' | 'auth';
  entityId: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}
