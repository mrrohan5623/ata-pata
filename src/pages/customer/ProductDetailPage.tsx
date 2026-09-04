import React, { useState } from 'react';
import {
  Star,
  ShieldCheck,
  Truck,
  Heart,
  ShoppingBag,
  Zap,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Product, Review } from '../../types';
import { useShop } from '../../context/ShopContext';
import { ReviewService } from '../../services/storageService';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onDirectCheckout: (product: Product, quantity: number, size: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onBack,
  onDirectCheckout
}) => {
  const { addToCart, isInWishlist, toggleWishlist, settings } = useShop();

  const [selectedImage, setSelectedImage] = useState<string>(product.images[0]);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.availableSizes && product.availableSizes.length > 0
      ? product.availableSizes[0]
      : product.size
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'notes' | 'description' | 'reviews'>('notes');

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>(() => ReviewService.getByProduct(product.id));
  const [reviewName, setReviewName] = useState('');
  const [reviewEmail, setReviewEmail] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;

  const discountPercent = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    ReviewService.submit({
      productId: product.id,
      productName: product.name,
      customerName: reviewName,
      customerEmail: reviewEmail,
      rating: reviewRating,
      comment: reviewComment
    });

    setReviewSuccess(true);
    setReviewName('');
    setReviewEmail('');
    setReviewComment('');
    setTimeout(() => setReviewSuccess(false), 6000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs text-[#9d9990] hover:text-[#d4af37] uppercase tracking-wider transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Catalog</span>
      </button>

      {/* Main Product Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#15151c] border border-[#262632]">
            <img
              src={selectedImage}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {discountPercent > 0 && (
                <span className="bg-[#d4af37] text-[#0c0c0e] font-bold text-xs px-2.5 py-1 rounded tracking-wider uppercase">
                  Save {discountPercent}%
                </span>
              )}
              {product.bestSeller && (
                <span className="bg-[#1b1b22] border border-[#d4af37]/50 text-[#d4af37] text-xs font-semibold px-2.5 py-1 rounded uppercase tracking-wider">
                  Best Seller
                </span>
              )}
            </div>

            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-lg ${
                inWishlist
                  ? 'bg-[#d4af37] text-[#0c0c0e]'
                  : 'bg-[#0c0c0e]/80 text-[#f4f2ee] hover:bg-[#d4af37] hover:text-[#0c0c0e]'
              }`}
              aria-label={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart className="w-5 h-5 fill-current" />
            </button>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-24 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImage === img ? 'border-[#d4af37]' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions */}
        <div className="space-y-6">
          <div className="border-b border-[#22222a] pb-6 space-y-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#d4af37]">
              <span>{product.fragranceType}</span>
              <span>•</span>
              <span>{product.gender}</span>
              <span>•</span>
              <span>SKU: {product.sku}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-cinzel font-bold text-[#fbfaf8]">
              {product.name}
            </h1>

            {/* Rating & Reviews Count */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex text-[#d4af37]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(product.rating) ? 'fill-[#d4af37]' : 'text-[#3e3d36]'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-[#f4f2ee]">{product.rating}</span>
              <span className="text-xs text-[#8c887f]">
                ({product.reviewsCount} customer reviews)
              </span>
            </div>

            {/* Pricing in PKR */}
            <div className="pt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-[#d4af37]">
                Rs. {(product.salePrice || product.price).toLocaleString()}
              </span>
              {product.salePrice && (
                <span className="text-lg text-[#6f6c65] line-through">
                  Rs. {product.price.toLocaleString()}
                </span>
              )}
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded">
                Includes All Taxes
              </span>
            </div>
          </div>

          {/* Short Description */}
          <p className="text-sm text-[#beb9ae] leading-relaxed">
            {product.shortDescription || product.description}
          </p>

          {/* Bottle Size Selector */}
          {product.availableSizes && product.availableSizes.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#cfccc4]">
                Select Bottle Volume
              </label>
              <div className="flex flex-wrap gap-2">
                {product.availableSizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`text-xs px-4 py-2.5 rounded border transition-all ${
                      selectedSize === sz
                        ? 'border-[#d4af37] bg-[#d4af37]/15 text-[#d4af37] font-semibold'
                        : 'border-[#2a2a34] bg-[#16161d] text-[#b0aca3] hover:text-[#f4f2ee]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Indicator */}
          <div>
            {isOutOfStock ? (
              <div className="flex items-center gap-2 text-red-400 text-xs font-semibold bg-red-950/30 border border-red-500/30 p-2.5 rounded">
                <AlertCircle className="w-4 h-4" />
                <span>Currently Sold Out. Scent artisans are aging the next batch.</span>
              </div>
            ) : isLowStock ? (
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold bg-amber-950/30 border border-amber-500/30 p-2.5 rounded">
                <AlertCircle className="w-4 h-4" />
                <span>Only {product.stock} bottles remaining in Lahore warehouse.</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>In Stock — Ready for Express Nationwide Dispatch</span>
              </div>
            )}
          </div>

          {/* Actions: Quantity + Add to Cart + Buy with COD */}
          {!isOutOfStock && (
            <div className="space-y-3 pt-2">
              <div className="flex gap-4">
                {/* Quantity */}
                <div className="flex items-center border border-[#2f2f3c] bg-[#131319] rounded px-3 py-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-[#8c887f] hover:text-[#f4f2ee] px-2 font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-semibold text-[#f4f2ee]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="text-[#8c887f] hover:text-[#f4f2ee] px-2 font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={() => addToCart(product, quantity, selectedSize)}
                  className="flex-1 bg-[#202028] hover:bg-[#2c2c38] border border-[#3c3c4a] text-[#f4f2ee] font-semibold text-xs uppercase tracking-wider py-3 px-4 rounded flex items-center justify-center gap-2 transition-colors active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
                  <span>Add To Bag</span>
                </button>
              </div>

              {/* Instant COD Buy Now */}
              <button
                onClick={() => onDirectCheckout(product, quantity, selectedSize)}
                className="w-full bg-[#d4af37] hover:bg-[#be9c2f] text-[#0c0c0e] font-bold text-xs uppercase tracking-[0.2em] py-4 px-6 rounded shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Instant Cash on Delivery Checkout</span>
              </button>
            </div>
          )}

          {/* Pakistani COD & Courier Delivery Info */}
          <div className="bg-[#131319] border border-[#23232c] rounded-lg p-4 space-y-3 text-xs text-[#a09c93]">
            <div className="flex items-start gap-3">
              <Truck className="w-4 h-4 text-[#d4af37] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#f4f2ee] block">Pakistan-Wide Cash On Delivery</strong>
                <span>Karachi, Lahore, Islamabad in 2-3 business days. All other cities 3-5 days via TCS & Leopards.</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-[#d4af37] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#f4f2ee] block">7-Day Transit Protection</strong>
                <span>Inspect your parcel upon arrival. In case of damage, replacement is shipped instantly.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Olfactory Notes Pyramid, Full Story, Customer Reviews */}
      <div className="border-t border-[#23232c] pt-10">
        <div className="flex border-b border-[#23232c] gap-8">
          <button
            onClick={() => setActiveTab('notes')}
            className={`pb-4 text-xs font-semibold uppercase tracking-[0.18em] transition-colors border-b-2 ${
              activeTab === 'notes'
                ? 'border-[#d4af37] text-[#d4af37]'
                : 'border-transparent text-[#8a867e] hover:text-[#f4f2ee]'
            }`}
          >
            Olfactory Pyramid
          </button>
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-4 text-xs font-semibold uppercase tracking-[0.18em] transition-colors border-b-2 ${
              activeTab === 'description'
                ? 'border-[#d4af37] text-[#d4af37]'
                : 'border-transparent text-[#8a867e] hover:text-[#f4f2ee]'
            }`}
          >
            Scent Narrative
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 text-xs font-semibold uppercase tracking-[0.18em] transition-colors border-b-2 ${
              activeTab === 'reviews'
                ? 'border-[#d4af37] text-[#d4af37]'
                : 'border-transparent text-[#8a867e] hover:text-[#f4f2ee]'
            }`}
          >
            Verified Reviews ({reviews.length})
          </button>
        </div>

        {/* Tab 1: Olfactory Pyramid */}
        {activeTab === 'notes' && (
          <div className="py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#131319] border border-[#24242e] rounded-xl p-6 space-y-3">
              <span className="text-[11px] font-semibold text-[#d4af37] uppercase tracking-[0.2em] block">
                01 • Top Notes (First 15 mins)
              </span>
              <h4 className="font-cinzel text-base font-bold text-[#f4f2ee]">Opening Impression</h4>
              <div className="flex flex-wrap gap-2 pt-2">
                {product.fragranceNotes.top.map((n) => (
                  <span
                    key={n}
                    className="bg-[#1b1b24] border border-[#2b2b38] text-[#cfccc4] text-xs px-2.5 py-1 rounded"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-[#131319] border border-[#24242e] rounded-xl p-6 space-y-3">
              <span className="text-[11px] font-semibold text-[#d4af37] uppercase tracking-[0.2em] block">
                02 • Heart Notes (2 to 6 hours)
              </span>
              <h4 className="font-cinzel text-base font-bold text-[#f4f2ee]">The Signature Soul</h4>
              <div className="flex flex-wrap gap-2 pt-2">
                {product.fragranceNotes.middle.map((n) => (
                  <span
                    key={n}
                    className="bg-[#1b1b24] border border-[#2b2b38] text-[#cfccc4] text-xs px-2.5 py-1 rounded"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-[#131319] border border-[#24242e] rounded-xl p-6 space-y-3">
              <span className="text-[11px] font-semibold text-[#d4af37] uppercase tracking-[0.2em] block">
                03 • Base Notes (6 to 14+ hours)
              </span>
              <h4 className="font-cinzel text-base font-bold text-[#f4f2ee]">Enduring Trail</h4>
              <div className="flex flex-wrap gap-2 pt-2">
                {product.fragranceNotes.base.map((n) => (
                  <span
                    key={n}
                    className="bg-[#1b1b24] border border-[#2b2b38] text-[#cfccc4] text-xs px-2.5 py-1 rounded"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Full Narrative */}
        {activeTab === 'description' && (
          <div className="py-8 max-w-3xl space-y-4 text-sm text-[#b8b3a8] leading-relaxed">
            <p>{product.description}</p>
            <div className="pt-4 border-t border-[#202028] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[#716d66] block uppercase">Concentration</span>
                <strong className="text-[#f4f2ee]">{product.fragranceType}</strong>
              </div>
              <div>
                <span className="text-[#716d66] block uppercase">Profile</span>
                <strong className="text-[#f4f2ee]">{product.gender}</strong>
              </div>
              <div>
                <span className="text-[#716d66] block uppercase">Longevity</span>
                <strong className="text-[#f4f2ee]">14+ Hours Skin & Cloth</strong>
              </div>
              <div>
                <span className="text-[#716d66] block uppercase">Origin</span>
                <strong className="text-[#f4f2ee]">Hand-poured in Pakistan</strong>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Reviews */}
        {activeTab === 'reviews' && (
          <div className="py-8 space-y-10">
            {/* Reviews List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#8c887f] bg-[#121217] rounded-xl border border-[#202028] col-span-2">
                  No public reviews for this fragrance yet. Be the first to share your experience!
                </div>
              ) : (
                reviews.map((r) => (
                  <div key={r.id} className="bg-[#131319] border border-[#22222b] p-5 rounded-xl space-y-3">
                    <div className="flex justify-between items-center">
                      <h5 className="font-semibold text-xs text-[#f4f2ee]">{r.customerName}</h5>
                      <span className="text-[11px] text-[#716d66]">{r.date}</span>
                    </div>
                    <div className="flex text-[#d4af37]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < r.rating ? 'fill-[#d4af37]' : 'text-[#3e3d36]'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-[#b8b4ab] leading-relaxed italic">"{r.comment}"</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Review Form */}
            <div className="bg-[#14141c] border border-[#262632] rounded-xl p-6 max-w-xl">
              <h4 className="font-cinzel text-base font-bold text-[#f4f2ee] mb-1">
                Leave an Honest Fragrance Review
              </h4>
              <p className="text-xs text-[#8c887f] mb-4">
                Reviews are moderated by our admin team prior to public display.
              </p>

              {reviewSuccess ? (
                <div className="bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 p-4 rounded text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Thank you! Your review has been submitted for moderation.</span>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[#cfccc4] mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        className="w-full bg-[#0c0c0e] border border-[#2a2a34] rounded px-3 py-2 text-xs text-[#f4f2ee] focus:border-[#d4af37] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#cfccc4] mb-1">Your Email</label>
                      <input
                        type="email"
                        value={reviewEmail}
                        onChange={(e) => setReviewEmail(e.target.value)}
                        className="w-full bg-[#0c0c0e] border border-[#2a2a34] rounded px-3 py-2 text-xs text-[#f4f2ee] focus:border-[#d4af37] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[#cfccc4] mb-1">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className="text-[#d4af37] p-1"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= reviewRating ? 'fill-[#d4af37]' : 'text-[#3e3d36]'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[#cfccc4] mb-1">Your Experience *</label>
                    <textarea
                      required
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Comment on longevity, projection, notes, and delivery..."
                      className="w-full bg-[#0c0c0e] border border-[#2a2a34] rounded px-3 py-2 text-xs text-[#f4f2ee] focus:border-[#d4af37] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-[#d4af37] hover:bg-[#be9c2f] text-[#0c0c0e] font-bold text-xs uppercase tracking-wider py-2.5 px-6 rounded"
                  >
                    Submit Review
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
