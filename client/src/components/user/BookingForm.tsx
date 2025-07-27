import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../css/BookingForm.css';

const BookingForm = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [bookingDate, setBookingDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [note, setNote] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const currentUserId = 'u1'; 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newBooking = {
      id: `b${Date.now()}`,
      roomId: roomId || '',
      tenantId: currentUserId,
      bookingDate,
      endDate,
      note,
      name,
      phone,
      email,
      address,
      status: 'pending'
    };

    try {
      const res = await fetch('http://localhost:3000/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newBooking)
      });

      if (!res.ok) {
        throw new Error('Gửi booking thất bại');
      }

      alert('Gửi yêu cầu thuê thành công!');
      navigate('/my-bookings');
    } catch (error) {
      console.error('Lỗi gửi booking:', error);
      alert('Có lỗi khi gửi yêu cầu thuê.');
    }
  };

  return (
    <div className="booking-form-container">
      <h2>Đặt phòng</h2>
      <form onSubmit={handleSubmit}>
        <label>Họ tên:</label>
        <input value={name} onChange={e => setName(e.target.value)} required />

        <label>Số điện thoại:</label>
        <input value={phone} onChange={e => setPhone(e.target.value)} required />

        <label>Email:</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />

        <label>Địa chỉ hiện tại:</label>
        <input value={address} onChange={e => setAddress(e.target.value)} required />

        <label>Ngày thuê mong muốn:</label>
        <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} required />

        <label>Ngày trả phòng (dự kiến):</label>
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />

        <label>Ghi chú:</label>
        <textarea value={note} onChange={e => setNote(e.target.value)} rows={4} />

        <button type="submit">Gửi yêu cầu</button>
      </form>
    </div>
  );
};

export default BookingForm;
