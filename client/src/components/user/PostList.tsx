import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PostCard from './PostCard';

interface Room {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  address: string;
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
    fetch('http://localhost:3000/rooms')
      .then((res) => res.json())
      .then((data) => {
        setRooms(data);
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
          to={`/posts/${room.id}`}
          key={room.id}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <PostCard {...room} />
        </Link>
      ))}
    </div>
  );
};

export default PostList;
