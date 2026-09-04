import React, { useState, useMemo, useEffect } from 'react';
import { Filter, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { ProductCard } from '../../components/common/ProductCard';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';

interface ShopPageProps {
  initialCategory?: string;
  onSelectProduct: (product: Product) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ initialCategory, onSelectProduct }) => {
  const { products } = useShop();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [selectedGender, setSelectedGender] = useState<string>('All');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<number>(15000);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const categories = [
    'All',
    "Men's Collection",
    "Women's Collection",
    'Unisex Collection',
    'Best Sellers',
    'New Arrivals',
    'Premium Royale',
    'Gift Sets'
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (!p.published) return false;

      // Category match
      if (selectedCategory !== 'All') {
        const catMatch =
          p.category === selectedCategory ||
          p.collection === selectedCategory ||
          (selectedCategory === 'Best Sellers' && p.bestSeller) ||
          (selectedCategory === 'New Arrivals' && p.newArrival);
        if (!catMatch) return false;
      }

      // Gender match
      if (selectedGender !== 'All' && p.gender !== selectedGender) {
        return false;
      }

      // Stock
      if (inStockOnly && p.stock <= 0) {
        return false;
      }

      // Price
      const activePrice = p.salePrice || p.price;
      if (activePrice > priceRange) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.fragranceType.toLowerCase().includes(q) ||
          [...p.fragranceNotes.top, ...p.fragranceNotes.middle, ...p.fragranceNotes.base].some((n) =>
            n.toLowerCase().includes(q)
          );
        if (!matches) return false;
      }

      return true;
    });
  }, [products, selectedCategory, selectedGender, inStockOnly, priceRange, searchQuery]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price-low') {
      return list.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    }
    if (sortBy === 'price-high') {
      return list.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    }
    if (sortBy === 'rating') {
      return list.sort((a, b) => b.rating - a.rating);
    }
    if (sortBy === 'newest') {
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    if (sortBy === 'best-selling') {
      return list.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
    }
    // Default featured
    return list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }, [filteredProducts, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedGender('All');
    setInStockOnly(false);
    setPriceRange(15000);
    setSortBy('featured');
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="border-b border-[#22222a] pb-8 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
            Haute Parfumerie Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl font-cinzel font-bold text-[#fbfaf8] mt-1">
            {selectedCategory === 'All' ? 'All Fragrances' : selectedCategory}
          </h1>
          <p className="text-xs sm:text-sm text-[#959188] mt-1">
            Displaying {sortedProducts.length} artisanal perfume{sortedProducts.length !== 1 ? 's' : ''} formulated for longevity.
          </p>
        </div>

        {/* Mobile Filter Trigger */}
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="lg:hidden flex items-center justify-center gap-2 bg-[#171720] border border-[#2b2b36] py-2.5 px-4 rounded text-xs font-semibold text-[#f4f2ee]"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#d4af37]" />
          <span>Filters & Sort</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block space-y-6 bg-[#111116] p-6 rounded-xl border border-[#23232b] h-fit">
          <div className="flex items-center justify-between pb-4 border-b border-[#21212a]">
            <div className="flex items-center gap-2 text-sm font-cinzel font-bold text-[#f4f2ee]">
              <Filter className="w-4 h-4 text-[#d4af37]" />
              <span>Refine Scent</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-[11px] text-[#8e8a81] hover:text-[#d4af37] flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Search Bar */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#cfccc4] mb-2">
              Keyword
            </label>
            <input
              type="text"
              placeholder="Search oud, saffron, rose..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#181820] border border-[#2a2a34] rounded px-3 py-2 text-xs text-[#f4f2ee] focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          {/* Category List */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#cfccc4] mb-2">
              Collection
            </label>
            <div className="space-y-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left text-xs py-1.5 px-2 rounded transition-colors flex items-center justify-between ${
                    selectedCategory === cat
                      ? 'bg-[#d4af37]/15 text-[#d4af37] font-semibold'
                      : 'text-[#9f9b91] hover:text-[#f4f2ee] hover:bg-[#181820]'
                  }`}
                >
                  <span>{cat}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Gender */}
          <div className="pt-4 border-t border-[#21212a]">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#cfccc4] mb-2">
              Gender Profile
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['All', 'Men', 'Women', 'Unisex'].map((gen) => (
                <button
                  key={gen}
                  onClick={() => setSelectedGender(gen)}
                  className={`text-xs py-1.5 px-2 rounded border text-center transition-colors ${
                    selectedGender === gen
                      ? 'bg-[#d4af37] text-[#0c0c0e] font-semibold border-[#d4af37]'
                      : 'bg-[#181820] text-[#9f9b91] border-[#292934] hover:text-[#f4f2ee]'
                  }`}
                >
                  {gen}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="pt-4 border-t border-[#21212a]">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#cfccc4]">
                Max Price
              </label>
              <span className="text-xs font-bold text-[#d4af37]">
                Rs. {priceRange.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="5000"
              max="15000"
              step="500"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-[#d4af37] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#6b6861] mt-1">
              <span>Rs. 5,000</span>
              <span>Rs. 15,000</span>
            </div>
          </div>

          {/* Stock Toggle */}
          <div className="pt-4 border-t border-[#21212a] flex items-center justify-between">
            <span className="text-xs text-[#cfccc4]">In-Stock Only</span>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-4 h-4 accent-[#d4af37] rounded cursor-pointer"
            />
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3 space-y-6">
          {/* Sorting Bar */}
          <div className="flex items-center justify-between bg-[#121217] p-3 rounded-lg border border-[#212128] text-xs">
            <span className="text-[#8c887f]">
              Showing <strong className="text-[#f4f2ee]">{sortedProducts.length}</strong> creations
            </span>

            <div className="flex items-center gap-2">
              <span className="text-[#8c887f]">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#181820] border border-[#2c2c36] text-[#f4f2ee] rounded px-3 py-1.5 focus:outline-none focus:border-[#d4af37]"
              >
                <option value="featured">Featured First</option>
                <option value="best-selling">Best Sellers</option>
                <option value="newest">Newest Formulations</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {sortedProducts.length === 0 ? (
            <div className="bg-[#121217] border border-[#22222a] rounded-xl p-12 text-center space-y-4">
              <p className="font-cinzel text-lg text-[#f4f2ee]">No Fragrances Found</p>
              <p className="text-xs text-[#8c887f] max-w-sm mx-auto">
                No perfumes match your current filter preferences. Try adjusting price range or clearing keyword search.
              </p>
              <button
                onClick={resetFilters}
                className="bg-[#d4af37] text-[#0c0c0e] font-semibold text-xs px-6 py-2.5 rounded uppercase tracking-wider"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={onSelectProduct}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-[#111116] p-6 text-[#f4f2ee] overflow-y-auto space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-[#23232b]">
              <span className="font-cinzel text-base font-bold">Filters & Sort</span>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="text-xs text-[#d4af37] font-semibold"
              >
                Close
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#cfccc4] mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-[#181820] border border-[#2c2c36] text-[#f4f2ee] rounded px-3 py-2 text-xs"
              >
                <option value="featured">Featured</option>
                <option value="best-selling">Best Sellers</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#cfccc4] mb-2">
                Collection
              </label>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left text-xs py-2 px-3 rounded ${
                      selectedCategory === cat
                        ? 'bg-[#d4af37] text-[#0c0c0e] font-semibold'
                        : 'text-[#a29e95]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full bg-[#d4af37] text-[#0c0c0e] font-bold text-xs uppercase tracking-wider py-3 rounded mt-6"
            >
              Apply ({sortedProducts.length} Results)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
