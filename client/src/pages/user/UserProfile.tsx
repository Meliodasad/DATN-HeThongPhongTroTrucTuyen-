import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../../css/UserProfile.css';

interface User {
  id: string;
  name: string;
  phone: string;
  zalo?: string;
  avatar?: string;
  role?: string;
}

interface Room {
  id: string;
  title: string;
  price: number;
  address: string;
  images: string;
  hostId: string;
}

const UserProfile = () => {
  const { userId } = useParams();
  const [host, setHost] = useState<User | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, roomsRes] = await Promise.all([
          axios.get(`http://localhost:3000/users/${userId}`),
          axios.get('http://localhost:3000/rooms'),
        ]);

        setHost(userRes.data);
        const hostRooms = roomsRes.data.filter((room: Room) => room.hostId === userId);
        setRooms(hostRooms);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      }
    };

    fetchData();
  }, [userId]);

  if (!host) {
    return <p>Đang tải thông tin người dùng...</p>;
  }

  return (
    <div className="user-profile-container">
      <div className="user-info">
        <div className="user-info-left">
          <img src={host.avatar || '/default-avatar.png'} alt={host.name} className="avatar" />
          <div className="user-info-text">
            <h2>Tên :   {host.name}</h2>
            <p className="role">Role :    {host.role || 'Chủ trọ'}</p>
            <div className="contact-info">
              <p> <a href={`tel:${host.phone}`}>{host.phone}</a></p>
              {host.zalo && (
                <p> <a href={host.zalo} target="_blank" rel="noopener noreferrer">Nhắn Zalo</a></p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="user-rooms">
        <h3>Các phòng đã đăng</h3>
        <div className="room-list">
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <Link to={`/posts/${room.id}`} key={room.id} className="post-card1-link">
                <div className="post-card1">
                  <img
                    src={(room.images?.[0]) || '/default-thumbnail.jpg'}
                    alt={room.title}
                    className="thumbnail"
                  />
                  <div className="details">
                    <h4>{room.title}</h4>
                    <p className="price">{room.price.toLocaleString()} VNĐ/tháng</p>
                    <p className="address">{room.address}</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p>Người dùng này chưa đăng phòng nào.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
