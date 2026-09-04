import React, { useState, useMemo } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Product } from '../../types';

interface SearchModalProps {
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ onSelectProduct }) => {
  const { isSearchOpen, setIsSearchOpen, products } = useShop();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return products.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchNotes = [
        ...p.fragranceNotes.top,
        ...p.fragranceNotes.middle,
        ...p.fragranceNotes.base
      ].some((note) => note.toLowerCase().includes(q));
      return matchName || matchSku || matchCat || matchDesc || matchNotes;
    });
  }, [query, products]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="relative max-w-2xl mx-auto bg-[#131318] border border-[#2d2d38] rounded-xl shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-[#252530] bg-[#171720]">
          <Search className="w-5 h-5 text-[#d4af37] mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by perfume name, note (Oud, Saffron, Amber), SKU..."
            className="w-full bg-transparent py-4 text-sm text-[#f4f2ee] placeholder-[#817d74] focus:outline-none"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 text-[#8c887e] hover:text-[#f4f2ee] rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto p-4">
          {!query.trim() ? (
            <div className="py-8 text-center text-xs text-[#8c887f]">
              <p className="font-cinzel text-sm text-[#d4af37] mb-1">Explore Scent Profiles</p>
              <div className="flex flex-wrap justify-center gap-2 mt-3 max-w-md mx-auto">
                {['Oud', 'Saffron', 'Amber', 'Taif Rose', 'Jasmine', 'Mysore Sandalwood', 'Extrait'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="bg-[#1c1c24] hover:bg-[#282834] text-[#cfccc4] px-2.5 py-1 rounded border border-[#2b2b36] text-[11px]"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#8c887f]">
              No fragrances matched "{query}". Try searching for Oud, Rose, or Sandalwood.
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-[11px] text-[#8c887f] uppercase tracking-wider mb-2">
                Found {filtered.length} fragrance{filtered.length > 1 ? 's' : ''}
              </p>
              {filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setIsSearchOpen(false);
                    onSelectProduct(item);
                  }}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#1a1a24] cursor-pointer transition-colors group border border-transparent hover:border-[#d4af37]/30"
                >
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-14 object-cover rounded bg-[#1c1c22]"
                  />
                  <div className="flex-1">
                    <h4 className="font-cinzel text-sm font-semibold text-[#f4f2ee] group-hover:text-[#d4af37] transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-xs text-[#8e8a82]">
                      {item.fragranceType} • {item.gender} • SKU: {item.sku}
                    </p>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <span className="text-xs font-bold text-[#d4af37]">
                      Rs. {(item.salePrice || item.price).toLocaleString()}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#7d7971] group-hover:text-[#d4af37] group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
