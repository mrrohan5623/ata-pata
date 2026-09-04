import React, { useState } from 'react';
import { Plus, Trash2, Tag, CheckCircle2, X } from 'lucide-react';
import { Coupon, DiscountType } from '../../types';
import { CouponService } from '../../services/storageService';

export const AdminCouponsTab: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(() => CouponService.getAll());
  const [isCreating, setIsCreating] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form states
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<DiscountType>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minSpend, setMinSpend] = useState<number>(5000);
  const [usageLimit, setUsageLimit] = useState<number | undefined>(undefined);
  const [expiryDate, setExpiryDate] = useState('2026-12-31');

  const refreshCoupons = () => {
    setCoupons(CouponService.getAll());
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    CouponService.create({
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      minSpend: Number(minSpend),
      usageLimit: usageLimit ? Number(usageLimit) : undefined,
      expiryDate,
      isActive: true
    });

    refreshCoupons();
    setIsCreating(false);
    setCode('');
    setFeedback(`Coupon "${code.toUpperCase()}" created successfully.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleToggleActive = (coupon: Coupon) => {
    CouponService.update(coupon.id, { isActive: !coupon.isActive });
    refreshCoupons();
  };

  const handleDelete = (id: string, cCode: string) => {
    if (window.confirm(`Delete coupon "${cCode}"?`)) {
      CouponService.delete(id);
      refreshCoupons();
      setFeedback(`Coupon "${cCode}" removed.`);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#131319] p-4 rounded-xl border border-[#23232c]">
        <div>
          <h3 className="font-cinzel text-base font-bold text-[#fbfaf8]">
            Voucher & Promotional Codes
          </h3>
          <p className="text-xs text-[#8e8a82]">
            Create promotional incentives for Pakistani customers and festive campaigns (Eid, Pakistan Day).
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="bg-[#d4af37] hover:bg-[#be9c2f] text-[#0c0c0e] font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg flex items-center gap-2 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>New Coupon</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Coupons Table */}
      <div className="bg-[#131319] border border-[#23232c] rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs text-[#cfccc4]">
          <thead className="bg-[#171720] border-b border-[#24242e] text-[#8e8a81] uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Coupon Code</th>
              <th className="py-3 px-4">Discount</th>
              <th className="py-3 px-4">Min. Spend</th>
              <th className="py-3 px-4">Usage</th>
              <th className="py-3 px-4">Expiry</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e26]">
            {coupons.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-xs text-[#8c887f]">
                  No promotional coupons created yet.
                </td>
              </tr>
            ) : (
              coupons.map((c) => (
                <tr key={c.id} className="hover:bg-[#16161f] transition-colors">
                  <td className="py-3 px-4 flex items-center gap-2 font-mono font-bold text-[#d4af37]">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{c.code}</span>
                  </td>

                  <td className="py-3 px-4 font-semibold text-[#f4f2ee]">
                    {c.discountType === 'percentage'
                      ? `${c.discountValue}% OFF`
                      : c.discountType === 'fixed_amount'
                      ? `Rs. ${c.discountValue.toLocaleString()} OFF`
                      : 'FREE DELIVERY'}
                  </td>

                  <td className="py-3 px-4">Rs. {c.minSpend.toLocaleString()}</td>

                  <td className="py-3 px-4">
                    {c.usedCount} {c.usageLimit ? `/ ${c.usageLimit}` : 'times'}
                  </td>

                  <td className="py-3 px-4">{c.expiryDate}</td>

                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleActive(c)}
                      className={`text-[10px] font-semibold uppercase px-2.5 py-1 rounded border ${
                        c.isActive
                          ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                          : 'bg-red-950/40 text-red-400 border-red-500/30'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDelete(c.id, c.code)}
                      className="p-1.5 text-[#9d9990] hover:text-red-400 transition-colors"
                      title="Delete Coupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsCreating(false)} />

          <div className="relative w-full max-w-md bg-[#121217] border border-[#2a2a36] rounded-xl shadow-2xl p-6 z-10 space-y-5">
            <div className="flex justify-between items-center border-b border-[#212128] pb-3">
              <h3 className="font-cinzel text-base font-bold text-[#fbfaf8]">
                Create Promotional Coupon
              </h3>
              <button onClick={() => setIsCreating(false)} className="text-[#8c887f] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#cfccc4] mb-1 font-semibold">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ROHAN10"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full bg-[#181822] border border-[#2b2b36] rounded px-3 py-2 text-[#f4f2ee] uppercase font-mono focus:border-[#d4af37] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#cfccc4] mb-1 font-semibold">Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as DiscountType)}
                    className="w-full bg-[#181822] border border-[#2b2b36] rounded px-3 py-2 text-[#f4f2ee] focus:border-[#d4af37] outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed_amount">Fixed PKR (Rs.)</option>
                    <option value="free_shipping">Free Shipping</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#cfccc4] mb-1 font-semibold">
                    {discountType === 'percentage' ? 'Percentage %' : 'Amount (PKR)'}
                  </label>
                  <input
                    type="number"
                    disabled={discountType === 'free_shipping'}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full bg-[#181822] border border-[#2b2b36] rounded px-3 py-2 text-[#f4f2ee] focus:border-[#d4af37] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#cfccc4] mb-1 font-semibold">Min. Cart Spend (PKR)</label>
                  <input
                    type="number"
                    value={minSpend}
                    onChange={(e) => setMinSpend(Number(e.target.value))}
                    className="w-full bg-[#181822] border border-[#2b2b36] rounded px-3 py-2 text-[#f4f2ee] focus:border-[#d4af37] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#cfccc4] mb-1 font-semibold">Usage Limit</label>
                  <input
                    type="number"
                    placeholder="Unlimited"
                    value={usageLimit || ''}
                    onChange={(e) => setUsageLimit(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full bg-[#181822] border border-[#2b2b36] rounded px-3 py-2 text-[#f4f2ee] focus:border-[#d4af37] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#cfccc4] mb-1 font-semibold">Expiry Date</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full bg-[#181822] border border-[#2b2b36] rounded px-3 py-2 text-[#f4f2ee] focus:border-[#d4af37] outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded bg-[#1f1f28] text-[#8e8a81]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#d4af37] hover:bg-[#be9c2f] text-[#0c0c0e] font-bold px-5 py-2 rounded"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
