import React, { useEffect, useState } from 'react';
import '../../css/BookingRequests.css';

interface Booking {
  id: string;
  roomId: string;
  tenantId: string;
  bookingDate: string;
  endDate?: string;
  note?: string;
  status: 'pending' | 'accepted' | 'rejected';
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
}

interface Room {
  id: string;
  roomTitle: string;
  location: string;
}

const BookingRequests: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  // Load bookings and rooms from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingRes = await fetch('http://localhost:3000/bookings');
        const bookingData: Booking[] = await bookingRes.json();
        // Lọc lấy các booking có status pending
        const pendingBookings = bookingData.filter(b => b.status === 'pending');
        setBookings(pendingBookings);

        const roomsRes = await fetch('http://localhost:3000/rooms');
        const roomsData: Room[] = await roomsRes.json();
        setRooms(roomsData);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu booking hoặc phòng:', error);
      }
    };

    fetchData();
  }, []);

  // Hàm lấy thông tin phòng theo id
  const getRoomInfo = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    return room ? `${room.roomTitle} - ${room.location}` : 'Không tìm thấy phòng';
  };

  // Chấp nhận booking: update status và tạo hợp đồng (nếu có)
  const handleAccept = async (booking: Booking) => {
    try {
      // Cập nhật trạng thái booking
      await fetch(`http://localhost:3000/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'accepted' }),
      });

      // Tạo hợp đồng mới
      const newContract = {
        id: 'c' + Date.now(),
        tenantId: booking.tenantId,
        roomId: booking.roomId,
        startDate: booking.bookingDate,
        endDate: booking.endDate || '',
        status: 'accepted',
      };

      await fetch('http://localhost:3000/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContract),
      });

      // Cập nhật lại danh sách bookings ở trạng thái pending
      setBookings(prev => prev.filter(b => b.id !== booking.id));
    } catch (error) {
      console.error('Lỗi khi chấp nhận booking:', error);
      alert('Có lỗi xảy ra khi duyệt yêu cầu đặt phòng.');
    }
  };

  // Từ chối booking: update status
  const handleReject = async (bookingId: string) => {
    try {
      await fetch(`http://localhost:3000/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      });
      setBookings(prev => prev.filter(b => b.id !== bookingId));
    } catch (error) {
      console.error('Lỗi khi từ chối booking:', error);
      alert('Có lỗi xảy ra khi từ chối yêu cầu đặt phòng.');
    }
  };

  return (
    <div className="booking-requests-container">
      <h2>Yêu cầu đặt phòng chờ duyệt</h2>
      {bookings.length === 0 ? (
        <p>Không có yêu cầu nào.</p>
      ) : (
        <ul className="booking-list">
          {bookings.map(b => (
            <li key={b.id} className="booking-item">
              <div><strong>Phòng:</strong> {getRoomInfo(b.roomId)}</div>
              <div><strong>Ngày bắt đầu:</strong> {new Date(b.bookingDate).toLocaleDateString()}</div>
              {b.endDate && <div><strong>Ngày kết thúc:</strong> {new Date(b.endDate).toLocaleDateString()}</div>}
              <div><strong>Người thuê:</strong> {b.name || 'Không rõ'}</div>
              <div><strong>Email:</strong> {b.email || 'Không rõ'}</div>
              <div><strong>Ghi chú:</strong> {b.note || 'Không có'}</div>
              <button onClick={() => handleAccept(b)}>Chấp nhận</button>
              <button onClick={() => handleReject(b.id)}>Từ chối</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookingRequests;
