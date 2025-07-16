import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Home, 
  User, 
  Star,
  Wifi,
  Car,
  Shield,
  Zap,
  Droplets,
  Wind,
  Phone,
  MessageSquare,
  Edit,
  Trash2
} from 'lucide-react';
import type { Room } from '../../../types/room';
import { useToastContext } from '../../../contexts/ToastContext';
import { roomService } from '../../../services/roomService';
import { commentService } from '../../../services/commentService';
import type { IComment } from '../../../types/comment';


interface RoomDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string | null;
  onEdit: (room: Room) => void;
  onDelete: (id: string) => void;
}

const RoomDetailModal: React.FC<RoomDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  roomId,
  onEdit,
  onDelete
}) => {
  const [room, setRoom] = useState<Room | null>(null);
const [comments, setComments] = useState<IComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { error } = useToastContext();

  useEffect(() => {
    if (isOpen && roomId) {
      loadRoomDetails();
    }
  }, [isOpen, roomId]);

  const loadRoomDetails = async () => {
    if (!roomId) return;
    
    try {
      setLoading(true);
      const [roomData, allComments] = await Promise.all([
        roomService.getRoomById(roomId),
        commentService.getComments()
      ]);
      
      setRoom(roomData);
      setComments(allComments.filter(c => c.roomId === roomId));
    } catch (err) {
      console.error(err);
      error('Lỗi', 'Không thể tải chi tiết phòng trọ');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (room) {
      onEdit(room);
      onClose();
    }
  };

  const handleDelete = () => {
    if (room && confirm('Bạn có chắc chắn muốn xóa phòng trọ này?')) {
      onDelete(room.id);
      onClose();
    }
  };

  const getStatusColor = (status: Room['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'rented':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-gray-100 text-gray-800';
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
      case 'pending':
        return 'Chờ duyệt';
      case 'rejected':
        return 'Đã từ chối';
      default:
        return 'Không xác định';
    }
  };

  const getTypeText = (type: Room['type']) => {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
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

  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wifi')) return <Wifi className="w-4 h-4" />;
    if (amenityLower.includes('điều hòa')) return <Wind className="w-4 h-4" />;
    if (amenityLower.includes('bảo vệ')) return <Shield className="w-4 h-4" />;
    if (amenityLower.includes('điện')) return <Zap className="w-4 h-4" />;
    if (amenityLower.includes('nước')) return <Droplets className="w-4 h-4" />;
    if (amenityLower.includes('xe')) return <Car className="w-4 h-4" />;
    return <Home className="w-4 h-4" />;
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating}/5)</span>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Chi tiết phòng trọ</h3>
          <div className="flex items-center gap-2">
            {room && room.status !== 'pending' && (
              <>
                <button
                  onClick={handleEdit}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Chỉnh sửa
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Đang tải...</span>
            </div>
          ) : room ? (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Images */}
                <div className="lg:col-span-2">
                  {/* Main Image */}
                  <div className="mb-4">
                    <div className="relative h-80 bg-gray-200 rounded-lg overflow-hidden">
                      {room.images && room.images.length > 0 ? (
                        <img
                          src={room.images[activeImageIndex]}
                          alt={room.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Home className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Image Thumbnails */}
                  {room.images && room.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2 mb-6">
                      {room.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImageIndex(index)}
                          className={`relative h-20 rounded-lg overflow-hidden border-2 ${
                            activeImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${room.title} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Room Info */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{room.title}</h2>
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <MapPin className="w-4 h-4" />
                          <span>{room.address}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(room.status)}`}>
                            {getStatusText(room.status)}
                          </span>
                          <span className="text-sm text-gray-600">{getTypeText(room.type)}</span>
                          <span className="text-sm text-gray-600">{room.area}m²</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">
                          {formatCurrency(room.price)}
                        </div>
                        <div className="text-sm text-gray-500">/ tháng</div>
                      </div>
                    </div>

                    {/* Rejection Reason */}
                    {room.status === 'rejected' && room.rejectionReason && (
                      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <h4 className="font-semibold text-red-800 mb-2">Lý do từ chối</h4>
                        <p className="text-red-700">{room.rejectionReason}</p>
                      </div>
                    )}

                    {/* Approval Info */}
                    {room.approved && room.approvedBy && room.approvedAt && (
                      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-2">Thông tin duyệt</h4>
                        <div className="text-sm text-green-700">
                          <p>Được duyệt bởi: <span className="font-medium">{room.approvedBy}</span></p>
                          <p>Thời gian: <span className="font-medium">{formatDate(room.approvedAt)}</span></p>
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    {room.description && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-2">Mô tả</h4>
                        <p className="text-gray-700 leading-relaxed">{room.description}</p>
                      </div>
                    )}

                    {/* Amenities */}
                    {room.amenities && room.amenities.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Tiện nghi</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {room.amenities.map((amenity, index) => (
                            <div key={index} className="flex items-center gap-2 text-gray-700">
                              {getAmenityIcon(amenity)}
                              <span className="text-sm">{amenity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Owner & Stats */}
                <div className="space-y-6">
                  {/* Owner Info */}
                  <div className="bg-white border rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Thông tin chủ sở hữu
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-600">Tên:</span>
                        <p className="font-medium text-gray-900">{room.owner}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">ID:</span>
                        <p className="font-medium text-gray-900">#{room.ownerId}</p>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                          <Phone className="w-4 h-4" />
                          Liên hệ
                        </button>
                        <button className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Nhắn tin
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Room Stats */}
                  <div className="bg-white border rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Thông tin chi tiết</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ngày tạo:</span>
                        <span className="font-medium">{formatDate(room.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cập nhật:</span>
                        <span className="font-medium">{formatDate(room.updatedAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ID phòng:</span>
                        <span className="font-medium">#{room.id}</span>
                      </div>
                      {room.rating && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Đánh giá:</span>
                          <div>{renderStars(room.rating)}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Comments Summary */}
                  <div className="bg-white border rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Đánh giá ({comments.length})
                    </h4>
                    {comments.length > 0 ? (
                      <div className="space-y-3">
                        {comments.slice(0, 3).map((comment) => (
                          <div key={comment.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm text-gray-900">{comment.author}</span>
                              {comment.rating && renderStars(comment.rating)}
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">{comment.content}</p>
                            <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                          </div>
                        ))}
                        {comments.length > 3 && (
                          <button className="text-blue-600 text-sm hover:text-blue-800">
                            Xem thêm {comments.length - 3} đánh giá...
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">Chưa có đánh giá nào</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Không tìm thấy thông tin phòng trọ</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomDetailModal;