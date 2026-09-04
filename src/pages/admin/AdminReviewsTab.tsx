import React, { useState } from 'react';
import { Star, Check, Trash2, CheckCircle2, MessageSquare } from 'lucide-react';
import { Review } from '../../types';
import { ReviewService } from '../../services/storageService';

export const AdminReviewsTab: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(() => ReviewService.getAll());
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [feedback, setFeedback] = useState<string | null>(null);

  const refreshReviews = () => {
    setReviews(ReviewService.getAll());
  };

  const handleApprove = (id: string) => {
    ReviewService.approve(id);
    refreshReviews();
    setFeedback('Review approved and published to product page.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this customer review?')) {
      ReviewService.delete(id);
      refreshReviews();
      setFeedback('Review removed.');
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const filtered = reviews.filter((r) => {
    if (filter === 'pending') return !r.approved;
    if (filter === 'approved') return r.approved;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#131319] p-4 rounded-xl border border-[#23232c]">
        <div>
          <h3 className="font-cinzel text-base font-bold text-[#fbfaf8]">
            Customer Review Moderation
          </h3>
          <p className="text-xs text-[#8e8a82]">
            Approve genuine Pakistani buyer testimonials before they display on live fragrance pages.
          </p>
        </div>

        <div className="flex gap-2">
          {(['all', 'pending', 'approved'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`text-xs px-3 py-1.5 rounded-lg border capitalize transition-colors ${
                filter === tab
                  ? 'bg-[#d4af37] text-[#0c0c0e] font-semibold border-[#d4af37]'
                  : 'bg-[#181822] text-[#9b978e] border-[#292934] hover:text-[#f4f2ee]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-[#131319] border border-[#23232c] rounded-xl p-10 text-center text-xs text-[#8c887f]">
            No reviews match this filter.
          </div>
        ) : (
          filtered.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#131319] border border-[#23232c] rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-sm text-[#f4f2ee]">
                    {rev.customerName}
                  </span>
                  <span className="text-[11px] text-[#78756d]">
                    on <strong className="text-[#cfccc4]">{rev.productName}</strong>
                  </span>
                  <span className="text-[11px] text-[#78756d] font-mono">{rev.date}</span>
                  <span
                    className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${
                      rev.approved
                        ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-950/40 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {rev.approved ? 'Approved' : 'Pending Moderation'}
                  </span>
                </div>

                <div className="flex text-[#d4af37]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? 'fill-[#d4af37]' : 'text-[#35353d]'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-[#cfccc4] italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {!rev.approved && (
                  <button
                    onClick={() => handleApprove(rev.id)}
                    className="bg-[#d4af37] hover:bg-[#be9c2f] text-[#0c0c0e] font-semibold text-xs px-3 py-1.5 rounded flex items-center gap-1.5 shadow"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                )}
                <button
                  onClick={() => handleDelete(rev.id)}
                  className="bg-[#21212a] hover:bg-red-950 text-[#8e8a81] hover:text-red-400 text-xs p-1.5 rounded transition-colors"
                  title="Delete Review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
