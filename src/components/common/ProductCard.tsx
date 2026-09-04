import React from 'react';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  const { addToCart, isInWishlist, toggleWishlist } = useShop();
  const inWishlist = isInWishlist(product.id);

  const discountPercent = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;

  return (
    <div className="group relative bg-[#121216] rounded-lg border border-[#232328] hover:border-[#d4af37]/50 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image & Badges Container */}
      <div
        className="relative w-full aspect-[4/5] bg-[#18181f] overflow-hidden cursor-pointer"
        onClick={() => onSelectProduct(product)}
      >
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80'}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Status Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="bg-[#d4af37] text-[#0c0c0e] text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
              Save {discountPercent}%
            </span>
          )}
          {product.bestSeller && (
            <span className="bg-[#1f1f26] border border-[#d4af37]/40 text-[#d4af37] text-[10px] font-semibold px-2 py-0.5 rounded tracking-wider uppercase">
              Best Seller
            </span>
          )}
          {product.newArrival && (
            <span className="bg-[#101015] border border-white/20 text-[#f4f2ee] text-[10px] font-semibold px-2 py-0.5 rounded tracking-wider uppercase">
              New Arrival
            </span>
          )}
          {isOutOfStock ? (
            <span className="bg-red-950/80 border border-red-500/40 text-red-300 text-[10px] font-semibold px-2 py-0.5 rounded tracking-wider uppercase">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-950/80 border border-amber-500/40 text-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded tracking-wider uppercase">
              Only {product.stock} Left
            </span>
          ) : null}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-10 ${
            inWishlist
              ? 'bg-[#d4af37] text-[#0c0c0e]'
              : 'bg-[#0c0c0e]/70 text-[#f4f2ee] hover:bg-[#d4af37] hover:text-[#0c0c0e]'
          }`}
          title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className="w-4 h-4 fill-current" />
        </button>

        {/* Quick Add Overlay on desktop hover */}
        {!isOutOfStock && (
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#0c0c0e]/90 via-[#0c0c0e]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1);
              }}
              className="w-full bg-[#d4af37] hover:bg-[#bfa033] text-[#0c0c0e] font-semibold text-xs py-2 px-3 rounded flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              Quick Add (COD)
            </button>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-[#9a978f] uppercase tracking-wider mb-1">
            <span>{product.fragranceType}</span>
            <span>{product.gender}</span>
          </div>

          <h3
            onClick={() => onSelectProduct(product)}
            className="font-cinzel text-sm sm:text-base font-semibold text-[#f4f2ee] hover:text-[#d4af37] transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          <p className="text-xs text-[#8c887f] line-clamp-2 mt-1 leading-relaxed">
            {product.shortDescription || product.description}
          </p>
        </div>

        <div className="pt-3 mt-3 border-t border-[#202026] flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm sm:text-base font-bold text-[#d4af37]">
                Rs. {(product.salePrice || product.price).toLocaleString()}
              </span>
              {product.salePrice && (
                <span className="text-xs text-[#716e67] line-through">
                  Rs. {product.price.toLocaleString()}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <Star className="w-3 h-3 text-[#d4af37] fill-[#d4af37]" />
              <span className="text-[11px] font-semibold text-[#cfccc4]">{product.rating}</span>
              <span className="text-[10px] text-[#716e67]">({product.reviewsCount})</span>
            </div>
          </div>

          <button
            onClick={() => onSelectProduct(product)}
            className="text-xs text-[#c5c1b8] hover:text-[#d4af37] font-medium tracking-wider uppercase underline underline-offset-4"
          >
            Explore
          </button>
        </div>
      </div>
    </div>
  );
};
