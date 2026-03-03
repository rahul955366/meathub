"use client";

import React, { useState } from 'react';
import { Star, Send, X, Check } from 'lucide-react';
import { createReview } from '@/lib/api';

interface ReviewFormProps {
    orderId: number;
    butcherId: number;
    onSuccess?: () => void;
    onClose?: () => void;
}

export default function ReviewForm({ orderId, butcherId, onSuccess, onClose }: ReviewFormProps) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const token = localStorage.getItem('meathub_token');
        const result = await createReview(token || '', {
            order: orderId,
            butcher: butcherId,
            rating,
            comment
        });

        if (result.success) {
            setSubmitted(true);
            setTimeout(() => {
                if (onSuccess) onSuccess();
                if (onClose) onClose();
            }, 2000);
        } else {
            setError(result.error || 'Failed to submit review.');
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="text-center p-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-black uppercase italic">Thank You!</h3>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Your review helps our master butchers improve.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-2">
            <div className="text-center space-y-2 mb-8">
                <h3 className="text-2xl font-black uppercase tracking-tighter italic">Rate Your Experience</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">How was the quality of the meat?</p>
            </div>

            {/* Star Rating */}
            <div className="flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map((s) => (
                    <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className={`transition-all ${rating >= s ? 'text-rose-600 scale-110' : 'text-slate-200'}`}
                    >
                        <Star className={`w-10 h-10 ${rating >= s ? 'fill-current' : ''}`} />
                    </button>
                ))}
            </div>

            {/* Comment */}
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Comments (Optional)</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full h-32 px-6 py-4 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm font-bold focus:ring-2 focus:ring-rose-600 outline-none resize-none"
                    placeholder="The mutton was exceptionally fresh..."
                />
            </div>

            {error && <p className="text-xs text-red-500 text-center font-bold">Error: {error}</p>}

            <div className="flex gap-4">
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 h-16 bg-slate-100 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 h-16 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-rose-600 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                >
                    {isSubmitting ? 'Submitting...' : <><Send className="w-4 h-4" /> Submit Review</>}
                </button>
            </div>
        </form>
    );
}
