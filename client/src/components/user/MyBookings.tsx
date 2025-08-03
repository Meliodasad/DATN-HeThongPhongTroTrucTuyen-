import React, { useEffect, useState } from 'react';
import '../../css/MyBookings.css';
import { useAuth } from '../../contexts/AuthContext';

interface RentalRequest {
  id: string;
  tenantId: string;
  roomId: string;
  extendMonths: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  note?: string;
}

interface Room {
  id: string;
  roomTitle: string;
  location: string;
  images?: string[]; // hỗ trợ nhiều ảnh
}

const MyBookings: React.FC = () => {
  const { user } = useAuth();
  const tenantId = user?.id;

  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tenantId) return;

    const fetchData = async () => {
      try {
        const [requestsRes, roomsRes] = await Promise.all([
          fetch(`http://localhost:3000/room_requests?tenantId=${tenantId}`),
          fetch(`http://localhost:3000/rooms`)
        ]);

        const requestsData = await requestsRes.json();
        const roomsData = await roomsRes.json();

        setRequests(requestsData);
        setRooms(roomsData);
      } catch (err) {
        console.error('Lỗi tải dữ liệu:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tenantId]);

  const getRoom = (roomId: string) => rooms.find(r => r.id === roomId);

  const handleCancel = async (id: string) => {
    const confirm = window.confirm('Bạn có chắc muốn hủy yêu cầu này không?');
    if (!confirm) return;

    try {
      await fetch(`http://localhost:3000/room_requests/${id}`, {
        method: 'DELETE',
      });

      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error('Lỗi hủy yêu cầu:', error);
      alert('Không thể hủy yêu cầu.');
    }
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;

  return (
    <div className="my-bookings-container">
      <h2>Danh sách yêu cầu thuê phòng</h2>
      {requests.length === 0 ? (
        <p>Bạn chưa gửi yêu cầu nào.</p>
      ) : (
        <ul className="booking-list">
          {requests.map(r => {
            const room = getRoom(r.roomId);
            const imageSrc = room?.images && room.images.length > 0
              ? room.images[0]
              : 'https://via.placeholder.com/120x90?text=No+Image';
            return (
              <li key={r.id} className={`booking-item ${r.status}`}>
                <img src={imageSrc} alt={room?.roomTitle || 'Phòng trọ'} className="room-image" />
                <div className="booking-info">
                  <div>
                    <strong>Phòng:</strong>{' '}
                    {room ? `${room.roomTitle} - ${room.location}` : 'Không rõ'}
                  </div>
                  <div>
                    <strong>Gia hạn dự kiến:</strong> {r.extendMonths} tháng
                  </div>
                  <div>
                    <strong>Ngày gửi:</strong>{' '}
                    {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                  <div>
                    <strong>Trạng thái:</strong>{' '}
                    <span className={`status ${r.status}`}>{r.status}</span>
                  </div>
                  {r.note && (
                    <div>
                      <strong>Ghi chú:</strong> {r.note}
                    </div>
                  )}
                  {r.status === 'pending' && (
                    <div className="actions">
                      <button onClick={() => handleCancel(r.id)}>Hủy yêu cầu</button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MyBookings;
