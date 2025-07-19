import React, { useState, useEffect, useMemo } from "react";
import { Home } from "lucide-react";
import { roomService } from "../../services/roomService";
import { useToast } from "../../hooks/useToast";
import type {
  Room,
  RoomFilters,
  RoomFormData,
  RoomStats,
} from "../../types/room";
import Toast from "./Toast";
import RoomDetailModal from "./RoomDetailModal";
import RoomModal from "./RoomModal";
import RoomCard from "./RoomCard";
import RoomStatsComponent from "./RoomStats";
import RoomFiltersComponent from "./RoomFilters";

const RoomManagement: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [stats, setStats] = useState<RoomStats>({
    total: 0,
    available: 0,
    rented: 0,
    maintenance: 0,
    byType: { single: 0, shared: 0, apartment: 0, studio: 0 },
    averagePrice: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [viewingRoom, setViewingRoom] = useState<Room | null>(null);
  const [filters, setFilters] = useState<RoomFilters>({
    search: "",
    district: "",
    roomType: "all",
    status: "all",
    minPrice: 0,
    maxPrice: 0,
    minArea: 0,
    maxArea: 0,
  });

  const { toasts, removeToast, success, error } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [roomsData, statsData] = await Promise.all([
        roomService.getRooms(),
        roomService.getRoomStats(),
      ]);
      setRooms(roomsData);
      setStats(statsData);
    } catch (err) {
      console.error(err);
      error("Lỗi", "Không thể tải dữ liệu phòng trọ");
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchesSearch =
        room.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        room.address.toLowerCase().includes(filters.search.toLowerCase()) ||
        room.district.toLowerCase().includes(filters.search.toLowerCase());

      const matchesDistrict =
        !filters.district || room.district === filters.district;
      const matchesRoomType =
        filters.roomType === "all" || room.roomType === filters.roomType;
      const matchesStatus =
        filters.status === "all" || room.status === filters.status;
      const matchesMinPrice =
        !filters.minPrice || room.price >= filters.minPrice;
      const matchesMaxPrice =
        !filters.maxPrice || room.price <= filters.maxPrice;
      const matchesMinArea = !filters.minArea || room.area >= filters.minArea;
      const matchesMaxArea = !filters.maxArea || room.area <= filters.maxArea;

      return (
        matchesSearch &&
        matchesDistrict &&
        matchesRoomType &&
        matchesStatus &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesMinArea &&
        matchesMaxArea
      );
    });
  }, [rooms, filters]);

  const handleAddRoom = () => {
    setEditingRoom(null);
    setIsModalOpen(true);
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setIsModalOpen(true);
  };

  const handleViewRoom = (room: Room) => {
    setViewingRoom(room);
    setIsDetailModalOpen(true);
  };

  const handleSubmitRoom = async (roomData: RoomFormData) => {
    try {
      setModalLoading(true);

      if (editingRoom) {
        await roomService.updateRoom(editingRoom.id, roomData);
        success("Thành công", "Cập nhật phòng trọ thành công");
      } else {
        await roomService.createRoom(roomData);
        success("Thành công", "Thêm phòng trọ thành công");
      }

      await loadData();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      error("Lỗi", "Không thể thực hiện thao tác");
    } finally {
      setModalLoading(false);
    }
  };

 const handleDeleteRoom = async (id: number) => {
  const room = rooms.find((r) => r.id === id);
  if (!room) return;

  const confirmMessage = `⚠️ XÁC NHẬN XÓA PHÒNG ⚠️

Phòng: ${room.title}
Địa chỉ: ${room.address}, ${room.district}
Giá: ${new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(room.price)}

❌ CẢNH BÁO: Hành động này sẽ XÓA VĨNH VIỄN phòng khỏi hệ thống!

Bạn có CHẮC CHẮN muốn tiếp tục?`;

  if (!window.confirm(confirmMessage)) return;

  try {
    await roomService.deleteRoom(id); // 🧩 API xóa phòng
    success(
      "✅ Đã xóa thành công",
      `Phòng "${room.title}" đã được xóa khỏi hệ thống`
    );
    await loadData(); // 🔁 Load lại danh sách phòng
  } catch (err) {
    error("❌ Lỗi xóa phòng", "Không thể xóa phòng trọ. Vui lòng thử lại!");
    console.error(err);
  }
};


  const handleStatusChange = async (id: number, status: Room["status"]) => {
    try {
      await roomService.updateRoomStatus(id, status);
      success("Thành công", "Cập nhật trạng thái thành công");
      await loadData();
    } catch (err) {
      console.error(err);
      error("Lỗi", "Không thể cập nhật trạng thái");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 text-white rounded-lg">
              <Home size={24} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              🏠 Quản lý phòng trọ
            </h1>
          </div>
          <p className="text-gray-600">
            Quản lý toàn bộ phòng trọ trong hệ thống - thêm, sửa, xóa và theo
            dõi trạng thái
          </p>
        </div>

        <RoomStatsComponent stats={stats} loading={loading} />

        <RoomFiltersComponent
          filters={filters}
          onFiltersChange={setFilters}
          onAddRoom={handleAddRoom}
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 rounded flex-1"></div>
                    <div className="h-6 bg-gray-200 rounded flex-1"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center py-12">
            <Home size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy phòng nào
            </h3>
            <p className="text-gray-600 mb-4">
              Không có phòng nào phù hợp với bộ lọc hiện tại hoặc chưa có phòng
              trong hệ thống
            </p>
            <button
              onClick={handleAddRoom}
              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200 font-medium"
            >
              Thêm phòng đầu tiên vào hệ thống
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onEdit={handleEditRoom}
                onDelete={handleDeleteRoom}
                onStatusChange={handleStatusChange}
                onView={handleViewRoom}
              />
            ))}
          </div>
        )}

        <RoomModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmitRoom}
            onDelete={handleDeleteRoom} // 👈 Thêm dòng này
          room={editingRoom}
          loading={modalLoading}
        />

        <RoomDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          room={viewingRoom}
        />
      </div>

      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={removeToast} />
        ))}
      </div>
    </div>
  );
};

export default RoomManagement;
