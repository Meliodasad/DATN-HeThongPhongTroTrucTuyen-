import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { hostService } from "../services/hostService";

import RoomDetail from "./RoomDetail";
import { Home, CheckCircle, Users, DollarSign, Plus, Eye } from "lucide-react";
import StatCard from "../../components/StatCard";
import RoomCard from "../../components/RoomCard";
import RentalRequestCard from "../../components/RentalRequestCard";

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
  status: string;
  tenant?: {
    name: string;
    phone: string;
    avatar: string;
  };
}

interface RentalRequest {
  id: number;
  tenantName: string;
  phone: string;
  email: string;
  desiredRoomId: string;
  status: string;
  message: string;
  submittedAt: string;
  avatar: string;
}

interface Statistics {
  totalRooms: number;
  availableRooms: number;
  rentedRooms: number;
  totalRevenue: number;
}

const Dashboard = () => {
  const [statistics, setStatistics] = useState<Statistics>({
    totalRooms: 0,
    availableRooms: 0,
    rentedRooms: 0,
    totalRevenue: 0
  });
  const [rooms, setRooms] = useState<Room[]>([]);
  const [rentalRequests, setRentalRequests] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, roomsRes, requestsRes] = await Promise.all([
        hostService.getStatistics(),
        hostService.getRooms(),
        hostService.getRentalRequests()
      ]);

      setStatistics(statsRes.data);
      setRooms(roomsRes.data.map((room: any) => ({
        ...room,
        status: room.tenant ? "Đã cho thuê" : "Còn trống"
      })));
      setRentalRequests(requestsRes.data.map((req: any) => ({
        ...req,
        submittedAt: new Date().toLocaleDateString('vi-VN') + " - " + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        avatar: "https://i.pravatar.cc/100?img=" + req.id
      })));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteRoom = async (id: number) => {
    const confirm = window.confirm("❗Bạn có chắc chắn muốn xóa phòng này?");
    if (!confirm) return;
    
    try {
      await hostService.deleteRoom(id);
      setRooms(rooms.filter(room => room.id !== id));
    } catch (err) {
      alert("❌ Lỗi khi xóa phòng!");
      console.error(err);
    }
  };

  const handleApproveRequest = async (request: RentalRequest) => {
    const confirm = window.confirm("Bạn có chắc muốn duyệt và tạo hợp đồng?");
    if (!confirm) return;

    try {
      await hostService.approveRentalRequest(request.id.toString());
      alert("Đã duyệt yêu cầu. Chuyển sang trang tạo hợp đồng.");
      navigate("/host/create-contract", {
        state: {
          tenantName: request.tenantName,
          phone: request.phone,
          roomId: request.desiredRoomId,
        },
      });
    } catch (error) {
      console.error("Error approving request:", error);
      alert("Lỗi khi duyệt yêu cầu!");
    }
  };

  const handleRejectRequest = async (id: number) => {
    const confirm = window.confirm("Bạn có chắc muốn từ chối?");
    if (!confirm) return;

    try {
      await hostService.rejectRentalRequest(id.toString());
      setRentalRequests(rentalRequests.filter(req => req.id !== id));
      alert("Đã từ chối yêu cầu.");
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Lỗi khi từ chối yêu cầu!");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Chào Nguyễn Thị Mai!
          </h1>
          <p className="text-gray-600">
            Quản lý phòng trọ và theo dõi doanh thu của bạn
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Tổng phòng"
            value={statistics.totalRooms}
            icon={Home}
            iconColor="text-blue-600"
            bgColor="bg-blue-100"
          />
          <StatCard
            title="Đã cho thuê"
            value={statistics.rentedRooms}
            icon={CheckCircle}
            iconColor="text-green-600"
            bgColor="bg-green-100"
          />
          <StatCard
            title="Còn trống"
            value={statistics.availableRooms}
            icon={Users}
            iconColor="text-yellow-600"
            bgColor="bg-yellow-100"
          />
          <StatCard
            title="Doanh thu/tháng"
            value={`${statistics.totalRevenue.toLocaleString()}đ`}
            icon={DollarSign}
            iconColor="text-purple-600"
            bgColor="bg-purple-100"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rooms Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Phòng trọ của bạn
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate("/host/room-list")}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  <Eye size={16} />
                  <span>Xem tất cả</span>
                </button>
                <button
                  onClick={() => navigate("/host/create-room")}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                >
                  <Plus size={16} />
                  <span>Thêm phòng</span>
                </button>
              </div>
            </div>

            {rooms.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Bạn chưa có phòng nào</p>
                <button
                  onClick={() => navigate("/host/create-room")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Tạo phòng đầu tiên
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rooms.slice(0, 4).map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    onViewDetail={() => setSelectedRoom(room)}
                    onEdit={() => navigate(`/host/update-room/${room.id}`)}
                    onDelete={() => handleDeleteRoom(room.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Rental Requests Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Yêu cầu thuê phòng
              </h2>
              <button
                onClick={() => navigate("/host/rental-request")}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                <Eye size={16} />
                <span>Xem tất cả</span>
              </button>
            </div>

            {rentalRequests.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                <Users className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Không có yêu cầu mới</p>
              </div>
            ) : (
              <div className="space-y-4">
                {rentalRequests.slice(0, 3).map((request) => (
                  <RentalRequestCard
                    key={request.id}
                    request={request}
                    onApprove={() => handleApproveRequest(request)}
                    onReject={() => handleRejectRequest(request.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedRoom && (
        <RoomDetail 
          room={selectedRoom} 
          onClose={() => setSelectedRoom(null)} 
        />
      )}
    </div>
  );
};

export default Dashboard;