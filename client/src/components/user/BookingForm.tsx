import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../css/BookingForm.css';
import { useAuth } from '../../contexts/AuthContext';
import { headers } from '../../utils/config';

interface Room {
  id: string;
  roomTitle: string;
  price: number;
  location: string;
}

interface Contract {
  id: string;
  tenantId: string;
  roomId: string;
  status: 'active' | 'terminated' | 'pending';
}

const BookingForm = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const currentUserId = currentUser?.id;

  const [room, setRoom] = useState<Room | null>(null);
  const [extendMonths, setExtendMonths] = useState(3);
  const [note, setNote] = useState(''); // thêm ghi chú
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [hasActiveContract, setHasActiveContract] = useState(false);
  const [hasAnyContract, setHasAnyContract] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await fetch(`http://localhost:3000/rooms/${roomId}`, { headers });
        const data = await res.json();
        setRoom(data.data);
      } catch (err) {
        console.error('Lỗi khi lấy phòng:', err);
      }
    };

    const fetchContracts = async () => {
      try {
        const res = await fetch(`http://localhost:3000/contracts?tenantId=${currentUserId}`, { headers });
        const data = await res.json();
        setContracts(data.data.contracts);
        setHasActiveContract(data.data.contracts.some((c: Contract) => c.status === 'active'));
        setHasAnyContract(data.data.contracts.length > 0);
      } catch (err) {
        console.error('Lỗi khi lấy hợp đồng:', err);
      }
    };

    if (roomId) fetchRoom();
    if (currentUserId) fetchContracts();
  }, [roomId, currentUserId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!room || !currentUserId) return;

    if (hasActiveContract) {
      alert('❌ Bạn đang có hợp đồng đang hoạt động. Không thể gửi thêm yêu cầu thuê.');
      return;
    }

    const newRequest = {
      id: Date.now().toString(),
      tenantId: currentUserId,
      roomId: room.id,
      extendMonths,
      note: note.trim(), // lưu ghi chú
      status: 'pending',
      createdAt: new Date().toISOString(),
      requestType: 'booking', // đánh dấu là yêu cầu thuê
    };

    try {
      await fetch(`http://localhost:3000/room_requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRequest),
      });
      alert('✅ Yêu cầu thuê đã được gửi thành công!');
      navigate('/my-bookings');
    } catch (error) {
      console.error('Lỗi gửi yêu cầu:', error);
      alert('❌ Gửi yêu cầu thất bại!');
    }
  };

  return (
    <div className="booking-form-container">
      <h2>Yêu cầu thuê phòng</h2>

      {room && (
        <div className="room-info">
          <p><strong>Tên phòng:</strong> {room.roomTitle}</p>
          <p><strong>Giá thuê:</strong> {room.price.toLocaleString()} VND / tháng</p>
          <p><strong>Địa chỉ:</strong> {room.location}</p>
        </div>
      )}

      {hasAnyContract && !hasActiveContract && (
        <p className="warning">
          ⚠️ Bạn đã từng ký hợp đồng trước đây. Vẫn có thể gửi yêu cầu thuê mới.
        </p>
      )}

      <form onSubmit={handleSubmit} className="booking-form">
        <label>Họ và tên:</label>
        <input type="text" value={currentUser?.fullName || ''} disabled />

        <label>Số điện thoại:</label>
        <input type="text" value={currentUser?.phone || ''} disabled />

        <label>Email:</label>
        <input type="email" value={currentUser?.email || ''} disabled />

        <label>Gia hạn hợp đồng dự kiến (tháng):</label>
        <input
          type="number"
          min={3}
          value={extendMonths}
          onChange={(e) => setExtendMonths(Number(e.target.value))}
          required
        />

        <label>Ghi chú:</label>
        <textarea
          placeholder="Nhập ghi chú cho chủ trọ (ví dụ: Tôi muốn xem phòng vào cuối tuần)..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button type="submit">Gửi yêu cầu</button>
      </form>
    </div>
  );
};

export default BookingForm;