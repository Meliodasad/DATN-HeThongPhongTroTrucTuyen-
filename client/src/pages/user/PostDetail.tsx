import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import '../../css/PostDetail.css';
import ReviewSection from '../../components/user/ReviewSection';
import ReportForm from '../../components/user/ReportForm';
import { useAuth } from '../../contexts/AuthContext';
import { headers } from '../../utils/config';

interface Room {
  id: string;
  hostId: string;           // giá trị này nhiều khả năng là userId
  roomId: string;
  roomTitle: string;
  price: number;
  area: number;
  location: string;
  description: string;
  images: string[];
  roomType: string;
  status: string;
  utilities: string[];
  terms: string;
  approvalStatus: string;
  approvalDate?: string;
  createdAt: string;
}

// cấu trúc trả về từ API /users/:id
interface UserApi {
  _id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  avatar: string;
  address?: string;
  dob?: string;
  createdAt: string;
  updatedAt: string;
}

// model dùng trong UI
interface User {
  id: string;               // dùng để link: /user/:id
  fullName: string;
  avatar: string;
  phone: string;
  zalo?: string;            // API chưa có, để optional
  status: string;
  createdAt: string;
}

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [host, setHost] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useAuth();

  // hàm ánh xạ UserApi -> User (UI)
  const mapUser = (u: UserApi): User => ({
    // ưu tiên userId cho đường link/profile; fallback _id nếu thiếu
    id: u.userId || u._id,
    fullName: u.fullName,
    avatar: u.avatar,
    phone: u.phone,
    status: u.status,
    createdAt: u.createdAt,
    // zalo: có thể ánh xạ nếu về sau backend trả về
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1) lấy phòng
        const roomRes = await fetch(`http://localhost:3000/rooms/${id}`, { headers });
        if (!roomRes.ok) throw new Error('Không tìm thấy phòng');
        const roomJson: any = await roomRes.json();
        const roomData: Room = roomJson?.data;
        if (!roomData) throw new Error('Dữ liệu phòng không hợp lệ');
        setRoom(roomData);

        // 2) lấy user host theo hostId (thường là userId)
const hostRes = await fetch(`http://localhost:3000/public-users/${roomData.hostId}`);
        if (!hostRes.ok) throw new Error('Không tìm thấy người đăng');
        const hostJson: { success: boolean; data?: UserApi } = await hostRes.json();

        if (!hostJson?.success || !hostJson?.data) {
          throw new Error('Payload user không hợp lệ');
        }

        setHost(mapUser(hostJson.data));
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Lỗi khi tải dữ liệu');
        setRoom(null);
        setHost(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading) return <div className="post-detail-container">Đang tải dữ liệu...</div>;
  if (error) return <div className="post-detail-container">Lỗi: {error}</div>;
  if (!room || !host) return <div className="post-detail-container">Không có dữ liệu.</div>;

  const images = (room.images ?? []).map(img => ({
    original: img,
    thumbnail: img,
  }));

  const [district, province] = room.location ? room.location.split(',').map(s => s.trim()) : ['', ''];

  return (
    <div className="post-detail-container">
      <ImageGallery items={images} showPlayButton={false} showFullscreenButton={false} />

      <Link to={`/booking/${room.roomId}`} className="booking">Yêu cầu thuê phòng</Link>

      <div className="post-info">
        <h1 className="title">{room.roomTitle}</h1>
        <div className="meta">
          <span className="price">{room.price?.value.toLocaleString('vi-VN')} đ</span>
          <span className="dot">•</span>
          <span>{room.area} m²</span>
          <span className="dot">•</span>
          <span>{room.location}</span>
        </div>

        <div className="info-table">
          <div className="info-row"><span><strong>Quận huyện:</strong></span><span>{district}</span></div>
          <div className="info-row"><span><strong>Tỉnh thành:</strong></span><span>{province}</span></div>
          <div className="info-row"><span><strong>Địa chỉ:</strong></span><span>{room.location}</span></div>
          <div className="info-row"><span><strong>Mã phòng:</strong></span><span>#{room.roomId.padStart(6, '0')}</span></div>
          <div className="info-row"><span><strong>Ngày đăng:</strong></span><span>{new Date(room.createdAt).toLocaleDateString()}</span></div>
          <div className="info-row"><span><strong>Ngày duyệt:</strong></span><span>{room.approvalDate ? new Date(room.approvalDate).toLocaleDateString() : 'Chưa duyệt'}</span></div>
          <div className="info-row"><span><strong>Trạng thái:</strong></span><span>{room.status}</span></div>
          <div className="info-row"><span><strong>Loại phòng:</strong></span><span>{room.roomType}</span></div>
          <div className="info-row"><span><strong>Tiện ích:</strong></span><span>{room.utilities?.length ? room.utilities.join(', ') : 'Không có'}</span></div>
          <div className="info-row"><span><strong>Điều khoản:</strong></span><span>{room.terms || 'Không có'}</span></div>
        </div>

        <div className="description">
          <h3>Thông tin mô tả</h3>
          <p>{room.description}</p>
        </div>
      </div>

      <Link to={`/user/${host.id}`} className="contact-header">
        <img src={host.avatar} alt="avatar" className="avatar" />
        <div>
          <h3>{host.fullName}</h3>
          <p className="sub-info">
            {host.status} • Tham gia từ: {new Date(host.createdAt).toLocaleDateString()}
          </p>
        </div>
      </Link>

      <div className="contact-info">
        <p><strong>📞 Số điện thoại:</strong> <a href={`tel:${host.phone}`}>{host.phone}</a></p>
        {host.zalo && (
          <p>
            <strong>💬 Zalo:</strong>{' '}
            <a
              href={host.zalo.startsWith('http') ? host.zalo : `https://zalo.me/${host.zalo}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Nhắn Zalo
            </a>
          </p>
        )}
      </div>

      {currentUser ? (
        <>
          <ReviewSection roomId={room.roomId} />
          <ReportForm roomId={room.roomId} />
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
