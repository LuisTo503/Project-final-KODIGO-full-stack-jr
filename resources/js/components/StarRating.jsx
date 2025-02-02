import React from 'react';

const StarRating = ({ rating, editable = false, onChange }) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`text-2xl transition-colors ${editable ? 'cursor-pointer' : 'cursor-default'}
            ${star <= (hoverRating || rating) ? 
              'text-primary' : 
              'text-base-content/30'}
          `}
          onMouseEnter={() => editable && setHoverRating(star)}
          onMouseLeave={() => editable && setHoverRating(0)}
          onClick={() => editable && onChange?.(star)}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default StarRating;