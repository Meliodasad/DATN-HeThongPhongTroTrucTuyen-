import React from 'react';
import { X, MapPin, Users, Maximize, DollarSign, Phone, Mail, Calendar, Zap, Droplets, Wifi, Car, Heart } from 'lucide-react';
import type { Room } from '../../../types/room';

interface RoomDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
}

const RoomDetailModal: React.FC<RoomDetailModalProps> = ({ isOpen, onClose, room }) => {
  if (!isOpen || !room) return null;

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
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">Thông tin chi tiết phòng</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Images */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {room.images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`${room.title} - ${index + 1}`}
                  className="w-full h-64 object-cover rounded-xl"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800';
                  }}
                />
              </div>
            ))}
          </div>

          {/* Title and Status */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{room.title}</h1>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin size={16} className="mr-1" />
                <span>{room.address}, {room.district}, {room.city}</span>
              </div>
            </div>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(room.status)}`}>
              {getStatusText(room.status)}
            </span>
          </div>

          {/* Key Information */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6 p-4 bg-gray-50 rounded-xl">
            <div className="text-center">
              <DollarSign className="mx-auto mb-2 text-blue-600" size={24} />
              <div className="text-lg font-bold text-gray-900">{formatCurrency(room.price)}</div>
              <div className="text-sm text-gray-600">Giá thuê/tháng</div>
            </div>
            <div className="text-center">
              <Maximize className="mx-auto mb-2 text-green-600" size={24} />
              <div className="text-lg font-bold text-gray-900">{room.area}m²</div>
              <div className="text-sm text-gray-600">Diện tích</div>
            </div>
            <div className="text-center">
              <Users className="mx-auto mb-2 text-purple-600" size={24} />
              <div className="text-lg font-bold text-gray-900">{room.maxOccupants}</div>
              <div className="text-sm text-gray-600">Số người tối đa</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{getRoomTypeText(room.roomType)}</div>
              <div className="text-sm text-gray-600">Loại phòng</div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Mô tả</h3>
            <p className="text-gray-700 leading-relaxed">{room.description}</p>
          </div>

          {/* Cost Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Chi phí</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Tiền cọc</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(room.deposit)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Zap size={16} className="mr-2 text-yellow-600" />
                    <span className="text-gray-700">Tiền điện</span>
                  </div>
                  <span className="font-semibold text-gray-900">{formatCurrency(room.electricityCost)}/kWh</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Droplets size={16} className="mr-2 text-blue-600" />
                    <span className="text-gray-700">Tiền nước</span>
                  </div>
                  <span className="font-semibold text-gray-900">{formatCurrency(room.waterCost)}/tháng</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Dịch vụ bao gồm</h3>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Wifi size={16} className="mr-3 text-blue-600" />
                  <span className="text-gray-700">Internet</span>
                  <span className={`ml-auto px-2 py-1 text-xs rounded-full ${room.internetIncluded ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {room.internetIncluded ? 'Có' : 'Không'}
                  </span>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Car size={16} className="mr-3 text-gray-600" />
                  <span className="text-gray-700">Chỗ đậu xe</span>
                  <span className={`ml-auto px-2 py-1 text-xs rounded-full ${room.parkingIncluded ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {room.parkingIncluded ? 'Có' : 'Không'}
                  </span>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Heart size={16} className="mr-3 text-pink-600" />
                  <span className="text-gray-700">Thú cưng</span>
                  <span className={`ml-auto px-2 py-1 text-xs rounded-full ${room.petAllowed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {room.petAllowed ? 'Cho phép' : 'Không cho phép'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Tiện ích</h3>
            <div className="flex flex-wrap gap-2">
              {room.amenities.map((amenity, index) => (
                <span
                  key={index}
                  className="inline-flex px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          {/* Landlord Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Thông tin chủ sở hữu</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Users size={16} className="mr-3 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">{room.landlordName}</div>
                  <div className="text-sm text-gray-600">Chủ sở hữu</div>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Phone size={16} className="mr-3 text-green-600" />
                <div>
                  <div className="font-medium text-gray-900">{room.landlordPhone}</div>
                  <div className="text-sm text-gray-600">Số điện thoại</div>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Mail size={16} className="mr-3 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">{room.landlordEmail}</div>
                  <div className="text-sm text-gray-600">Email</div>
                </div>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="border-t pt-6 mt-6">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                <span>Ngày thêm vào hệ thống: {room.createdAt}</span>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                <span>Lần cập nhật cuối: {room.updatedAt}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailModal;