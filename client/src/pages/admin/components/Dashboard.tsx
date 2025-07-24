import React from 'react';
import { Users, Home, MessageSquare, TrendingUp, DollarSign, Calendar } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Chào mừng trở lại, Admin!</h1>
        <p className="text-blue-100">Đây là tổng quan về hệ thống quản lý phòng trọ của bạn</p>
      </div>

      {/* Quick Stats */}
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
              <p className="text-sm font-medium text-gray-600">Bình luận mới</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
              <p className="text-sm text-yellow-600">+5% so với tháng trước</p>
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

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  <p className="text-sm text-gray-900">Người dùng mới đăng ký</p>
                  <p className="text-xs text-gray-500">2 phút trước</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Home className="w-4 h-4 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-900">Phòng trọ mới được đăng</p>
                  <p className="text-xs text-gray-500">15 phút trước</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-900">Bình luận mới cần duyệt</p>
                  <p className="text-xs text-gray-500">1 giờ trước</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Thống kê nhanh</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tỷ lệ phòng đã thuê</span>
                <span className="text-sm font-medium text-gray-900">78%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Đánh giá trung bình</span>
                <span className="text-sm font-medium text-gray-900">4.5/5</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Phòng trống</span>
                <span className="text-sm font-medium text-gray-900">102</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Người dùng hoạt động</span>
                <span className="text-sm font-medium text-gray-900">892</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;