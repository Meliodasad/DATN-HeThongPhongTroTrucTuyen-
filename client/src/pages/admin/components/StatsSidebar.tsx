import React from 'react';
import { Users, Home, TrendingUp, DollarSign } from 'lucide-react';
import type { UserStats } from '../../../types/user';
import type { RoomStats } from '../../../types/room';

interface StatsSidebarProps {
  userStats: UserStats;
  roomStats: RoomStats;
}

const StatsSidebar: React.FC<StatsSidebarProps> = ({ userStats, roomStats }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Thống kê tổng quan</h3>
      
      {/* User Stats */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-blue-600" />
          <h4 className="font-medium text-gray-900">Người dùng</h4>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
            <span className="text-sm text-gray-600">Tổng số</span>
            <span className="font-semibold text-blue-600">{userStats.total}</span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <span className="text-sm text-gray-600">Hoạt động</span>
            <span className="font-semibold text-green-600">{userStats.active}</span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
            <span className="text-sm text-gray-600">Không hoạt động</span>
            <span className="font-semibold text-red-600">{userStats.inactive}</span>
          </div>
        </div>

        <div className="mt-4">
          <h5 className="text-sm font-medium text-gray-700 mb-2">Theo vai trò</h5>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Admin</span>
              <span className="font-medium">{userStats.byRole.Admin}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Chủ trọ</span>
              <span className="font-medium">{userStats.byRole['Chủ trọ']}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Người dùng</span>
              <span className="font-medium">{userStats.byRole['Người dùng']}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Room Stats */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Home className="w-5 h-5 text-green-600" />
          <h4 className="font-medium text-gray-900">Phòng trọ</h4>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
            <span className="text-sm text-gray-600">Tổng số</span>
            <span className="font-semibold text-blue-600">{roomStats.total}</span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <span className="text-sm text-gray-600">Còn trống</span>
            <span className="font-semibold text-green-600">{roomStats.available}</span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
            <span className="text-sm text-gray-600">Đã thuê</span>
            <span className="font-semibold text-yellow-600">{roomStats.rented}</span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
            <span className="text-sm text-gray-600">Bảo trì</span>
            <span className="font-semibold text-red-600">{roomStats.maintenance}</span>
          </div>
        </div>

        <div className="mt-4">
          <h5 className="text-sm font-medium text-gray-700 mb-2">Theo loại</h5>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Phòng đơn</span>
              <span className="font-medium">{roomStats.byType.single}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Phòng chia sẻ</span>
              <span className="font-medium">{roomStats.byType.shared}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Căn hộ</span>
              <span className="font-medium">{roomStats.byType.apartment}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Studio</span>
              <span className="font-medium">{roomStats.byType.studio}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Stats */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-purple-600" />
          <h4 className="font-medium text-gray-900">Doanh thu</h4>
        </div>
        
        <div className="space-y-3">
          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Giá trung bình</div>
            <div className="font-semibold text-purple-600">
              {formatCurrency(roomStats.averagePrice)}
            </div>
          </div>
          
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Tổng doanh thu</div>
            <div className="font-semibold text-green-600">
              {formatCurrency(roomStats.totalRevenue)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSidebar;