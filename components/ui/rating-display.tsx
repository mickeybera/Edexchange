"use client";

import { Star, StarHalf } from 'lucide-react';
import { Badge } from './badge';

interface RatingDisplayProps {
  rating: number;
  totalRatings: number;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function RatingDisplay({ rating = 0, totalRatings = 0, showCount = true, size = 'md' }: RatingDisplayProps) {
  // Ensure rating is a valid number
  const validRating = typeof rating === 'number' && !isNaN(rating) ? rating : 0;
  const validTotalRatings = typeof totalRatings === 'number' && !isNaN(totalRatings) ? totalRatings : 0;
  
  const fullStars = Math.floor(validRating);
  const hasHalfStar = validRating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const starSize = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }[size];

  const textSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }[size];

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className={`${starSize} fill-yellow-400 text-yellow-400`} />
        ))}
        {hasHalfStar && (
          <StarHalf className={`${starSize} fill-yellow-400 text-yellow-400`} />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className={`${starSize} text-gray-300`} />
        ))}
      </div>
      {showCount && validTotalRatings > 0 && (
        <span className={`${textSize} text-muted-foreground`}>
          ({validTotalRatings})
        </span>
      )}
    </div>
  );
}

interface RatingBadgeProps {
  rating: number;
  totalRatings: number;
}

export function RatingBadge({ rating = 0, totalRatings = 0 }: RatingBadgeProps) {
  // Ensure rating is a valid number
  const validRating = typeof rating === 'number' && !isNaN(rating) ? rating : 0;
  const validTotalRatings = typeof totalRatings === 'number' && !isNaN(totalRatings) ? totalRatings : 0;
  
  if (validTotalRatings === 0) {
    return (
      <Badge variant="secondary" className="text-xs">
        No ratings
      </Badge>
    );
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'bg-green-500 text-white';
    if (rating >= 4.0) return 'bg-blue-500 text-white';
    if (rating >= 3.5) return 'bg-yellow-500 text-white';
    if (rating >= 3.0) return 'bg-orange-500 text-white';
    return 'bg-red-500 text-white';
  };

  return (
    <Badge className={`${getRatingColor(validRating)} text-xs`}>
      ⭐ {validRating.toFixed(1)} ({validTotalRatings})
    </Badge>
  );
}
