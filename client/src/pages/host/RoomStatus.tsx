// 📁 src/pages/host/RoomStatus.tsx
// Trang quản lý trạng thái phòng của chủ nhà
import { useEffect, useState } from "react";
import { hostService } from "../../services/hostService";

interface Room {
  id: number;
  name: string;
  status: string;
}

const RoomStatus = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRooms = () => {
    setLoading(true);
    hostService
      .getRooms()
      .then((res) => setRooms(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleStatusChange = (roomId: number, newStatus: string) => {
    hostService
      .updateRoomStatus(roomId, newStatus)
      .then(() => {
        setRooms((prev) =>
          prev.map((room) =>
            room.id === roomId ? { ...room, status: newStatus } : room
          )
        );
      })
      .catch(() => alert("Cập nhật thất bại!"));
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <h2>Quản lý trạng thái phòng</h2>
      <p>Đánh dấu phòng đang trống, đã cho thuê, đang sửa chữa,...</p>
      {loading ? (
        <p>Đang tải danh sách phòng...</p>
      ) : (
        <table style={{ width: "100%", marginTop: 20 }}>
          <thead>
            <tr>
              <th>Tên phòng</th>
              <th>Trạng thái</th>
              <th>Thay đổi trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id}>
                <td>{room.name}</td>
                <td>{room.status}</td>
                <td>
                  <select
                    value={room.status}
                    onChange={(e) =>
                      handleStatusChange(room.id, e.target.value)
                    }
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
      )}
    </div>
  );
};

export default RoomStatus;
