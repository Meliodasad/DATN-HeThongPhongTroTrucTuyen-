import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import '../../css/PostDetail.css';
import ReviewSection from '../../components/user/ReviewSection';
import ReportForm from '../../components/user/ReportForm';
import { useAuth } from '../../contexts/AuthContext';

interface Tenant {
  userId: string;
  fullName: string;
  phone: string;
  avatar: string;
}

interface Room {
  id: string;
  roomId: string;
  area: number;
  price: number;
  utilities: string[];
  maxPeople: number;
  images: string[];
  description: string;
  location: string;
  deposit: string;
  electricity: string;
  tenant: Tenant | null;
}

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/rooms/${id}`);
        if (!res.ok) throw new Error('Không tìm thấy phòng');
        const data: Room = await res.json();
        setRoom(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Lỗi khi tải dữ liệu');
        setRoom(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRoom();
  }, [id]);

  if (loading) return <div className="post-detail-container">Đang tải dữ liệu...</div>;
  if (error) return <div className="post-detail-container">Lỗi: {error}</div>;
  if (!room) return <div className="post-detail-container">Không có dữ liệu.</div>;

  const images = room.images.map(img => ({
    original: img,
    thumbnail: img,
  }));

  return (
    <div className="post-detail-container">
      {/* Gallery ảnh */}
      <ImageGallery items={images} showPlayButton={false} showFullscreenButton={false} />

      {/* Link đặt phòng */}
      <Link to={`/booking/${room.id}`} className="booking">Yêu cầu thuê phòng</Link>

      {/* Thông tin phòng */}
      <div className="post-info">
        <h1 className="title">{room.roomId}</h1>
        <div className="meta">
          <span className="price">{room.price.toLocaleString('vi-VN')} đ</span>
          <span className="dot">•</span>
          <span>{room.area} m²</span>
          <span className="dot">•</span>
          <span>{room.location}</span>
        </div>

        <div className="info-table">
          <div className="info-row"><span><strong>Mã phòng:</strong></span><span>{room.roomId}</span></div>
          <div className="info-row"><span><strong>Địa chỉ:</strong></span><span>{room.location}</span></div>
          <div className="info-row"><span><strong>Tiền cọc:</strong></span><span>{room.deposit}</span></div>
          <div className="info-row"><span><strong>Điện:</strong></span><span>{room.electricity} VND/kWh</span></div>
          <div className="info-row"><span><strong>Số người tối đa:</strong></span><span>{room.maxPeople}</span></div>
          <div className="info-row"><span><strong>Tiện ích:</strong></span><span>{room.utilities.length ? room.utilities.join(', ') : 'Không có'}</span></div>
        </div>

        <div className="description">
          <h3>Thông tin mô tả</h3>
          <p>{room.description}</p>
        </div>
      </div>

      {/* Người thuê hiện tại (nếu có) */}
      {room.tenant ? (
        <div className="contact-header">
          <img src={room.tenant.avatar} alt="avatar" className="avatar" />
          <div>
            <h3>{room.tenant.fullName}</h3>
            <p className="sub-info">📞 {room.tenant.phone}</p>
          </div>
        </div>
      ) : (
        <p style={{ marginTop: '1rem', color: 'gray' }}>Phòng đang trống</p>
      )}

      {/* Đánh giá + Báo cáo */}
      {currentUser ? (
        <>
          <ReviewSection roomId={room.id} />
          <ReportForm roomId={room.id} />
        </>
      ) : (
        <p style={{ marginTop: '1rem', color: 'gray' }}>
          🔒 Bạn cần <Link to="/login">đăng nhập</Link> để phản ánh và đánh giá phòng này.
        </p>
      )}
    </div>
  );
};

export default PostDetail;
