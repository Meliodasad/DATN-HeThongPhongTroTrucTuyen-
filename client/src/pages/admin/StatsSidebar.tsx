import React from 'react';
import { TrendingUp, Users, Home, DollarSign, Calendar, Activity, AlertCircle } from 'lucide-react';

interface StatsSidebarProps {
  userStats: {
    total: number;
    active: number;
    inactive: number;
    byRole: Record<string, number>;
  };
  roomStats: {
    total: number;
    available: number;
    rented: number;
    maintenance: number;
    averagePrice: number;
    totalRevenue: number;
  };
}

const StatsSidebar: React.FC<StatsSidebarProps> = ({ userStats, roomStats }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      notation: 'compact'
    }).format(amount);
  };

  const occupancyRate = roomStats.total > 0 ? Math.round((roomStats.rented / roomStats.total) * 100) : 0;
  const activeUserRate = userStats.total > 0 ? Math.round((userStats.active / userStats.total) * 100) : 0;

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">📊 Thống kê tổng quan</h3>
          <p className="text-sm text-gray-600">Cập nhật theo thời gian thực</p>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Người dùng</span>
              </div>
              <span className="text-lg font-bold text-blue-900">{userStats.total}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600">{userStats.active} hoạt động</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp size={12} className="text-green-600" />
                <span className="text-xs text-green-600">{activeUserRate}%</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Home size={16} className="text-green-600" />
                <span className="text-sm font-medium text-green-900">Phòng trọ</span>
              </div>
              <span className="text-lg font-bold text-green-900">{roomStats.total}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-xs text-gray-600">{roomStats.rented} đã thuê</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp size={12} className="text-green-600" />
                <span className="text-xs text-green-600">{occupancyRate}%</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Doanh thu</span>
              </div>
            </div>
            <div className="text-lg font-bold text-purple-900 mb-1">
              {formatCurrency(roomStats.totalRevenue)}
            </div>
            <div className="text-xs text-gray-600">
              TB: {formatCurrency(roomStats.averagePrice)}/tháng
            </div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Chi tiết theo vai trò</h4>
          <div className="space-y-2">
            {Object.entries(userStats.byRole).map(([role, count]) => (
              <div key={role} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-700">{role}</span>
                <span className="text-sm font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Room Status Breakdown */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Trạng thái phòng</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Còn trống</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{roomStats.available}</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Đã thuê</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{roomStats.rented}</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-red-50 rounded">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Bảo trì</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{roomStats.maintenance}</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Hoạt động gần đây</h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-2 bg-blue-50 rounded">
              <Activity size={14} className="text-blue-600 mt-0.5" />
              <div>
                <p className="text-xs text-gray-700">Thêm người dùng mới</p>
                <p className="text-xs text-gray-500">2 phút trước</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2 bg-green-50 rounded">
              <Home size={14} className="text-green-600 mt-0.5" />
              <div>
                <p className="text-xs text-gray-700">Cập nhật phòng trọ</p>
                <p className="text-xs text-gray-500">15 phút trước</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2 bg-yellow-50 rounded">
              <AlertCircle size={14} className="text-yellow-600 mt-0.5" />
              <div>
                <p className="text-xs text-gray-700">Phòng cần bảo trì</p>
                <p className="text-xs text-gray-500">1 giờ trước</p>
              </div>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar size={12} />
            <span>Cập nhật: {new Date().toLocaleString('vi-VN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSidebar;