import { useState, useEffect, useRef } from 'react';
import api from '../../lib/api';
import { format } from 'date-fns';
import { QRCodeCanvas } from 'qrcode.react';

const ReviewModerator = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>({ total: 0, approved: 0, pending: 0, featured: 0, averageRating: 0, named: 0, anonymous: 0, ratingDist: {} });
  const [loading, setLoading] = useState(true);
  const qrRef = useRef<HTMLCanvasElement>(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const [revRes, statRes] = await Promise.all([
        api.get('/reviews'),
        api.get('/reviews/analytics')
      ]);
      setReviews(revRes.data);
      setAnalytics(statRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/reviews/${id}`, { status });
      fetchReviews();
    } catch (err) {
      alert('Error updating status');
    }
  };

  const deleteReview = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      fetchReviews();
    } catch (err) {
      alert('Error deleting review');
    }
  };

  if (loading) return <div className="text-muted-foreground p-8">Loading reviews...</div>;

  const downloadQR = () => {
    const canvas = qrRef.current;
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "Patient_Review_QR.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-display text-ink">Review Moderation</h1>
          <p className="text-muted-foreground mt-1 text-sm">Approve, feature, and manage patient testimonials.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden">
            <QRCodeCanvas 
              id="qrCode" 
              ref={qrRef}
              value={`${window.location.origin}/share-review`} 
              size={1024} 
              level={"H"}
            />
          </div>
          <button 
            onClick={downloadQR}
            className="px-4 py-2 bg-foreground text-background text-sm rounded-lg hover:bg-foreground/90 transition-colors"
          >
            Download Clinic QR Code
          </button>
        </div>
      </div>
      
      {/* Analytics Dashboard */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-foreground/5 p-6 rounded-xl border border-rule/30">
          <p className="text-sm text-muted-foreground mb-1">Average Rating</p>
          <p className="text-3xl font-display text-gold">{analytics.averageRating.toFixed(1)} <span className="text-sm">/ 5</span></p>
        </div>
        <div className="bg-foreground/5 p-6 rounded-xl border border-rule/30">
          <p className="text-sm text-muted-foreground mb-1">Total Reviews</p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-display">{analytics.total}</p>
            <p className="text-xs text-muted-foreground mb-1 pb-0.5">({analytics.approved} approved)</p>
          </div>
        </div>
        <div className="bg-foreground/5 p-6 rounded-xl border border-rule/30">
          <p className="text-sm text-muted-foreground mb-1">Status Breakdown</p>
          <div className="flex gap-4 mt-2">
            <div>
              <p className="text-xl font-display text-yellow-600">{analytics.pending}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
            <div>
              <p className="text-xl font-display text-blue-600">{analytics.featured}</p>
              <p className="text-xs text-muted-foreground">Featured</p>
            </div>
          </div>
        </div>
        <div className="bg-foreground/5 p-6 rounded-xl border border-rule/30">
          <p className="text-sm text-muted-foreground mb-1">Attribution</p>
          <div className="flex gap-4 mt-2">
            <div>
              <p className="text-xl font-display text-ink">{analytics.named}</p>
              <p className="text-xs text-muted-foreground">Named</p>
            </div>
            <div>
              <p className="text-xl font-display text-muted-foreground">{analytics.anonymous}</p>
              <p className="text-xs text-muted-foreground">Anonymous</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Rating Distribution */}
      {analytics.ratingDist && Object.keys(analytics.ratingDist).length > 0 && (
        <div className="mb-8 bg-foreground/5 p-6 rounded-xl border border-rule/30">
          <h3 className="text-sm font-medium mb-4">Rating Distribution (Approved & Featured)</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(star => {
              const count = analytics.ratingDist[star] || 0;
              const totalDist = Math.max(1, analytics.approved + analytics.featured); // Prevent div by 0
              const percentage = Math.round((count / totalDist) * 100);
              return (
                <div key={star} className="flex items-center gap-4">
                  <div className="w-12 text-sm text-muted-foreground">{star} Stars</div>
                  <div className="flex-1 h-2 bg-rule/30 rounded-full overflow-hidden">
                    <div className="h-full bg-gold" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <div className="w-8 text-sm text-right text-muted-foreground">{count}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {reviews.map(review => (
          <div key={review._id} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">{review.patientName}</h3>
                <p className="text-sm text-gray-500">{format(new Date(review.createdAt), 'MMM d, yyyy HH:mm')} &bull; {review.rating} Stars</p>
              </div>
              <div className="flex gap-2">
                <span className={`px-2 py-1 text-xs font-bold rounded uppercase tracking-wider
                  ${review.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    review.status === 'approved' ? 'bg-green-100 text-green-800' : 
                    review.status === 'featured' ? 'bg-blue-100 text-blue-800' : 
                    review.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                  {review.status}
                </span>
              </div>
            </div>
            <p className="text-gray-700 mb-6 bg-white p-4 rounded border border-gray-100">{review.text}</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => updateStatus(review._id, 'approved')} className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700">Approve</button>
              {review.status === 'featured' ? (
                <button onClick={() => updateStatus(review._id, 'approved')} className="px-4 py-2 text-sm border border-ink text-ink rounded hover:bg-ink/5">Unfeature</button>
              ) : (
                <button onClick={() => updateStatus(review._id, 'featured')} className="px-4 py-2 text-sm bg-ink text-white rounded hover:bg-ink/80">Feature</button>
              )}
              <button onClick={() => updateStatus(review._id, 'hidden')} className="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600">Hide</button>
              <button onClick={() => updateStatus(review._id, 'rejected')} className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600">Reject</button>
              <button onClick={() => deleteReview(review._id)} className="px-4 py-2 text-sm border border-red-500 text-red-500 rounded hover:bg-red-50">Delete</button>
            </div>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-gray-500">No reviews found.</p>}
      </div>
    </div>
  );
};

export default ReviewModerator;
