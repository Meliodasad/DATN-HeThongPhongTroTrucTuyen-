import { useEffect, useState } from 'react';
import '../../css/ReviewSection.css'

type Review = {
  user: string;
  rating: number;
  comment: string;
  date: string;
};

const getReviews = (postId: string): Review[] => {
  const stored = localStorage.getItem('reviews');
  const all = stored ? JSON.parse(stored) : {};
  return all[postId] || [];
};

const saveReview = (postId: string, review: Review) => {
  const stored = localStorage.getItem('reviews');
  const all = stored ? JSON.parse(stored) : {};
  const updated = {
    ...all,
    [postId]: [...(all[postId] || []), review],
  };
  localStorage.setItem('reviews', JSON.stringify(updated));
};

const ReviewSection = ({ postId }: { postId: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    setReviews(getReviews(postId));
  }, [postId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment) return alert('Vui lòng nhập nội dung đánh giá');
    const newReview: Review = {
      user: 'Người dùng ẩn danh',
      rating,
      comment,
      date: new Date().toLocaleDateString('vi-VN'),
    };
    saveReview(postId, newReview);
    setReviews(prev => [...prev, newReview]);
    setRating(5);
    setComment('');
  };

  return (
    <div className="review-section">
      <h3>Đánh giá trọ</h3>
      <form onSubmit={handleSubmit} className="review-form">
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map(star => (
            <span
              key={star}
              onClick={() => setRating(star)}
              style={{
                cursor: 'pointer',
                fontSize: '20px',
                color: star <= rating ? '#FFD700' : '#ccc',
              }}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          placeholder="Nội dung đánh giá"
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
        <button type="submit">Gửi đánh giá</button>
      </form>

      <div className="review-list">
        {reviews.map((r, i) => (
          <div key={i} className="review-item">
            <p>
              <strong>{r.user}</strong>{' '}
              <span style={{ color: '#FFD700' }}>
                {'★'.repeat(r.rating)}
                {'☆'.repeat(5 - r.rating)}
              </span>
            </p>
            <p>{r.comment}</p>
            <span className="review-date">{r.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;
