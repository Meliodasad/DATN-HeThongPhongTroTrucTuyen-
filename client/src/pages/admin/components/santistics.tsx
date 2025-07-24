import React from 'react';
import { BarChart3, TrendingUp, Users, Home, DollarSign, Calendar, MessageSquare, Star } from 'lucide-react';

export const StatisticsManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Thống kê chi tiết</h1>
          <p className="text-gray-600">Xem báo cáo và phân tích dữ liệu chi tiết</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng người dùng</p>
              <p className="text-2xl font-bold text-gray-900">1,234</p>
              <p className="text-sm text-green-600">+12% so với tháng trước</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Home className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng phòng trọ</p>
              <p className="text-2xl font-bold text-gray-900">456</p>
              <p className="text-sm text-green-600">+8% so với tháng trước</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <MessageSquare className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bình luận</p>
              <p className="text-2xl font-bold text-gray-900">1,456</p>
              <p className="text-sm text-green-600">+25% so với tháng trước</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Doanh thu tháng</p>
              <p className="text-2xl font-bold text-gray-900">₫125M</p>
              <p className="text-sm text-green-600">+15% so với tháng trước</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Người dùng theo tháng</h3>
          </div>
          <div className="p-6">
            <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Biểu đồ người dùng</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Phòng trọ theo loại</h3>
          </div>
          <div className="p-6">
            <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <Home className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Biểu đồ phòng trọ</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Doanh thu & Đánh giá</h3>
          </div>
          <div className="p-6">
            <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Biểu đồ doanh thu</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Thống kê chi tiết</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Người dùng</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Admin</span>
                    <span className="text-sm font-medium">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Chủ trọ</span>
                    <span className="text-sm font-medium">89</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Người dùng</span>
                    <span className="text-sm font-medium">1,140</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Phòng trọ</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Phòng đơn</span>
                    <span className="text-sm font-medium">180</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Phòng chia sẻ</span>
                    <span className="text-sm font-medium">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Căn hộ</span>
                    <span className="text-sm font-medium">89</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Studio</span>
                    <span className="text-sm font-medium">31</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Hoạt động gần đây</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-900">5 người dùng mới đăng ký</p>
                  <p className="text-xs text-gray-500">2 phút trước</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Home className="w-4 h-4 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-900">3 phòng trọ mới được đăng</p>
                  <p className="text-xs text-gray-500">15 phút trước</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-900">12 bình luận mới cần duyệt</p>
                  <p className="text-xs text-gray-500">1 giờ trước</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-900">Đánh giá trung bình: 4.5/5</p>
                  <p className="text-xs text-gray-500">Cập nhật 2 giờ trước</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};