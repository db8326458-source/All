import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  reviewCount, 
  size = 'sm',
  showNumber = true 
}) => {
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5';
  const textSize = size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base font-semibold';

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${iconSize} ${
              star <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'text-slate-200 fill-slate-200'
            }`}
          />
        ))}
      </div>
      {showNumber && (
        <span className={`font-semibold text-slate-800 ${textSize}`}>
          {rating > 0 ? rating.toFixed(1) : 'New'}
        </span>
      )}
      {reviewCount !== undefined && reviewCount > 0 && (
        <span className="text-xs text-slate-500 font-normal">
          ({reviewCount})
        </span>
      )}
    </div>
  );
};
