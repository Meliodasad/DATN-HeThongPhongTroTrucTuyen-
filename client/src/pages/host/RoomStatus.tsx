// 📁 src/pages/host/RoomStatus.tsx
// Quản lý trạng thái phòng
import { useEffect, useState } from "react";
import { hostService } from "../../services/hostService";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";

interface RoomStatus {
  id: number;
  name: string;
  status: string;
}

const RoomStatus = () => {
  const [roomStatus, setRoomStatus] = useState<RoomStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await hostService.getRoomStatus();
      setRoomStatus(res.data);
    } catch (error) {
      console.error("Error fetching room status:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleStatusChange = async (roomId: number, newStatus: string) => {
    try {
      await hostService.updateRoomStatus(roomId, newStatus);
      setRoomStatus((prev) =>
        prev.map((room) =>
          room.id === roomId ? { ...room, status: newStatus } : room
        )
      );
    } catch (error) {
      alert("Cập nhật thất bại!");
      console.error(error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Đã cho thuê":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "Còn trống":
      case "Trống":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "Đang sửa chữa":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đã cho thuê":
        return "bg-green-100 text-green-800";
      case "Còn trống":
      case "Trống":
        return "bg-yellow-100 text-yellow-800";
      case "Đang sửa chữa":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải danh sách phòng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Quản lý trạng thái phòng</h1>
        <p className="text-gray-600">
          Đánh dấu phòng đang trống, đã cho thuê hoặc đang sửa chữa
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {roomStatus.length === 0 ? (
          <div className="p-12 text-center">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không có phòng nào
            </h3>
            <p className="text-gray-500">
              Hãy tạo phòng đầu tiên để quản lý trạng thái
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên phòng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái hiện tại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thay đổi trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {roomStatus.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(room.status)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {room.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(room.status)}`}>
                        {room.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={room.status}
                        onChange={(e) =>
                          handleStatusChange(room.id, e.target.value)
                        }
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
    </div>
  );
};

export default RoomStatus;