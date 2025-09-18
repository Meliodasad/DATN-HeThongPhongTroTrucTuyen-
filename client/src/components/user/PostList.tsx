import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PostCard from './PostCard';
import { headers } from '../../utils/config';

interface Room {
  id: string;
  roomId: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  address: string;
  area?: number;
  author: {
    id: string;
    fullName: string;
    phone: string;
    avatarUrl?: string;
  };
}

const PostList = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/rooms', { headers })
      .then((res) => res.json())
      .then((data) => {
        setRooms(data?.data?.rooms || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Lỗi khi tải danh sách phòng:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Đang tải danh sách phòng...</div>;

  return (
    <div className="grid">
      {rooms.map((room) => (
        <Link
          to={`/posts/${room.roomId}`}
          key={room.roomId}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <PostCard {...room} area={room.area ?? 0} />
        </Link>
      ))}
    </div>
  );
};

export default PostList;
