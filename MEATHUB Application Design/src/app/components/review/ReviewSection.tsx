// MEATHUB - Review Section Component

import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Star, Send } from 'lucide-react';
import { toast } from 'sonner';
import { reviewApi, ReviewResponse, CreateReviewRequest } from '../../../api/reviewApi';

interface ReviewSectionProps {
  meatItemId: string;
  orderId?: number;
  onReviewSubmitted?: () => void;
}

export function ReviewSection({ meatItemId, orderId, onReviewSubmitted }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [meatItemId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewApi.getReviewsByMeatItem(parseInt(meatItemId));
      setReviews(data);
    } catch (error: any) {
      console.error('Failed to load reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!orderId) {
      toast.error('Order ID is required to submit a review');
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setSubmitting(true);
    try {
      const request: CreateReviewRequest = {
        orderId,
        meatItemId: parseInt(meatItemId),
        rating,
        comment: comment.trim() || undefined,
      };

      await reviewApi.createReview(request);
      toast.success('Review submitted successfully!');
      setShowForm(false);
      setRating(0);
      setComment('');
      await loadReviews();
      onReviewSubmitted?.();
    } catch (error: any) {
      console.error('Failed to submit review:', error);
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold mb-1">Customer Reviews</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {averageRating.toFixed(1)} ({reviews.length} reviews)
            </span>
          </div>
        </div>
        {orderId && !showForm && (
          <Button onClick={() => setShowForm(true)} size="sm">
            Write a Review
          </Button>
        )}
      </div>

      {showForm && orderId && (
        <Card className="p-4 mb-4 bg-muted">
          <h4 className="font-semibold mb-3">Write Your Review</h4>
          <div className="mb-3">
            <Label>Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="mb-3">
            <Label htmlFor="comment">Comment (Optional)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSubmitReview} disabled={submitting || rating === 0}>
              <Send className="mr-2 h-4 w-4" />
              {submitting ? 'Submitting...' : 'Submit Review'}
            </Button>
            <Button variant="outline" onClick={() => {
              setShowForm(false);
              setRating(0);
              setComment('');
            }}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No reviews yet. Be the first to review!
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-4 last:border-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">
                    {review.userName || `User ${review.userId}`}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              {review.comment && (
                <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

