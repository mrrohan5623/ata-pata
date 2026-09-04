import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, Coupon, StoreSettings } from '../types';
import {
  SettingsService,
  CouponService,
  WishlistService,
  ProductService
} from '../services/storageService';

interface ShopContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedSize?: string) => void;
  updateQuantity: (productId: string, selectedSize: string, quantity: number) => void;
  removeFromCart: (productId: string, selectedSize: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  shippingFee: number;
  finalTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  appliedCoupon: Coupon | null;
  couponDiscount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  settings: StoreSettings;
  refreshSettings: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  products: Product[];
  refreshProducts: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'rohan_cart_v1';

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => WishlistService.get());
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [settings, setSettings] = useState<StoreSettings>(() => SettingsService.get());
  const [products, setProducts] = useState<Product[]>(() => ProductService.getAll());

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }, [cart]);

  const refreshSettings = () => {
    setSettings(SettingsService.get());
  };

  const refreshProducts = () => {
    setProducts(ProductService.getAll());
  };

  const addToCart = (product: Product, quantity = 1, selectedSize?: string) => {
    const sizeToUse = selectedSize || product.size;
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === sizeToUse
      );

      if (existingIdx >= 0) {
        const nextCart = [...prev];
        const newQty = nextCart[existingIdx].quantity + quantity;
        // Bound by product stock
        nextCart[existingIdx].quantity = Math.min(newQty, product.stock);
        return nextCart;
      } else {
        return [...prev, { product, quantity: Math.min(quantity, product.stock), selectedSize: sizeToUse }];
      }
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, selectedSize: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && item.selectedSize === selectedSize) {
          const maxStock = item.product.stock;
          return { ...item, quantity: Math.min(quantity, maxStock) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string, selectedSize: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedSize === selectedSize)
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartSubtotal = cart.reduce((total, item) => {
    const unitPrice = item.product.salePrice || item.product.price;
    return total + unitPrice * item.quantity;
  }, 0);

  // Recalculate coupon discount whenever subtotal changes
  useEffect(() => {
    if (appliedCoupon) {
      const check = CouponService.validate(appliedCoupon.code, cartSubtotal);
      if (check.valid) {
        setCouponDiscount(check.discountAmount);
      } else {
        setAppliedCoupon(null);
        setCouponDiscount(0);
      }
    }
  }, [cartSubtotal, appliedCoupon]);

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const result = CouponService.validate(code, cartSubtotal);
    if (result.valid && result.coupon) {
      setAppliedCoupon(result.coupon);
      setCouponDiscount(result.discountAmount);
      return { success: true, message: result.message };
    }
    return { success: false, message: result.message };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  let shippingFee = settings.defaultShippingFee;
  if (cartSubtotal >= settings.freeShippingThreshold || appliedCoupon?.discountType === 'free_shipping') {
    shippingFee = 0;
  }

  const finalTotal = Math.max(0, cartSubtotal - couponDiscount + (cart.length > 0 ? shippingFee : 0));

  const toggleWishlist = (productId: string) => {
    const updated = WishlistService.toggle(productId);
    setWishlist(updated);
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  return (
    <ShopContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        shippingFee,
        finalTotal,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        appliedCoupon,
        couponDiscount,
        applyCoupon,
        removeCoupon,
        settings,
        refreshSettings,
        searchQuery,
        setSearchQuery,
        products,
        refreshProducts
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = (): ShopContextType => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
