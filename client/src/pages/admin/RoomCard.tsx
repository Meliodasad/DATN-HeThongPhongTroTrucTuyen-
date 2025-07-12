  import React from 'react';
  import { MapPin, Users, Maximize, DollarSign, Edit, MoreVertical, Eye } from 'lucide-react';
import type { Room } from '../../types/room';
  
  interface RoomCardProps {
    room: Room;
    onEdit: (room: Room) => void;
    onDelete: (id: number) => void;
    onStatusChange: (id: number, status: Room['status']) => void;
    onView: (room: Room) => void;
  }
  
  const RoomCard: React.FC<RoomCardProps> = ({ room, onEdit, onView }) => {
    const [showDropdown, setShowDropdown] = React.useState(false);
  
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(amount);
    };
  
    const getStatusColor = (status: Room['status']) => {
      switch (status) {
        case 'available':
          return 'bg-green-100 text-green-800';
        case 'rented':
          return 'bg-orange-100 text-orange-800';
        case 'maintenance':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };
  
    const getStatusText = (status: Room['status']) => {
      switch (status) {
        case 'available':
          return 'Còn trống';
        case 'rented':
          return 'Đã thuê';
        case 'maintenance':
          return 'Bảo trì';
        default:
          return 'Không xác định';
      }
    };
  
    const getRoomTypeText = (type: Room['roomType']) => {
      switch (type) {
        case 'single':
          return 'Phòng đơn';
        case 'shared':
          return 'Phòng chia sẻ';
        case 'apartment':
          return 'Căn hộ';
        case 'studio':
          return 'Studio';
        default:
          return 'Không xác định';
      }
    };
  
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={room.images[0] || 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'}
            alt={room.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800';
            }}
          />
          <div className="absolute top-4 left-4">
            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(room.status)}`}>
              {getStatusText(room.status)}
            </span>
          </div>
          <div className="absolute top-4 right-4">
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all duration-200"
              >
                <MoreVertical size={16} />
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-10">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        onView(room);
                        setShowDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <Eye size={14} className="mr-2" />
                      Chi tiết phòng
                    </button>
                    <button
                      onClick={() => {
                        onEdit(room);
                        setShowDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <Edit size={14} className="mr-2" />
                      Sửa thông tin
                    </button>
                
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
  
        {/* Content */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {room.title}
          </h3>
          
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin size={16} className="mr-1" />
            <span className="text-sm">{room.district}, {room.city}</span>
          </div>
  
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center text-gray-600">
              <DollarSign size={16} className="mr-1" />
              <span className="text-sm font-medium">{formatCurrency(room.price)}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Maximize size={16} className="mr-1" />
              <span className="text-sm">{room.area}m²</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users size={16} className="mr-1" />
              <span className="text-sm">{room.maxOccupants} người</span>
            </div>
            <div className="text-sm text-gray-600">
              {getRoomTypeText(room.roomType)}
            </div>
          </div>
  
          <div className="mb-4">
            <p className="text-sm text-gray-600 line-clamp-2">
              {room.description}
            </p>
          </div>
  
          <div className="flex flex-wrap gap-1 mb-4">
            {room.amenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
              >
                {amenity}
              </span>
            ))}
            {room.amenities.length > 3 && (
              <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                +{room.amenities.length - 3} khác
              </span>
            )}
          </div>
  
          <div className="border-t pt-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Chủ trọ: {room.landlordName}</span>
              <span>Cập nhật: {room.updatedAt}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default RoomCard;