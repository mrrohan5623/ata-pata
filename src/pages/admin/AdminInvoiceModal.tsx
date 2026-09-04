import React from 'react';
import { X, Printer, Package, Truck, Phone, Mail } from 'lucide-react';
import { Order } from '../../types';

interface AdminInvoiceModalProps {
  order: Order;
  onClose: () => void;
}

export const AdminInvoiceModal: React.FC<AdminInvoiceModalProps> = ({ order, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-10 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl bg-white text-gray-900 rounded-xl shadow-2xl p-8 overflow-hidden z-10 print:p-0 print:shadow-none print:w-full">
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex justify-between items-center pb-6 border-b border-gray-200 print:hidden">
          <span className="text-xs uppercase font-bold text-gray-500 tracking-wider">
            Official Pakistani COD Commercial Invoice
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-gray-900 hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice / Packing Slip</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-500 hover:text-gray-900 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="pt-6 space-y-8">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-serif font-bold text-gray-950 tracking-widest uppercase">
                ROHAN PERFUME
              </h1>
              <p className="text-[10px] text-gray-500 tracking-wider uppercase font-semibold">
                Haute Parfumerie Pakistan • Lahore Central Atelier
              </p>
              <p className="text-xs text-gray-600 mt-1">support@rohanperfume.com | +92 300 1234567</p>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono font-bold text-gray-900 block text-lg">
                INVOICE #{order.orderNumber}
              </span>
              <span className="text-xs text-gray-500">
                Date: {new Date(order.createdAt).toLocaleDateString('en-PK', { dateStyle: 'medium' })}
              </span>
              <div className="mt-1">
                <span className="inline-block bg-black text-white text-[11px] font-bold px-2 py-0.5 rounded uppercase">
                  CASH ON DELIVERY (COD)
                </span>
              </div>
            </div>
          </div>

          {/* Consignee / Dispatch Details */}
          <div className="grid grid-cols-2 gap-8 p-4 bg-gray-50 rounded-lg border border-gray-200 text-xs">
            <div>
              <strong className="text-gray-900 uppercase tracking-wider block mb-1">
                Ship To (Consignee):
              </strong>
              <p className="font-semibold text-gray-950 text-sm">{order.shippingAddress.customerName}</p>
              <p className="text-gray-700">
                {order.shippingAddress.houseFlat}, {order.shippingAddress.street}
              </p>
              <p className="text-gray-700">
                {order.shippingAddress.area}, {order.shippingAddress.city}, {order.shippingAddress.province}
              </p>
              <p className="font-mono text-gray-900 font-bold mt-1">
                Tel: {order.shippingAddress.phone}
              </p>
            </div>

            <div>
              <strong className="text-gray-900 uppercase tracking-wider block mb-1">
                Courier Logistics Data:
              </strong>
              <p className="text-gray-700">Courier Partner: {order.courier || 'TCS Express Pakistan'}</p>
              <p className="text-gray-700">
                Tracking Air Waybill: {order.trackingNumber || 'Awaiting Dispatch'}
              </p>
              <p className="text-gray-700">Order Status: {order.status.toUpperCase()}</p>
              {order.customerNotes && (
                <p className="text-gray-600 italic mt-1">Note: "{order.customerNotes}"</p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-900">
                <th className="py-2 font-bold uppercase text-gray-900">Fragrance Item</th>
                <th className="py-2 font-bold uppercase text-gray-900">Size</th>
                <th className="py-2 text-center font-bold uppercase text-gray-900">Qty</th>
                <th className="py-2 text-right font-bold uppercase text-gray-900">Unit Price</th>
                <th className="py-2 text-right font-bold uppercase text-gray-900">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {order.items.map((it, idx) => (
                <tr key={idx}>
                  <td className="py-2.5 font-medium text-gray-900">{it.name}</td>
                  <td className="py-2.5 text-gray-600">{it.selectedSize}</td>
                  <td className="py-2.5 text-center text-gray-900 font-semibold">{it.quantity}</td>
                  <td className="py-2.5 text-right text-gray-700 font-mono">
                    Rs. {it.price.toLocaleString()}
                  </td>
                  <td className="py-2.5 text-right text-gray-950 font-bold font-mono">
                    Rs. {(it.price * it.quantity).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Financial Breakdown */}
          <div className="flex justify-end">
            <div className="w-64 space-y-1.5 text-xs text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono">Rs. {order.subtotal.toLocaleString()}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Voucher Discount:</span>
                  <span className="font-mono">- Rs. {order.discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee:</span>
                <span className="font-mono">
                  {order.shippingFee === 0 ? 'FREE' : `Rs. ${order.shippingFee}`}
                </span>
              </div>
              <div className="pt-2 border-t-2 border-gray-900 flex justify-between text-sm font-bold text-gray-950">
                <span>Total Due on Delivery:</span>
                <span className="font-mono text-base">Rs. {order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Courier Verification Footer */}
          <div className="pt-6 border-t border-gray-200 text-center text-[10px] text-gray-500 space-y-1">
            <p>Customer must pay the exact invoice amount in Pakistani Rupees to the courier upon delivery.</p>
            <p>For inquiries or claims within 7 days, contact WhatsApp support at +92 300 1234567.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
