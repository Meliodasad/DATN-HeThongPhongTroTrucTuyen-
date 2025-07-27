import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building, 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  User, 
  Calendar,
  MapPin,
  Home,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Save,
  X
} from 'lucide-react';
import { useToastContext } from '../../contexts/ToastContext';
import { roomService } from '../../services/roomService';
import type { Room, RoomStats, RoomFilters, CreateRoomData, UpdateRoomData } from '../../types/room';

// Room Modal Component
interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string | null;
  mode: 'create' | 'edit' | 'view';
  onSave: () => void;
}

const RoomModal: React.FC<RoomModalProps> = ({ isOpen, onClose, roomId, mode, onSave }) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [customUtility, setCustomUtility] = useState('');
  const [showCustomUtilityInput, setShowCustomUtilityInput] = useState(false);
  const [formData, setFormData] = useState<CreateRoomData>({
    hostId: '2', // Default host
    roomTitle: '',
    price: 0,
    area: 0,
    location: '',
    description: '',
    images: [],
    roomType: 'single',
    utilities: [],
    terms: ''
  });

  const { success, error } = useToastContext();

  useEffect(() => {
    if (isOpen) {
      if (roomId && (mode === 'edit' || mode === 'view')) {
        loadRoom();
      } else if (mode === 'create') {
        resetForm();
      }
    }
  }, [isOpen, roomId, mode]);

  const loadRoom = async () => {
    if (!roomId) return;
    
    try {
      setLoading(true);
      const roomData = await roomService.getRoomById(roomId);
      setRoom(roomData);
      setFormData({
        hostId: roomData.hostId,
        roomTitle: roomData.roomTitle,
        price: roomData.price,
        area: roomData.area,
        location: roomData.location,
        description: roomData.description,
        images: roomData.images,
        roomType: roomData.roomType,
        utilities: roomData.utilities,
        terms: roomData.terms
      });
    } catch (err) {
      console.error(err);
      error('Lỗi', 'Không thể tải thông tin phòng trọ');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setRoom(null);
    setFormData({
      hostId: '2',
      roomTitle: '',
      price: 0,
      area: 0,
      location: '',
      description: '',
      images: [],
      roomType: 'single',
      utilities: [],
      terms: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'view') return;

    try {
      setSaving(true);
      
      if (mode === 'create') {
        await roomService.createRoom(formData);
        success('Thành công', 'Tạo phòng trọ mới thành công');
      } else if (mode === 'edit' && roomId) {
        const updateData: UpdateRoomData = { ...formData };
        await roomService.updateRoom(roomId, updateData);
        success('Thành công', 'Cập nhật thông tin thành công');
      }
      
      onSave();
      onClose();
    } catch (err) {
      console.error(err);
      error('Lỗi', mode === 'create' ? 'Không thể tạo phòng trọ' : 'Không thể cập nhật thông tin');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof CreateRoomData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImage = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleUtilityChange = (utility: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({ ...prev, utilities: [...prev.utilities, utility] }));
    } else {
      setFormData(prev => ({ ...prev, utilities: prev.utilities.filter(u => u !== utility) }));
    }
  };

  const handleAddCustomUtility = () => {
    if (customUtility.trim() && !formData.utilities.includes(customUtility.trim())) {
      setFormData(prev => ({ 
        ...prev, 
        utilities: [...prev.utilities, customUtility.trim()] 
      }));
      setCustomUtility('');
      setShowCustomUtilityInput(false);
    }
  };

  const handleRemoveUtility = (utilityToRemove: string) => {
    setFormData(prev => ({ 
      ...prev, 
      utilities: prev.utilities.filter(u => u !== utilityToRemove) 
    }));
  };
  const getRoomTypeText = (type: Room['roomType']) => {
    switch (type) {
      case 'single': return 'Phòng đơn';
      case 'shared': return 'Phòng chia sẻ';
      case 'apartment': return 'Căn hộ';
      default: return 'Không xác định';
    }
  };

  const getStatusText = (status: Room['status']) => {
    switch (status) {
      case 'available': return 'Còn trống';
      case 'rented': return 'Đã thuê';
      case 'maintenance': return 'Bảo trì';
      default: return 'Không xác định';
    }
  };

  const getStatusColor = (status: Room['status']) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'rented': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const availableUtilities = [
    { key: 'wifi', label: 'Wifi' },
    { key: 'airconditioner', label: 'Điều hòa' },
    { key: 'washing_machine', label: 'Máy giặt' },
    { key: 'kitchen', label: 'Bếp' },
    { key: 'parking', label: 'Chỗ đậu xe' },
    { key: 'elevator', label: 'Thang máy' }
  ];

  if (!isOpen) return null;

  const isViewMode = mode === 'view';
  const isCreateMode = mode === 'create';
  const isEditMode = mode === 'edit';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            {isEditMode && 'Chỉnh sửa phòng trọ'}
            {isViewMode && 'Chi tiết phòng trọ'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Đang tải...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiêu đề phòng *
                  </label>
                  {isViewMode ? (
                    <p className="text-gray-900 font-medium">{room?.roomTitle}</p>
                  ) : (
                    <input
                      type="text"
                      value={formData.roomTitle}
                      onChange={(e) => handleInputChange('roomTitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại phòng *
                  </label>
                  {isViewMode ? (
                    <p className="text-gray-900">{getRoomTypeText(room?.roomType || 'single')}</p>
                  ) : (
                    <select
                      value={formData.roomType}
                      onChange={(e) => handleInputChange('roomType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="single">Phòng đơn</option>
                      <option value="shared">Phòng chia sẻ</option>
                      <option value="apartment">Căn hộ</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá thuê (VND) *
                  </label>
                  {isViewMode ? (
                    <p className="text-gray-900 font-medium text-green-600">{formatPrice(room?.price || 0)}</p>
                  ) : (
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      min="0"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Diện tích (m²) *
                  </label>
                  {isViewMode ? (
                    <p className="text-gray-900">{room?.area}m²</p>
                  ) : (
                    <input
                      type="number"
                      value={formData.area}
                      onChange={(e) => handleInputChange('area', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      min="0"
                    />
                  )}
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa điểm *
                </label>
                {isViewMode ? (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <p className="text-gray-900">{room?.location}</p>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ví dụ: Quận 1, TP.HCM"
                    required
                  />
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả *
                </label>
                {isViewMode ? (
                  <p className="text-gray-900 leading-relaxed">{room?.description}</p>
                ) : (
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Mô tả chi tiết về phòng trọ..."
                    required
                  />
                )}
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hình ảnh
                </label>
                {isViewMode ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {room?.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Room ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {formData.images.map((image, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="url"
                          value={image}
                          onChange={(e) => handleImageChange(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="URL hình ảnh"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addImage}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      + Thêm hình ảnh
                    </button>
                  </div>
                )}
              </div>

              {/* Utilities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiện ích
                </label>
                {isViewMode ? (
                  <div className="flex flex-wrap gap-2">
                    {room?.utilities.map((utility) => {
                      const utilityInfo = availableUtilities.find(u => u.key === utility);
                      return (
                        <span key={utility} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                          {utilityInfo?.label || utility}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Tiện ích có sẵn */}
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Tiện ích có sẵn:</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {availableUtilities.map((utility) => (
                          <label key={utility.key} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.utilities.includes(utility.key)}
                              onChange={(e) => handleUtilityChange(utility.key, e.target.checked)}
                              className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{utility.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Tiện ích đã chọn */}
                    {formData.utilities.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Tiện ích đã chọn:</p>
                        <div className="flex flex-wrap gap-2">
                          {formData.utilities.map((utility) => {
                            const utilityInfo = availableUtilities.find(u => u.key === utility);
                            const isCustom = !utilityInfo;
                            return (
                              <span 
                                key={utility} 
                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                                  isCustom 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {utilityInfo?.label || utility}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveUtility(utility)}
                                  className="ml-1 text-red-500 hover:text-red-700"
                                  title="Xóa tiện ích"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Thêm tiện ích tùy chọn */}
                    <div>
                      {!showCustomUtilityInput ? (
                        <button
                          type="button"
                          onClick={() => setShowCustomUtilityInput(true)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          Thêm tiện ích khác
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={customUtility}
                            onChange={(e) => setCustomUtility(e.target.value)}
                            placeholder="Nhập tiện ích mới..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddCustomUtility();
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={handleAddCustomUtility}
                            disabled={!customUtility.trim()}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          >
                            Thêm
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowCustomUtilityInput(false);
                              setCustomUtility('');
                            }}
                            className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm"
                          >
                            Hủy
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Terms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Điều khoản
                </label>
                {isViewMode ? (
                  <p className="text-gray-900">{room?.terms || 'Không có điều khoản đặc biệt'}</p>
                ) : (
                  <textarea
                    value={formData.terms}
                    onChange={(e) => handleInputChange('terms', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Các điều khoản và quy định..."
                  />
                )}
              </div>

              {/* Status and Approval (View mode only) */}
              {isViewMode && room && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái
                    </label>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(room.status)}`}>
                      {getStatusText(room.status)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái duyệt
                    </label>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                      room.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' :
                      room.approvalStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {room.approvalStatus === 'approved' ? 'Đã duyệt' :
                       room.approvalStatus === 'pending' ? 'Chờ duyệt' : 'Từ chối'}
                    </span>
                  </div>
                </div>
              )}

              {/* Host Info (View mode only) */}
              {isViewMode && room?.host && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thông tin chủ trọ
                  </label>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        {room.host.avatar ? (
                          <img 
                            src={room.host.avatar} 
                            alt={room.host.fullName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{room.host.fullName}</p>
                        <p className="text-sm text-gray-500">{room.host.email}</p>
                        {room.host.phone && (
                          <p className="text-sm text-gray-500">{room.host.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Created Date (View mode only) */}
              {isViewMode && room && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày tạo
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <p className="text-gray-900">{formatDate(room.createdAt)}</p>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
          >
            {isViewMode ? 'Đóng' : 'Hủy'}
          </button>
          {!isViewMode && (
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Đang lưu...' : (isCreateMode ? 'Tạo mới' : 'Cập nhật')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Rooms Page Component
const RoomsPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [stats, setStats] = useState<RoomStats>({
    total: 0,
    available: 0,
    rented: 0,
    maintenance: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<RoomFilters>({
    roomType: 'all',
    status: 'all',
    approvalStatus: 'all',
    searchTerm: ''
  });
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('view');

  const { success, error } = useToastContext();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [roomsData, statsData] = await Promise.all([
        roomService.getRooms(filters),
        roomService.getRoomStats()
      ]);
      setRooms(roomsData);
      setStats(statsData);
    } catch (err) {
      console.error(err);
      error('Lỗi', 'Không thể tải dữ liệu phòng trọ');
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const matchesSearch = !filters.searchTerm || 
        room.roomTitle.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        room.location.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      const matchesType = filters.roomType === 'all' || room.roomType === filters.roomType;
      const matchesStatus = filters.status === 'all' || room.status === filters.status;
      const matchesApproval = filters.approvalStatus === 'all' || room.approvalStatus === filters.approvalStatus;
      
      return matchesSearch && matchesType && matchesStatus && matchesApproval;
    });
  }, [rooms, filters]);



 

  const handleViewRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa phòng trọ này?')) return;

    try {
      await roomService.deleteRoom(roomId);
      success('Thành công', 'Xóa phòng trọ thành công');
      await loadData();
    } catch (err) {
      console.error(err);
      error('Lỗi', 'Không thể xóa phòng trọ');
    }
  };

  const handleUpdateApproval = async (roomId: string, status: Room['approvalStatus']) => {
    try {
      await roomService.updateApprovalStatus(roomId, status);
      success('Thành công', `${status === 'approved' ? 'Duyệt' : 'Từ chối'} phòng trọ thành công`);
      await loadData();
    } catch (err) {
      console.error(err);
      error('Lỗi', 'Không thể cập nhật trạng thái duyệt');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRoomId(null);
  };

  const handleSaveModal = () => {
    loadData();
  };

  const getRoomTypeText = (type: Room['roomType']) => {
    switch (type) {
      case 'single': return 'Phòng đơn';
      case 'shared': return 'Phòng chia sẻ';
      case 'apartment': return 'Căn hộ';
      default: return 'Không xác định';
    }
  };

  const getStatusText = (status: Room['status']) => {
    switch (status) {
      case 'available': return 'Còn trống';
      case 'rented': return 'Đã thuê';
      case 'maintenance': return 'Bảo trì';
      default: return 'Không xác định';
    }
  };

  const getStatusColor = (status: Room['status']) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'rented': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getApprovalColor = (status: Room['approvalStatus']) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý phòng trọ</h1>
          <p className="text-gray-600">Quản lý thông tin và trạng thái phòng trọ</p>
        </div>

      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Building className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng phòng trọ</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Còn trống</p>
              <p className="text-2xl font-bold text-green-600">{stats.available}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Home className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đã thuê</p>
              <p className="text-2xl font-bold text-blue-600">{stats.rented}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên phòng, địa điểm..."
              value={filters.searchTerm || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filters.roomType}
              onChange={(e) => setFilters(prev => ({ ...prev, roomType: e.target.value as Room['roomType'] | 'all' }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả loại phòng</option>
              <option value="single">Phòng đơn</option>
              <option value="shared">Phòng chia sẻ</option>
              <option value="apartment">Căn hộ</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as Room['status'] | 'all' }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="available">Còn trống</option>
              <option value="rented">Đã thuê</option>
              <option value="maintenance">Bảo trì</option>
            </select>

            <select
              value={filters.approvalStatus}
              onChange={(e) => setFilters(prev => ({ ...prev, approvalStatus: e.target.value as Room['approvalStatus'] | 'all' }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả duyệt</option>
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Từ chối</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rooms Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Danh sách phòng trọ ({filteredRooms.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phòng trọ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chủ trọ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại phòng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá thuê
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duyệt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRooms.map((room) => (
                <tr key={room.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      {room.images && room.images.length > 0 && (
                        <img 
                          src={room.images[0]} 
                          alt={room.roomTitle}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {room.roomTitle}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span className="truncate">{room.location}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {room.area}m²
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        {room.host?.avatar ? (
                          <img 
                            src={room.host.avatar} 
                            alt={room.host.fullName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                      <div className="ml-2">
                        <div className="text-sm font-medium text-gray-900">
                          {room.host?.fullName || 'Unknown'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {getRoomTypeText(room.roomType)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm font-medium text-green-600">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {formatPrice(room.price)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(room.status)}`}>
                      {getStatusText(room.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getApprovalColor(room.approvalStatus)}`}>
                      {room.approvalStatus === 'approved' ? 'Đã duyệt' : 
                       room.approvalStatus === 'pending' ? 'Chờ duyệt' : 'Từ chối'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(room.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {room.approvalStatus === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleUpdateApproval(room.id, 'approved')}
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                            title="Duyệt phòng"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleUpdateApproval(room.id, 'rejected')}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Từ chối"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => handleViewRoom(room.id)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50" 
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                  
                      <button 
                        onClick={() => handleDeleteRoom(room.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Xóa phòng"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">Không tìm thấy phòng trọ nào</p>
            <p className="text-gray-400 text-sm mt-1">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        )}
      </div>

      {/* Room Modal */}
      <RoomModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        roomId={selectedRoomId}
        mode={modalMode}
        onSave={handleSaveModal}
      />
    </div>
  );
};

export default RoomsPage;