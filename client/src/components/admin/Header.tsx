import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Search, Bell, Settings } from 'lucide-react';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();

  const getPageInfo = () => {
    switch (location.pathname) {
      case '/':
      case '/dashboard':
        return {
          title: 'Dashboard Tổng quan',
          description: 'Theo dõi hiệu suất và thống kê hệ thống quản lý'
        };
      case '/users':
        return {
          title: 'Quản lý người dùng',
          description: 'Quản lý tài khoản và phân quyền người dùng'
        };
      case '/rooms':
        return {
          title: 'Quản lý phòng trọ',
          description: 'Quản lý thông tin phòng trọ và trạng thái cho thuê'
        };
      case '/comments':
        return {
          title: 'Quản lý bình luận',
          description: 'Quản lý và kiểm duyệt bình luận của người dùng'
        };
      case '/statistics':
        return {
          title: 'Thống kê chi tiết',
          description: 'Xem báo cáo và phân tích dữ liệu chi tiết'
        };
      case '/contacts':
        return {
          title: 'Liên hệ & Hỗ trợ',
          description: 'Quản lý tin nhắn liên hệ và hỗ trợ khách hàng'
        };
      default:
        return {
          title: 'Trang không tìm thấy',
          description: 'Trang bạn đang tìm kiếm không tồn tại'
        };
    }
  };

  const { title, description } = getPageInfo();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <Menu size={20} />
          </button>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* Settings */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <Settings size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;