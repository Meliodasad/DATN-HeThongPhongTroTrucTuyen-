import React, { useEffect, useState } from 'react';
import db from '../../data/db';
import '../../css/BookingRequests.css';

interface Booking {
  id: string;
  roomId: string;
  tenantId: string;
  bookingDate: string;
  endDate: string;
  note: string;
  status: 'pending' | 'accepted' | 'rejected';
  name: string;
  phone: string;
  email: string;
  address: string;
}

interface Contract {
  id: string;
  tenantId: string;
  postId: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'accepted' | 'rejected';
}

const BookingRequests = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const allBookings: Booking[] = JSON.parse(localStorage.getItem('bookings') || '[]');
    const pending = allBookings.filter(b => b.status === 'pending');
    setBookings(pending);
  }, []);

  const handleAccept = (booking: Booking) => {
    const stored = localStorage.getItem('bookings');
    const allBookings: Booking[] = stored ? JSON.parse(stored) : [];

    const updatedBookings = allBookings.map(b =>
      b.id === booking.id ? { ...b, status: 'accepted' } : b
    );
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));

    const pendingBookings = updatedBookings.filter(b => b.status === 'pending') as Booking[];
    setBookings(pendingBookings);

    const newContract: Contract = {
      id: 'c' + Date.now(),
      tenantId: booking.tenantId,
      postId: booking.roomId,
      startDate: booking.bookingDate,
      endDate: booking.endDate || '',
      status: 'accepted',
    };

    const storedContracts = localStorage.getItem('contracts');
    const contracts: Contract[] = storedContracts ? JSON.parse(storedContracts) : [];

    const exists = contracts.some(
      c => c.tenantId === booking.tenantId && c.postId === booking.roomId
    );

    if (!exists) {
      contracts.push(newContract);
      localStorage.setItem('contracts', JSON.stringify(contracts));
      alert(' Đã chấp nhận yêu cầu và tạo hợp đồng!');
    } else {
      alert(' Hợp đồng đã tồn tại cho yêu cầu này.');
    }
  };

  const handleReject = (bookingId: string) => {
    const stored = localStorage.getItem('bookings');
    const allBookings: Booking[] = stored ? JSON.parse(stored) : [];

    const updatedBookings = allBookings.map(b =>
      b.id === bookingId ? { ...b, status: 'rejected' } : b
    );
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));

    const pendingBookings = updatedBookings.filter(b => b.status === 'pending') as Booking[];
    setBookings(pendingBookings);
  };

  const getRoomInfo = (roomId: string) => {
    const post = db.posts.find(p => p.id === roomId);
    return post ? `${post.title} - ${post.address}` : 'Không tìm thấy phòng';
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
              <div><strong>Ngày kết thúc:</strong> {new Date(b.endDate).toLocaleDateString()}</div>
              <div><strong>Người thuê:</strong> {b.name}</div>
              <div><strong>Email:</strong> {b.email}</div>
              <div><strong>Ghi chú:</strong> {b.note}</div>
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
