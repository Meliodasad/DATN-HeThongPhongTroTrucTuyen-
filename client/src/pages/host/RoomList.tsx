// ../client/src/pages/host/RoomList.tsx
// Danh sách phòng trọ
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { hostService } from "../../services/hostService";
import RoomDetail from "./RoomDetail";

interface Room {
  id: number;
  code: string;
  area: number;
  price: number;
  utilities: string;
  maxPeople: number;
  image: string;
  description?: string;
  location?: string;
  deposit?: string;
  electricity?: string;
  tenant?: {
    name: string;
    phone: string;
    avatar: string;
  };
}

export default function RoomList() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const navigate = useNavigate();

  const fetchRooms = () => {
    hostService.getRooms().then((res) => setRooms(res.data));
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleDelete = async (id: number) => {
    const confirm = window.confirm("❗Bạn có chắc chắn muốn xóa phòng này?");
    if (!confirm) return;
    try {
      await hostService.deleteRoom(id);
      fetchRooms();
    } catch (err) {
      alert("❌ Lỗi khi xóa phòng!");
      console.error(err);
    }
  };

  return (
    <div className="w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">📋 Danh sách phòng trọ</h1>
        <button
          onClick={() => navigate("/host/create-room")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ➕ Tạo phòng
        </button>
      </div>

      {rooms.length === 0 ? (
        <p className="text-center text-gray-500">Không có phòng nào.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white shadow-lg rounded-xl overflow-hidden">
              <img src={room.image} alt={room.code} className="w-full h-48 object-cover" />
              <div className="p-4 space-y-2">
                <h2 className="text-xl font-semibold">{room.code}</h2>
                <p>Giá: {room.price.toLocaleString()} VNĐ</p>
                <p>Diện tích: {room.area} m²</p>
                <p>Tiện ích: {room.utilities}</p>
                <div className="flex justify-between pt-4 gap-2">
                  <button
                    onClick={() => setSelectedRoom(room)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Chi tiết
                  </button>
                  <button
                    onClick={() => navigate(`/host/update-room/${room.id}`)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(room.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedRoom && (
        <RoomDetail room={selectedRoom} onClose={() => setSelectedRoom(null)} />
      )}
    </div>
  );
}
