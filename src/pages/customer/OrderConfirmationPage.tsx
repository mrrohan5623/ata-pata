import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  Truck,
  Phone,
  Package,
  ArrowRight,
  MessageCircle,
  MapPin,
  Clock
} from 'lucide-react';
import { Order } from '../../types';
import { useShop } from '../../context/ShopContext';

interface OrderConfirmationPageProps {
  order: Order;
  onTrackOrder: (orderNumber: string) => void;
  onContinueShopping: () => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  order,
  onTrackOrder,
  onContinueShopping
}) => {
  const { settings } = useShop();

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#ffffff', '#b38f2a']
      });
    } catch {
      // ignore
    }
  }, []);

  const cleanWaNumber = (settings.whatsappNumber || '+923001234567').replace(/[^0-9]/g, '');
  const waMsg = encodeURIComponent(
    `As-salamu alaykum! I placed COD order #${order.orderNumber} for Rs. ${order.totalAmount}. Please confirm my shipment.`
  );
  const waUrl = `https://wa.me/${cleanWaNumber}?text=${waMsg}`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-10">
      {/* Top Badge & Heading */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#181822] border-2 border-[#d4af37] text-[#d4af37] flex items-center justify-center mx-auto shadow-2xl">
          <CheckCircle className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
            Order Confirmed
          </span>
          <h1 className="text-3xl sm:text-4xl font-cinzel font-bold text-[#fbfaf8] mt-1">
            Thank You, {order.shippingAddress.customerName}
          </h1>
          <p className="text-xs sm:text-sm text-[#9c988f] max-w-md mx-auto mt-2">
            Your artisanal fragrance order has been received. Our Lahore atelier is preparing your parcel for dispatch.
          </p>
        </div>
      </div>

      {/* Main Order Details Card */}
      <div className="bg-[#121217] border border-[#23232c] rounded-xl p-6 sm:p-8 space-y-6">
        {/* Order Reference Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-[#212129] gap-4">
          <div>
            <span className="text-[11px] text-[#78746c] uppercase tracking-wider block">
              Order Reference Number
            </span>
            <span className="font-mono text-lg font-bold text-[#d4af37]">
              {order.orderNumber}
            </span>
          </div>

          <div className="sm:text-right">
            <span className="text-[11px] text-[#78746c] uppercase tracking-wider block">
              Payment Method
            </span>
            <span className="inline-block bg-[#1c1c24] border border-[#d4af37]/30 text-[#f4f2ee] text-xs font-semibold px-2.5 py-1 rounded mt-0.5">
              Cash on Delivery (Pending Courier Arrival)
            </span>
          </div>
        </div>

        {/* Ordered Fragrances */}
        <div className="space-y-4">
          <h3 className="font-cinzel text-sm font-semibold uppercase tracking-wider text-[#cfccc4]">
            Fragrance Selections
          </h3>
          <div className="divide-y divide-[#1d1d25]">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-14 object-cover rounded bg-[#181820]"
                  />
                  <div>
                    <h4 className="font-cinzel font-semibold text-[#f4f2ee]">{item.name}</h4>
                    <p className="text-[#848077] text-[11px]">
                      Size: {item.selectedSize} • Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-[#d4af37]">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="pt-4 border-t border-[#202028] space-y-2 text-xs text-[#9d9990]">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="text-[#f4f2ee]">Rs. {order.subtotal.toLocaleString()}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-400">
              <span>Coupon Discount ({order.couponCode})</span>
              <span>- Rs. {order.discountAmount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Nationwide Delivery Fee</span>
            <span className="text-[#f4f2ee]">
              {order.shippingFee === 0 ? 'FREE' : `Rs. ${order.shippingFee}`}
            </span>
          </div>
          <div className="pt-3 border-t border-[#22222a] flex justify-between text-base font-bold text-[#f4f2ee]">
            <span>Total Payable in Cash</span>
            <span className="text-[#d4af37] text-xl">Rs. {order.totalAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* Delivery Address & Contact Card */}
        <div className="pt-6 border-t border-[#202028] grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[#cfccc4] font-semibold mb-2">
              <MapPin className="w-4 h-4 text-[#d4af37]" />
              <span>Dispatch Address</span>
            </div>
            <p className="text-[#f4f2ee] font-medium">{order.shippingAddress.customerName}</p>
            <p className="text-[#9e9a91]">
              {order.shippingAddress.houseFlat}, {order.shippingAddress.street}
            </p>
            <p className="text-[#9e9a91]">
              {order.shippingAddress.area}, {order.shippingAddress.city}, {order.shippingAddress.province}
            </p>
            {order.shippingAddress.postalCode && (
              <p className="text-[#7d7971]">Postal: {order.shippingAddress.postalCode}</p>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[#cfccc4] font-semibold mb-2">
              <Truck className="w-4 h-4 text-[#d4af37]" />
              <span>Courier Delivery Guidance</span>
            </div>
            <p className="text-[#9e9a91] leading-relaxed">
              TCS / Leopards courier will call on{' '}
              <strong className="text-[#f4f2ee]">{order.shippingAddress.phone}</strong> before arrival.
            </p>
            <p className="text-[#9e9a91] leading-relaxed mt-1">
              Please have exact cash ready in Pakistani Rupees (<strong>Rs. {order.totalAmount.toLocaleString()}</strong>).
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={() => onTrackOrder(order.orderNumber)}
          className="w-full sm:w-auto bg-[#d4af37] hover:bg-[#be9c2f] text-[#0c0c0e] font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded flex items-center justify-center gap-2 shadow-lg"
        >
          <Package className="w-4 h-4" />
          <span>Track Delivery Status</span>
        </button>

        <a
          href={waUrl}
          target="_blank"
          rel="noreferrer"
          className="w-full sm:w-auto bg-[#181822] hover:bg-[#23232e] border border-[#343444] text-[#25D366] font-semibold text-xs uppercase tracking-wider px-6 py-3.5 rounded flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>WhatsApp Concierge Confirmation</span>
        </a>

        <button
          onClick={onContinueShopping}
          className="w-full sm:w-auto text-xs text-[#9d9990] hover:text-[#f4f2ee] uppercase tracking-wider py-3"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};
