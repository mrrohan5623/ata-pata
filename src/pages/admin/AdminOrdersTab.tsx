import React, { useState, useMemo } from 'react';
import {
  Search,
  Truck,
  Eye,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Phone,
  MapPin,
  Save
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { OrderService } from '../../services/storageService';
import { AdminInvoiceModal } from './AdminInvoiceModal';

export const AdminOrdersTab: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(() => OrderService.getAll());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  // Edit fields for selected order
  const [newStatus, setNewStatus] = useState<OrderStatus>('pending');
  const [courier, setCourier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const refreshOrders = () => {
    const updated = OrderService.getAll();
    setOrders(updated);
    if (selectedOrder) {
      const current = updated.find((o) => o.id === selectedOrder.id);
      if (current) setSelectedOrder(current);
    }
  };

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setCourier(order.courier || 'TCS Express');
    setTrackingNumber(order.trackingNumber || '');
    setTrackingUrl(order.trackingUrl || '');
    setSaveSuccess(false);
  };

  const handleSaveOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    OrderService.updateStatus(selectedOrder.id, newStatus, {
      courier,
      trackingNumber,
      trackingUrl: trackingUrl || (courier.toLowerCase().includes('tcs') && trackingNumber ? `https://tcsexpress.com/track/${trackingNumber}` : undefined)
    });

    setSaveSuccess(true);
    refreshOrders();
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      if (statusFilter !== 'all' && ord.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          ord.orderNumber.toLowerCase().includes(q) ||
          ord.shippingAddress.customerName.toLowerCase().includes(q) ||
          ord.shippingAddress.phone.includes(q) ||
          ord.shippingAddress.city.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-950/40 text-amber-400 border-amber-500/30';
      case 'confirmed':
        return 'bg-blue-950/40 text-blue-400 border-blue-500/30';
      case 'processing':
        return 'bg-purple-950/40 text-purple-400 border-purple-500/30';
      case 'shipped':
        return 'bg-indigo-950/40 text-indigo-400 border-indigo-500/30';
      case 'delivered':
        return 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30';
      case 'cancelled':
        return 'bg-red-950/40 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-[#131319] p-4 rounded-xl border border-[#23232c]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#75726a] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order #, Customer, Phone, City..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#181822] border border-[#2a2a34] rounded-lg pl-9 pr-3 py-2 text-xs text-[#f4f2ee] focus:border-[#d4af37] outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`text-xs px-3 py-1.5 rounded-lg border capitalize whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-[#d4af37] text-[#0c0c0e] font-semibold border-[#d4af37]'
                  : 'bg-[#181822] text-[#9b978e] border-[#292934] hover:text-[#f4f2ee]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Orders Table list */}
        <div className="lg:col-span-7 bg-[#131319] border border-[#23232c] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#212128] flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-[#cfccc4]">
            <span>Pakistani COD Orders ({filteredOrders.length})</span>
          </div>

          <div className="divide-y divide-[#1f1f26] max-h-[600px] overflow-y-auto">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#8c887f]">
                No orders match your filter criteria.
              </div>
            ) : (
              filteredOrders.map((ord) => (
                <div
                  key={ord.id}
                  onClick={() => handleSelectOrder(ord)}
                  className={`p-4 cursor-pointer transition-colors flex items-center justify-between ${
                    selectedOrder?.id === ord.id
                      ? 'bg-[#1a1a24] border-l-4 border-l-[#d4af37]'
                      : 'hover:bg-[#16161f]'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#d4af37]">
                        #{ord.orderNumber}
                      </span>
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${getStatusBadge(
                          ord.status
                        )}`}
                      >
                        {ord.status}
                      </span>
                    </div>

                    <h4 className="font-medium text-xs text-[#f4f2ee]">
                      {ord.shippingAddress.customerName} • {ord.shippingAddress.city}
                    </h4>

                    <p className="text-[11px] text-[#7d7971] font-mono">
                      {ord.shippingAddress.phone}
                    </p>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="font-bold text-xs text-[#f4f2ee] block">
                      Rs. {ord.totalAmount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-[#7d7971] block">
                      {new Date(ord.createdAt).toLocaleDateString('en-PK', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Selected Order Detail & Management Drawer */}
        <div className="lg:col-span-5 bg-[#131319] border border-[#23232c] rounded-xl p-6 space-y-6">
          {selectedOrder ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-[#212128] pb-4">
                <div>
                  <span className="font-mono text-xs font-bold text-[#d4af37] block">
                    #{selectedOrder.orderNumber}
                  </span>
                  <h3 className="font-cinzel text-base font-bold text-[#fbfaf8]">
                    Order Management
                  </h3>
                </div>

                <button
                  onClick={() => setInvoiceOrder(selectedOrder)}
                  className="bg-[#20202a] hover:bg-[#2c2c3a] text-[#d4af37] text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 border border-[#353545]"
                  title="Print Pakistani COD Invoice"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Invoice</span>
                </button>
              </div>

              {saveSuccess && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Order status and courier tracking updated successfully!</span>
                </div>
              )}

              {/* Status and Logistics Form */}
              <form onSubmit={handleSaveOrder} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#cfccc4] mb-1">
                    Fulfillment Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                    className="w-full bg-[#181822] border border-[#2a2a36] text-[#f4f2ee] rounded-lg px-3 py-2 text-xs focus:border-[#d4af37] outline-none"
                  >
                    <option value="pending">Pending Review (New COD Order)</option>
                    <option value="confirmed">Confirmed (Verified via Phone)</option>
                    <option value="processing">In Processing / Extrait Aging</option>
                    <option value="shipped">Dispatched (Handed to Courier)</option>
                    <option value="delivered">Delivered & Cash Collected</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#cfccc4] mb-1">
                      Courier Service
                    </label>
                    <select
                      value={courier}
                      onChange={(e) => setCourier(e.target.value)}
                      className="w-full bg-[#181822] border border-[#2a2a36] text-[#f4f2ee] rounded px-3 py-2 text-xs focus:border-[#d4af37] outline-none"
                    >
                      <option value="TCS Express">TCS Express</option>
                      <option value="Leopards Courier">Leopards Courier</option>
                      <option value="Trax Logistics">Trax Logistics</option>
                      <option value="Call Courier">Call Courier</option>
                      <option value="M&P Logistics">M&P Logistics</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#cfccc4] mb-1">
                      Tracking # (Air Waybill)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 7729103841"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full bg-[#181822] border border-[#2a2a36] text-[#f4f2ee] rounded px-3 py-2 text-xs font-mono focus:border-[#d4af37] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#cfccc4] mb-1">
                    Courier Direct Tracking URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://tcsexpress.com/track/..."
                    value={trackingUrl}
                    onChange={(e) => setTrackingUrl(e.target.value)}
                    className="w-full bg-[#181822] border border-[#2a2a36] text-[#f4f2ee] rounded px-3 py-2 text-xs focus:border-[#d4af37] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#d4af37] hover:bg-[#be9c2f] text-[#0c0c0e] font-bold text-xs uppercase tracking-wider py-2.5 rounded flex items-center justify-center gap-2 shadow"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Order Status</span>
                </button>
              </form>

              {/* Shipping Address and Contact info */}
              <div className="pt-4 border-t border-[#202028] space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-[#f4f2ee]">
                  <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Delivery Address</span>
                </div>
                <p className="text-[#cfccc4] font-medium">{selectedOrder.shippingAddress.customerName}</p>
                <p className="text-[#8c887f]">
                  {selectedOrder.shippingAddress.houseFlat}, {selectedOrder.shippingAddress.street}
                </p>
                <p className="text-[#8c887f]">
                  {selectedOrder.shippingAddress.area}, {selectedOrder.shippingAddress.city},{' '}
                  {selectedOrder.shippingAddress.province}
                </p>
                <div className="flex items-center gap-2 pt-1 font-mono text-[#d4af37]">
                  <Phone className="w-3.5 h-3.5" />
                  <a href={`tel:${selectedOrder.shippingAddress.phone}`} className="hover:underline">
                    {selectedOrder.shippingAddress.phone}
                  </a>
                </div>
              </div>

              {/* Items List */}
              <div className="pt-4 border-t border-[#202028] space-y-2 text-xs">
                <span className="font-semibold text-[#cfccc4] uppercase tracking-wider block mb-2">
                  Fragrances ({selectedOrder.items.length})
                </span>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <div>
                        <span className="text-[#f4f2ee] font-medium">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-[#7d7971] text-[11px] block">{item.selectedSize}</span>
                      </div>
                      <span className="font-bold text-[#d4af37]">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-[#202028] flex justify-between font-bold text-xs text-[#f4f2ee]">
                  <span>Total Amount (COD):</span>
                  <span className="text-[#d4af37] text-sm">
                    Rs. {selectedOrder.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-xs text-[#8c887f] space-y-2">
              <Eye className="w-8 h-8 text-[#5c5850] mx-auto" />
              <p>Select any order on the left to view customer details, assign couriers, or print invoices.</p>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Modal */}
      {invoiceOrder && (
        <AdminInvoiceModal
          order={invoiceOrder}
          onClose={() => setInvoiceOrder(null)}
        />
      )}
    </div>
  );
};
