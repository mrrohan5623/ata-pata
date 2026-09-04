import React, { useState } from 'react';
import {
  User,
  Package,
  Heart,
  LogOut,
  ShoppingBag,
  Clock,
  Trash2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useShop } from '../../context/ShopContext';
import { OrderService } from '../../services/storageService';
import { Product } from '../../types';

interface CustomerAccountPageProps {
  initialTab?: string;
  onSelectProduct: (product: Product) => void;
  onTrackOrder: (orderNumber: string) => void;
  onExplore: () => void;
}

export const CustomerAccountPage: React.FC<CustomerAccountPageProps> = ({
  initialTab = 'orders',
  onSelectProduct,
  onTrackOrder,
  onExplore
}) => {
  const { currentUser, login, logout, register } = useAuth();
  const { wishlist, toggleWishlist, products, addToCart } = useShop();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile'>(
    (initialTab as 'orders' | 'wishlist' | 'profile') || 'orders'
  );

  // Auth form states if not logged in
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Wishlist products
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  // Orders for current user (or lookup by phone / email)
  const userOrders = currentUser
    ? OrderService.getAll().filter(
        (o) =>
          (currentUser.uid && o.customerId === currentUser.uid) ||
          (currentUser.email && o.email?.toLowerCase() === currentUser.email.toLowerCase()) ||
          (currentUser.phone && o.phone === currentUser.phone)
      )
    : [];

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (isRegisterMode) {
      if (!displayName || !email || !password) {
        setAuthError('Please fill in all required fields.');
        return;
      }
      const res = await register(displayName, email, password);
      if (!res.success) {
        setAuthError(res.error || 'Registration failed.');
      }
    } else {
      if (!email || !password) {
        setAuthError('Please enter both email and password.');
        return;
      }
      const res = await login(email, password);
      if (!res.success) {
        setAuthError(res.error || 'Invalid credentials.');
      }
    }
  };

  // If NOT logged in, show elegant Login/Register screen
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-[#121217] border border-[#23232c] rounded-xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
              Rohan Perfume Connoisseur
            </span>
            <h1 className="text-2xl font-cinzel font-bold text-[#fbfaf8]">
              {isRegisterMode ? 'Create Account' : 'Sign In'}
            </h1>
            <p className="text-xs text-[#8e8a82]">
              Access saved fragrances, COD order tracking, and member exclusives.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-950/40 border border-red-500/40 text-red-300 text-xs rounded">
              {authError}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {isRegisterMode && (
              <div>
                <label className="block text-xs font-semibold text-[#cfccc4] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Baloch"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-[#181820] border border-[#2b2b36] rounded px-3 py-2 text-xs text-[#f4f2ee] focus:border-[#d4af37] outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#cfccc4] mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#181820] border border-[#2b2b36] rounded px-3 py-2 text-xs text-[#f4f2ee] focus:border-[#d4af37] outline-none"
              />
            </div>

            {isRegisterMode && (
              <div>
                <label className="block text-xs font-semibold text-[#cfccc4] mb-1">
                  Mobile Number (03XXXXXXXXX)
                </label>
                <input
                  type="tel"
                  placeholder="03001234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#181820] border border-[#2b2b36] rounded px-3 py-2 text-xs text-[#f4f2ee] focus:border-[#d4af37] outline-none font-mono"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#cfccc4] mb-1">
                Password *
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#181820] border border-[#2b2b36] rounded px-3 py-2 text-xs text-[#f4f2ee] focus:border-[#d4af37] outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#d4af37] hover:bg-[#be9c2f] text-[#0c0c0e] font-bold text-xs uppercase tracking-wider py-3 rounded mt-2 transition-transform active:scale-95"
            >
              {isRegisterMode ? 'Register Account' : 'Sign In'}
            </button>
          </form>

          <div className="pt-4 border-t border-[#202028] text-center text-xs text-[#8c887f]">
            {isRegisterMode ? (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => setIsRegisterMode(false)}
                  className="text-[#d4af37] hover:underline font-semibold"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                New to Rohan Perfume?{' '}
                <button
                  onClick={() => setIsRegisterMode(true)}
                  className="text-[#d4af37] hover:underline font-semibold"
                >
                  Create an Account
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // LOGGED IN VIEW
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Account Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#111116] border border-[#23232b] rounded-xl p-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#1c1c24] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-cinzel font-bold text-[#fbfaf8]">
              {currentUser.displayName || 'Distinguished Patron'}
            </h1>
            <p className="text-xs text-[#8a877f]">
              {currentUser.email} • {currentUser.phone || 'No phone registered'}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 text-xs text-[#8a877f] hover:text-red-400 py-2 px-3 rounded hover:bg-[#181820] transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#23232c] gap-8 text-xs font-semibold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-[#d4af37] text-[#d4af37]'
              : 'border-transparent text-[#8a877f] hover:text-[#f4f2ee]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({userOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'wishlist'
              ? 'border-[#d4af37] text-[#d4af37]'
              : 'border-transparent text-[#8a877f] hover:text-[#f4f2ee]'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Wishlist ({wishlistProducts.length})</span>
        </button>
      </div>

      {/* Tab: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {userOrders.length === 0 ? (
            <div className="bg-[#121217] border border-[#23232c] rounded-xl p-10 text-center space-y-4">
              <Package className="w-10 h-10 text-[#6e6a62] mx-auto" />
              <h3 className="font-cinzel text-base font-semibold text-[#f4f2ee]">No Orders Yet</h3>
              <p className="text-xs text-[#8c887f] max-w-sm mx-auto">
                You have not placed any Cash on Delivery orders yet. Explore our royal agarwood collection.
              </p>
              <button
                onClick={onExplore}
                className="bg-[#d4af37] text-[#0c0c0e] font-semibold text-xs px-6 py-2.5 rounded uppercase tracking-wider"
              >
                Explore Fragrances
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {userOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-[#121217] border border-[#23232c] rounded-xl p-5 sm:p-6 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-[#1f1f26] gap-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-[#d4af37]">
                        #{ord.orderNumber}
                      </span>
                      <span className="text-xs text-[#817d74] ml-3">
                        {new Date(ord.createdAt).toLocaleDateString('en-PK', { dateStyle: 'medium' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#f4f2ee]">
                        Rs. {ord.totalAmount.toLocaleString()} (COD)
                      </span>
                      <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded bg-[#1c1c24] text-[#d4af37] border border-[#d4af37]/30">
                        {ord.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {ord.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-[#cfccc4]">
                          {item.quantity}x {item.name} ({item.selectedSize})
                        </span>
                        <span className="text-[#8c887f]">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[#1f1f26] flex justify-end gap-3">
                    <button
                      onClick={() => onTrackOrder(ord.orderNumber)}
                      className="text-xs bg-[#191922] hover:bg-[#252532] text-[#d4af37] border border-[#313140] px-4 py-2 rounded flex items-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Track Shipment</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Wishlist */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlistProducts.length === 0 ? (
            <div className="bg-[#121217] border border-[#23232c] rounded-xl p-10 text-center space-y-4">
              <Heart className="w-10 h-10 text-[#6e6a62] mx-auto" />
              <h3 className="font-cinzel text-base font-semibold text-[#f4f2ee]">
                Your Wishlist is Empty
              </h3>
              <p className="text-xs text-[#8c887f] max-w-sm mx-auto">
                Tap the heart icon on any perfume to save it to your private chest.
              </p>
              <button
                onClick={onExplore}
                className="bg-[#d4af37] text-[#0c0c0e] font-semibold text-xs px-6 py-2.5 rounded uppercase tracking-wider"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-[#131319] border border-[#23232b] rounded-xl overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative aspect-square">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => onSelectProduct(p)}
                    />
                    <button
                      onClick={() => toggleWishlist(p.id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#0c0c0e]/80 text-[#d4af37] flex items-center justify-center hover:bg-black"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <h4
                        onClick={() => onSelectProduct(p)}
                        className="font-cinzel text-sm font-semibold text-[#f4f2ee] hover:text-[#d4af37] cursor-pointer"
                      >
                        {p.name}
                      </h4>
                      <p className="text-xs text-[#d4af37] font-bold mt-1">
                        Rs. {(p.salePrice || p.price).toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() => addToCart(p, 1)}
                      className="w-full bg-[#d4af37] hover:bg-[#be9c2f] text-[#0c0c0e] font-semibold text-xs py-2 px-3 rounded flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag (COD)</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
