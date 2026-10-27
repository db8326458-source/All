import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Star, CheckCircle, ThumbsUp } from 'lucide-react';
import { Booking } from '../../types';

interface WriteReviewModalProps {
  booking: Booking;
  onClose: () => void;
  onSuccess: () => void;
}

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({ booking, onClose, onSuccess }) => {
  const { submitReview } = useApp();
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Punctual', 'High Quality Work']);

  const tagOptions = [
    'Punctual',
    'High Quality Work',
    'Fair & Transparent Price',
    'Clean Work Area',
    'Great Communication',
    'Expert Diagnostics'
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert('Please enter your written review.');
      return;
    }

    submitReview(booking.id, rating, comment.trim(), selectedTags);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 space-y-4">
        
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Rate & Review</h3>
            <p className="text-xs text-slate-500">{booking.professionalName} ({booking.professionalCategory})</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Star selector */}
          <div className="text-center py-2">
            <div className="text-xs text-slate-500 mb-1.5 font-medium">How was your service experience?</div>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="font-bold text-slate-800 text-sm mt-1">
              {rating === 5 && 'Outstanding (5.0)'}
              {rating === 4 && 'Very Good (4.0)'}
              {rating === 3 && 'Average (3.0)'}
              {rating === 2 && 'Needs Improvement (2.0)'}
              {rating === 1 && 'Unsatisfactory (1.0)'}
            </div>
          </div>

          {/* Compliment Tags */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">What went especially well?</label>
            <div className="flex flex-wrap gap-1.5">
              {tagOptions.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-medium border transition-colors ${
                      isSelected
                        ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold'
                        : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}{tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">Your Feedback & Recommendation *</label>
            <textarea
              required
              rows={3}
              placeholder="Describe the technician's punctuality, repair quality, and advice..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/30"
          >
            Submit Verified Review
          </button>
        </form>

      </div>
    </div>
  );
};
