import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const WhatsAppButton: React.FC = () => {
  const { settings } = useShop();

  const rawNumber = settings.whatsappNumber || '+923001234567';
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
  const message = encodeURIComponent(
    'As-salamu alaykum! I am inquiring about Rohan Perfume fragrances & Cash on Delivery orders.'
  );
  const waUrl = `https://wa.me/${cleanNumber}?text=${message}`;

  return (
    <aside aria-label="WhatsApp Support" className="fixed bottom-6 right-6 z-30">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center gap-3 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105"
        title="Chat with Rohan Perfume on WhatsApp"
        aria-label="Chat with Rohan Perfume on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
        <span className="hidden sm:inline-block font-sans font-semibold text-xs tracking-wider">
          WhatsApp Concierge
        </span>
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400"></span>
        </span>
      </a>
    </aside>
  );
};
