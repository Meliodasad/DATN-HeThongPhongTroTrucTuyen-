import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../../css/UserProfile.css';

interface User {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  zalo: string;
  joinedDate: string;
  status: string;
}

interface Room {
  id: string;
  title: string;
  price: string;
  area: string;
  address: string;
  images: string[];
  ownerId: string;
  owner?: User;
}

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [userRooms, setUserRooms] = useState<Room[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, roomsRes] = await Promise.all([
          fetch(`http://localhost:3000/users/${userId}`),
          fetch(`http://localhost:3000/rooms?ownerId=${userId}`)
        ]);
        const userData = await userRes.json();
        const roomsData = await roomsRes.json();

        setUser(userData);
        setUserRooms(roomsData);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  if (!user) return <div className="user-profile-container">Người dùng không tồn tại.</div>;

  return (
    <div className="user-profile-container">
      <div className="profile-card">
        <img src={user.avatar} alt="avatar" className="avatar-large" />

        <div className="info">
          <h2>{user.name}</h2>
          <p className="sub-info">{user.status} • Tham gia từ: {user.joinedDate}</p>

          <div className="contact">
            <p><strong>📞 Điện thoại:</strong> <a href={`tel:${user.phone}`}>{user.phone}</a></p>
            <p><strong>💬 Zalo:</strong> <a href={user.zalo} target="_blank" rel="noopener noreferrer">Nhắn Zalo</a></p>
          </div>
        </div>
      </div>

      <Link to={`/edit-profile/${user.id}`} className="edit-profile-button">
        Chỉnh sửa thông tin
      </Link>

      {userRooms.length > 0 && (
        <div className="user-posts">
          <h3>Phòng trọ của {user.name}</h3>
          <div className="post-list">
            {userRooms.map(room => (
              <div key={room.id} className="post-card1">
                <img src={room.images?.[0]} alt="thumbnail" />
                <div className="post-info1">
                  <h4>{room.title}</h4>
                  <p>{room.price} • {room.area}</p>
                  <p>{room.address}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
