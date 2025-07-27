import React, { useEffect, useState } from 'react';
import db from '../../data/db';
import '../../css/MyBookings.css';

interface Booking {
  id: string;
  roomId: string;
  tenantId: string;
  bookingDate: string;
  note: string;
  status: 'pending' | 'accepted' | 'rejected';
  name: string;
  phone: string;
  email: string;
  address: string;
}

interface MyBookingsProps {
  tenantId: string;
}

const MyBookings: React.FC<MyBookingsProps> = ({ tenantId }) => {
  const [myBookings, setMyBookings] = useState<Booking[]>([]);

  useEffect(() => {
    loadBookings();
  }, [tenantId]);

  const loadBookings = () => {
    const allBookings: Booking[] = JSON.parse(localStorage.getItem('bookings') || '[]');
    const userBookings = allBookings.filter(
      b => b.tenantId === tenantId && b.status !== 'rejected' 
    );
    setMyBookings(userBookings);
  };

  const getRoomInfo = (roomId: string) => {
    const post = db.posts.find(p => p.id === roomId);
    return post ? `${post.title} - ${post.address}` : 'Phòng không tồn tại';
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa yêu cầu này?')) {
      const allBookings: Booking[] = JSON.parse(localStorage.getItem('bookings') || '[]');
      const updatedBookings = allBookings.filter(b => b.id !== id);
      localStorage.setItem('bookings', JSON.stringify(updatedBookings));
      loadBookings();
    }
  };

  const handleEdit = (id: string) => {
    const allBookings: Booking[] = JSON.parse(localStorage.getItem('bookings') || '[]');
    const bookingToEdit = allBookings.find(b => b.id === id);
    if (!bookingToEdit) return;

    const name = prompt('Họ tên:', bookingToEdit.name);
    const phone = prompt('Số điện thoại:', bookingToEdit.phone);
    const email = prompt('Email:', bookingToEdit.email);
    const address = prompt('Địa chỉ:', bookingToEdit.address);
    const note = prompt('Ghi chú:', bookingToEdit.note);

    if (!name || !phone || !email || !address) {
      alert('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    const updatedBookings = allBookings.map(b =>
      b.id === id ? { ...b, name, phone, email, address, note: note || '' } : b
    );

    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    loadBookings();
  };

  return (
    <div className="my-bookings-container">
      <h2>Yêu cầu đã gửi</h2>
      {myBookings.length === 0 ? (
        <p>Bạn chưa gửi yêu cầu đặt phòng nào.</p>
      ) : (
        <ul className="booking-list">
          {myBookings.map(b => (
            <li key={b.id} className={`booking-item ${b.status}`}>
              <div><strong>Phòng:</strong> {getRoomInfo(b.roomId)}</div>
              <div><strong>Ngày thuê:</strong> {new Date(b.bookingDate).toLocaleDateString()}</div>
              <div><strong>Ghi chú:</strong> {b.note}</div>
              <div><strong>Trạng thái:</strong> <span className={`status ${b.status}`}>{b.status}</span></div>
              <div><strong>Họ tên:</strong> {b.name}</div>
              <div><strong>SĐT:</strong> {b.phone}</div>
              <div><strong>Email:</strong> {b.email}</div>
              <div><strong>Địa chỉ:</strong> {b.address}</div>

              {b.status === 'pending' && (
                <div className="actions">
                  <button onClick={() => handleEdit(b.id)}>Sửa</button>
                  <button onClick={() => handleDelete(b.id)}>Xóa</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyBookings;
