import { useEffect, useState } from 'react';
import '../../css/ReviewSection.css';

type Review = {
  id?: string;
  roomId: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
};

const ReviewSection = ({ roomId }: { roomId: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3000/reviews?roomId=${roomId}`)
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error('Lỗi khi tải đánh giá:', err));
  }, [roomId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment) return alert('Vui lòng nhập nội dung đánh giá');

    const newReview: Review = {
      roomId,
      user: 'Ẩn danh',
      rating,
      comment,
      date: new Date().toISOString().split('T')[0], 
    };

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
      });

      if (!res.ok) throw new Error('Gửi đánh giá thất bại');

      const saved = await res.json();
      setReviews(prev => [...prev, saved]);
      setComment('');
      setRating(5);
    } catch (error) {
      alert('Có lỗi khi gửi đánh giá');
    } finally {
      setLoading(false);
    }
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

        <button type="submit" disabled={loading}>
          {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
        </button>
      </form>

      <div className="review-list">
        {reviews.map((r, i) => (
          <div key={r.id || i} className="review-item">
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
