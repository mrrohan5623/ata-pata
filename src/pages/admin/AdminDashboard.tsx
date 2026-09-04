import React, { useState } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  LogOut,
  Tag,
  Star,
  Settings,
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useShop } from '../../context/ShopContext';
import { OrderService, ActivityLogService } from '../../services/storageService';
import { AdminOrdersTab } from './AdminOrdersTab';
import { AdminProductsTab } from './AdminProductsTab';
import { AdminCouponsTab } from './AdminCouponsTab';
import { AdminReviewsTab } from './AdminReviewsTab';
import { AdminSettingsTab } from './AdminSettingsTab';

interface AdminDashboardProps {
  onViewStore: () => void;
}

type AdminTab = 'analytics' | 'orders' | 'products' | 'coupons' | 'reviews' | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onViewStore }) => {
  const { currentUser, logout } = useAuth();
  const { products } = useShop();

  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');

  const orders = OrderService.getAll();
  const activityLogs = ActivityLogService.getAll().slice(0, 8);

  // Compute analytics
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const lowStockProducts = products.filter((p) => p.stock <= p.lowStockThreshold);

  return (
    <div className="min-h-screen bg-[#0c0c0f] text-[#f4f2ee]">
      {/* Top Admin Navigation Bar */}
      <header className="border-b border-[#212128] bg-[#111116] px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1a1a24] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-cinzel text-base font-bold tracking-wider text-[#fbfaf8]">
                  ROHAN PERFUME
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-[#d4af37]/15 text-[#d4af37] px-2 py-0.5 rounded border border-[#d4af37]/30">
                  Management Console
                </span>
              </div>
              <p className="text-[11px] text-[#86827a]">
                Admin: {currentUser?.email || 'balochrohan50@gmail.com'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onViewStore}
              className="bg-[#181822] hover:bg-[#252532] text-[#cfccc4] hover:text-[#f4f2ee] text-xs font-semibold px-3.5 py-2 rounded-lg border border-[#2b2b38] flex items-center gap-1.5 transition-colors"
            >
              <span>View Live Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={logout}
              className="p-2 text-[#8c887f] hover:text-red-400 rounded-lg hover:bg-[#1c1c24] transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 border-b border-[#212128] pb-1">
          {[
            { id: 'analytics', label: 'Executive Overview', icon: TrendingUp },
            {
              id: 'orders',
              label: `COD Orders (${orders.length})`,
              icon: ShoppingBag,
              badge: pendingOrders.length > 0 ? `${pendingOrders.length} New` : undefined
            },
            { id: 'products', label: `Fragrances (${products.length})`, icon: Package },
            { id: 'coupons', label: 'Vouchers & Coupons', icon: Tag },
            { id: 'reviews', label: 'Review Moderation', icon: Star },
            { id: 'settings', label: 'Store Settings', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#d4af37] text-[#0c0c0e] shadow-lg'
                    : 'text-[#9b978e] hover:text-[#f4f2ee] hover:bg-[#16161f]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-black text-[#d4af37]' : 'bg-red-500 text-white'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Analytics / Executive Overview */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Low stock alert banner */}
            {lowStockProducts.length > 0 && (
              <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-4 flex items-center justify-between gap-4 text-xs text-amber-200">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <div>
                    <strong className="block text-amber-300">
                      Inventory Warning: {lowStockProducts.length} perfume(s) running low on stock
                    </strong>
                    <span>
                      {lowStockProducts.map((p) => `${p.name} (${p.stock} left)`).join(', ')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('products')}
                  className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 px-3 py-1.5 rounded border border-amber-500/30 text-xs font-semibold whitespace-nowrap"
                >
                  Manage Stock
                </button>
              </div>
            )}

            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Total Revenue */}
              <div className="bg-[#121217] border border-[#212129] rounded-xl p-6 space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-[#8a867e] font-semibold">
                  Gross COD Revenue
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-bold text-[#d4af37]">
                    Rs. {totalRevenue.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                    Pakistani Rupees
                  </span>
                </div>
                <p className="text-[11px] text-[#716e67]">Calculated from confirmed and delivered orders</p>
              </div>

              {/* Total Orders */}
              <div className="bg-[#121217] border border-[#212129] rounded-xl p-6 space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-[#8a867e] font-semibold">
                  Total Orders
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-bold text-[#f4f2ee]">
                    {orders.length}
                  </span>
                  <span className="text-[10px] text-[#a09c94]">Nationwide COD</span>
                </div>
                <p className="text-[11px] text-[#716e67]">
                  Across TCS, Leopards & Trax logistics
                </p>
              </div>

              {/* Pending COD Orders */}
              <div className="bg-[#121217] border border-[#212129] rounded-xl p-6 space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-[#8a867e] font-semibold">
                  Pending Verification
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-bold text-amber-400">
                    {pendingOrders.length}
                  </span>
                  <span className="text-[10px] text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20">
                    Action Required
                  </span>
                </div>
                <p className="text-[11px] text-[#716e67]">Awaiting phone call confirmation before dispatch</p>
              </div>

              {/* Catalog Size */}
              <div className="bg-[#121217] border border-[#212129] rounded-xl p-6 space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-[#8a867e] font-semibold">
                  Active Perfumes
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-bold text-[#f4f2ee]">
                    {products.length}
                  </span>
                  <span className="text-[10px] text-emerald-400">Haute Parfums</span>
                </div>
                <p className="text-[11px] text-[#716e67]">Small-batch extrait formulations</p>
              </div>
            </div>

            {/* Recent Orders Table & Activity Log */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Recent Orders Preview */}
              <div className="lg:col-span-8 bg-[#121217] border border-[#23232c] rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-[#212128] pb-3">
                  <h3 className="font-cinzel text-base font-bold text-[#fbfaf8]">
                    Recent Customer Dispatches
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#d4af37] hover:underline flex items-center gap-1"
                  >
                    <span>View All Orders</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-[#1e1e26]">
                  {orders.slice(0, 5).map((ord) => (
                    <div
                      key={ord.id}
                      onClick={() => setActiveTab('orders')}
                      className="py-3 flex items-center justify-between cursor-pointer hover:bg-[#171720] px-2 rounded transition-colors text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#d4af37]">
                            #{ord.orderNumber}
                          </span>
                          <span className="text-[#f4f2ee] font-medium">
                            {ord.shippingAddress.customerName}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#7b7871]">
                          {ord.shippingAddress.city} • {ord.items.length} item(s)
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-[#f4f2ee] block">
                          Rs. {ord.totalAmount.toLocaleString()}
                        </span>
                        <span className="text-[10px] uppercase font-semibold text-[#a8a49b]">
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Log */}
              <div className="lg:col-span-4 bg-[#121217] border border-[#23232c] rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-[#212128] pb-3">
                  <Activity className="w-4 h-4 text-[#d4af37]" />
                  <h3 className="font-cinzel text-base font-bold text-[#fbfaf8]">
                    Audit Activity
                  </h3>
                </div>

                <div className="space-y-3">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="text-xs space-y-0.5 border-b border-[#1b1b22] pb-2">
                      <p className="text-[#cfccc4] leading-snug">{log.details}</p>
                      <span className="text-[10px] text-[#716e67] block">
                        {new Date(log.timestamp).toLocaleTimeString('en-PK', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Orders */}
        {activeTab === 'orders' && <AdminOrdersTab />}

        {/* Tab 3: Products */}
        {activeTab === 'products' && <AdminProductsTab />}

        {/* Tab 4: Coupons */}
        {activeTab === 'coupons' && <AdminCouponsTab />}

        {/* Tab 5: Reviews */}
        {activeTab === 'reviews' && <AdminReviewsTab />}

        {/* Tab 6: Settings */}
        {activeTab === 'settings' && <AdminSettingsTab />}
      </div>
    </div>
  );
};
