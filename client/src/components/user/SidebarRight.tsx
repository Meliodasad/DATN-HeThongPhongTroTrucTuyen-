import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../css/SidebarRight.css';

interface Room {
  id: string;
  title: string;
  price: string;
  images: string[];
  postedDate: string;
}

const SidebarRight = () => {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('http://localhost:3000/rooms');
        const data = await response.json();
        setRooms(data.slice().reverse().slice(0, 5)); // Lấy 5 bài mới nhất
      } catch (error) {
        console.error('Lỗi khi tải tin mới:', error);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="sidebar-container">
      <div className="sidebar-section">
        <h4>Xem khoảng giá</h4>
        <div className="price-area">
          <div>
            <p><span>›</span> <a href="#">Dưới 1 triệu</a></p>
            <p><span>›</span> <a href="#">Từ 2 - 3 triệu</a></p>
            <p><span>›</span> <a href="#">Từ 5 - 7 triệu</a></p>
            <p><span>›</span> <a href="#">Từ 10 - 15 triệu</a></p>
          </div>
          <div>
            <p><span>›</span> <a href="#">Từ 1 - 2 triệu</a></p>
            <p><span>›</span> <a href="#">Từ 3 - 5 triệu</a></p>
            <p><span>›</span> <a href="#">Từ 7 - 10 triệu</a></p>
            <p><span>›</span> <a href="#">Trên 15 triệu</a></p>
          </div>
        </div>
      </div>

      <div className="sidebar-section">
        <h4>Xem diện tích</h4>
        <div className="area-area">
          <div>
            <p><span>›</span> <a href="#">Dưới 20 m²</a></p>
            <p><span>›</span> <a href="#">Từ 30 - 50m²</a></p>
            <p><span>›</span> <a href="#">Từ 70 - 90m²</a></p>
          </div>
          <div>
            <p><span>›</span> <a href="#">Từ 20 - 30m²</a></p>
            <p><span>›</span> <a href="#">Từ 50 - 70m²</a></p>
            <p><span>›</span> <a href="#">Trên 90m²</a></p>
          </div>
        </div>
      </div>

      <p className="latest-posts-title">Tin mới đăng</p>
      {rooms.map((room) => (
        <Link
          key={room.id}
          to={`/posts/${room.id}`}
          className="post-item"
        >
          <img
            src={room.images?.[0]}
            alt={room.title}
          />
          <div className="post-info">
            <div>{room.title}</div>
            <div>{room.price}</div>
            <div>{room.postedDate}</div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SidebarRight;
