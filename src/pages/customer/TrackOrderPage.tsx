import React, { useState, useEffect } from 'react';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { OrderService } from '../../services/storageService';

interface TrackOrderPageProps {
  initialOrderNumber?: string;
  onExplore: () => void;
}

export const TrackOrderPage: React.FC<TrackOrderPageProps> = ({
  initialOrderNumber,
  onExplore
}) => {
  const [searchInput, setSearchInput] = useState(initialOrderNumber || '');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const performSearch = (query: string) => {
    setErrorMsg(null);
    setHasSearched(true);

    const q = query.trim();
    if (!q) {
      setErrorMsg('Please enter an order number or phone number.');
      setSearchedOrder(null);
      return;
    }

    // Try finding by order number first
    let found = OrderService.getByOrderNumber(q);

    // If not found, try by phone
    if (!found) {
      const byPhone = OrderService.getByPhone(q);
      if (byPhone.length > 0) {
        found = byPhone[0]; // most recent
      }
    }

    if (found) {
      setSearchedOrder(found);
      setErrorMsg(null);
    } else {
      setSearchedOrder(null);
      setErrorMsg(`No order found matching "${q}". Please check your order reference (e.g. RP-2026-0001).`);
    }
  };

  useEffect(() => {
    if (initialOrderNumber) {
      performSearch(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchInput);
  };

  // Status step progression helper
  const STATUS_STEPS: { status: OrderStatus; label: string; desc: string }[] = [
    { status: 'pending', label: 'Order Received', desc: 'Awaiting atelier review' },
    { status: 'confirmed', label: 'Confirmed', desc: 'Order verified by team' },
    { status: 'processing', label: 'In Atelier Preparation', desc: 'Packaging extrait bottle' },
    { status: 'shipped', label: 'Dispatched with Courier', desc: 'In transit across Pakistan' },
    { status: 'delivered', label: 'Delivered & Paid', desc: 'Cash collected upon delivery' }
  ];

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'cancelled' || status === 'returned') return -1;
    return STATUS_STEPS.findIndex((s) => s.status === status);
  };

  const currentStepIdx = searchedOrder ? getStepIndex(searchedOrder.status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Title & Search Bar */}
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
          Nationwide Dispatch Tracking
        </span>
        <h1 className="text-3xl sm:text-4xl font-cinzel font-bold text-[#fbfaf8]">
          Track Your COD Shipment
        </h1>
        <p className="text-xs sm:text-sm text-[#9c988f] max-w-md mx-auto">
          Enter your Rohan Perfume order reference (e.g. <strong>RP-2026-0001</strong>) or your registered Pakistani mobile number.
        </p>

        <form onSubmit={handleFormSubmit} className="max-w-md mx-auto pt-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#7d7971] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. RP-2026-0001 or 03001234567"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-[#14141c] border border-[#2c2c38] rounded-lg pl-10 pr-3 py-3 text-xs text-[#f4f2ee] focus:border-[#d4af37] outline-none font-mono"
            />
          </div>
          <button
            type="submit"
            className="bg-[#d4af37] hover:bg-[#be9c2f] text-[#0c0c0e] font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg shadow-lg"
          >
            Track
          </button>
        </form>
      </div>

      {errorMsg && (
        <div className="max-w-md mx-auto bg-red-950/40 border border-red-500/40 text-red-300 p-4 rounded-lg text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Searched Order Results Card */}
      {searchedOrder && (
        <div className="bg-[#121217] border border-[#23232c] rounded-xl p-6 sm:p-8 space-y-8">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-[#212129] gap-4">
            <div>
              <span className="text-xs font-mono text-[#d4af37] font-bold">
                Order #{searchedOrder.orderNumber}
              </span>
              <h2 className="text-lg font-cinzel font-bold text-[#f4f2ee] mt-0.5">
                {searchedOrder.shippingAddress.customerName}
              </h2>
              <span className="text-xs text-[#7f7b73]">
                Placed on {new Date(searchedOrder.createdAt).toLocaleDateString('en-PK', { dateStyle: 'long' })}
              </span>
            </div>

            <div className="sm:text-right">
              <span className="text-[11px] text-[#7f7b73] uppercase tracking-wider block">
                Total Payable at Doorstep
              </span>
              <span className="text-xl font-bold text-[#d4af37]">
                Rs. {searchedOrder.totalAmount.toLocaleString()}
              </span>
              <span className="text-[11px] text-[#25D366] block font-semibold">
                Cash on Delivery (COD)
              </span>
            </div>
          </div>

          {/* Stepper Progression */}
          {searchedOrder.status === 'cancelled' ? (
            <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-lg text-red-300 text-xs">
              This order was cancelled. Please contact our WhatsApp concierge if you have questions.
            </div>
          ) : (
            <div className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                {STATUS_STEPS.map((step, idx) => {
                  const isCompleted = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;

                  return (
                    <div
                      key={step.status}
                      className={`flex flex-col items-center text-center p-3 rounded-lg border ${
                        isCurrent
                          ? 'border-[#d4af37] bg-[#d4af37]/10'
                          : isCompleted
                          ? 'border-[#2d2d38] bg-[#171720]'
                          : 'border-transparent opacity-40'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                          isCompleted ? 'bg-[#d4af37] text-[#0c0c0e]' : 'bg-[#23232c] text-[#7f7b73]'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                      </div>
                      <span className="text-xs font-semibold text-[#f4f2ee]">{step.label}</span>
                      <span className="text-[10px] text-[#8e8a81] mt-0.5">{step.desc}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Courier Details (if shipped) */}
          {searchedOrder.trackingNumber && (
            <div className="p-4 rounded-lg bg-[#181822] border border-[#d4af37]/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
              <div className="flex items-center gap-3">
                <Truck className="w-6 h-6 text-[#d4af37]" />
                <div>
                  <strong className="text-[#f4f2ee] block">
                    Courier Partner: {searchedOrder.courier || 'TCS Express'}
                  </strong>
                  <span className="text-[#9e9a91]">
                    Tracking Number:{' '}
                    <span className="font-mono text-[#d4af37] font-bold">
                      {searchedOrder.trackingNumber}
                    </span>
                  </span>
                </div>
              </div>

              {searchedOrder.trackingUrl && (
                <a
                  href={searchedOrder.trackingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#242430] hover:bg-[#323242] text-[#f4f2ee] font-semibold text-xs px-4 py-2 rounded flex items-center gap-1.5 transition-colors border border-[#3c3c4e]"
                >
                  <span>Courier Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}

          {/* Destination & Ordered Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#202028] text-xs">
            <div>
              <div className="flex items-center gap-1.5 text-[#cfccc4] font-semibold mb-2">
                <MapPin className="w-4 h-4 text-[#d4af37]" />
                <span>Delivery Location</span>
              </div>
              <p className="text-[#f4f2ee]">{searchedOrder.shippingAddress.customerName}</p>
              <p className="text-[#9e9a91]">
                {searchedOrder.shippingAddress.houseFlat}, {searchedOrder.shippingAddress.street}
              </p>
              <p className="text-[#9e9a91]">
                {searchedOrder.shippingAddress.area}, {searchedOrder.shippingAddress.city},{' '}
                {searchedOrder.shippingAddress.province}
              </p>
              <p className="text-[#d4af37] font-mono mt-1">
                Phone: {searchedOrder.shippingAddress.phone}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-[#cfccc4] font-semibold mb-2">
                <Package className="w-4 h-4 text-[#d4af37]" />
                <span>Items in Parcel ({searchedOrder.items.length})</span>
              </div>
              <div className="space-y-2">
                {searchedOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <span className="text-[#d4d1c9]">
                      {item.quantity}x {item.name} ({item.selectedSize})
                    </span>
                    <span className="font-bold text-[#d4af37]">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suggested perfumes footer */}
      {!searchedOrder && !hasSearched && (
        <div className="text-center pt-8">
          <p className="text-xs text-[#7e7a72] mb-3">Looking to add more perfumes to your collection?</p>
          <button
            onClick={onExplore}
            className="text-xs text-[#d4af37] hover:underline uppercase tracking-wider font-semibold"
          >
            Explore Royal Fragrances →
          </button>
        </div>
      )}
    </div>
  );
};
