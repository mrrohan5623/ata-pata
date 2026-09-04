import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Truck, Star, Award, Clock } from 'lucide-react';
import { ProductCard } from '../../components/common/ProductCard';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';

interface HomePageProps {
  onSelectProduct: (product: Product) => void;
  onNavigate: (page: string, param?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectProduct, onNavigate }) => {
  const { products } = useShop();

  const featured = products.filter((p) => p.featured && p.published).slice(0, 4);
  const bestSellers = products.filter((p) => p.bestSeller && p.published).slice(0, 4);
  const newArrivals = products.filter((p) => p.newArrival && p.published).slice(0, 4);

  return (
    <div className="space-y-24 pb-12">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#14141b] via-[#0c0c0e] to-[#0c0c0e] px-4 sm:px-6 lg:px-8 border-b border-[#202028]">
        {/* Background glow & subtle ambient textures */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#d4af37]/15 blur-[120px] rounded-full" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center space-y-8 z-10 py-16">
          {/* Subtle Tagline */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c1c24] border border-[#d4af37]/30 text-[#d4af37] text-xs font-semibold tracking-[0.2em] uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Extrait de Parfum • Aged in Small Batches</span>
          </div>

          {/* Majestic Heading */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-cinzel font-bold tracking-[0.08em] text-[#fbfaf8] leading-tight">
              SCENTS OF <span className="gold-gradient-text">REGAL MAJESTY</span>
            </h1>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#a39f96] font-sans font-light leading-relaxed">
              Crafted in Pakistan with precious Cambodian agarwood, Kashmiri royal saffron, and Taif rose.
              Unrivaled 14+ hour longevity engineered for the discerning Pakistani connoisseur.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('shop')}
              className="w-full sm:w-auto bg-[#d4af37] hover:bg-[#be9c2f] text-[#0c0c0e] font-bold text-xs uppercase tracking-[0.2em] px-8 py-4 rounded shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <span>Explore Fragrances</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('shop', 'Best Sellers')}
              className="w-full sm:w-auto bg-[#181820] hover:bg-[#22222c] border border-[#343440] text-[#f4f2ee] font-medium text-xs uppercase tracking-[0.2em] px-8 py-4 rounded transition-colors"
            >
              Shop Best Sellers
            </button>
          </div>

          {/* COD Trust Anchor */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#8c887f]">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#d4af37]" />
              <span>Cash on Delivery across Pakistan</span>
            </div>
            <span className="hidden sm:inline text-[#3a3a46]">•</span>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#d4af37]" />
              <span>2-3 Days Fast Delivery (TCS / Leopards)</span>
            </div>
            <span className="hidden sm:inline text-[#3a3a46]">•</span>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
              <span>100% Original Concentration Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CURATED COLLECTIONS TILES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
            Olfactory Realms
          </span>
          <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-[#f4f2ee] mt-1">
            Curated Collections
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Men's */}
          <div
            onClick={() => onNavigate('shop', "Men's Collection")}
            className="group relative h-96 rounded-xl overflow-hidden cursor-pointer border border-[#23232a]"
          >
            <img
              src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80"
              alt="Men's Fragrances"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6">
              <span className="text-[11px] font-semibold text-[#d4af37] uppercase tracking-[0.2em]">
                Bold & Commanding
              </span>
              <h3 className="font-cinzel text-xl font-bold text-white mt-1">Men’s Aristocracy</h3>
              <p className="text-xs text-[#a9a59b] mt-1 line-clamp-2">
                Smoky Cambodian agarwood, Russian leather, spiced cardamom, and mountain pine.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-[#d4af37] font-semibold uppercase tracking-wider">
                <span>View Men's Scents</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Women's */}
          <div
            onClick={() => onNavigate('shop', "Women's Collection")}
            className="group relative h-96 rounded-xl overflow-hidden cursor-pointer border border-[#23232a]"
          >
            <img
              src="https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=900&q=80"
              alt="Women's Fragrances"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6">
              <span className="text-[11px] font-semibold text-[#d4af37] uppercase tracking-[0.2em]">
                Floral & Sensual
              </span>
              <h3 className="font-cinzel text-xl font-bold text-white mt-1">Women’s Velvet Flora</h3>
              <p className="text-xs text-[#a9a59b] mt-1 line-clamp-2">
                Mughal damascena rose water, Kashmiri jasmine petals, sweet pear nectar, and cashmere musk.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-[#d4af37] font-semibold uppercase tracking-wider">
                <span>View Women's Scents</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Unisex */}
          <div
            onClick={() => onNavigate('shop', 'Unisex Collection')}
            className="group relative h-96 rounded-xl overflow-hidden cursor-pointer border border-[#23232a]"
          >
            <img
              src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=80"
              alt="Unisex Fragrances"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6">
              <span className="text-[11px] font-semibold text-[#d4af37] uppercase tracking-[0.2em]">
                Versatile & Transcendental
              </span>
              <h3 className="font-cinzel text-xl font-bold text-white mt-1">Unisex Royale</h3>
              <p className="text-xs text-[#a9a59b] mt-1 line-clamp-2">
                Warm Baltic golden amber, creamy Mysore sandalwood, and ethereal white musk.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-[#d4af37] font-semibold uppercase tracking-wider">
                <span>View Unisex Scents</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PERFUMES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
              Masterpiece Creations
            </span>
            <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-[#f4f2ee] mt-1">
              Featured Signatures
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs text-[#d4af37] hover:text-[#f4f2ee] font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <span>View All Signatures</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 4. PROMOTIONAL HERO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden border border-[#2b2b36] bg-gradient-to-r from-[#171720] via-[#1a1a24] to-[#121217] p-8 sm:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="inline-block bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] text-[11px] font-bold px-3 py-1 rounded tracking-widest uppercase">
              Pakistani Gift Season Special
            </span>
            <h3 className="text-2xl sm:text-4xl font-cinzel font-bold text-[#fbfaf8] leading-snug">
              Royal Heritage Discovery Set
            </h3>
            <p className="text-xs sm:text-sm text-[#b2aea4] leading-relaxed">
              Experience five distinguished 10ml travel extraits in an embossed midnight-black velvet coffret.
              Includes Sultanul Oud, Koh-i-Noor Amber, Noor-e-Jahan, Imperial Sandalwood, and Night in Margalla.
            </p>
            <div className="pt-2 flex items-baseline gap-3">
              <span className="text-2xl font-bold text-[#d4af37]">Rs. 5,200</span>
              <span className="text-sm text-[#6c6962] line-through">Rs. 6,500</span>
              <span className="text-xs text-emerald-400 font-semibold">(Free Delivery Across Pakistan)</span>
            </div>
            <div className="pt-4">
              <button
                onClick={() => onNavigate('shop', 'Gift Sets')}
                className="bg-[#d4af37] hover:bg-[#be9c2f] text-[#0c0c0e] font-bold text-xs uppercase tracking-[0.2em] px-8 py-3.5 rounded transition-transform active:scale-95"
              >
                Order Coffret (COD)
              </button>
            </div>
          </div>

          <div className="relative w-full md:w-80 aspect-square rounded-xl overflow-hidden shadow-2xl border border-[#32323e]">
            <img
              src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=80"
              alt="Royal Heritage Set"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 5. BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
              Most Adored Across Pakistan
            </span>
            <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-[#f4f2ee] mt-1">
              Best Sellers
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop', 'Best Sellers')}
            className="text-xs text-[#d4af37] hover:text-[#f4f2ee] font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <span>View All Best Sellers</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 6. WHY CHOOSE ROHAN PERFUME */}
      <section className="bg-[#111116] border-y border-[#212128] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
              The Rohan Distinction
            </span>
            <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-[#f4f2ee] mt-1">
              Why Discerning Pakistanis Choose Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#16161d] p-8 rounded-xl border border-[#262630] space-y-4 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#20202a] border border-[#d4af37]/30 flex items-center justify-center">
                <Award className="w-7 h-7 text-[#d4af37]" />
              </div>
              <h3 className="font-cinzel text-lg font-bold text-[#f4f2ee]">
                30%+ Extrait Concentrations
              </h3>
              <p className="text-xs text-[#9c988f] leading-relaxed">
                We formulate with heavy concentrations of authentic French perfume oils and aged
                Cambodian agarwood. No diluted synthetics or fleeting head notes.
              </p>
            </div>

            <div className="bg-[#16161d] p-8 rounded-xl border border-[#262630] space-y-4 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#20202a] border border-[#d4af37]/30 flex items-center justify-center">
                <Clock className="w-7 h-7 text-[#d4af37]" />
              </div>
              <h3 className="font-cinzel text-lg font-bold text-[#f4f2ee]">
                14+ Hours Longevity & Sillage
              </h3>
              <p className="text-xs text-[#9c988f] leading-relaxed">
                Engineered specifically for Pakistan’s climate. Endures high humidity, summer heat,
                and evening winter celebrations without losing its luxurious trail.
              </p>
            </div>

            <div className="bg-[#16161d] p-8 rounded-xl border border-[#262630] space-y-4 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#20202a] border border-[#d4af37]/30 flex items-center justify-center">
                <Truck className="w-7 h-7 text-[#d4af37]" />
              </div>
              <h3 className="font-cinzel text-lg font-bold text-[#f4f2ee]">
                COD to 250+ Pakistani Cities
              </h3>
              <p className="text-xs text-[#9c988f] leading-relaxed">
                Inspect the parcel and pay upon arrival at your doorstep via TCS, Leopards, or Trax.
                No pre-payment required; complete peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
            Verified Experiences
          </span>
          <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-[#f4f2ee] mt-1">
            Praised by Scent Enthusiasts
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#14141a] p-6 rounded-xl border border-[#22222a] flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex text-[#d4af37]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#cfccc4] italic leading-relaxed">
                "Sultanul Oud Royale is simply magnificent. I’ve owned niche perfumes worth 80k PKR,
                and this projection easily matches them. Delivered via TCS to DHA Lahore in 2 days."
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-[#202028] flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-xs text-[#f4f2ee]">Hamza Tariq</h4>
                <span className="text-[11px] text-[#86837b]">Lahore • Verified COD Buyer</span>
              </div>
              <span className="text-[10px] text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded border border-[#d4af37]/20">
                Sultanul Oud
              </span>
            </div>
          </div>

          <div className="bg-[#14141a] p-6 rounded-xl border border-[#22222a] flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex text-[#d4af37]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#cfccc4] italic leading-relaxed">
                "Koh-i-Noor Amber is intoxicating! The tonka and vanilla amber dry down stayed on my shawl
                for three days straight. Even the packaging screams sheer luxury."
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-[#202028] flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-xs text-[#f4f2ee]">Zainab Abbasi</h4>
                <span className="text-[11px] text-[#86837b]">Islamabad • Verified Buyer</span>
              </div>
              <span className="text-[10px] text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded border border-[#d4af37]/20">
                Koh-i-Noor Amber
              </span>
            </div>
          </div>

          <div className="bg-[#14141a] p-6 rounded-xl border border-[#22222a] flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex text-[#d4af37]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#cfccc4] italic leading-relaxed">
                "Ordered the Royal Heritage Discovery Box for my brother's wedding gift. The velvet box
                presentation and bottle craftsmanship blew us away. Ordering full bottles now!"
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-[#202028] flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-xs text-[#f4f2ee]">Shahmeer Baloch</h4>
                <span className="text-[11px] text-[#86837b]">Karachi • Verified COD Buyer</span>
              </div>
              <span className="text-[10px] text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded border border-[#d4af37]/20">
                Discovery Set
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. NEW ARRIVALS */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
                Fresh From The Atelier
              </span>
              <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-[#f4f2ee] mt-1">
                New Arrivals
              </h2>
            </div>
            <button
              onClick={() => onNavigate('shop', 'New Arrivals')}
              className="text-xs text-[#d4af37] hover:text-[#f4f2ee] font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <span>Explore New Arrivals</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
