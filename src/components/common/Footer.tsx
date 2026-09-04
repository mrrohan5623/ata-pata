import React from 'react';
import { Truck, ShieldCheck, RefreshCw, MessageSquare, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

interface FooterProps {
  onNavigate: (page: string, param?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings } = useShop();

  return (
    <footer className="bg-[#09090b] border-t border-[#202025] text-[#a19d94] mt-24">
      {/* Pakistani COD & Trust Highlights */}
      <div className="border-b border-[#202025] py-10 bg-[#0e0e12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#18181f] border border-[#d4af37]/30 flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6 text-[#d4af37]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#f4f2ee] text-sm uppercase tracking-wider font-cinzel">
                  Nationwide COD
                </h4>
                <p className="text-xs text-[#8e8a82] mt-0.5">
                  Cash on Delivery to 250+ cities across Pakistan.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#18181f] border border-[#d4af37]/30 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-[#d4af37]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#f4f2ee] text-sm uppercase tracking-wider font-cinzel">
                  100% Haute Parfumerie
                </h4>
                <p className="text-xs text-[#8e8a82] mt-0.5">
                  Artisanal aging with authentic French & Arab oils.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#18181f] border border-[#d4af37]/30 flex items-center justify-center flex-shrink-0">
                <RefreshCw className="w-6 h-6 text-[#d4af37]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#f4f2ee] text-sm uppercase tracking-wider font-cinzel">
                  7-Day Safe Exchange
                </h4>
                <p className="text-xs text-[#8e8a82] mt-0.5">
                  Hassle-free replacement policy if damaged in transit.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#18181f] border border-[#d4af37]/30 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-6 h-6 text-[#d4af37]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#f4f2ee] text-sm uppercase tracking-wider font-cinzel">
                  Live WhatsApp Concierge
                </h4>
                <p className="text-xs text-[#8e8a82] mt-0.5">
                  Instant guidance from our scent specialists.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <span className="block text-2xl font-cinzel font-bold tracking-[0.2em] text-[#fbfaf8]">
              ROHAN PERFUME
            </span>
            <p className="text-xs text-[#8e8a82] leading-relaxed max-w-sm">
              Pakistan’s prestigious luxury fragrance house. Blending ancient Cambodian agarwood,
              regal Kashmiri saffron, and French blossoms into enduring Extrait de Parfum creations.
            </p>
            <div className="pt-2 text-xs space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#d4af37]" />
                <span>{settings.phoneNumber || '+92 300 1234567'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#d4af37]" />
                <span>{settings.contactEmail || 'support@rohanperfume.com'}</span>
              </div>
            </div>
          </div>

          {/* Scent Collections */}
          <div>
            <h4 className="font-cinzel text-xs font-semibold uppercase tracking-[0.2em] text-[#f4f2ee] mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('shop', "Men's Collection")}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Men’s Collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', "Women's Collection")}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Women’s Collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'Unisex Collection')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Unisex Royale
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'Best Sellers')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Best Sellers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'Gift Sets')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Discovery Gift Sets
                </button>
              </li>
            </ul>
          </div>

          {/* Client Services */}
          <div>
            <h4 className="font-cinzel text-xs font-semibold uppercase tracking-[0.2em] text-[#f4f2ee] mb-4">
              Client Services
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('track-order')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Track Shipment (COD)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('policy-delivery')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Shipping & Delivery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('policy-returns')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Returns & Replacements
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('faq')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Fragrance FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Contact Concierge
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Administration */}
          <div>
            <h4 className="font-cinzel text-xs font-semibold uppercase tracking-[0.2em] text-[#f4f2ee] mb-4">
              Governance
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('policy-privacy')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('policy-terms')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin-login')}
                  className="text-[#d4af37] hover:underline transition-colors font-semibold"
                >
                  Admin Management Login
                </button>
              </li>
            </ul>

            <div className="mt-6 flex items-center space-x-3 text-[#c5c1b8]">
              <a
                href={settings.socialLinks?.instagram || 'https://instagram.com'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#18181f] flex items-center justify-center hover:text-[#d4af37] border border-[#2b2b35] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={settings.socialLinks?.facebook || 'https://facebook.com'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#18181f] flex items-center justify-center hover:text-[#d4af37] border border-[#2b2b35] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#1b1b22] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#716e67]">
          <p>© {new Date().getFullYear()} Rohan Perfume. All rights reserved across the Islamic Republic of Pakistan.</p>
          <p className="flex items-center gap-2">
            <span>Primary Delivery Partners:</span>
            <span className="text-[#d2cec5] font-semibold">TCS Express • Leopards • Call Courier</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
