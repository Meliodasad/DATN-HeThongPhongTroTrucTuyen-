import React, { useState, useEffect, useMemo } from 'react';
import { Home, MapPin, DollarSign, Users, Plus, Search, Filter, MoreVertical, Edit, Trash2, Eye, Calendar } from 'lucide-react';
import { useToastContext } from '../../../contexts/ToastContext';
import { roomService } from '../../../services/roomService';
import type { Room, RoomStats } from '../../../types/room';
import RoomModal from './RoomModal';

const RoomManagement: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [stats, setStats] = useState<RoomStats>({
    total: 0,
    available: 0,
    rented: 0,
    maintenance: 0,
    byType: { single: 0, shared: 0, apartment: 0, studio: 0 },
    averagePrice: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<Room['type'] | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<Room['status'] | 'all'>('all');

  const { success, error } = useToastContext();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [roomsData, statsData] = await Promise.all([
        roomService.getRooms(),
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
      const matchesSearch = room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          room.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          room.owner.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || room.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [rooms, searchTerm, typeFilter, statusFilter]);

  const handleAddRoom = () => {
    setEditingRoom(null);
    setIsModalOpen(true);
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setIsModalOpen(true);
  };

  const handleSubmitRoom = async (roomData: any) => {
    try {
      setModalLoading(true);
      
      if (editingRoom) {
        await roomService.updateRoom(editingRoom.id, roomData);
        success('Thành công', 'Cập nhật phòng trọ thành công');
      } else {
        await roomService.createRoom(roomData);
        success('Thành công', 'Thêm phòng trọ thành công');
      }
      
      await loadData();
      setIsModalOpen(false);
    } catch (err) {
      console.log(err);
      error('Lỗi', 'Không thể thực hiện thao tác');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteRoom = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa phòng trọ này?')) return;

    try {
      await roomService.deleteRoom(id);
      success('Thành công', 'Xóa phòng trọ thành công');
      await loadData();
    } catch (err) {
      console.error(err);
      error('Lỗi', 'Không thể xóa phòng trọ');
    }
  };

  const handleUpdateStatus = async (id: number, status: Room['status']) => {
    try {
      await roomService.updateRoomStatus(id, status);
      success('Thành công', 'Cập nhật trạng thái thành công');
      await loadData();
    } catch (err) {
      console.error(err);
      error('Lỗi', 'Không thể cập nhật trạng thái');
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
          <p className="text-gray-600">Quản lý thông tin phòng trọ và trạng thái cho thuê</p>
        </div>
        <button 
          onClick={handleAddRoom}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Thêm phòng mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Home className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng phòng</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold">✓</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Còn trống</p>
              <p className="text-2xl font-bold text-green-600">{stats.available}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đã thuê</p>
              <p className="text-2xl font-bold text-blue-600">{stats.rented}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-bold">⚠</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bảo trì</p>
              <p className="text-2xl font-bold text-red-600">{stats.maintenance}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Tìm kiếm phòng trọ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as Room['type'] | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả loại</option>
            <option value="single">Phòng đơn</option>
            <option value="shared">Phòng chia sẻ</option>
            <option value="apartment">Căn hộ</option>
            <option value="studio">Studio</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Room['status'] | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="available">Còn trống</option>
            <option value="rented">Đã thuê</option>
            <option value="maintenance">Bảo trì</option>
          </select>
        </div>
      </div>

      {/* Rooms Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Danh sách phòng trọ ({filteredRooms.length})</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thông tin phòng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Địa chỉ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá thuê
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại phòng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chủ sở hữu
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRooms.map((room) => (
                <tr key={room.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                        {room.images[0] ? (
                          <img src={room.images[0]} alt={room.title} className="w-full h-full object-cover" />
                        ) : (
                          <Home className="w-6 h-6 text-gray-500" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{room.title}</div>
                        <div className="text-sm text-gray-500">{room.area}m² • ID: {room.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-900">
                      <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="max-w-xs truncate">{room.address}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm font-medium text-gray-900">
                      <DollarSign className="w-4 h-4 text-green-500 mr-1" />
                      {formatCurrency(room.price)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{getTypeText(room.type)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={room.status}
                      onChange={(e) => handleUpdateStatus(room.id, e.target.value as Room['status'])}
                      className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${getStatusColor(room.status)}`}
                    >
                      <option value="available">Còn trống</option>
                      <option value="rented">Đã thuê</option>
                      <option value="maintenance">Bảo trì</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{room.owner}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-blue-600 hover:text-blue-900" title="Xem chi tiết">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditRoom(room)}
                        className="text-green-600 hover:text-green-900"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteRoom(room.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Xóa"
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
          <div className="text-center py-8">
            <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Không tìm thấy phòng trọ nào</p>
          </div>
        )}
      </div>

      {/* Room Modal */}
      <RoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitRoom}
        room={editingRoom}
        loading={modalLoading}
      />
    </div>
  );
};

export default RoomManagement;