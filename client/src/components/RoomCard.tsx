// src/components/RoomCard.tsx
// Thẻ hiển thị thông tin phòng trọ
import { MapPin, Users, Zap } from "lucide-react";

interface RoomCardProps {
  room: {
    id: number;
    code: string;
    roomId?: string;
    area: number;
    price: number;
    utilities: string;
    maxPeople: number;
    image: string;
    status: string;
    tenant?: {
      name: string;
      phone: string;
      avatar: string;
    };
  };
  onViewDetail: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const RoomCard = ({ room, onViewDetail, onEdit, onDelete }: RoomCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đã cho thuê":
        return "bg-green-100 text-green-800";
      case "Còn trống":
        return "bg-yellow-100 text-yellow-800";
      case "Đang sửa chữa":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const displayCode = room.roomId || room.code || `P${room.id}`;
  const displayUtilities = room.utilities || "Chưa có thông tin";
  const displayImage = room.image || "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <img src={displayImage} alt={displayCode} className="w-full h-48 object-cover" />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
            {room.status}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{displayCode}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{room.area}m²</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-1" />
            <span>Tối đa {room.maxPeople} người</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Zap className="w-4 h-4 mr-1" />
            <span className="truncate">{displayUtilities}</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-lg font-bold text-blue-600">
            {room.price?.toLocaleString() || 0}đ/tháng
          </p>
        </div>

        {room.tenant && (
          <div className="flex items-center space-x-2 mb-4 p-2 bg-gray-50 rounded-lg">
            <img
              src={room.tenant.avatar}
              alt={room.tenant.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {room.tenant.name}
              </p>
              <p className="text-xs text-gray-500">{room.tenant.phone}</p>
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <button
            onClick={onViewDetail}
            className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-100 transition"
          >
            Chi tiết
          </button>
          <button
            onClick={onEdit}
            className="flex-1 bg-yellow-50 text-yellow-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-yellow-100 transition"
          >
            Sửa
          </button>
          <button
            onClick={onDelete}
            className="flex-1 bg-red-50 text-red-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-100 transition"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;