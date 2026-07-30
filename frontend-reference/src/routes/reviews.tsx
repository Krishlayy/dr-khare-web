import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Link } from '@tanstack/react-router';
export const Route = createFileRoute('/reviews')({
  component: ReviewsRoute,
});

function ReviewsRoute() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('recent'); // 'recent', 'featured', 'anonymous'

  const { data: analytics } = useQuery({
    queryKey: ['reviews-analytics'],
    queryFn: async () => {
      const res = await api.get('/reviews/analytics');
      return res.data;
    },
  });

  const { data: reviews, isLoading } = useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const res = await api.get('/reviews/public');
      return res.data;
    },
  });

  const filteredReviews = reviews?.filter((r: any) => {
    if (filter === 'featured' && r.status !== 'featured') return false;
    if (filter === 'anonymous' && r.publishPreference !== 'publish_anonymously') return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const textMatch = r.text?.toLowerCase().includes(q) || r.reviewText?.toLowerCase().includes(q) || false;
      const nameMatch = r.patientName?.toLowerCase().includes(q) || false;
      if (!textMatch && !nameMatch) return false;
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-4xl px-6 py-20 md:px-10">
      <div className="mb-16 text-center">
        <h1 className="font-display text-4xl font-light tracking-tight sm:text-5xl">Patient Experiences</h1>
        <p className="mt-4 text-lg text-muted-foreground mb-8">
          Real feedback from patients and colleagues over the years.
        </p>
        <Link 
          to="/share-review"
          className="bg-gold text-foreground px-8 py-3 rounded-full text-sm font-medium hover:scale-105 transition-transform inline-block"
        >
          Share Your Experience
        </Link>
      </div>

      {analytics && analytics.ratingDist && (
        <div className="mb-12 bg-foreground/5 p-6 md:p-8 rounded-3xl border border-rule/30 flex flex-col md:flex-row gap-8 items-center">
          <div className="text-center md:w-1/3">
            <div className="text-5xl font-display text-gold mb-2">{analytics.averageRating?.toFixed(1) || '0.0'}</div>
            <div className="flex justify-center gap-1 mb-2">
               {[...Array(5)].map((_, i) => (
                  <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-gold">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
            </div>
            <p className="text-sm text-muted-foreground">{analytics.approved + analytics.featured} Verified Reviews</p>
          </div>
          <div className="w-full md:w-2/3 space-y-2">
            {[5, 4, 3, 2, 1].map(star => {
              const count = analytics.ratingDist[star] || 0;
              const totalDist = Math.max(1, analytics.approved + analytics.featured);
              const percentage = Math.round((count / totalDist) * 100);
              return (
                <div key={star} className="flex items-center gap-4">
                  <div className="w-12 text-sm text-muted-foreground text-right">{star} Stars</div>
                  <div className="flex-1 h-3 bg-rule/30 rounded-full overflow-hidden">
                    <div className="h-full bg-gold" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <div className="w-8 text-sm text-muted-foreground">{count}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2 bg-foreground/5 p-1 rounded-full border border-rule/30">
          <button onClick={() => setFilter('recent')} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'recent' ? 'bg-background shadow-sm' : 'hover:bg-foreground/5'}`}>Recent</button>
          <button onClick={() => setFilter('featured')} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'featured' ? 'bg-background shadow-sm' : 'hover:bg-foreground/5'}`}>Featured</button>
          <button onClick={() => setFilter('anonymous')} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'anonymous' ? 'bg-background shadow-sm' : 'hover:bg-foreground/5'}`}>Anonymous</button>
        </div>
        <input 
          type="text" 
          placeholder="Search reviews..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 bg-foreground/5 border border-rule/30 rounded-full focus:outline-none focus:border-gold text-sm w-full md:w-64"
        />
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground">Loading reviews...</div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {filteredReviews?.map((review: any) => (
            <div key={review._id} className="rounded-2xl border border-rule/50 bg-background/50 p-8 md:p-10 shadow-sm relative overflow-hidden">
              {review.status === 'featured' && (
                <div className="absolute top-0 right-0 bg-gold text-background text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-bl-xl">
                  Featured
                </div>
              )}
              <div className="flex gap-1 text-gold mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="font-display text-xl leading-relaxed text-foreground/90 md:text-2xl italic">
                "{review.reviewText || review.text}"
              </p>
              <div className="mt-8 flex justify-between items-end border-t border-rule/30 pt-4">
                <div>
                  <p className="font-medium text-foreground">
                    {review.publishPreference === 'publish_anonymously' ? 'Anonymous Patient' : review.patientName}
                  </p>
                  {review.treatment && <p className="text-sm text-muted-foreground mt-1">{review.treatment}</p>}
                </div>
              </div>
            </div>
          ))}
          {filteredReviews?.length === 0 && (
             <div className="py-20 text-center text-muted-foreground border border-rule/30 rounded-3xl bg-foreground/5">
                No reviews found matching your criteria.
             </div>
          )}
        </div>
      )}
    </div>
  );
}
