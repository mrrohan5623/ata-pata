import React, { useState } from 'react';
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  User,
  ShieldCheck,
  Truck,
  Sparkles
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onNavigate: (page: string, param?: string) => void;
  currentPage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const { cartCount, wishlist, setIsCartOpen, setIsSearchOpen, settings } = useShop();
  const { currentUser, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', page: 'home' },
    { label: 'All Fragrances', page: 'shop' },
    { label: "Men's", page: 'shop', param: "Men's Collection" },
    { label: "Women's", page: 'shop', param: "Women's Collection" },
    { label: 'Unisex', page: 'shop', param: 'Unisex Collection' },
    { label: 'Best Sellers', page: 'shop', param: 'Best Sellers' },
    { label: 'Track Order', page: 'track-order' }
  ];

  const handleLinkClick = (page: string, param?: string) => {
    onNavigate(page, param);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#0c0c0e]/95 border-b border-[#232328]">
      {/* Top Luxury Announcement Bar */}
      <div className="bg-[#121216] border-b border-[#232328] text-xs py-2 px-4 text-center text-[#c5c1b8] flex items-center justify-center gap-2 tracking-wider">
        <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
        <span>{settings.announcementText || 'FREE EXPRESS DELIVERY ON ORDERS OVER RS. 6,000 | CASH ON DELIVERY ACROSS PAKISTAN'}</span>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#a8a59f] hover:text-[#d4af37] focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex-shrink-0 cursor-pointer text-center" onClick={() => handleLinkClick('home')}>
            <span className="block text-2xl sm:text-3xl font-cinzel font-bold tracking-[0.18em] text-[#fbfaf8]">
              ROHAN
            </span>
            <span className="block text-[9px] tracking-[0.4em] uppercase text-[#d4af37] -mt-1 font-sans font-semibold">
              HAUTE PARFUMERIE • PAKISTAN
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((item) => (
              <button
                key={item.label}
                onClick={() => handleLinkClick(item.page, item.param)}
                className={`text-xs uppercase tracking-[0.15em] transition-colors duration-200 py-1 border-b-2 ${
                  currentPage === item.page
                    ? 'text-[#d4af37] border-[#d4af37] font-semibold'
                    : 'text-[#bbb7ad] border-transparent hover:text-[#f4f2ee]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-4 sm:space-x-5">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-[#c5c1b8] hover:text-[#d4af37] transition-colors"
              title="Search Fragrances"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => handleLinkClick('account', 'wishlist')}
              className="relative p-2 text-[#c5c1b8] hover:text-[#d4af37] transition-colors"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-[#d4af37] text-[#0c0c0e] font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Account / Admin Portal */}
            <button
              onClick={() => {
                if (isAdmin) {
                  handleLinkClick('admin-dashboard');
                } else if (currentUser) {
                  handleLinkClick('account');
                } else {
                  handleLinkClick('login');
                }
              }}
              className="p-2 text-[#c5c1b8] hover:text-[#d4af37] transition-colors flex items-center gap-1.5"
              title={isAdmin ? 'Admin Console' : currentUser ? 'My Account' : 'Sign In'}
              aria-label="Account"
            >
              {isAdmin ? (
                <ShieldCheck className="w-5 h-5 text-[#d4af37]" />
              ) : (
                <User className="w-5 h-5" />
              )}
              {isAdmin && (
                <span className="hidden sm:inline-block text-[11px] font-bold uppercase tracking-wider text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded border border-[#d4af37]/30">
                  Admin
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-[#1a1a20] hover:bg-[#25252c] border border-[#303038] text-[#f4f2ee] rounded-md transition-all duration-200 flex items-center gap-2 group"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#d4af37] group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold tracking-wider font-cinzel">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#101014] border-b border-[#232328] px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-1 gap-2 pt-2">
            {navLinks.map((item) => (
              <button
                key={item.label}
                onClick={() => handleLinkClick(item.page, item.param)}
                className="text-left px-3 py-2.5 text-sm uppercase tracking-wider text-[#d2cec5] hover:bg-[#1a1a20] hover:text-[#d4af37] rounded"
              >
                {item.label}
              </button>
            ))}

            <div className="pt-2 border-t border-[#232328] flex flex-col gap-2">
              <button
                onClick={() => handleLinkClick('track-order')}
                className="flex items-center gap-2 text-left px-3 py-2 text-sm text-[#bbb7ad] hover:text-[#d4af37]"
              >
                <Truck className="w-4 h-4 text-[#d4af37]" />
                Track COD Shipment
              </button>

              {isAdmin ? (
                <button
                  onClick={() => handleLinkClick('admin-dashboard')}
                  className="flex items-center gap-2 text-left px-3 py-2 text-sm font-semibold text-[#d4af37] bg-[#d4af37]/10 rounded border border-[#d4af37]/30"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Access Store Admin Dashboard
                </button>
              ) : (
                <button
                  onClick={() => handleLinkClick(currentUser ? 'account' : 'login')}
                  className="flex items-center gap-2 text-left px-3 py-2 text-sm text-[#bbb7ad] hover:text-[#d4af37]"
                >
                  <User className="w-4 h-4" />
                  {currentUser ? 'My Account Profile' : 'Sign In / Register'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
