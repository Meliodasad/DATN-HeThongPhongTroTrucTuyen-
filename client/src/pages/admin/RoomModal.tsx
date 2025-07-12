import React, { useState, useEffect } from 'react';
import { X, Home, MapPin, DollarSign, Users, Maximize, Plus, Minus, Upload, AlertCircle, Settings } from 'lucide-react';
import type { Room, RoomFormData, RoomFormErrors } from '../../types/room';
import { commonAmenities, vietnamDistricts } from '../../utils/roomMockData';


interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (roomData: RoomFormData) => Promise<void>;
    onDelete?: (roomId: number) => Promise<void>; // 👈 Thêm dòng này
  room?: Room | null;
  loading?: boolean;
}

const RoomModal: React.FC<RoomModalProps> = ({ isOpen, onClose, onSubmit, onDelete, room, loading }) => {
  const [formData, setFormData] = useState<RoomFormData>({
    title: '',
    description: '',
    address: '',
    district: '',
    city: 'TP. Hồ Chí Minh',
    price: 0,
    area: 0,
    roomType: '',
    amenities: [],
    images: [],
    landlordId: 2, // Default to Trần Thị Lan
    maxOccupants: 1,
    deposit: 0,
    electricityCost: 3500,
    waterCost: 100000,
    internetIncluded: true,
    parkingIncluded: false,
    petAllowed: false
  });
  
  const [errors, setErrors] = useState<RoomFormErrors>({});
  const [newImageUrl, setNewImageUrl] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [roomStatus, setRoomStatus] = useState<Room['status']>('available');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (room) {
      setFormData({
        title: room.title,
        description: room.description,
        address: room.address,
        district: room.district,
        city: room.city,
        price: room.price,
        area: room.area,
        roomType: room.roomType,
        amenities: room.amenities,
        images: room.images,
        landlordId: room.landlordId,
        maxOccupants: room.maxOccupants,
        deposit: room.deposit,
        electricityCost: room.electricityCost,
        waterCost: room.waterCost,
        internetIncluded: room.internetIncluded,
        parkingIncluded: room.parkingIncluded,
        petAllowed: room.petAllowed
      });
      setSelectedAmenities(room.amenities);
      setRoomStatus(room.status);
    } else {
      setFormData({
        title: '',
        description: '',
        address: '',
        district: '',
        city: 'TP. Hồ Chí Minh',
        price: 0,
        area: 0,
        roomType: '',
        amenities: [],
        images: [],
        landlordId: 2,
        maxOccupants: 1,
        deposit: 0,
        electricityCost: 3500,
        waterCost: 100000,
        internetIncluded: true,
        parkingIncluded: false,
        petAllowed: false
      });
      setSelectedAmenities([]);
      setRoomStatus('available');
    }
    setErrors({});
    setNewImageUrl('');
  }, [room, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: RoomFormErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Tiêu đề không được để trống';
    if (!formData.description.trim()) newErrors.description = 'Mô tả không được để trống';
    if (!formData.address.trim()) newErrors.address = 'Địa chỉ không được để trống';
    if (!formData.district) newErrors.district = 'Vui lòng chọn quận/huyện';
    if (!formData.roomType) newErrors.roomType = 'Vui lòng chọn loại phòng';
    if (formData.price <= 0) newErrors.price = 'Giá phòng phải lớn hơn 0';
    if (formData.area <= 0) newErrors.area = 'Diện tích phải lớn hơn 0';
    if (formData.maxOccupants <= 0) newErrors.maxOccupants = 'Số người tối đa phải lớn hơn 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const submitData = {
      ...formData,
      amenities: selectedAmenities,
      deposit: formData.deposit || formData.price * 2, // Default deposit is 2 months rent
      ...(room && { status: roomStatus }) // Only include status when editing
    };

    try {
      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const addImage = () => {
    if (newImageUrl.trim() && !formData.images.includes(newImageUrl.trim())) {
      setFormData({
        ...formData,
        images: [...formData.images, newImageUrl.trim()]
      });
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">
            {room ? 'Cập nhật thông tin phòng' : 'Thêm phòng mới vào hệ thống'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Home size={16} className="inline mr-1" />
                Tên/Tiêu đề phòng
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="VD: Phòng cao cấp gần Đại học Bách Khoa"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.title}
                </p>
              )}
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả chi tiết (cho admin và khách hàng)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Mô tả chi tiết về phòng, tiện ích, vị trí, điều kiện thuê..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} className="inline mr-1" />
                Địa chỉ
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="VD: 123 Đường Lý Thường Kiệt"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.address}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quận/Huyện/Thành phố
              </label>
              <select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.district ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">-- Chọn khu vực --</option>
                {vietnamDistricts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
              {errors.district && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.district}
                </p>
              )}
            </div>
          </div>

          {/* Room Details */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign size={16} className="inline mr-1" />
                Giá thuê/tháng (VNĐ)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="VD: 4500000"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.price}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Maximize size={16} className="inline mr-1" />
                Diện tích (m²)
              </label>
              <input
                type="number"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.area ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="25"
              />
              {errors.area && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.area}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại phòng
              </label>
              <select
                value={formData.roomType}
                onChange={(e) => setFormData({ ...formData, roomType: e.target.value as RoomFormData['roomType'] })}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.roomType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Chọn loại phòng</option>
                <option value="single">Phòng đơn</option>
                <option value="shared">Phòng chia sẻ</option>
                <option value="apartment">Căn hộ</option>
                <option value="studio">Studio</option>
              </select>
              {errors.roomType && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.roomType}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users size={16} className="inline mr-1" />
                Số người tối đa
              </label>
              <input
                type="number"
                value={formData.maxOccupants}
                onChange={(e) => setFormData({ ...formData, maxOccupants: Number(e.target.value) })}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.maxOccupants ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="2"
                min="1"
              />
              {errors.maxOccupants && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.maxOccupants}
                </p>
              )}
            </div>
          </div>

          {/* Room Status - Only show when editing */}
          {room && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Settings size={20} className="mr-2 text-yellow-600" />
                ⚙️ Quản lý phòng
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Update */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🏠 Trạng thái phòng
                  </label>
                  <select
                    value={roomStatus}
                    onChange={(e) => setRoomStatus(e.target.value as Room['status'])}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="available">✅ Còn trống</option>
                    <option value="rented">🏠 Đã thuê</option>
                    <option value="maintenance">🔧 Đang bảo trì</option>
                  </select>
                  <p className="mt-1 text-sm text-gray-600">
                    Cập nhật trạng thái hiện tại của phòng
                  </p>
                </div>

                {/* Delete Section */}
                <div>
                  <label className="block text-sm font-medium text-red-700 mb-2">
                    🗑️ Xóa phòng khỏi hệ thống
                  </label>
                  {!showDeleteConfirm ? (
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full px-4 py-3 bg-red-100 text-red-700 border border-red-300 rounded-xl hover:bg-red-200 transition-colors duration-200 font-medium"
                    >
                      🗑️ Xóa phòng này
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800 font-medium">⚠️ Xác nhận xóa vĩnh viễn</p>
                        <p className="text-xs text-red-600 mt-1">Hành động này không thể hoàn tác!</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setShowDeleteConfirm(false)}
                          className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 text-sm"
                        >
                          Hủy
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            if (room && window.confirm(`⚠️ XÁC NHẬN XÓA PHÒNG ⚠️\n\nPhòng: ${room.title}\nĐịa chỉ: ${room.address}, ${room.district}\nGiá: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.price)}\n\n❌ CẢNH BÁO: Hành động này sẽ XÓA VĨNH VIỄN phòng khỏi hệ thống!\n\nBạn có CHẮC CHẮN muốn tiếp tục?`)) {
                              try {
                                await onDelete?.(room.id);
                                onClose();
                              } catch (error) {
                                console.error('Error deleting room:', error);
                              }
                            }
                          }}
                          className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
                        >
                          ✅ Xóa ngay
                        </button>
                      </div>
                    </div>
                  )}
                  <p className="mt-1 text-sm text-red-600">
                    Xóa phòng sẽ loại bỏ hoàn toàn khỏi hệ thống
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Additional Costs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
               Tiền cọc/đặt cọc (VNĐ)
              </label>
              <input
                type="number"
                value={formData.deposit}
                onChange={(e) => setFormData({ ...formData, deposit: Number(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
               placeholder="VD: 9000000 (thường = 2 tháng tiền thuê)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiền điện (VNĐ/kWh)
              </label>
              <input
                type="number"
                value={formData.electricityCost}
                onChange={(e) => setFormData({ ...formData, electricityCost: Number(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="3500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiền nước (VNĐ/tháng)
              </label>
              <input
                type="number"
                value={formData.waterCost}
                onChange={(e) => setFormData({ ...formData, waterCost: Number(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="100000"
              />
            </div>
          </div>

          {/* Additional Options */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="internetIncluded"
                checked={formData.internetIncluded}
                onChange={(e) => setFormData({ ...formData, internetIncluded: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="internetIncluded" className="ml-2 block text-sm text-gray-900">
                Bao gồm Internet
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="parkingIncluded"
                checked={formData.parkingIncluded}
                onChange={(e) => setFormData({ ...formData, parkingIncluded: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="parkingIncluded" className="ml-2 block text-sm text-gray-900">
                Có chỗ đậu xe
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="petAllowed"
                checked={formData.petAllowed}
                onChange={(e) => setFormData({ ...formData, petAllowed: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="petAllowed" className="ml-2 block text-sm text-gray-900">
                Cho phép nuôi thú cưng
              </label>
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Upload size={16} className="inline mr-1" />
              Hình ảnh phòng (URL)
            </label>
            <div className="flex gap-2 mb-4">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="https://example.com/image.jpg"
              />
              <button
                type="button"
                onClick={addImage}
                className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Room ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                  >
                    <Minus size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiện ích & Dịch vụ có sẵn
            </label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {commonAmenities.map((amenity) => (
                <div key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`amenity-${amenity}`}
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`amenity-${amenity}`} className="ml-2 block text-sm text-gray-900">
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors duration-200 font-medium"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang xử lý...' : (room ? 'Lưu thay đổi' : 'Thêm vào hệ thống')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomModal;