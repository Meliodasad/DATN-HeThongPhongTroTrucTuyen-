import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PostCard from './PostCard';
import { headers } from '../../utils/config';
import { useSearch } from '../../contexts/SearchContext';

interface Room {
   _id: string;
  roomId: string;
  roomTitle: string;
  description: string;
  price: { value: number; unit: string };
  images: string[];
  location: string;
  area: number;
  status: string;
  roomType: string;
  utilities: string[];
  createdAt: string;
  updatedAt: string;
}


const PostList = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const { searchRoom } = useSearch();

  useEffect(() => {
    const params = new URLSearchParams(searchRoom as any).toString();
    fetch(`http://localhost:3000/rooms?${params}`, { headers })
      .then((res) => res.json())
      .then((data) => {
        setRooms(data?.data?.rooms || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Lỗi khi tải danh sách phòng:', error);
        setLoading(false);
      });
  }, [searchRoom]);

  if (loading) return <div>Đang tải danh sách phòng...</div>;

  return (
    <div className="grid">
      {rooms.map((room) => (
        <Link
          to={`/posts/${room.roomId}`}
          key={room.roomId}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <PostCard
          title={room.roomTitle}
          price={room.price}
          area={room.area}
          address={room.location}
          images={room.images}
          description={room.description}
          status={room.status}
          roomType={room.roomType}
          utilities={room.utilities}
          createdAt={room.createdAt}
        />

        </Link>
      ))}
    </div>
  );
};

export default PostList;
