import React, { useEffect, useState } from 'react';
import '../../css/MyBookings.css';

interface Booking {
  id: string;
  roomId: string;
  tenantId: string;
  bookingDate: string;
  endDate?: string;
  note: string;
  status: 'pending' | 'accepted' | 'rejected';
  name: string;
  phone: string;
  email: string;
  address: string;
}

interface Room {
  id: string;
  roomTitle: string;
  location: string;
}

interface MyBookingsProps {
  tenantId: string;
}

const MyBookings: React.FC<MyBookingsProps> = ({ tenantId }) => {
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tenantId) return;

    const fetchRooms = async () => {
      try {
        const res = await fetch('http://localhost:3000/rooms');
        if (!res.ok) throw new Error('Lỗi tải phòng');
        const data: Room[] = await res.json();
        setRooms(data);
      } catch (error) {
        console.error('Lỗi lấy dữ liệu phòng:', error);
      }
    };

    const fetchBookings = async () => {
      try {
        const res = await fetch(`http://localhost:3000/bookings?tenantId=${tenantId}`);
        if (!res.ok) throw new Error('Lỗi tải đặt phòng');
        const data: Booking[] = await res.json();
        setMyBookings(data);
      } catch (error) {
        console.error('Lỗi lấy dữ liệu đặt phòng:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
    fetchBookings();
  }, [tenantId]);

  const getRoomInfo = (roomId: string) => {
    return rooms.find(room => room.id === roomId);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa yêu cầu này?')) return;

    try {
      const res = await fetch(`http://localhost:3000/bookings/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setMyBookings(prev => prev.filter(b => b.id !== id));
      } else {
        alert('Xóa thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi xóa yêu cầu:', error);
      alert('Xóa thất bại');
    }
  };

  const handleEdit = async (id: string) => {
    const bookingToEdit = myBookings.find(b => b.id === id);
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

    try {
      const res = await fetch(`http://localhost:3000/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, address, note: note || '' }),
      });
      if (res.ok) {
        const updatedBooking = await res.json();
        setMyBookings(prev =>
          prev.map(b => (b.id === id ? updatedBooking : b))
        );
      } else {
        alert('Cập nhật thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật yêu cầu:', error);
      alert('Cập nhật thất bại');
    }
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;

  return (
    <div className="my-bookings-container">
      <h2>Danh sách yêu cầu đặt phòng</h2>
      {myBookings.length === 0 ? (
        <p>Bạn chưa có yêu cầu đặt phòng nào.</p>
      ) : (
        <ul className="booking-list">
          {myBookings.map(b => {
            const room = getRoomInfo(b.roomId);
            return (
              <li key={b.id} className={`booking-item ${b.status}`}>
                <div>
                  <strong>Phòng:</strong>{' '}
                  {room ? `${room.roomTitle} - ${room.location}` : 'Không tìm thấy phòng'}
                </div>
                <div>
                  <strong>Ngày gửi:</strong>{' '}
                  {new Date(b.bookingDate).toLocaleDateString()}
                </div>
                {b.endDate && (
                  <div>
                    <strong>Ngày kết thúc:</strong>{' '}
                    {new Date(b.endDate).toLocaleDateString()}
                  </div>
                )}
                <div>
                  <strong>Ghi chú:</strong> {b.note}
                </div>
                <div>
                  <strong>Trạng thái:</strong>{' '}
                  <span className={`status ${b.status}`}>{b.status}</span>
                </div>
                <div>
                  <strong>Họ tên:</strong> {b.name}
                </div>
                <div>
                  <strong>SĐT:</strong> {b.phone}
                </div>
                <div>
                  <strong>Email:</strong> {b.email}
                </div>
                <div>
                  <strong>Địa chỉ:</strong> {b.address}
                </div>

                {b.status === 'pending' && (
                  <div className="actions">
                    <button onClick={() => handleEdit(b.id)}>Sửa</button>
                    <button onClick={() => handleDelete(b.id)}>Xóa</button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MyBookings;
