import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

interface CartDrawerProps {
  onCheckout: () => void;
  onExplore: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout, onExplore }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    shippingFee,
    finalTotal,
    appliedCoupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    settings
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = useShop();
    const result = res.applyCoupon(couponInput);
    if (result.success) {
      setCouponFeedback({ message: result.message, isError: false });
      setCouponInput('');
    } else {
      setCouponFeedback({ message: result.message, isError: true });
    }
  };

  const freeShippingNeeded = Math.max(0, settings.freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, Math.round((cartSubtotal / settings.freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#101015] border-l border-[#23232a] text-[#f4f2ee] shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-5 border-b border-[#23232a] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
              <h2 className="font-cinzel text-lg font-bold tracking-wider">
                Your Fragrance Chest ({cart.length})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#9a978f] hover:text-[#f4f2ee] transition-colors rounded-full hover:bg-[#1a1a22]"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          {cart.length > 0 && (
            <div className="bg-[#16161e] px-5 py-3 border-b border-[#23232a] text-xs">
              <div className="flex justify-between font-medium mb-1.5">
                <span>
                  {freeShippingNeeded === 0 ? (
                    <span className="text-[#d4af37] font-semibold">
                      🎉 Congratulations! You qualify for Free Delivery!
                    </span>
                  ) : (
                    <span>
                      Add <strong className="text-[#d4af37]">Rs. {freeShippingNeeded.toLocaleString()}</strong> for Free Delivery
                    </span>
                  )}
                </span>
                <span className="text-[#a09c94]">{freeShippingProgress}%</span>
              </div>
              <div className="w-full bg-[#23232e] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#d4af37] h-full transition-all duration-500 rounded-full"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Items List / Empty State */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#181820] flex items-center justify-center border border-[#2e2e38]">
                  <ShoppingBag className="w-8 h-8 text-[#7a766e]" />
                </div>
                <div>
                  <h3 className="font-cinzel text-lg font-semibold text-[#f4f2ee]">
                    Your Chest is Empty
                  </h3>
                  <p className="text-xs text-[#8c887f] max-w-xs mt-1">
                    Discover Pakistan’s finest artisanal Extrait de Parfum creations.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onExplore();
                  }}
                  className="bg-[#d4af37] hover:bg-[#be9c2f] text-[#0c0c0e] font-semibold text-xs px-6 py-3 rounded uppercase tracking-wider transition-colors"
                >
                  Explore Fragrances
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const activePrice = item.product.salePrice || item.product.price;
                return (
                  <div
                    key={`${item.product.id}-${item.selectedSize}`}
                    className="flex gap-4 p-3 rounded-lg bg-[#14141a] border border-[#202026] relative"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-20 h-24 object-cover rounded bg-[#1b1b22] flex-shrink-0"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-cinzel text-sm font-semibold text-[#f4f2ee] line-clamp-1 pr-4">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                            className="text-[#7d7971] hover:text-red-400 p-1"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-[#9b978e] mt-0.5">{item.selectedSize}</p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Pill */}
                        <div className="flex items-center border border-[#2e2e38] bg-[#0c0c0e] rounded">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                            className="px-2 py-1 text-[#8f8b82] hover:text-[#f4f2ee]"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                            className="px-2 py-1 text-[#8f8b82] hover:text-[#f4f2ee]"
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-[#d4af37]">
                            Rs. {(activePrice * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer & Checkout Controls */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#23232a] bg-[#131319] space-y-4">
              {/* Promo Coupon Bar */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-[#1b1b22] border border-[#d4af37]/40 px-3 py-2 rounded text-xs">
                    <div className="flex items-center gap-2 text-[#d4af37]">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Code <strong>{appliedCoupon.code}</strong> applied</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-red-400 hover:underline ml-2"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon (e.g. ROHAN10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 bg-[#0c0c0e] border border-[#2b2b34] rounded px-3 py-2 text-xs text-[#f4f2ee] uppercase focus:outline-none focus:border-[#d4af37]"
                    />
                    <button
                      type="submit"
                      className="bg-[#24242d] hover:bg-[#32323e] text-[#f4f2ee] text-xs font-semibold px-3 py-2 rounded transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {couponFeedback && (
                  <p
                    className={`text-[11px] mt-1 ${
                      couponFeedback.isError ? 'text-red-400' : 'text-emerald-400'
                    }`}
                  >
                    {couponFeedback.message}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#a5a198]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#f4f2ee]">Rs. {cartSubtotal.toLocaleString()}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span>- Rs. {couponDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span className="font-semibold text-[#f4f2ee]">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-400 uppercase tracking-wider">FREE</span>
                    ) : (
                      `Rs. ${shippingFee}`
                    )}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#23232e] flex justify-between text-sm font-bold text-[#f4f2ee]">
                  <span>Total Amount (COD)</span>
                  <span className="text-[#d4af37] text-base">Rs. {finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* COD Badge */}
              <div className="flex items-center justify-center gap-2 text-[11px] text-[#c5c1b8] bg-[#0c0c0e] p-2 rounded border border-[#232328]">
                <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                <span>Pay in Cash Upon Delivery Anywhere in Pakistan</span>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onCheckout();
                }}
                className="w-full bg-[#d4af37] hover:bg-[#be9c2f] text-[#0c0c0e] font-bold text-xs uppercase tracking-widest py-3.5 px-4 rounded flex items-center justify-center gap-2 shadow-xl transition-all active:scale-[0.99]"
              >
                <span>Proceed to COD Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
