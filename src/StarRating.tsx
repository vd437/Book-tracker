
import React from "react";
import { Star, StarHalf, StarOff } from "lucide-react";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
  editable?: boolean;
  onRatingChange?: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  max = 5,
  size = 20,
  editable = false,
  onRatingChange = () => {}
}) => {
  const handleClick = (selectedRating: number) => {
    if (editable) {
      onRatingChange(selectedRating);
    }
  };

  const renderStars = () => {
    const stars = [];
    
    for (let i = 1; i <= max; i++) {
      if (i <= rating) {
        // Full star
        stars.push(
          <Star
            key={i}
            size={size}
            className={editable ? "cursor-pointer text-book-purple" : "text-book-purple"}
            fill="currentColor"
            onClick={() => handleClick(i)}
          />
        );
      } else if (i - 0.5 <= rating) {
        // Half star
        stars.push(
          <StarHalf
            key={i}
            size={size}
            className={editable ? "cursor-pointer text-book-purple" : "text-book-purple"}
            fill="currentColor"
            onClick={() => handleClick(i)}
          />
        );
      } else {
        // Empty star
        stars.push(
          <StarOff
            key={i}
            size={size}
            className={editable ? "cursor-pointer text-gray-300" : "text-gray-300"}
            onClick={() => handleClick(i)}
          />
        );
      }
    }

    return stars;
  };

  return (
    <div className="flex items-center gap-1">
      {renderStars()}
    </div>
  );
};

export default StarRating;
