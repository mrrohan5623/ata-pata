import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  ArrowLeft,
  Tag,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';
import { PakistaniAddress, PakistanProvince, Order } from '../../types';
import { OrderService } from '../../services/storageService';

interface CheckoutPageProps {
  onBack: () => void;
  onOrderSuccess: (order: Order) => void;
}

const PAKISTAN_PROVINCES: PakistanProvince[] = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Gilgit-Baltistan',
  'Azad Jammu & Kashmir'
];

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBack, onOrderSuccess }) => {
  const {
    cart,
    cartSubtotal,
    shippingFee,
    finalTotal,
    appliedCoupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    clearCart
  } = useShop();

  const { currentUser } = useAuth();

  // Address form fields
  const [customerName, setCustomerName] = useState(currentUser?.displayName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [houseFlat, setHouseFlat] = useState('');
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('Lahore');
  const [province, setProvince] = useState<PakistanProvince>('Punjab');
  const [postalCode, setPostalCode] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Coupon
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Validate Pakistani Phone format
  const isValidPakistaniPhone = (num: string): boolean => {
    const cleaned = num.trim().replace(/[\s-]/g, '');
    const regex1 = /^03\d{9}$/; // 03001234567
    const regex2 = /^\+923\d{9}$/; // +923001234567
    const regex3 = /^923\d{9}$/; // 923001234567
    return regex1.test(cleaned) || regex2.test(cleaned) || regex3.test(cleaned);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponMsg({ text: res.message, isError: false });
      setCouponInput('');
    } else {
      setCouponMsg({ text: res.message, isError: true });
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Phone validation
    if (!isValidPakistaniPhone(phone)) {
      setErrorMessage('Please enter a valid Pakistani mobile number (e.g. 03001234567 or +923001234567).');
      return;
    }

    // 2. Validate Cart
    if (cart.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    setIsSubmitting(true);

    try {
      const address: PakistaniAddress = {
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        houseFlat: houseFlat.trim(),
        street: street.trim(),
        area: area.trim(),
        city: city.trim(),
        province,
        postalCode: postalCode.trim() || undefined,
        specialInstructions: specialInstructions.trim() || undefined
      };

      const payload = {
        customerId: currentUser?.uid,
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        address,
        cartItems: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          selectedSize: item.selectedSize
        })),
        couponCode: appliedCoupon?.code,
        customerNotes: specialInstructions.trim() || undefined
      };

      const res = OrderService.createOrder(payload);

      if (!res.success || !res.order) {
        setErrorMessage(res.error || 'Failed to place order. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Order created successfully!
      clearCart();
      onOrderSuccess(res.order);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setErrorMessage(msg);
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-cinzel text-2xl font-bold text-[#f4f2ee]">Your Chest is Empty</h2>
        <p className="text-xs text-[#8c887f]">Please add perfumes to your chest before proceeding to checkout.</p>
        <button
          onClick={onBack}
          className="bg-[#d4af37] text-[#0c0c0e] font-bold text-xs uppercase tracking-wider px-6 py-3 rounded"
        >
          Browse Fragrances
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#212129] pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs text-[#9d9990] hover:text-[#d4af37] uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Fragrances</span>
        </button>
        <div className="text-right">
          <span className="text-xs font-cinzel font-bold text-[#d4af37] block">
            CASH ON DELIVERY
          </span>
          <span className="text-[10px] text-[#78746c]">Pay when parcel arrives at your doorstep</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Pakistani Address & Details Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#111116] border border-[#23232c] rounded-xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="font-cinzel text-xl font-bold text-[#fbfaf8]">
                Shipping & Contact Information
              </h2>
              <p className="text-xs text-[#8e8a82] mt-1">
                Enter your precise location in Pakistan for expedited TCS & Leopards delivery.
              </p>
            </div>

            {errorMessage && (
              <div className="bg-red-950/40 border border-red-500/40 text-red-300 p-4 rounded-lg text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-4">
              {/* Full Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#cfccc4] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muhammad Ali"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#171720] border border-[#2d2d38] rounded-lg px-3.5 py-2.5 text-xs text-[#f4f2ee] focus:border-[#d4af37] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#cfccc4] mb-1">
                    Mobile Number (For Delivery SMS / Call) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="03001234567 or +923..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#171720] border border-[#2d2d38] rounded-lg px-3.5 py-2.5 text-xs text-[#f4f2ee] focus:border-[#d4af37] outline-none font-mono"
                  />
                  <span className="text-[10px] text-[#716e67] mt-0.5 block">
                    Courier driver calls this number before delivery.
                  </span>
                </div>
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-[#cfccc4] mb-1">
                  Email Address (Optional — for order receipt & tracking link)
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#171720] border border-[#2d2d38] rounded-lg px-3.5 py-2.5 text-xs text-[#f4f2ee] focus:border-[#d4af37] outline-none"
                />
              </div>

              {/* House / Flat & Street */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[#cfccc4] mb-1">
                    House / Flat / Bungalow # *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. House 45-B, Flat 302"
                    value={houseFlat}
                    onChange={(e) => setHouseFlat(e.target.value)}
                    className="w-full bg-[#171720] border border-[#2d2d38] rounded-lg px-3.5 py-2.5 text-xs text-[#f4f2ee] focus:border-[#d4af37] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#cfccc4] mb-1">
                    Street / Lane / Block *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Street 14, Block 4"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full bg-[#171720] border border-[#2d2d38] rounded-lg px-3.5 py-2.5 text-xs text-[#f4f2ee] focus:border-[#d4af37] outline-none"
                  />
                </div>
              </div>

              {/* Sector / Area & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#cfccc4] mb-1">
                    Sector / Society / Area *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DHA Phase 5, Bahria Town, Gulberg"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full bg-[#171720] border border-[#2d2d38] rounded-lg px-3.5 py-2.5 text-xs text-[#f4f2ee] focus:border-[#d4af37] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#cfccc4] mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Karachi, Lahore, Islamabad, Quetta..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#171720] border border-[#2d2d38] rounded-lg px-3.5 py-2.5 text-xs text-[#f4f2ee] focus:border-[#d4af37] outline-none"
                  />
                </div>
              </div>

              {/* Province & Postal Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#cfccc4] mb-1">
                    Province / Region *
                  </label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value as PakistanProvince)}
                    className="w-full bg-[#171720] border border-[#2d2d38] rounded-lg px-3.5 py-2.5 text-xs text-[#f4f2ee] focus:border-[#d4af37] outline-none"
                  >
                    {PAKISTAN_PROVINCES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#cfccc4] mb-1">
                    Postal Code (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 54000"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full bg-[#171720] border border-[#2d2d38] rounded-lg px-3.5 py-2.5 text-xs text-[#f4f2ee] focus:border-[#d4af37] outline-none"
                  />
                </div>
              </div>

              {/* Special Delivery Instructions */}
              <div>
                <label className="block text-xs font-semibold text-[#cfccc4] mb-1">
                  Delivery Notes / Landmark
                </label>
                <textarea
                  rows={2}
                  placeholder="Near landmark, preferred delivery time, gate code..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full bg-[#171720] border border-[#2d2d38] rounded-lg px-3.5 py-2 text-xs text-[#f4f2ee] focus:border-[#d4af37] outline-none"
                />
              </div>

              {/* Payment Method Badge */}
              <div className="p-4 rounded-lg bg-[#181820] border border-[#d4af37]/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-4 border-[#d4af37] bg-black" />
                  <div>
                    <span className="text-xs font-bold text-[#f4f2ee] block">
                      Cash on Delivery (COD)
                    </span>
                    <span className="text-[11px] text-[#9b978d]">
                      Pay in Pakistani Rupees to courier upon unboxing.
                    </span>
                  </div>
                </div>
                <Truck className="w-5 h-5 text-[#d4af37]" />
              </div>
            </form>
          </div>
        </div>

        {/* Right: Order Review & Pricing Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#111116] border border-[#23232c] rounded-xl p-6 space-y-6">
            <h3 className="font-cinzel text-lg font-bold text-[#fbfaf8] border-b border-[#212128] pb-3">
              Order Summary ({cart.length} item{cart.length > 1 ? 's' : ''})
            </h3>

            {/* Cart Items Preview */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}`}
                  className="flex gap-3 items-center py-2 border-b border-[#1b1b22] text-xs"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-14 object-cover rounded bg-[#181820]"
                  />
                  <div className="flex-1">
                    <h4 className="font-cinzel font-semibold text-[#f4f2ee] line-clamp-1">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] text-[#8e8a81]">
                      Qty: {item.quantity} • {item.selectedSize}
                    </p>
                  </div>
                  <span className="font-bold text-[#d4af37]">
                    Rs. {((item.product.salePrice || item.product.price) * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon Application */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-[#191922] border border-[#d4af37]/40 px-3 py-2 rounded text-xs">
                  <div className="flex items-center gap-2 text-[#d4af37]">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> applied</span>
                  </div>
                  <button onClick={removeCoupon} className="text-red-400 hover:underline">
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
                    className="flex-1 bg-[#171720] border border-[#2d2d38] rounded px-3 py-2 text-xs text-[#f4f2ee] uppercase focus:border-[#d4af37] outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-[#262632] hover:bg-[#343444] text-[#f4f2ee] text-xs font-semibold px-4 py-2 rounded transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponMsg && (
                <p className={`text-[11px] mt-1 ${couponMsg.isError ? 'text-red-400' : 'text-emerald-400'}`}>
                  {couponMsg.text}
                </p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-[#9d9990] pt-2 border-t border-[#202028]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#f4f2ee] font-semibold">Rs. {cartSubtotal.toLocaleString()}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Voucher Discount</span>
                  <span>- Rs. {couponDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery (Pakistan Nationwide)</span>
                <span className="text-[#f4f2ee] font-semibold">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-400 uppercase tracking-wider font-bold">FREE</span>
                  ) : (
                    `Rs. ${shippingFee}`
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-[#22222a] flex justify-between text-base font-bold text-[#f4f2ee]">
                <span>Total Due (COD)</span>
                <span className="text-[#d4af37] text-xl">Rs. {finalTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              className="w-full bg-[#d4af37] hover:bg-[#be9c2f] disabled:bg-[#443b1f] text-[#0c0c0e] font-bold text-xs uppercase tracking-[0.2em] py-4 px-6 rounded-lg shadow-2xl flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              {isSubmitting ? (
                <span>Generating Order...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Place Cash on Delivery Order</span>
                </>
              )}
            </button>

            {/* Delivery Timeline Guarantee */}
            <div className="space-y-2 text-[11px] text-[#7d7971] pt-2">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Estimated dispatch within 24 business hours.</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Zero pre-payment risk. Pay courier after physical inspection.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
