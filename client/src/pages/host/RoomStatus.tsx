// 📁 src/pages/host/RoomStatus.tsx
// Quản lý trạng thái phòng
import { useEffect, useState } from "react";
import { hostService } from "../../services/hostService";

interface RoomStatus {
  id: number;
  name: string;
  status: string;
}

const RoomStatus = () => {
  const [roomStatus, setRoomStatus] = useState<RoomStatus[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRooms = () => {
    setLoading(true);
    hostService
      .getRoomStatus()
      .then((res) => setRoomStatus(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleStatusChange = (roomId: number, newStatus: string) => {
    hostService
      .updateRoomStatus(roomId, newStatus)
      .then(() => {
        setRoomStatus((prev) =>
          prev.map((room) =>
            room.id === roomId ? { ...room, status: newStatus } : room
          )
        );
      })
      .catch(() => alert("Cập nhật thất bại!"));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-indigo-600 mb-2 text-center">
        🏠 Quản lý trạng thái phòng
      </h2>
      <p className="text-center text-gray-500 mb-6">
        Đánh dấu phòng đang trống, đã cho thuê hoặc đang sửa chữa
      </p>

      {loading ? (
        <p className="text-center text-gray-500">Đang tải danh sách phòng...</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white border border-gray-200 text-sm">
            <thead className="bg-indigo-100 text-indigo-700">
              <tr>
                <th className="p-3 text-left">📛 Tên phòng</th>
                <th className="p-3 text-left">📌 Trạng thái hiện tại</th>
                <th className="p-3 text-left">⚙️ Thay đổi trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {roomStatus.map((room) => (
                <tr key={room.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{room.name}</td>
                  <td className="p-3 text-gray-600">{room.status}</td>
                  <td className="p-3">
                    <select
                      value={room.status}
                      onChange={(e) =>
                        handleStatusChange(room.id, e.target.value)
                      }
                      className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Trống">Trống</option>
                      <option value="Đã cho thuê">Đã cho thuê</option>
                      <option value="Đang sửa chữa">Đang sửa chữa</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RoomStatus;
