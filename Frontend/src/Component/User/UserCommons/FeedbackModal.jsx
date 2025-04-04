import React from 'react';
import { IoClose } from 'react-icons/io5';
import { FaStar } from 'react-icons/fa';

// Star Rating Component
const StarRating = ({ rating }) => {
  const stars = [];
  const roundedRating = Math.round(rating * 2) / 2;

  for (let i = 1; i <= 5; i++) {
    if (i <= roundedRating) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    } else if (i - 0.5 === roundedRating) {
      stars.push(<FaStar key={i} className="text-yellow-400 opacity-50" />);
    } else {
      stars.push(<FaStar key={i} className="text-gray-300" />);
    }
  }

  return (
    <div className="flex items-center space-x-1">
      {stars}
      <span className="ml-2 text-sm text-gray-600">({rating.toFixed(1)})</span>
    </div>
  );
};

const FeedbackModal = ({ isOpen, onClose, feedbacks, doctorName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Feedbacks for Dr. {doctorName}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <IoClose size={24} />
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {feedbacks && feedbacks.length > 0 ? (
            feedbacks.map((feedback, index) => (
              <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <StarRating rating={feedback.rating} />
                </div>
                <p className="text-gray-700">{feedback.feedback}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No feedbacks available for this doctor.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
